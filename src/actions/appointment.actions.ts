"use server";

import dayjs from "dayjs";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import z from "zod";

import { db } from "@/db";
import { appointmentsTable } from "@/db/schema";
import { actionClient } from "@/lib/safe-action";

import { addAppointmentSchema } from "./appointment.schema";
import { getAvailableTimes } from "./available-times.actions";
import { requireSession } from "./clinic.actions";

export const addAppointment = actionClient
  .schema(addAppointmentSchema)
  .action(async ({ parsedInput }) => {
    const session = await requireSession();
    if (!session.user.clinic?.id) throw new Error("Clinic not Found");

    const availableTimes = await getAvailableTimes({
      doctorId: parsedInput.doctorId,
      date: dayjs(parsedInput.date).format("YYYY-MM-DD"),
    });
    if (!availableTimes?.data) throw new Error("No available times");

    const isTimeAvailable = availableTimes.data?.some(
      (time) => time.value === parsedInput.time && time.available,
    );
    if (!isTimeAvailable) throw new Error("Time not available");

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
    revalidatePath("/dashboard");
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
    revalidatePath("/dashboard");
  });
