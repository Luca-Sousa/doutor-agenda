"use client";

import { Mail, Phone, User } from "lucide-react";
import { useState } from "react";

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
import { patientsTable } from "@/db/schema";

import UpsertPatientForm from "./upsert-patient-form";

interface PatientCardProps {
  patient: typeof patientsTable.$inferSelect;
}

const PatientCard = ({ patient }: PatientCardProps) => {
  const [isUpsertPatientDialogOpen, setIsUpsertPatientDialogOpen] =
    useState(false);

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "";

    const formatted = phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    return formatted;
  };

  const getGenderLabel = (gender: "male" | "female") => {
    return gender === "male" ? "Masculino" : "Feminino";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Avatar className="size-12">
            <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h3 className="text-sm font-medium">{patient.name}</h3>
            <p className="text-muted-foreground text-sm">
              {getGenderLabel(patient.gender)}
            </p>
          </div>
        </div>
      </CardHeader>
      <Separator />

      <CardContent className="flex flex-col gap-2">
        <Badge variant="outline">
          <Mail className="mr-1" />
          {patient.email}
        </Badge>
        <Badge variant="outline">
          <Phone className="mr-1" />
          {formatPhoneNumber(patient.phoneNumber)}
        </Badge>
        <Badge variant="outline">
          <User className="mr-1" />
          {getGenderLabel(patient.gender)}
        </Badge>
      </CardContent>
      <Separator />

      <CardFooter>
        <Dialog
          open={isUpsertPatientDialogOpen}
          onOpenChange={setIsUpsertPatientDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="w-full cursor-pointer">Ver detalhes</Button>
          </DialogTrigger>

          <UpsertPatientForm
            patient={patient}
            onSuccess={() => setIsUpsertPatientDialogOpen(false)}
            isOpen={isUpsertPatientDialogOpen}
          />
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default PatientCard;
