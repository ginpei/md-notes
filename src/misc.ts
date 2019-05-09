/**
 * @example
 * const params = getGetParams(props.location.search);
 * const type = params['type'] || 'defaultType';
 */
export function getGetParams (search: string): { [key: string]: string } {
  const pairs = search.slice(1)
    .split('&')
    .map((pair) => pair.split('='));

  const map: { [key: string]: string } = {};
  pairs.forEach(([key, value]) => {
    map[key] = value;
  });

  return map;
}

export const noop: () => void = () => {};

export function fillZero2 (n: number) {
  return `0${n}`.slice(-2);
}

export function dateToString (date: Date) {
  const sYear = date.getFullYear();
  const sMonth = fillZero2(date.getMonth() + 1);
  const sDate = fillZero2(date.getDate());
  const sHours = fillZero2(date.getHours());
  const sMin = fillZero2(date.getMinutes());
  const sSec = fillZero2(date.getSeconds());

  return `${sYear}-${sMonth}-${sDate} ${sHours}:${sMin}:${sSec}`;
}
