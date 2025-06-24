"use client";

import { ChevronsUpDown, PlusIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as React from "react";

import { updateActiveClinic } from "@/actions/user.actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface ClinicSwitcherProps {
  clinics: {
    id: string;
    name: string;
  }[];
  userPlan: string | null | undefined;
  activeClinicId: string | null | undefined;
  onClinicChange?: (clinicId: string) => void;
}

const ClinicSwitcher = ({
  clinics,
  userPlan,
  activeClinicId,
  onClinicChange,
}: ClinicSwitcherProps) => {
  const router = useRouter();
  const { isMobile } = useSidebar();

  const canAddMoreClinics = () => {
    if (!userPlan && clinics.length >= 1) return false;
    if (userPlan === "essential" && clinics.length >= 3) return false;
    return true;
  };

  const handleClinicSelect = async (clinic: (typeof clinics)[0]) => {
    await updateActiveClinic(clinic.id);
    if (onClinicChange) onClinicChange(clinic.id);

    router.refresh();
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Image
                  src="/logomarca.png"
                  alt="Doutor Agenda"
                  width={32}
                  height={32}
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium capitalize">
                  {!activeClinicId
                    ? "Dr. Agenda"
                    : "Clínica " +
                      (clinics.find((c) => c.id === activeClinicId)?.name ??
                        "Clínica")}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Clínicas
            </DropdownMenuLabel>
            {clinics.map((clinic, index) => (
              <DropdownMenuItem
                key={clinic.id}
                onClick={() => handleClinicSelect(clinic)}
                className={`${
                  activeClinicId === clinic.id &&
                  "bg-accent text-accent-foreground"
                } gap-2 p-2`}
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <Image
                    src="/logomarca.png"
                    alt="Doutor Agenda"
                    width={24}
                    height={24}
                  />
                </div>
                {clinic.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer items-start gap-2 p-2"
              onClick={() => router.push("/clinic-form")}
              disabled={!canAddMoreClinics()}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <PlusIcon className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">
                {canAddMoreClinics() ? (
                  "Adicionar Clínica"
                ) : (
                  <span className="text-xs">Limite de clínicas atingido</span>
                )}
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default ClinicSwitcher;
