import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { InputOTPForm } from "./_components/otp-form";

import { Fingerprint } from "lucide-react";
import { auth } from "@/server/auth";

export default async function VerificationPage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  const cookieStore = await cookies();

  const email = cookieStore.get("otp-email")?.value;

  if (!email) {
    redirect("/auth/login");
  }

  return (
    <main className="bg-primary flex min-h-screen flex-col items-center justify-center">
      <div className="flex max-w-[400px] flex-col items-center text-center">
        <Fingerprint size={80} className="text-white" />
        <h1 className="text-4xl font-bold text-white">Revisa tu Correo</h1>
        <InputOTPForm email={email} />
      </div>
    </main>
  );
}
