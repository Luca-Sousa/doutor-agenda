import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";

import LoginForm from "./componentes/login-form";
import SignUpForm from "./componentes/sign-up-form";

const AuthenticationPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) redirect("/dashboard");

  return (
    <div className="flex h-screen w-screen items-center justify-center gap-24">
      <div className="relative aspect-square xl:size-[700px]">
        <Image
          src="/assets/icons/logo-logim-form.svg"
          alt="logo"
          fill
          className="object-cover"
        />
      </div>
      <Tabs defaultValue="login" className="w-[450px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login" className="cursor-pointer">
            Login
          </TabsTrigger>
          <TabsTrigger value="register" className="cursor-pointer">
            Criar Conta
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <LoginForm />
        </TabsContent>

        <TabsContent value="register">
          <SignUpForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthenticationPage;
