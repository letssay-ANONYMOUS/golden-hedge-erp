// This service mocks a WebSocket or SSE connection to a real-time pricing API like Fastmarkets.

type SpotPriceCallback = (prices: { XAU: number; XAG: number }) => void;

let listeners: SpotPriceCallback[] = [];
let interval: NodeJS.Timeout | null = null;

// Starting base prices (USD per Ounce)
let currentPrices = {
  XAU: 2350.50,
  XAG: 28.40
};

function generateRandomFluctuation(base: number, volatility: number) {
  const change = base * volatility * (Math.random() * 2 - 1);
  return Number((base + change).toFixed(2));
}

function notifyListeners() {
  currentPrices = {
    XAU: generateRandomFluctuation(currentPrices.XAU, 0.0001), // 0.01% volatility per tick
    XAG: generateRandomFluctuation(currentPrices.XAG, 0.0002), // Silver is more volatile
  };
  
  listeners.forEach(cb => cb(currentPrices));
}

export function subscribeToSpotPrices(callback: SpotPriceCallback) {
  listeners.push(callback);
  
  // Immediately fire with current prices
  callback(currentPrices);

  // If this is the first listener, start the "WebSocket" interval (1 tick per second)
  if (listeners.length === 1 && typeof window !== 'undefined') {
    interval = setInterval(notifyListeners, 1000);
  }

  // Return unsubscribe function
  return () => {
    listeners = listeners.filter(cb => cb !== callback);
    if (listeners.length === 0 && interval) {
      clearInterval(interval);
      interval = null;
    }
  };
}

export function getSpotPriceSync(metal: 'XAU' | 'XAG'): number {
  return currentPrices[metal];
}
