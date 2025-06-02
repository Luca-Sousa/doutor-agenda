"use server";

import { db } from "@/db";
import { clinicsTable, doctorsTable, usersToClinicsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { upsertDoctorSchema } from "./clinic.schema";
import { actionClient } from "@/lib/safe-action";

const requireSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized");

  return session;
};

export const createClinic = async (name: string) => {
  const session = await requireSession();

  const [clinic] = await db.insert(clinicsTable).values({ name }).returning();

  await db.insert(usersToClinicsTable).values({
    userId: session.user.id,
    clinicId: clinic.id,
  });

  redirect("/dashboard");
};

export const upsertDoctor = actionClient
  .schema(upsertDoctorSchema)
  .action(async ({ parsedInput }) => {
    const session = await requireSession();
    if (!session.user.clinic?.id) throw new Error("Clinic not Found");

    await db
      .insert(doctorsTable)
      .values({
        id: parsedInput.id,
        clinicId: session.user.clinic.id,
        ...parsedInput,
      })
      .onConflictDoUpdate({
        target: [doctorsTable.id],
        set: {
          ...parsedInput,
        },
      });
  });
