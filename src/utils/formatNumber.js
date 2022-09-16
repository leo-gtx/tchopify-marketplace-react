import { replace } from 'lodash';
import numeral from 'numeral';

// ----------------------------------------------------------------------
// load a locale
numeral.register('locale', 'AO-fr', {
  delimiters: {
      thousands: ' ',
      decimal: ','
  },
  abbreviations: {
      thousand: 'k',
      million: 'm',
      billion: 'b',
      trillion: 't'
  },
  ordinal : (number) =>  number === 1 ? 'er' : 'ème',
  currency: {
      symbol: 'XAF'
  }
});

// switch between locales
numeral.locale('AO-fr');
export function fCurrency(number) {
  return numeral(number).format(Number.isInteger(number) ? '0,0$' : '0,0.00$');
}

export function fPercent(number) {
  return numeral(number / 100).format('0.0%');
}

export function fNumber(number) {
  return numeral(number).format();
}

export function fShortenNumber(number) {
  return replace(numeral(number).format('0.00a'), '.00', '');
}

export function fData(number) {
  return numeral(number).format('0.0 b');
}
