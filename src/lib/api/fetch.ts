export async function getCurrencies(date: string): Promise<{ usd: Record<string, number> }> {
  const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${date}/v1/currencies/usd.min.json`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      return data;
    } catch (error) {
      console.error('Error fetching currency data:', error);
      throw new Error('Failed to fetch currencies');
    }
  }
  // This function will try to return the data or any errors when fetching data from api.