import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

// ----------------------------------------------------------------------

dayjs.extend(duration);
dayjs.extend(relativeTime);

// ----------------------------------------------------------------------

export type DatePickerFormat = Dayjs | Date | string | number | null | undefined;

/**
 * Docs: https://day.js.org/docs/en/display/format
 */
export const formatStr = {
  dateTime: 'DD MMM YYYY hh:mm', // 17 Apr 2022 12:00
  date: 'DD MMM YYYY', // 17 Apr 2022
  time: 'hh:mm', // 12:00
  split: {
    dateTime: 'DD/MM/YYYY hh:mm', // 17/04/2022 12:00
    date: 'DD/MM/YYYY', // 17/04/2022
  },
  paramCase: {
    dateTime: 'DD-MM-YYYY hh:mm', // 17-04-2022 12:00
    date: 'DD-MM-YYYY', // 17-04-2022
  },
};

export function today(format?: string) {
  return dayjs(new Date()).startOf('day').format(format);
}

// ----------------------------------------------------------------------

/** output: 17 Apr 2022 12:00
 */
export function fDateTime(date: DatePickerFormat, format?: string) {
  if (!date) {
    return null;
  }

  const isValid = dayjs(date).isValid();

  return isValid ? dayjs(date).format(format ?? formatStr.dateTime) : 'Invalid time value';
}

// ----------------------------------------------------------------------

/** output: 17 Apr 2022
 */
export function fDate(date: DatePickerFormat, format?: string) {
  if (!date) {
    return null;
  }

  const isValid = dayjs(date).isValid();

  return isValid ? dayjs(date).format(format ?? formatStr.date) : 'Invalid time value';
}

// ----------------------------------------------------------------------

/** output: 12:00
 */
export function fTime(date: DatePickerFormat, format?: string) {
  if (!date) {
    return null;
  }

  const isValid = dayjs(date).isValid();

  return isValid ? dayjs(date).format(format ?? formatStr.time) : 'Invalid time value';
}

// ----------------------------------------------------------------------

/** output: 1713250100
 */
export function fTimestamp(date: DatePickerFormat) {
  if (!date) {
    return null;
  }

  const isValid = dayjs(date).isValid();

  return isValid ? dayjs(date).valueOf() : 'Invalid time value';
}

// ----------------------------------------------------------------------

/** output: a few seconds, 2 years
 */
export function fToNow(date: DatePickerFormat) {
  if (!date) {
    return null;
  }

  const isValid = dayjs(date).isValid();

  return isValid ? dayjs(date).toNow(true) : 'Invalid time value';
}

/**
 * Format seconds to time
 * @example
 * formatSecondToTime(3600) // "01:00:00"
 * formatSecondToTime(60) // "01:00"
 * formatSecondToTime(1) // "00:01"
 */
export function formatSecondToTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const timer = hours > 0 ? [hours, minutes, remainingSeconds] : [minutes, remainingSeconds];
  const text = timer.map((t) => Math.floor(t).toString().padStart(2, '0')).join(':');

  return text;
}
