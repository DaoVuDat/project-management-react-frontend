import {parseISO} from 'date-fns';

export function formatDate(date: string | undefined) {
  return date
    ? parseISO(date).toLocaleDateString('vi', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : 'Undefined';
}

export function formatDateWithText(date: string | undefined) {
  return date
    ? parseISO(date).toLocaleDateString('en', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    : 'Undefined';
}