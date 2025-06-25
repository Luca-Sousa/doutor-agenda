import { z } from "zod";

import { MAX_FILE_SIZE } from "@/lib/utils";

export const upsertDoctorSchema = z
  .object({
    id: z.string().uuid().optional(),
    name: z.string().trim().min(1, {
      message: "Nome é obrigatório.",
    }),
    avatarImageUrl: z
      .array(z.union([z.instanceof(File), z.string()]))
      .optional()
      .refine(
        (files) =>
          !files ||
          files.length === 0 ||
          files.every(
            (file) =>
              typeof file === "string" ||
              (file instanceof File && file.size <= MAX_FILE_SIZE),
          ),
        {
          message: "A imagem deve ter no máximo 10MB.",
          path: ["avatarImageUrl"],
        },
      ),
    specialty: z.string().trim().min(1, {
      message: "Especialidade é obrigatória.",
    }),
    appointmentPriceInCents: z.number().min(1, {
      message: "Preço da consulta é obrigatório.",
    }),
    availableFromWeekDay: z.number().min(0).max(6),
    availableToWeekDay: z.number().min(0).max(6),
    availableFromTime: z.string().min(1, {
      message: "Hora de ínicio é obrigatória.",
    }),
    availableToTime: z.string().min(1, {
      message: "Hora de término é obrigatória.",
    }),
  })
  .refine(
    (data) => {
      return data.availableFromTime < data.availableToTime;
    },
    {
      message:
        "O horário de início não pode ser anterior ao horário de término.",
      path: ["availableToTime"],
    },
  );
