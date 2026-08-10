// Country helpers — localized names via Intl.DisplayNames, ISO-2 codes only.

export const FALLBACK_COUNTRY_CODES = [
  'AD','AE','AL','AM','AR','AT','AU','AZ','BA','BE','BG','BH','BR','BY','CA','CH','CL','CN','CO','CR',
  'CY','CZ','DE','DK','DZ','EC','EE','EG','ES','FI','FO','FR','GB','GE','GG','GI','GL','GR','HK','HR',
  'HU','ID','IE','IL','IM','IN','IQ','IS','IT','JE','JO','JP','KR','KW','KZ','LB','LI','LT','LU','LV',
  'MA','MC','MD','ME','MK','MT','MX','MY','NG','NL','NO','NZ','OM','PA','PE','PH','PL','PT','QA','RO',
  'RS','RU','SA','SE','SG','SI','SK','SM','TH','TN','TR','TW','UA','US','UY','VA','VN','ZA',
];

const cache = new Map<string, Intl.DisplayNames | null>();

function displayNames(locale: string): Intl.DisplayNames | null {
  if (cache.has(locale)) return cache.get(locale)!;
  let dn: Intl.DisplayNames | null = null;
  try {
    dn = new Intl.DisplayNames([locale], { type: 'region' });
  } catch {
    dn = null;
  }
  cache.set(locale, dn);
  return dn;
}

export function localizedCountryName(code: string, locale = 'nl'): string {
  const upper = (code || '').toUpperCase();
  if (!upper) return '';
  const primary = displayNames(locale)?.of(upper);
  if (primary && primary !== upper) return primary;
  const nl = displayNames('nl')?.of(upper);
  if (nl && nl !== upper) return nl;
  return upper;
}

export interface CountryOption {
  code: string;
  name: string;
}

export function localizedCountryOptions(codes: string[], locale = 'nl'): CountryOption[] {
  const seen = new Set<string>();
  const options: CountryOption[] = [];
  for (const raw of codes || []) {
    const code = (raw || '').toUpperCase();
    if (!code || seen.has(code)) continue;
    seen.add(code);
    options.push({ code, name: localizedCountryName(code, locale) });
  }
  return options.sort((a, b) => a.name.localeCompare(b.name, locale));
}
