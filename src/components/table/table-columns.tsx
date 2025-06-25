"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { appointmentsTable } from "@/db/schema";
import { formatCurrencyInCents } from "@/helpers/currency";

import { DataTableColumnHeader } from "./data-table-column-header";
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
    accessorFn: (row) => row.patient.name,
    header: "Paciente",
    cell: ({ row: { original: appointment } }) => {
      return `${appointment.patient.name}`;
    },
  },
  {
    id: "doctor",
    accessorKey: "doctor",
    accessorFn: (row) => row.doctor.name,
    header: "Médico",
    cell: ({ row: { original: appointment } }) => {
      return `${appointment.doctor.name}`;
    },
  },
  {
    id: "date",
    accessorKey: "date",
    accessorFn: (row) => row.date,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data e Hora" />
    ),
    cell: ({ row: { original: appointment } }) => {
      return format(new Date(appointment.date), "dd/MM/yyyy 'às' HH:mm", {
        locale: ptBR,
      });
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
