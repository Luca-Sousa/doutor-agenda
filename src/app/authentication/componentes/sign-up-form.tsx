"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { KeyIcon, MailIcon, UserPenIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import CustomFormField, {
  FormFieldType,
} from "@/components/form/custom-form-field";
import SubmitButtonForm from "@/components/form/submit-button-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { authClient } from "@/lib/auth-client";

const registerSchema = z.object({
  name: z.string().trim().min(2, {
    message: "Nome é obrigatório",
  }),
  email: z
    .string()
    .trim()
    .min(1, {
      message: "Email é obrigatório",
    })
    .email({ message: "Email inválido" }),
  password: z.string().trim().min(8, {
    message: "Senha deve ter pelo menos 8 caracteres",
  }),
});

const SignUpForm = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    await authClient.signUp.email(
      {
        email: values.email,
        name: values.name,
        password: values.password,
      },
      {
        onSuccess: () => {
          toast.success("Conta criada com sucesso!");
          router.push("/dashboard");
        },
        onError(ctx) {
          if (ctx.error.code === "USER_ALREADY_EXISTS") {
            toast.error("Email já cadastrado!");
            return;
          }

          toast.error("Erro ao criar conta.");
        },
      },
    );
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardHeader>
            <CardTitle>Criar conta</CardTitle>
            <CardDescription>Crie uma conta para continuar.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              icon={UserPenIcon}
              name="name"
              label="Nome"
              placeholder="Digite seu nome"
            />

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              icon={MailIcon}
              name="email"
              label="Email"
              typeInput="email"
              placeholder="Digite seu email"
            />

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              icon={KeyIcon}
              name="password"
              label="Senha"
              typeInput="password"
              placeholder="Digite sua senha"
            />
          </CardContent>

          <CardFooter>
            <SubmitButtonForm isLoading={isLoading}>
              Criar conta
            </SubmitButtonForm>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default SignUpForm;
