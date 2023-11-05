import {
  addDays,
  addHours,
  addMinutes,
  addMonths,
  addSeconds,
  addYears,
  differenceInDays,
  differenceInHours,
  differenceInMilliseconds,
  differenceInMinutes,
  differenceInMonths,
  differenceInSeconds,
} from "date-fns";

export const tinhKhoangThoiGian = ({
  hienTai,
  tuongLai,
  returnTimeEnd = "kết thúc khuyến mại",
}: {
  hienTai: string;
  tuongLai: string;
  returnTimeEnd: string;
}): string => {
  const hienTaiDate = new Date(hienTai);
  const tuongLaiDate = new Date(tuongLai);

  const khoangThoiGianMillis = differenceInMilliseconds(
    tuongLaiDate,
    hienTaiDate
  );

  if (khoangThoiGianMillis <= 0) {
    return returnTimeEnd;
  }

  // Kiểm tra nếu thời gian là ít hơn một ngày
  if (differenceInDays(tuongLaiDate, hienTaiDate) < 1) {
    const seconds = differenceInSeconds(tuongLaiDate, hienTaiDate);
    return `0 ngày ${Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0")}:${Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
  }

  const months = differenceInMonths(tuongLaiDate, hienTaiDate);
  const days = differenceInDays(tuongLaiDate, hienTaiDate) % 30; // Adjust for months
  const hours = differenceInHours(tuongLaiDate, hienTaiDate) % 24; // Adjust for days
  const minutes = differenceInMinutes(tuongLaiDate, hienTaiDate) % 60; // Adjust for hours
  const seconds = differenceInSeconds(tuongLaiDate, hienTaiDate) % 60; // Adjust for minutes

  let result = "";
  if (months > 0) {
    result += `${months} tháng `;
  }
  if (days > 0) {
    result += `${days} ngày `;
  }

  result += `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return result;
};

export const addToDate = ({
  initialDate,
  timeToAdd,
}: {
  initialDate: Date;
  timeToAdd: string;
}): Date => {
  const match = timeToAdd.match(/^(\d+)([smhdMy])$/);
  if (!match) {
    throw new Error("Invalid time parameter");
  }

  const amount = parseInt(match[1], 10);
  const unit = match[2];

  if (isNaN(amount)) {
    throw new Error("Invalid time parameter");
  }

  switch (unit) {
    case "s":
      return addSeconds(initialDate, amount);
    case "m":
      return addMinutes(initialDate, amount);
    case "h":
      return addHours(initialDate, amount);
    case "d":
      return addDays(initialDate, amount);
    case "M":
      return addMonths(initialDate, amount);
    case "y":
      return addYears(initialDate, amount);
    default:
      throw new Error("Invalid time unit");
  }
};
