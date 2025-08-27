import { Logo } from "@/assets/vectors";
import LoginForm from "./_components/login-form";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Login() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="grid md:grid-cols-2">
      <div className="bg-primary/90 hidden items-center justify-center text-white md:flex">
        <div className="relative flex flex-col items-center">
          <Logo className="mb-4 h-48 w-48 fill-white" />
          <h2 className="text-5xl font-bold uppercase">Peluditos</h2>
          <p className="font-light">Panel de administracion</p>
        </div>
      </div>
      <div className="flex h-screen items-center justify-center">
        <LoginForm />
      </div>
    </main>
  );
}
