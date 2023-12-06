import { Timestamp } from "firebase/firestore";

export const formatDate = (date: Timestamp | Date) => {
  let dateType;

  if (date instanceof Timestamp) {
    dateType = date.toDate();
  } else dateType = date;

  const formattedDate = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).format(dateType);

  return formattedDate;
};
