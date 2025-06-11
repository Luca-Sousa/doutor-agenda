"use client";

import { useQuery } from "@tanstack/react-query";
import {
  CalendarDaysIcon,
  LayoutDashboardIcon,
  StethoscopeIcon,
  UsersRoundIcon,
} from "lucide-react";

import { getUserClinics } from "@/actions/clinic.actions";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

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
  const { data: clinic } = useQuery({
    queryKey: ["userClinics"],
    queryFn: () => getUserClinics(),
  });

  return (
    <Sidebar>
      {/* <div className=" border-b px-6 py-4">
        <Image src="/logo.svg" alt="Doutor Agenda" width={136} height={28} />
      </div> */}

      <SidebarHeader className="border-b p-4">
        {clinic && <ClinicSwitcher clinics={clinic} />}
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={items} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
