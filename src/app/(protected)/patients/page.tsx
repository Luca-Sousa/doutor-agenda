import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { DataTable } from "@/components/ui/data-table";
import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { db } from "@/db";
import { patientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import AddPatientButton from "./components/add-patient-button";
import { patientsTableColumns } from "./components/table-columns";

const PatientsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) redirect("/authentication");

  const activeClinicId = session.user.activeClinicId;
  if (!activeClinicId) redirect("/clinic-form");

  if (!session.user.plan) redirect("/new-subscription");

  const patients = await db.query.patientsTable.findMany({
    where: eq(patientsTable.clinicId, activeClinicId),
  });

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Pacientes</PageTitle>
          <PageDescription>
            Gerencie os pacientes da sua clínica
          </PageDescription>
        </PageHeaderContent>

        <PageActions>
          <AddPatientButton />
        </PageActions>
      </PageHeader>

      <PageContent>
        {/* <div className="grid gap-6 2xl:grid-cols-4">
          {patients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div> */}
        <DataTable columns={patientsTableColumns} data={patients} />
      </PageContent>
    </PageContainer>
  );
};

export default PatientsPage;
