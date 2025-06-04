"use server";

import dayjs from "dayjs";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import z from "zod";

import { db } from "@/db";
import { appointmentsTable } from "@/db/schema";
import { actionClient } from "@/lib/safe-action";

import { addAppointmentSchema } from "./appointment.schema";
import { requireSession } from "./clinic.actions";

export const addAppointment = actionClient
  .schema(addAppointmentSchema)
  .action(async ({ parsedInput }) => {
    const session = await requireSession();
    if (!session.user.clinic?.id) throw new Error("Clinic not Found");

    const appointmentDateTime = dayjs(parsedInput.date)
      .set("hour", parseInt(parsedInput.time.split(":")[0]))
      .set("minute", parseInt(parsedInput.time.split(":")[1]))
      .toDate();

    await db.insert(appointmentsTable).values({
      ...parsedInput,
      clinicId: session.user.clinic.id,
      date: appointmentDateTime,
    });

    revalidatePath("/appointments");
  });

export const deleteAppointment = actionClient
  .schema(
    z.object({
      id: z.string().uuid(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const session = await requireSession();
    if (!session.user.clinic?.id) throw new Error("Clinic not Found");

    const appointment = await db.query.appointmentsTable.findFirst({
      where: eq(appointmentsTable.id, parsedInput.id),
    });

    if (!appointment) throw new Error("Agendamento não encontrado");

    if (appointment.clinicId !== session.user.clinic?.id)
      throw new Error("O Agendamento não pertence a clínica.");

    await db
      .delete(appointmentsTable)
      .where(eq(appointmentsTable.id, parsedInput.id));

    revalidatePath("/appointments");
  });
