const callingCodes: Array<[string, string]> = [
  ["971", "United Arab Emirates"], ["966", "Saudi Arabia"], ["974", "Qatar"],
  ["965", "Kuwait"], ["973", "Bahrain"], ["968", "Oman"], ["92", "Pakistan"],
  ["91", "India"], ["86", "China"], ["44", "United Kingdom"], ["61", "Australia"],
  ["64", "New Zealand"], ["65", "Singapore"], ["1", "United States / Canada"],
];

export function countryFromPhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, "").replace(/^00/, "");
  return callingCodes.find(([code]) => digits.startsWith(code))?.[1] ?? null;
}
