"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createClinic } from "@/actions/clinic.actions";
import SubmitButtonForm from "@/components/form/submit-button-form";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const clinicFormSchema = z.object({
  name: z.string().trim().min(2, {
    message: "Nome é obrigatório",
  }),
});

const ClinicForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof clinicFormSchema>>({
    resolver: zodResolver(clinicFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const createClinicAction = useAction(createClinic, {
    onSuccess: () => {
      toast.success("Clínica criada com sucesso!");
      form.reset();
      router.push("/dashboard");
    },
    onError: ({ error }) => {
      console.error(error);
      toast.error("Erro ao criar clínica!");
    },
  });

  const onSubmit = async ({ name }: z.infer<typeof clinicFormSchema>) => {
    createClinicAction.execute({ name });
  };

  const isLoading = createClinicAction.isPending;

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Digite seu nome" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <SubmitButtonForm isLoading={isLoading}>
              Criar clínica
            </SubmitButtonForm>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};

export default ClinicForm;
