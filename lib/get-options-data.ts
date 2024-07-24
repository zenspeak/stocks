const BASE_URL = `https://api.polygon.io/v3/reference/options/contracts?apiKey=${process.env.POLYGON_API_KEY}`;

export interface OptionData {
  strikePrice: number;
  lastPrice: number;
  bid: number;
  ask: number;
  volume: number;
  openInterest: number;
}

export async function getOptionsData(
  symbol: string,
  expirationDate: string
): Promise<OptionData[]> {
  const url = `${BASE_URL}&underlying_ticker=${symbol}&expiration_date=${expirationDate}`;
  
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    next: {
      revalidate: 60,
    },
  });

  const data = await res.json();

  if (!data.results || !Array.isArray(data.results)) {
    throw new Error("Failed to fetch options data");
  }

  const optionsData: OptionData[] = data.results.map((item: any) => ({
    strikePrice: item.strike_price,
    lastPrice: item.last_trade?.price || 0,
    bid: item.bid || 0,
    ask: item.ask || 0,
    volume: item.day.volume || 0,
    openInterest: item.open_interest || 0,
  }));

  return optionsData;
}
