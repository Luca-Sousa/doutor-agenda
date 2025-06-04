"use client";

import { ColumnDef } from "@tanstack/react-table";

import { appointmentsTable } from "@/db/schema";
import { formatCurrencyInCents } from "@/helpers/currency";

import AppointmentsTableActions from "./table-actions";

export type AppointmentWithRelations = typeof appointmentsTable.$inferSelect & {
  patient: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    gender: "male" | "female";
  };
  doctor: {
    id: string;
    name: string;
    specialty: string;
  };
};

export const appointmentsTableColumns: ColumnDef<AppointmentWithRelations>[] = [
  {
    id: "patient",
    accessorKey: "patient",
    header: "Paciente",
    cell: ({ row: { original: appointment } }) => {
      return `${appointment.patient.name}`;
    },
  },
  {
    id: "doctor",
    accessorKey: "doctor",
    header: "Médico",
    cell: ({ row: { original: appointment } }) => {
      return `${appointment.doctor.name}`;
    },
  },
  {
    id: "specialty",
    accessorKey: "doctor",
    header: "Especialidade",
    cell: ({ row: { original: appointment } }) => {
      return `${appointment.doctor.specialty}`;
    },
  },
  {
    id: "price",
    accessorKey: "appointmentPriceInCents",
    header: "Valor",
    cell: ({ row: { original: appointment } }) => {
      return formatCurrencyInCents(appointment.appointmentPriceInCents);
    },
  },
  {
    id: "actions",
    cell: ({ row: { original: appointment } }) => {
      return <AppointmentsTableActions appointment={appointment} />;
    },
  },
];
