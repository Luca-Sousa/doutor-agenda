import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import ClinicForm from "./componentes/form";

const ClinicFormPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) redirect("/authentication");
  const userPlan = session.user.plan;
  const clinics = session.user.clinics;

  const canAddMoreClinics = () => {
    if (!userPlan && clinics.length >= 1) return false;
    if (userPlan === "essential" && clinics.length >= 3) return false;
    return true;
  };

  if (!canAddMoreClinics()) redirect("/dashboard");

  return (
    <div className="flex h-screen max-h-screen justify-between">
      <section className="container my-auto w-full max-w-[900px] flex-col overflow-auto px-7 py-10">
        <div className="mx-auto flex size-full max-w-[496px] flex-col py-10">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={1000}
            height={1000}
            className="mb-12 h-10 w-fit"
          />

          <div className="mb-12 space-y-4">
            <h1 className="text-[18px] leading-[24px] font-bold md:text-[24px] md:leading-[28px]">
              Olá 👋
            </h1>
            <p>
              Qual será o nome da sua
              <span className="text-primary px-1 font-semibold uppercase">
                {session.user.activeClinicId ? "nova" : "primeira"}
              </span>
              clínica?
            </p>
          </div>

          <ClinicForm />

          <div className="mt-20 flex justify-between justify-items-end text-center xl:text-left">
            <p className="justify-items-end xl:text-left">
              © 2025 doutor agenda
            </p>

            {session.user.clinics && session.user.clinics.length > 0 && (
              <Link href="/dashboard" className="text-primary">
                voltar
              </Link>
            )}
          </div>
        </div>
      </section>

      <Image
        src="/assets/images/onboarding-img.png"
        alt="Imagem de Paciente"
        width={1000}
        height={1000}
        className="hidden h-full max-w-[50%] object-cover md:block"
      />
    </div>
  );
};

export default ClinicFormPage;
