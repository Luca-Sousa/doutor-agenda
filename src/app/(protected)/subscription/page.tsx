import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { auth } from "@/lib/auth";

import { SubscriptionPlan } from "./components/subscription-plan";

const SubscriptionPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) redirect("/authentication");

  const userClinics = session.user.clinics;
  const activeClinicId = session.user.activeClinicId;
  if (userClinics.length <= 0 || !activeClinicId) redirect("/clinic-form");

  if (!session?.user) redirect("/authentication");

  const userPlan = session.user.plan;
  const userEmail = session.user.email;

  const activePlan = () => {
    if (userPlan === null) return "free";
    if (userPlan === "essential") return "essential";
    if (userPlan === "premium") return "premium";
  };

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "R$0",
      description: "Ideal para testes e uso pessoal.",
      features: [
        "Cadastro de 1 médico",
        "Até 20 agendamentos/mês",
        "Cadastro de pacientes",
        "Suporte limitado",
      ],
      highlight: false,
    },
    {
      id: "essential",
      name: "Essential",
      price: "R$59",
      description: "Para profissionais autônomos ou pequenas clínicas",
      features: [
        "Cadastro de até 3 médicos",
        "Agendamentos ilimitados",
        "Métricas básicas",
        "Cadastro de pacientes",
        "Confirmação manual",
        "Suporte via e-mail",
      ],
      highlight: activePlan() === "essential",
    },
    {
      id: "premium",
      name: "Premium",
      price: "R$129",
      description: "Para clínicas que querem o máximo de recursos",
      features: [
        "Cadastro ilimitado de médicos",
        "Agendamentos ilimitados",
        "Métricas avançadas",
        "Cadastro de pacientes",
        "Confirmação automática",
        "Suporte prioritário",
        "Integração com WhatsApp",
      ],
      highlight: activePlan() === "premium",
    },
  ];

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Assinatura</PageTitle>
          <PageDescription>Gerencie a sua assinatura</PageDescription>
        </PageHeaderContent>
      </PageHeader>

      <PageContent>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 2xl:grid-cols-3">
          {plans.map((plan) => (
            <SubscriptionPlan
              key={plan.id}
              activePlan={activePlan()}
              userEmail={userEmail}
              plan={plan}
            />
          ))}
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default SubscriptionPage;
