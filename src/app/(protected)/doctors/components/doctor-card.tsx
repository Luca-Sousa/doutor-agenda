"use client";

import { CalendarIcon, ClockIcon, DollarSignIcon } from "lucide-react";
import { Trash2Icon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

import { deleteDoctor } from "@/actions/doctor.actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { getAvailability } from "@/helpers/availability";
import { formatCurrencyInCents } from "@/helpers/currency";

import UpsertDoctorForm from "./upsert-doctor-form";

interface DoctorCardProps {
  doctor: typeof doctorsTable.$inferSelect;
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  const [isUpsertDialogOpen, setIsUpsertDialogOpen] = useState(false);

  const availability = getAvailability(doctor);

  const deleteDoctorAction = useAction(deleteDoctor, {
    onSuccess: () => {
      toast.success("Médico deletado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao deletar o médico!");
    },
  });

  const handleDeleteDoctorClick = () => {
    if (!doctor) return;

    deleteDoctorAction.execute({
      id: doctor.id,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Avatar className="size-12">
            <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
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

      <CardFooter className="gap-1">
        <Dialog open={isUpsertDialogOpen} onOpenChange={setIsUpsertDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex-1 cursor-pointer">Ver detalhes</Button>
          </DialogTrigger>

          <UpsertDoctorForm
            isOpen={isUpsertDialogOpen}
            onSuccess={() => setIsUpsertDialogOpen(false)}
            doctor={{
              ...doctor,
              availableFromTime: availability.from.format("HH:mm:ss"),
              availableToTime: availability.to.format("HH:mm:ss"),
            }}
          />
        </Dialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="cursor-pointer bg-red-500 hover:bg-red-400"
            >
              <Trash2Icon />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Tem certeza que deseja deletar esse médico?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Essa ação não pode ser revertida. Isso irá deletar o médico e
                todas as consultas agendadas.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                className="cursor-pointer"
                onClick={handleDeleteDoctorClick}
              >
                Deletar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default DoctorCard;
