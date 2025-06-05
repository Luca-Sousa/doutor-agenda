import { Stethoscope } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TopDoctorsProps {
  doctors: {
    id: string;
    name: string;
    avatarImageUrl: string | null;
    specialty: string;
    appointments: number;
  }[];
}

const TopDoctors = ({ doctors }: TopDoctorsProps) => {
  return (
    <Card>
      <CardHeader className="mb-2 flex items-center gap-3">
        <Stethoscope className="text-muted-foreground" />
        <CardTitle>Médicos</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="size-10">
                  <AvatarFallback className="bg-gray-100 text-lg font-medium text-gray-600">
                    {doctor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-sm">{doctor.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    {doctor.specialty}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-muted-foreground text-sm font-medium">
                  {doctor.appointments} agend.
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopDoctors;
