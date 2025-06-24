"use server"

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { usersTable } from "@/db/schema";

import { requireSession } from "./clinic.actions";

export const updateActiveClinic = async (clinicId: string) => {
  const session = await requireSession();

  await db
    .update(usersTable)
    .set({ activeClinicId: clinicId })
    .where(eq(usersTable.id, session.user.id));
};
