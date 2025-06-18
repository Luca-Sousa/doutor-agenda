"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { CalendarIcon, HandCoinsIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { addAppointment } from "@/actions/appointment.actions";
import { getAvailableTimes } from "@/actions/available-times.actions";
import CustomFormField, {
  FormFieldType,
} from "@/components/form/custom-form-field";
import SubmitButtonForm from "@/components/form/submit-button-form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
} from "@/components/ui/form";
import {
  SelectItem,
} from "@/components/ui/select";
import { doctorsTable, patientsTable } from "@/db/schema";

const formSchema = z.object({
  patientId: z.string().min(1, {
    message: "Paciente é obrigatório.",
  }),
  doctorId: z.string().min(1, {
    message: "Médico é obrigatório.",
  }),
  appointmentPrice: z.number().min(1, {
    message: "Valor da consulta é obrigatório.",
  }),
  date: z.date({
    message: "Data é obrigatória.",
  }),
  time: z.string().min(1, {
    message: "Horário é obrigatório.",
  }),
});

interface AddAppointmentFormProps {
  isOpen: boolean;
  patients: (typeof patientsTable.$inferSelect)[];
  doctors: (typeof doctorsTable.$inferSelect)[];
  onSuccess?: () => void;
}

const AddAppointmentForm = ({
  isOpen,
  patients,
  doctors,
  onSuccess,
}: AddAppointmentFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "",
      doctorId: "",
      appointmentPrice: 0,
      date: undefined,
      time: "",
    },
  });

  const selectedDoctorId = form.watch("doctorId");
  const selectedPatientId = form.watch("patientId");
  const selectedDate = form.watch("date");

  const { data: availableTimes } = useQuery({
    queryKey: ["available-times", selectedDate, selectedDoctorId],
    queryFn: () =>
      getAvailableTimes({
        date: dayjs(selectedDate).format("YYYY-MM-DD"),
        doctorId: selectedDoctorId,
      }),
    enabled: !!selectedDate && !!selectedDoctorId,
  });

  // Atualizar o preço quando o médico for selecionado
  useEffect(() => {
    if (selectedDoctorId) {
      const selectedDoctor = doctors.find(
        (doctor) => doctor.id === selectedDoctorId,
      );

      if (selectedDoctor) {
        form.setValue(
          "appointmentPrice",
          selectedDoctor.appointmentPriceInCents / 100,
        );
      }
    }
  }, [selectedDoctorId, doctors, form]);

  useEffect(() => {
    if (isOpen) {
      form.reset({
        patientId: "",
        doctorId: "",
        appointmentPrice: 0,
        date: undefined,
        time: "",
      });
    }
  }, [isOpen, form]);

  const createAppointmentAction = useAction(addAppointment, {
    onSuccess: () => {
      toast.success("Agendamento criado com sucesso.");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Erro ao criar agendamento.");
    },
  });

  const isLoading = createAppointmentAction.isPending;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createAppointmentAction.execute({
      ...values,
      appointmentPriceInCents: values.appointmentPrice * 100,
    });
  };

  const isDateAvailable = (date: Date) => {
    if (!selectedDoctorId) return false;

    const selectedDoctor = doctors.find(
      (doctor) => doctor.id === selectedDoctorId,
    );
    if (!selectedDoctor) return false;

    const dayOfWeek = date.getDay();
    return (
      dayOfWeek >= selectedDoctor.availableFromWeekDay &&
      dayOfWeek <= selectedDoctor.availableToWeekDay
    );
  };

  const isDateTimeEnabled = selectedPatientId && selectedDoctorId;

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Novo agendamento</DialogTitle>
        <DialogDescription>
          Crie um novo agendamento para sua clínica.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SELECT}
            name="patientId"
            label="Paciente"
            placeholder="Selecione um paciente"
          >
            {patients.map((patient) => (
              <SelectItem key={patient.id} value={patient.id}>
                <Avatar>
                  <AvatarFallback className="uppercase">
                    {patient.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {patient.name}
              </SelectItem>
            ))}
          </CustomFormField>

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SELECT}
            name="doctorId"
            label="Médico"
            placeholder="Selecione um médico"
          >
            {doctors.map((doctor) => (
              <SelectItem key={doctor.id} value={doctor.id}>
                <Avatar>
                  <AvatarFallback className="uppercase">
                    {doctor.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {doctor.name} - {doctor.specialty}
              </SelectItem>
            ))}
          </CustomFormField>

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.NUMERICFORMAT}
            icon={HandCoinsIcon}
            name="appointmentPrice"
            label="Valor da consulta"
            disabled={!selectedDoctorId}
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.POPOVERCALENDER}
            icon={HandCoinsIcon}
            name="date"
            label="Data"
            disabled={!isDateTimeEnabled}
            disabledCalendar={(date) =>
              date < new Date() || !isDateAvailable(date)
            }
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SELECT}
            name="time"
            label="Horário"
            placeholder="Selecione um horário"
            disabled={!isDateTimeEnabled || !selectedDate}
          >
            {availableTimes?.data?.map((time) => (
              <SelectItem
                key={time.value}
                value={time.value}
                disabled={!time.available}
              >
                {time.label} {!time.available && "(Indisponível)"}
              </SelectItem>
            ))}
          </CustomFormField>

          <DialogFooter>
            <SubmitButtonForm isLoading={isLoading}>
              <div className="flex items-center gap-2">
                <CalendarIcon /> Criar agendamento
              </div>
            </SubmitButtonForm>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default AddAppointmentForm;
