import type { NodemailerUserConfig } from "next-auth/providers/nodemailer";

import { createTransport } from "nodemailer";

import { render } from "@react-email/render";
import { Verification } from "@/components/email/verification";

type SendVerificationRequestParams = Parameters<
  NonNullable<NodemailerUserConfig["sendVerificationRequest"]>
>[0];

export const generateVerificationToken = async () => {
  const random = crypto.getRandomValues(new Uint8Array(8));
  return Buffer.from(random).toString("hex").slice(0, 6);
};

export const sendVerificationRequest = async (
  params: SendVerificationRequestParams,
) => {
  const { identifier, provider, token } = params;

  const transport = createTransport(provider.server);

  const emailHtml = await render(<Verification token={token} />, {
    pretty: true,
  });
  const emailText = await render(<Verification token={token} />, {
    plainText: true,
  });

  const result = await transport.sendMail({
    to: identifier,
    from: provider.from,
    subject: "Ingresa al dashboard de Peluditos!",
    html: emailHtml,
    text: emailText,
  });

  const failed = result.rejected.concat(result.pending).filter(Boolean);

  const failedList = failed.map((entry) => {
    if (typeof entry === "string") return entry;
    if (typeof entry === "object" && entry !== null && "address" in entry) {
      return entry.address;
    }
    return String(entry);
  });

  if (failedList.length) {
    throw new Error(`Email(s) (${failedList.join(", ")}) could not be sent`);
  }
};
