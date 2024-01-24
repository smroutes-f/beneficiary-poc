import moment from 'moment';

export interface DateInfo {
  year: number;
  month: number;
  day: number;
}

export function formatCustomDate(date: DateInfo): string {
  const formattedDate = moment({
    year: date.year,
    month: date.month - 1, // Months in Moment.js are zero-based (0-11)
    day: date.day,
  });

  return formattedDate.format('MMM D, YYYY');
}
