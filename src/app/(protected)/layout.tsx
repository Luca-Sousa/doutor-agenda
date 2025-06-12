import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ClinicProvider } from "@/context/clinic-context";

import AppSidebar from "./components/app-sidebar";
import HeaderPages from "./components/header-pages";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <ClinicProvider>
        <AppSidebar />
        <main className="w-full">
          <SidebarInset>
            <HeaderPages />
            {children}
          </SidebarInset>
        </main>
      </ClinicProvider>
    </SidebarProvider>
  );
}
