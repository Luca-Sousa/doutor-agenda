"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import UpsertPatientForm from "./upsert-patient-form";

const AddPatientButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <PlusIcon />
          Adicionar Paciente
        </Button>
      </DialogTrigger>

      <UpsertPatientForm onSuccess={() => setIsOpen(false)} isOpen={isOpen} />
    </Dialog>
  );
};

export default AddPatientButton;
