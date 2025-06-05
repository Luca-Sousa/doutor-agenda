import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { auth } from "@/lib/auth";

import { DatePickerRange } from "./components/date-picker-range";

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) redirect("/authentication");
  if (!session.user.clinic) redirect("/clinic-form");

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Dashboard</PageTitle>
          <PageDescription>Gerencie os médicos de sua clínica.</PageDescription>
        </PageHeaderContent>

        <PageActions>
          <DatePickerRange  />
        </PageActions>
      </PageHeader>

      <PageContent>
        <div className="grid gap-6 2xl:grid-cols-4"></div>
      </PageContent>
    </PageContainer>
  );
};

export default DashboardPage;
