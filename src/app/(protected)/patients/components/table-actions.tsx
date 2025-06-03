"use client";

import { ClipboardPenIcon, MoreVerticalIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { patientsTable } from "@/db/schema";

import UpsertPatientForm from "./upsert-patient-form";

interface TableActionsProps {
  patient: typeof patientsTable.$inferSelect;
}

const TableActions = ({ patient }: TableActionsProps) => {
  const [upsertDialogIsOpen, setUpsertDialogIsOpen] = useState(false);

  return (
    <Dialog open={upsertDialogIsOpen} onOpenChange={setUpsertDialogIsOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="cursor-pointer">
            <MoreVerticalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuLabel className="text-center">Ações</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setUpsertDialogIsOpen(true)}
          >
            <ClipboardPenIcon />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Trash2Icon />
            Deletar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpsertPatientForm
        isOpen={upsertDialogIsOpen}
        onSuccess={() => setUpsertDialogIsOpen(false)}
        patient={patient}
      />
    </Dialog>
  );
};

export default TableActions;
