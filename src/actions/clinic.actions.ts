"use server";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { db } from "@/db";
import {
  clinicsTable,
  doctorsTable,
  usersTable,
  usersToClinicsTable,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";
import { handleFileUpload } from "@/utils/createImage";
import { deleteFileFromBucket } from "@/utils/deleteImage";

import { upsertDoctorSchema } from "./clinic.schema";

export const requireSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized");

  return session;
};

export const createClinic = actionClient
  .schema(
    z.object({
      name: z.string(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const { name } = parsedInput;
    const session = await requireSession();
    const [clinic] = await db.insert(clinicsTable).values({ name }).returning();

    await db.insert(usersToClinicsTable).values({
      userId: session.user.id,
      clinicId: clinic.id,
    });

    await db
      .update(usersTable)
      .set({ activeClinicId: clinic.id })
      .where(eq(usersTable.id, session.user.id));
  });

dayjs.extend(utc);

export const upsertDoctor = actionClient
  .schema(upsertDoctorSchema)
  .action(async ({ parsedInput }) => {
    const session = await requireSession();
    const activeClinicId = session.user.activeClinicId;
    if (!activeClinicId) throw new Error("Clinic not Found");

    const { availableFromTime, availableToTime, avatarImageUrl, id } =
      parsedInput;

    let uploadedImageUrl: string | undefined = undefined;
    let previousImageUrl: string | undefined = undefined;

    // Busca o registro atual do doutor para pegar a imagem antiga
    if (id) {
      const [doctor] = await db
        .select({ avatarImageUrl: doctorsTable.avatarImageUrl })
        .from(doctorsTable)
        .where(eq(doctorsTable.id, id));
      previousImageUrl = doctor?.avatarImageUrl ?? undefined;
    }

    // Lógica para upload e deleção
    if (avatarImageUrl && avatarImageUrl.length > 0) {
      const fileOrUrl = avatarImageUrl[0];

      // Se for um novo arquivo, faz upload e deleta o anterior
      if (fileOrUrl instanceof File) {
        uploadedImageUrl = await handleFileUpload(fileOrUrl);

        // Só deleta se havia imagem anterior
        if (previousImageUrl) {
          try {
            const url = new URL(previousImageUrl);
            const fileKey = url.pathname.startsWith("/")
              ? url.pathname.slice(1)
              : url.pathname;
            await deleteFileFromBucket(fileKey);
          } catch (e) {
            console.error("Erro ao deletar imagem antiga:", e);
          }
        }
      } else if (typeof fileOrUrl === "string") {
        // Se não mudou a imagem, mantém a URL anterior
        uploadedImageUrl = fileOrUrl;
      }
    }

    // Se não enviou nada, mantém undefined (sem imagem)
    // Se quiser manter a imagem anterior caso não envie nada, use:
    if (!uploadedImageUrl && previousImageUrl) {
      uploadedImageUrl = previousImageUrl;
    }

    const availableFromTimeUTC = dayjs()
      .set("hour", parseInt(availableFromTime.split(":")[0]))
      .set("minute", parseInt(availableFromTime.split(":")[1]))
      .set("second", parseInt(availableFromTime.split(":")[2]))
      .utc();

    const availableToTimeUTC = dayjs()
      .set("hour", parseInt(availableToTime.split(":")[0]))
      .set("minute", parseInt(availableToTime.split(":")[1]))
      .set("second", parseInt(availableToTime.split(":")[2]))
      .utc();

    await db
      .insert(doctorsTable)
      .values({
        ...parsedInput,
        id: parsedInput.id,
        avatarImageUrl: uploadedImageUrl,
        clinicId: activeClinicId,
        availableFromTime: availableFromTimeUTC.format("HH:mm:ss"),
        availableToTime: availableToTimeUTC.format("HH:mm:ss"),
      })
      .onConflictDoUpdate({
        target: [doctorsTable.id],
        set: {
          ...parsedInput,
          avatarImageUrl: uploadedImageUrl,
          availableFromTime: availableFromTimeUTC.format("HH:mm:ss"),
          availableToTime: availableToTimeUTC.format("HH:mm:ss"),
        },
      });

    revalidatePath("/doctors");
  });
