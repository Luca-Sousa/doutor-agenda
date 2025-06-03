"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { doctorsTable } from "@/db/schema";
import { actionClient } from "@/lib/safe-action";

import { requireSession } from "./clinic.actions";

export const deleteDoctor = actionClient
  .schema(
    z.object({
      id: z.string().uuid(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const session = await requireSession();

    const doctor = await db.query.doctorsTable.findFirst({
      where: eq(doctorsTable.id, parsedInput.id),
    });
    if (!doctor) throw new Error("Médico não encontrado!");

    if (doctor.clinicId !== session.user.clinic?.id)
      throw new Error("Unauthorized!");

    await db.delete(doctorsTable).where(eq(doctorsTable.id, parsedInput.id));

    revalidatePath("/doctors");
  });
