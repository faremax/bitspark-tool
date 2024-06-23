import { useMemo } from 'react';
import qs from 'query-string';

export default <T extends Record<string, any>>() => {
  const { search } = window.location;
  return useMemo(() => qs.parse(search, {
    parseBooleans: true,
    arrayFormat: 'separator',
    arrayFormatSeparator: ','
  }) as T, [search]);
}