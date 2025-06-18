"use client";

import {
  CalendarDaysIcon,
  LayoutDashboardIcon,
  StethoscopeIcon,
  UsersRoundIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";

import ClinicSwitcher from "./clinic-switcher";
import NavMain from "./nav-main";
import NavUser from "./nav-user";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Agendamentos",
    url: "/appointments",
    icon: CalendarDaysIcon,
  },
  {
    title: "Médicos",
    url: "/doctors",
    icon: StethoscopeIcon,
  },
  {
    title: "Pacientes",
    url: "/patients",
    icon: UsersRoundIcon,
  },
];

const AppSidebar = () => {
  const session = authClient.useSession();
  const clinics = session.data?.user.clinics;
  const userPlan = session.data?.user.plan;

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        {!clinics ? (
          <div className="flex h-[48px] w-full gap-2 rounded-lg bg-neutral-100 p-2">
            <Skeleton className="aspect-square size-8 rounded-lg bg-neutral-200" />

            <div className="my-auto flex-1 flex-col">
              <Skeleton className="h-3 w-32 bg-neutral-200" />
            </div>

            <Skeleton className="h-8 w-5 rounded-md bg-neutral-200" />
          </div>
        ) : (
          <ClinicSwitcher clinics={clinics} userPlan={userPlan} />
        )}
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={items} />
      </SidebarContent>

      <SidebarFooter>
        {!session.data?.user ? (
          <div className="flex h-[48px] w-full gap-2 bg-neutral-100 p-2">
            <Skeleton className="size-8 rounded-full bg-neutral-200" />

            <div className="flex flex-1 flex-col justify-between">
              <Skeleton className="h-3 w-32 bg-neutral-200" />
              <Skeleton className="h-2.5 w-24 bg-neutral-200" />
            </div>

            <Skeleton className="h-8 w-5 rounded-md bg-neutral-200" />
          </div>
        ) : (
          <NavUser />
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
