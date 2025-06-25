"use client";

import {
  CalendarIcon,
  ClockIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    <Card className="border-primary/10 hover:border-primary/30 border-2 shadow-lg transition-all duration-200">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="border-primary/30 size-20 border-2 shadow-md">
          {doctor.avatarImageUrl && (
            <AvatarImage
              src={doctor.avatarImageUrl}
              alt="Imagem do Doutor"
              className="object-cover object-top"
            />
          )}
          <AvatarFallback className="text-2xl">
            {doctor.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="text-primary text-xl font-bold">{doctor.name}</h3>
          <p className="text-muted-foreground text-base">{doctor.specialty}</p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 pt-0">
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1 text-xs capitalize"
          >
            <CalendarIcon className="text-primary size-4" />
            {availability.from.format("dddd")}
            <span className="normal-case">a</span>
            {availability.to.format("dddd")}
          </Badge>
          <Badge
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1 text-xs"
          >
            <ClockIcon className="text-primary size-4" />
            {availability.from.format("HH:mm")} -{" "}
            {availability.to.format("HH:mm")}
          </Badge>
        </div>
        <div>
          <Badge
            variant="outline"
            className="border-primary text-primary bg-primary/10 flex items-center gap-1 px-3 py-1 text-base"
          >
            {formatCurrencyInCents(doctor.appointmentPriceInCents)}
          </Badge>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="flex gap-2 pt-3">
        <Dialog open={isUpsertDialogOpen} onOpenChange={setIsUpsertDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex-1 cursor-pointer gap-2">
              <PencilIcon className="size-4" /> Editar
            </Button>
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
              title="Deletar médico"
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
