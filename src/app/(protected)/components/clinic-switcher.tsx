"use client";

import { ChevronsUpDown, PlusIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useEffect } from "react";

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
import { useClinic } from "@/context/clinic-context";

interface ClinicSwitcherProps {
  clinics: {
    id: string;
    name: string;
  }[];
  userPlan: string | null | undefined;
}

const ClinicSwitcher = ({ clinics, userPlan }: ClinicSwitcherProps) => {
  const router = useRouter();
  const { isMobile } = useSidebar();

  const { activeClinic, setActiveClinic } = useClinic();

  useEffect(() => {
    if (!activeClinic && clinics.length > 0) {
      setActiveClinic(clinics[0]);
    }
  }, [clinics, activeClinic, setActiveClinic]);

  const handleDisabledButton = () => {
    if ((userPlan === null || userPlan === undefined) && clinics.length >= 1)
      return true;
    if (userPlan === "essential" && clinics.length >= 3) return true;

    return false;
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
                  {!activeClinic
                    ? "Dr. Agenda"
                    : `Clínica ${activeClinic.name}`}
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
                key={clinic.name}
                onClick={() => {
                  setActiveClinic(clinic);
                  document.cookie = `activeClinicId=${clinic.id}; path=/`;
                  router.refresh();
                }}
                className="gap-2 p-2"
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
              disabled={handleDisabledButton()}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <PlusIcon className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">
                {!handleDisabledButton() ? (
                  "Adicionar Clínica"
                ) : (
                  <span className="text-xs">
                    Você atingiu a quantidade máxima de clínicas do seu plano
                  </span>
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
