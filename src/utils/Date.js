import { monthNameFirstThree } from "../contents/Date";
import moment from "moment";

export function getCurrentDateTime() {
  const currentDate = new Date();

  // Format date as DD-MM-YYYY
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const year = currentDate.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;

  // Format time as HH:MM am/pm
  let hours = currentDate.getHours();
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
  const formattedTime = `${hours}:${minutes} ${ampm}`;

  // return { date: formattedDate, time: formattedTime };
  return `${formattedDate} & ${formattedTime}`;
}

export function convertToIST(dateTime, dateOnly = false) {
  if (dateTime) {
    var dateTimeParts = dateTime.split(" ");
    var datePart = dateTimeParts[0];
    var timePart = dateTimeParts[1];

    var dateComponents = datePart.split("-").map(Number);
    var timeComponents = timePart.split(":").map(Number);

    var year = dateComponents[0];
    var month = dateComponents[1].toString().padStart(2, "0");
    var day = dateComponents[2].toString().padStart(2, "0");

    var hours = timeComponents[0].toString().padStart(2, "0");
    var minutes = timeComponents[1].toString().padStart(2, "0");
    var seconds = timeComponents[2].toString().padStart(2, "0");
    let noon = "AM";
    if (hours > 12) {
      hours = -12;
      noon = "PM";
    }
    if (dateOnly) {
      return `${day}-${month}-${year}`;
    }

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${noon}`;
  } else {
    return "";
  }
  // Parse the input date
}

export function formatDateToYYYYMMDD(dateString) {
  const date = new Date(dateString);
  if (isNaN(date)) {
    return "";
  }
  return date.toISOString().split("T")[0];
}
export function TformatDateToYYYYMMDDWTime(dateString) {
  const dates = new Date(dateString);
  if (isNaN(dates)) {
    return "";
  }
  const date = dates.toISOString().split("T")[0];
  const timeSplit = dates.toISOString().split("T")[1];
  const seprateTime = timeSplit.split(".");
  return `${date} ${seprateTime[0]}`;
}

export const convertActivityTime = (dates) => {
  const formatDate = convertToIST(dates);
  const date = formatDate.split("-")[0];
  const month = monthNameFirstThree[formatDate.split("-")[1]];
  const payload = {
    date,
    month,
  };
  return payload;
};

export const DBtimeConvert = (dateString) => {
  const date = new Date(dateString);

  // Extract date components
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  // Format to DDMMYYYY time
  const formattedDate = `${day}${month}${year} ${hours}:${minutes}:${seconds}`;
  return formattedDate;
};


export function convertDMYtoYMD(dateStr) {
  // Input "04-01-2025";

  const [day, month, year] = dateStr.split('-');
  // Output: 2025-01-04
  return `${year}-${month}-${day}`;
}

export function convertDateTimeYMDToDMY(dateTimeStr, isTime = true, isDate = true) {
  // input "2024-12-29 17:28:00"
  if (dateTimeStr) {
      const [date, time] = dateTimeStr.split(' ');  // Separate date and time
      const [year, month, day] = date.split('-');   // Separate date parts

      let formattedTime = '';
      if (isTime) {
          const [hour, minute, second] = time.split(':');  // Separate time parts
          const period = hour >= 12 ? 'PM' : 'AM';
          const hour12 = hour % 12 || 12;  // Convert to 12-hour format (0 becomes 12)
          formattedTime = `${hour12}:${minute}:${second} ${period}`;
      }

      // Build the return string based on flags
      if (isTime && isDate) {
          return `${day}-${month}-${year} ${formattedTime}`;  // DMY with time
      } else if (isDate && !isTime) {
          return `${day}-${month}-${year}`;
      } else if (!isDate && isTime) {
          return `${formattedTime}`;
      }
  } else {
      return;
  }
  // Output: 29-12-2024 5:28:00 PM
}

export function getCurrentDate() {
  const currentDate = new Date();

  // Format date as DD-MM-YYYY
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const year = currentDate.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;

  // Format time as HH:MM am/pm
  let hours = currentDate.getHours();
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
  const formattedTime = `${hours}:${minutes} ${ampm}`;

  // return { date: formattedDate, time: formattedTime };
  return `${formattedDate}`;
}

/* GET TODAY RANGE DATE */
export const getTodayRange = () => {
  const start = moment().startOf("day");
  const end = moment().endOf("day");
  return { start, end };
};