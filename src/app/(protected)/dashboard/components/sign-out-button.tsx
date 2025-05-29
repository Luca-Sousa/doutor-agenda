"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SignOutButton = () => {
  const router = useRouter();

  const handleSignOutClick = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Sessão encerrada com sucesso!");
          router.push("/authentication");
        },
      },
    });
  };

  return (
    <Button onClick={handleSignOutClick} className="cursor-pointer">
      Sair
    </Button>
  );
};

export default SignOutButton;
