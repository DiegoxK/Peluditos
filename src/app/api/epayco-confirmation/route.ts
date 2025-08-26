import { db } from "@/server/db";
import { type OrderDB, type ProductDB } from "@/server/db/schema";

import {
  validateEpaycoSignature,
  type EpaycoConfirmationData,
  type EpaycoSignatureConstructionData,
} from "epayco-checkout-community-sdk/server";
import { type NextRequest, NextResponse } from "next/server";

import { env } from "@/env";

export async function POST(req: NextRequest) {
  const queryParams = req.nextUrl.searchParams;
  const epaycoData = Object.fromEntries(
    queryParams,
  ) as unknown as EpaycoConfirmationData;

  const signatureData: EpaycoSignatureConstructionData = {
    p_cust_id_cliente: env.EPAYCO_P_CUST_ID_CLIENTE,
    p_key: env.EPAYCO_P_KEY,
    x_ref_payco: epaycoData.x_ref_payco,
    x_transaction_id: epaycoData.x_transaction_id,
    x_amount: epaycoData.x_amount,
    x_currency_code: epaycoData.x_currency_code,
  };

  if (!validateEpaycoSignature(epaycoData.x_signature, signatureData)) {
    console.error("ePayco Webhook: Invalid signature.");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const orderId = epaycoData.x_extra1;
  const ordersCollection = db.collection<OrderDB>("orders");
  const internalOrder = await ordersCollection.findOne({ orderId: orderId });

  if (!internalOrder) {
    console.error(`ePayco Webhook: Order not found for orderId ${orderId}.`);
    return NextResponse.json(
      { message: "Confirmation processed, but order not found." },
      { status: 200 },
    );
  }

  const isAmountMismatch =
    parseFloat(internalOrder.total.toString()) !==
    parseFloat(epaycoData.x_amount);
  if (isAmountMismatch) {
    console.error(
      `ePayco Webhook: Amount mismatch for orderId ${orderId}. DB: ${internalOrder.total}, ePayco: ${epaycoData.x_amount}`,
    );
    return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
  }

  if (internalOrder.paymentStatus === "aprobado") {
    console.log(
      `ePayco Webhook: Order ${orderId} is already approved. Ignoring subsequent webhook.`,
    );
    return NextResponse.json(
      { message: "Confirmation already processed for a successful order." },
      { status: 200 },
    );
  }

  try {
    const updatePayload: Partial<OrderDB> = {
      epaycoTransactionId: epaycoData.x_transaction_id,
      updatedAt: new Date().toISOString(),
    };

    switch (epaycoData.x_cod_response) {
      case "1": // Aprobada
        console.log(
          `ePayco Webhook: Transaction ${epaycoData.x_ref_payco} for order ${orderId} accepted.`,
        );
        updatePayload.paymentStatus = "aprobado";
        updatePayload.orderStatus = "procesando";

        const productsCollection = db.collection<ProductDB>("products");
        for (const product of internalOrder.products) {
          await productsCollection.updateOne(
            { name: product.name },
            { $inc: { stock: -product.quantity, sales: +product.quantity } },
          );
        }
        break;

      case "2": // Rechazada
      case "4": // Fallida
        console.log(
          `ePayco Webhook: Transaction ${epaycoData.x_ref_payco} for order ${orderId} rejected/failed.`,
        );
        updatePayload.paymentStatus = "rechazado";
        updatePayload.orderStatus = "cancelado";
        updatePayload.notes = `Pago rechazado o fallido. Razón: ${epaycoData.x_response_reason_text}`;
        break;

      case "3": // Pendiente
        console.log(
          `ePayco Webhook: Transaction ${epaycoData.x_ref_payco} for order ${orderId} is pending.`,
        );
        updatePayload.paymentStatus = "pendiente";
        updatePayload.orderStatus = "procesando";
        break;

      default: // Fall trough
        console.warn(
          `ePayco Webhook: Unknown response code ${epaycoData.x_cod_response} for order ${orderId}.`,
        );
        updatePayload.notes = `Código de respuesta ePayco desconocido: ${epaycoData.x_cod_response}. Requiere revisión manual.`;
        break;
    }

    await ordersCollection.updateOne(
      { _id: internalOrder._id },
      { $set: updatePayload },
    );
    return NextResponse.json(
      { message: "Confirmation successfully processed." },
      { status: 200 },
    );
  } catch (internalError) {
    const message =
      internalError instanceof Error ? internalError.message : "Unknown error";
    console.error(
      `ePayco Webhook: Internal server error for order ${orderId}:`,
      message,
    );
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
