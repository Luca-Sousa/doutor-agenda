"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  HandCoinsIcon,
  SaveIcon,
  StethoscopeIcon,
  UserPenIcon,
} from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { upsertDoctor } from "@/actions/clinic.actions";
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
import { SelectGroup, SelectItem, SelectLabel } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { medicalSpecialties, timeOptions, weekDays } from "@/contants";
import { doctorsTable } from "@/db/schema";

const formSchema = z
  .object({
    name: z.string().trim().min(1, {
      message: "Nome é obrigatório.",
    }),
    specialty: z.string().trim().min(1, {
      message: "Especialidade é obrigatória.",
    }),
    appointmentPrice: z.number().min(1, {
      message: "Preço da consulta é obrigatório.",
    }),
    availableFromWeekDay: z.string(),
    availableToWeekDay: z.string(),
    availableFromTime: z.string().min(1, {
      message: "Hora de ínicio é obrigatória.",
    }),
    availableToTime: z.string().min(1, {
      message: "Hora de término é obrigatória.",
    }),
  })
  .refine(
    (data) => {
      return data.availableFromTime < data.availableToTime;
    },
    {
      message:
        "O horário de início não pode ser anterior ao horário de término.",
      path: ["availableToTime"],
    },
  );

interface UpsertDoctorFormProps {
  isOpen: boolean;
  doctor?: typeof doctorsTable.$inferSelect;
  onSuccess?: () => void;
}

const UpsertDoctorForm = ({
  isOpen,
  doctor,
  onSuccess,
}: UpsertDoctorFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: doctor?.name ?? "",
      specialty: doctor?.specialty ?? "",
      appointmentPrice: doctor?.appointmentPriceInCents
        ? doctor.appointmentPriceInCents / 100
        : 0,
      availableFromWeekDay: doctor?.availableFromWeekDay?.toString() ?? "1",
      availableToWeekDay: doctor?.availableToWeekDay?.toString() ?? "5",
      availableFromTime: doctor?.availableFromTime ?? "",
      availableToTime: doctor?.availableToTime ?? "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: doctor?.name ?? "",
        specialty: doctor?.specialty ?? "",
        appointmentPrice: doctor?.appointmentPriceInCents
          ? doctor.appointmentPriceInCents / 100
          : 0,
        availableFromWeekDay: doctor?.availableFromWeekDay?.toString() ?? "1",
        availableToWeekDay: doctor?.availableToWeekDay?.toString() ?? "5",
        availableFromTime: doctor?.availableFromTime ?? "",
        availableToTime: doctor?.availableToTime ?? "",
      });
    }
  }, [form, isOpen, doctor]);

  const upsertDoctorAction = useAction(upsertDoctor, {
    onSuccess: () => {
      toast.success(
        `Médico ${doctor ? "atualizado" : "adicionado"} com sucesso!`,
      );
      onSuccess?.();
    },
    onError: () => {
      toast.error(`Erro ao ${doctor ? "atualizar" : "adicionar"} médico!`);
    },
  });

  const isLoading = upsertDoctorAction.isPending;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    upsertDoctorAction.execute({
      ...values,
      id: doctor?.id,
      availableFromWeekDay: parseInt(values.availableFromWeekDay),
      availableToWeekDay: parseInt(values.availableToWeekDay),
      appointmentPriceInCents: values.appointmentPrice * 100,
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {doctor ? `Médico: ${doctor.name}` : "Adicionar Médico"}
        </DialogTitle>
        <DialogDescription>
          {doctor
            ? "Edite as informações desse médico"
            : "Adicione um novo médico."}
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
            placeholder="Digite o nome do médico"
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SELECT}
            name="specialty"
            label="Especialidade"
            placeholder="Selecione uma especialidade"
          >
            {medicalSpecialties.map((specialty) => (
              <SelectItem key={specialty.label} value={specialty.value}>
                {specialty.label}
              </SelectItem>
            ))}
          </CustomFormField>

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.NUMERICFORMAT}
            icon={HandCoinsIcon}
            name="appointmentPrice"
            label="Preço da consulta"
          />

          <div className="flex gap-3">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SELECT}
              name="availableFromWeekDay"
              label="Dia inicial de disponibilidade"
              placeholder="Selecione um dia"
            >
              {weekDays.map((day) => (
                <SelectItem key={day.value} value={day.value}>
                  {day.label}
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SELECT}
              name="availableToWeekDay"
              label="Dia final de disponibilidade"
              placeholder="Selecione um dia"
            >
              {weekDays.map((day) => (
                <SelectItem key={day.value} value={day.value}>
                  {day.label}
                </SelectItem>
              ))}
            </CustomFormField>
          </div>

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SELECT}
            name="availableFromTime"
            label="Horário inicial de disponibilidade"
            placeholder="Selecione um horário"
          >
            <div className="grid w-full grid-cols-3 gap-3 p-2">
              {Object.entries(timeOptions).map(([label, times]) => (
                <React.Fragment key={label}>
                  <SelectGroup className="rounded-lg border shadow">
                    <SelectLabel className="text-center text-base">
                      {label}
                    </SelectLabel>
                    <Separator />
                    {times.map((time) => (
                      <SelectItem
                        key={time}
                        value={`${time}:00`}
                        className="justify-center px-0"
                      >
                        {time}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </React.Fragment>
              ))}
            </div>
          </CustomFormField>

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SELECT}
            name="availableToTime"
            label="Horário final de disponibilidade"
            placeholder="Selecione um horário"
          >
            <div className="grid w-full grid-cols-3 gap-3 p-2">
              {Object.entries(timeOptions).map(([label, times]) => (
                <React.Fragment key={label}>
                  <SelectGroup className="rounded-lg border shadow">
                    <SelectLabel className="text-center text-base">
                      {label}
                    </SelectLabel>
                    <Separator />
                    {times.map((time) => (
                      <SelectItem
                        key={time}
                        value={`${time}:00`}
                        className="justify-center px-0"
                      >
                        {time}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </React.Fragment>
              ))}
            </div>
          </CustomFormField>

          <DialogFooter>
            <SubmitButtonForm isLoading={isLoading}>
              {doctor ? (
                <div className="flex items-center gap-2">
                  <SaveIcon /> Salvar
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <StethoscopeIcon /> Adicionar Médico
                </div>
              )}
            </SubmitButtonForm>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default UpsertDoctorForm;
