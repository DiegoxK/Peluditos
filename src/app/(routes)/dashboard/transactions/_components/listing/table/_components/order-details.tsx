import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Order } from "@/server/db/schema";
import { Mail, MessageCircle } from "lucide-react";

interface OrderDetailsProps {
  order: Order;
}

export default function OrderDetails({ order }: OrderDetailsProps) {
  const fullAddress = `${order.customer.address.details}, ${order.customer.address.neighborhood}, ${order.customer.address.city}, ${order.customer.address.department}`;

  return (
    <div>
      <div className="space-y-2 pb-4">
        <h2 className="text-xl font-bold">
          Detalles del Pedido {order.orderId}
        </h2>
        <p className="text-muted-foreground text-sm">
          Información completa del pedido realizado el{" "}
          {formatDate(order.createdAt)}.
        </p>
      </div>

      <div className="grid max-h-[60vh] gap-6 space-y-4 overflow-y-scroll py-4 ps-1 pr-4">
        <InfoSection title="Información del Cliente">
          <div className="grid gap-1.5">
            <InfoRow label="Nombre" value={order.customer.name} />
            <InfoRow label="Teléfono" value={order.customer.phone} />
            <InfoRow label="Email" value={order.customer.email} />
            <InfoRow label="Dirección" value={fullAddress} />
          </div>
        </InfoSection>

        <InfoSection title="Productos" className="p-0">
          <div className="text-muted-foreground grid grid-cols-[2fr_1fr_1fr_1fr] border-b px-4 py-2 font-medium">
            <span>Producto</span>
            <span className="text-center">Cantidad</span>
            <span className="text-right">Precio</span>
            <span className="text-right">Subtotal</span>
          </div>
          <div className="divide-y">
            {order.products.map((p, index) => (
              <div
                key={index}
                className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center px-4 py-3"
              >
                <span>{p.name}</span>
                <span className="text-center">{p.quantity}</span>
                <span className="text-right">{formatPrice(p.price)}</span>
                <span className="text-right font-medium">
                  {formatPrice(p.price * p.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="bg-background/70 flex justify-end border-t px-4 py-3">
            <div className="grid w-1/2 grid-cols-2">
              <span className="font-semibold">Total</span>
              <span className="text-primary text-right font-bold">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </InfoSection>

        <div className="grid gap-6 sm:grid-cols-2">
          <InfoSection title="Información de Pago">
            <div className="grid gap-1.5">
              <InfoRow label="Método" value={order.paymentMethod} />
              <InfoRow
                label="Estado"
                value={
                  <Badge
                    variant={
                      order.paymentStatus === "aprobado"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {order.paymentStatus === "aprobado"
                      ? "Aprobado"
                      : "Rechazado"}
                  </Badge>
                }
              />
            </div>
          </InfoSection>

          <InfoSection title="Información de Envío">
            <div className="grid gap-1.5">
              <InfoRow
                label="Estado"
                value={
                  <Badge
                    variant={
                      order.orderStatus === "enviado"
                        ? "default"
                        : order.orderStatus === "entregado"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {order.orderStatus.charAt(0).toUpperCase() +
                      order.orderStatus.slice(1)}
                  </Badge>
                }
              />
              <InfoRow label="Empresa" value={order.shipping.company} />
              <InfoRow label="Código" value={order.shipping.code} />
              <InfoRow
                label="Fecha estimada"
                value={formatDate(order.shipping.estimatedDate)}
              />
            </div>
          </InfoSection>
        </div>

        {order.notes && (
          <InfoSection title="Observaciones">
            <p className="text-muted-foreground italic">{order.notes}</p>
          </InfoSection>
        )}
      </div>

      <DialogFooter className="mt-4 flex-col-reverse gap-2 sm:flex-row sm:justify-between">
        <div className="flex gap-2">
          <Button variant="outline">
            <MessageCircle className="mr-2 size-4" /> Enviar por WhatsApp
          </Button>
          <Button variant="outline">
            <Mail className="mr-2 size-4" /> Enviar por Correo
          </Button>
        </div>
        <DialogClose asChild>
          <Button variant="default">Cerrar</Button>
        </DialogClose>
      </DialogFooter>
    </div>
  );
}

const InfoSection = ({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className="space-y-2">
    <h3 className="font-semibold">{title}</h3>
    <div
      className={`bg-background/50 rounded-md border p-4 text-sm ${className}`}
    >
      {children}
    </div>
  </div>
);

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="grid grid-cols-2 gap-2">
    <span className="text-muted-foreground">{label}:</span>
    <span className="text-right font-medium sm:text-left">{value}</span>
  </div>
);
