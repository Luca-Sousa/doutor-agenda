"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { doctorsTable } from "@/db/schema";
import { actionClient } from "@/lib/safe-action";
import { deleteFileFromBucket } from "@/utils/deleteImage";

import { requireSession } from "./clinic.actions";

export const deleteDoctor = actionClient
  .schema(
    z.object({
      id: z.string().uuid(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const session = await requireSession();
    const activeClinicId = session.user.activeClinicId;
    if (!activeClinicId) throw new Error("Clinic not Found");

    const doctor = await db.query.doctorsTable.findFirst({
      where: eq(doctorsTable.id, parsedInput.id),
    });
    if (!doctor) throw new Error("Médico não encontrado!");

    if (doctor.clinicId !== activeClinicId) throw new Error("Unauthorized!");

    // Deleta a imagem do bucket, se existir
    if (doctor.avatarImageUrl) {
      try {
        const url = new URL(doctor.avatarImageUrl);
        // Remove a barra inicial e faz decode dos caracteres especiais
        const fileKey = decodeURIComponent(
          url.pathname.startsWith("/") ? url.pathname.slice(1) : url.pathname
        );
        await deleteFileFromBucket(fileKey);
      } catch (e) {
        console.error("Erro ao deletar imagem do doutor:", e);
      }
    }

    await db.delete(doctorsTable).where(eq(doctorsTable.id, parsedInput.id));

    revalidatePath("/doctors");
  });
