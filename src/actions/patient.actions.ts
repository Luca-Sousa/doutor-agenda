"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import z from "zod";

import { db } from "@/db";
import { patientsTable } from "@/db/schema";
import { actionClient } from "@/lib/safe-action";

import { requireSession } from "./clinic.actions";
import { upsertPatientSchema } from "./patient.schema";

export const upsertPatient = actionClient
  .schema(upsertPatientSchema)
  .action(async ({ parsedInput }) => {
    const session = await requireSession();
    const activeClinicId = session.user.activeClinicId;
    if (!activeClinicId) throw new Error("Clinic not Found");

    await db
      .insert(patientsTable)
      .values({
        ...parsedInput,
        id: parsedInput.id,
        clinicId: activeClinicId,
      })
      .onConflictDoUpdate({
        target: [patientsTable.id],
        set: {
          ...parsedInput,
        },
      });

    revalidatePath("/patients");
  });

export const deletePatient = actionClient
  .schema(
    z.object({
      id: z.string().uuid(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const session = await requireSession();
    const activeClinicId = session.user.activeClinicId;
    if (!activeClinicId) throw new Error("Clinic not Found");

    const patient = await db.query.patientsTable.findFirst({
      where: eq(patientsTable.id, parsedInput.id),
    });

    if (!patient) throw new Error("Paciente não encontrado");

    if (patient.clinicId !== activeClinicId)
      throw new Error("O paciente não pertence a clínica.");

    await db.delete(patientsTable).where(eq(patientsTable.id, parsedInput.id));

    revalidatePath("/patients");
  });
