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
