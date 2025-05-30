import { Button } from "@/components/ui/button";
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
import { PlusIcon } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const DoctorsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) redirect("/authentication");
  if (!session.user.clinic) redirect("/clinic-form");

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Médicos</PageTitle>
          <PageDescription>Gerencie os médicos de sua clínica.</PageDescription>
        </PageHeaderContent>

        <PageActions>
          <Button>
            <PlusIcon />
            Adicionar Médico
          </Button>
        </PageActions>
      </PageHeader>

      <PageContent>
        <h1>Médicos</h1>
      </PageContent>
    </PageContainer>
  );
};

export default DoctorsPage;
