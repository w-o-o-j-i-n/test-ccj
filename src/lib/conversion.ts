// conversion.ts
export function Convert(
  amount: number,
  from: string,
  to: string,
  exchangeRates: { [key: string]: number }
): { result: string, error: string } {
  let result = '';
  let error = '';

  if (amount === 0 || !from || !to) {
    error = 'Please fill up all the fields';
    return { result, error };
  }

  if (from in exchangeRates && to in exchangeRates) {
    const rateFrom = exchangeRates[from.toLowerCase()];
    const rateTo = exchangeRates[to.toLowerCase()];
    result = (amount * (rateTo / rateFrom)).toFixed(2);
  } else {
    error = 'Invalid currency selected';
  }

  return { result, error };
}
