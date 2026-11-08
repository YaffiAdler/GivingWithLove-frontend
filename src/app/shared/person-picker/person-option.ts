/** One row in a person picker: the person's code and the text shown for it. */
export interface PersonOption {
  code: number;
  label: string;
}

/**
 * The single place that formats a person in a picker: "family first (code)", e.g. "כהן משה (12)".
 * Family name comes first, as on the login screen. Optional details are appended after a bar.
 */
export function toPersonOption(
  code: number,
  familyName: string | null | undefined,
  firstName: string | null | undefined,
  details?: string,
): PersonOption {
  const name = [familyName, firstName].filter((part) => part).join(' ');
  const label = `${name} (${code})`;
  return { code, label: details ? `${label} | ${details}` : label };
}
