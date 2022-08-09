import { format, getTime, formatDistanceToNow } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';

// ----------------------------------------------------------------------
const locales = {
  fr,
  en: enUS
}
export function fDate(date) {
  return format(new Date(date), 'dd MMMM yyyy',{locale: locales[localStorage.getItem('i18nextLng') || 'fr']});
}

export function fDateTime(date) {
  return format(new Date(date), 'dd MMM yyyy HH:mm', {locale: locales[localStorage.getItem('i18nextLng') || 'fr']});
}

export function fTimestamp(date) {
  return getTime(new Date(date), {locale: locales[localStorage.getItem('i18nextLng') || 'fr']});
}

export function fDateTimeSuffix(date) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p', {locale: locales[localStorage.getItem('i18nextLng') || 'fr']});
}

export function fToNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: locales[localStorage.getItem('i18nextLng') || 'fr']
  });
}
