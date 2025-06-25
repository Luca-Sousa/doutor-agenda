"use client";

import { ArrowUpRight, Stethoscope } from "lucide-react";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
  const router = useRouter();

  return (
    <Card>
      <CardHeader className="mb-2 flex items-center gap-3">
        <Stethoscope className="text-muted-foreground" />
        <CardTitle className="flex-1">Médicos</CardTitle>

        <Button
          size="sm"
          variant="outline"
          onClick={() => router.push("/doctors")}
          className="cursor-pointer"
        >
          Ver todos
          <ArrowUpRight />
        </Button>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="border-primary size-12 border shadow-md">
                  {doctor.avatarImageUrl && (
                    <AvatarImage
                      src={doctor.avatarImageUrl}
                      alt="Imagem do Doutor"
                      className="object-cover object-top"
                    />
                  )}
                  <AvatarFallback className="bg-gray-100 text-lg font-medium text-gray-600">
                    {doctor.name.charAt(0)}
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
