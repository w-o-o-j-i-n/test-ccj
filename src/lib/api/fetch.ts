export async function getCurrencies(date: string): Promise<{ usd: Record<string, number> }> {
  const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${date}/v1/currencies/usd.min.json`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Failed to fetch currencies: ${(error as Error).message}`);
  }
}

  // This function will try to return the data or any errors when fetching data from api.