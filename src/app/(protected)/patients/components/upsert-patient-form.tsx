"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  MailIcon,
  MarsIcon,
  PhoneIcon,
  SaveIcon,
  UserIcon,
  UserPenIcon,
  VenusIcon,
} from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { upsertPatient } from "@/actions/patient.actions";
import CustomFormField, {
  FormFieldType,
} from "@/components/form/custom-form-field";
import SubmitButtonForm from "@/components/form/submit-button-form";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { patientsTable } from "@/db/schema";

const formSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Nome é obrigatório.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  phoneNumber: z.string().trim().min(1, {
    message: "Número de telefone é obrigatório.",
  }),
  gender: z.enum(["male", "female"], {
    required_error: "Gênero é obrigatório.",
  }),
});

interface UpsertPatientFormProps {
  isOpen: boolean;
  patient?: typeof patientsTable.$inferSelect;
  onSuccess?: () => void;
}

const UpsertPatientForm = ({
  isOpen,
  patient,
  onSuccess,
}: UpsertPatientFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: patient?.name ?? "",
      email: patient?.email ?? "",
      phoneNumber: patient?.phoneNumber ?? "",
      gender: patient?.gender ?? undefined,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset(patient);
    }
  }, [isOpen, form, patient]);

  const upsertPatientAction = useAction(upsertPatient, {
    onSuccess: () => {
      toast.success(
        `Paciente ${patient ? "atualizado" : "adicionado"} com sucesso!`,
      );
      onSuccess?.();
    },
    onError: () => {
      toast.error(`Erro ao ${patient ? "atualizar" : "adicionar"} paciente!`);
    },
  });

  const isLoading = upsertPatientAction.isPending;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    upsertPatientAction.execute({
      ...values,
      id: patient?.id,
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {patient ? `Paciente: ${patient.name}` : "Adicionar Paciente"}
        </DialogTitle>
        <DialogDescription>
          {patient
            ? "Edite as informações desse paciente."
            : "Adicione um novo paciente."}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            icon={UserPenIcon}
            name="name"
            label="Nome"
            placeholder="Digite o nome completo do paciente"
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            icon={MailIcon}
            name="email"
            label="Email"
            typeInput="email"
            placeholder="exemplo@gmail.com"
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.PHONE_INPUT}
            icon={PhoneIcon}
            name="phoneNumber"
            label="Número de telefone"
            placeholder="(11) 99999-9999"
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SELECT}
            name="gender"
            label="Gênero"
            placeholder="Selecione o gênero"
          >
            <SelectItem value="male">
              <MarsIcon className="size-5 text-primary/70" /> Masculino
            </SelectItem>
            <SelectItem value="female">
              <VenusIcon className="size-5 text-primary/70" /> Feminino
            </SelectItem>
          </CustomFormField>

          <DialogFooter>
            <SubmitButtonForm isLoading={isLoading}>
              {patient ? (
                <div className="flex items-center gap-2">
                  <SaveIcon /> Salvar
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <UserIcon /> Adicionar Paciente
                </div>
              )}
            </SubmitButtonForm>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default UpsertPatientForm;
