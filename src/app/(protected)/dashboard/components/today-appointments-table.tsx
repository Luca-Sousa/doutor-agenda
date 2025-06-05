import { Calendar } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";

import { appointmentsTableColumns } from "../../appointments/components/table-columns";

interface TodayAppointmentsTableProps {
  todayAppointments: {
    date: Date;
    id: string;
    appointmentPriceInCents: number;
    createdAt: Date;
    updatedAt: Date | null;
    clinicId: string;
    patientId: string;
    doctorId: string;
    patient: {
      id: string;
      name: string;
      createdAt: Date;
      updatedAt: Date | null;
      clinicId: string;
      email: string;
      phoneNumber: string;
      gender: "male" | "female";
    };
    doctor: {
      id: string;
      name: string;
      appointmentPriceInCents: number;
      createdAt: Date;
      updatedAt: Date | null;
      clinicId: string;
      avatarImageUrl: string | null;
      availableFromWeekDay: number;
      availableToWeekDay: number;
      availableFromTime: string;
      availableToTime: string;
      specialty: string;
    };
  }[];
}

const TodayAppointmentsTable = ({
  todayAppointments,
}: TodayAppointmentsTableProps) => {
  return (
    <Card className="mx-auto w-full">
      <CardHeader className="mb-2 flex items-center gap-3">
        <Calendar className="text-muted-foreground" />
        <CardTitle>Agendamentos de hoje</CardTitle>
      </CardHeader>

      <CardContent>
        <DataTable
          columns={appointmentsTableColumns}
          data={todayAppointments}
        />
      </CardContent>
    </Card>
  );
};

export default TodayAppointmentsTable;
