import { doctorsTable } from "@/db/schema";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import ptBr from "dayjs/locale/pt-br";

dayjs.extend(utc);
dayjs.locale(ptBr);

export const getAvailability = ({
  availableFromWeekDay,
  availableToWeekDay,
  availableToTime,
  availableFromTime,
}: typeof doctorsTable.$inferSelect) => {
  const from = dayjs()
    .utc()
    .day(availableFromWeekDay)
    .set("hour", parseInt(availableFromTime.split(":")[0]))
    .set("minute", parseInt(availableFromTime.split(":")[1]))
    .set("second", parseInt(availableFromTime.split(":")[2]) || 0)
    .local();

  const to = dayjs()
    .utc()
    .day(availableToWeekDay)
    .set("hour", parseInt(availableToTime.split(":")[0]))
    .set("minute", parseInt(availableToTime.split(":")[1]))
    .set("second", parseInt(availableToTime.split(":")[2]) || 0)
    .local();

  return { from, to };
};
