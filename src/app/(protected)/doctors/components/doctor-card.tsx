"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { doctorsTable } from "@/db/schema";
import UpsertDoctorForm from "./upsert-doctor-form";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ClockIcon, DollarSignIcon } from "lucide-react";
import { getAvailability } from "@/helpers/availability";
import { formatCurrencyInCents } from "@/helpers/currency";
import { useState } from "react";

interface DoctorCardProps {
  doctor: typeof doctorsTable.$inferSelect;
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  const [isUpsertDialogOpen, setIsUpsertDialogOpen] = useState(false);

  const doctorInitials = doctor.name
    .split(" ")
    .map((name) => name[0])
    .join("");

  const availability = getAvailability(doctor);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Avatar className="size-12">
            <AvatarFallback>{doctorInitials}</AvatarFallback>
          </Avatar>

          <div>
            <h3 className="text-sm font-medium">{doctor.name}</h3>
            <p className="text-muted-foreground text-sm">{doctor.specialty}</p>
          </div>
        </div>
      </CardHeader>
      <Separator />

      <CardContent className="flex flex-col gap-2">
        <Badge variant="outline">
          <CalendarIcon className="mr-1" />
          <p className="flex gap-1">
            <span className="capitalize">
              {availability.from.format("dddd").split("-")[0]}
            </span>
            a
            <span className="capitalize">
              {availability.to.format("dddd").split("-")[0]}
            </span>
          </p>
        </Badge>

        <Badge variant="outline">
          <ClockIcon className="mr-1" />
          {availability.from.format("HH:mm")} as{" "}
          {availability.to.format("HH:mm")}
        </Badge>

        <Badge variant="outline">
          <DollarSignIcon className="mr-1" />
          {formatCurrencyInCents(doctor.appointmentPriceInCents)}
        </Badge>
      </CardContent>
      <Separator />

      <CardFooter>
        <Dialog open={isUpsertDialogOpen} onOpenChange={setIsUpsertDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full cursor-pointer">Ver detalhes</Button>
          </DialogTrigger>

          <UpsertDoctorForm
            onSuccess={() => setIsUpsertDialogOpen(false)}
            doctor={{
              ...doctor,
              availableFromTime: availability.from.format("HH:mm:ss"),
              availableToTime: availability.to.format("HH:mm:ss"),
            }}
          />
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default DoctorCard;
