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

/**
 * Super precise calculator based on PRD formulation:
 * Price = Spot (per oz) / 31.1035 * FX (3.675) * weight_grams
 * (VAT and spread to be implemented dynamically later, currently defaults to base price)
 */
export function calculateItemPrice(metal_id: 'XAU' | 'XAG', weight_grams: number, karat: number = 24, spread_pct: number = 0): number {
  const spotPerOzUsd = currentPrices[metal_id] || (metal_id === 'XAU' ? 2350.50 : 28.40)
  const spotPerGramUsd = spotPerOzUsd / 31.1035
  const fxAed = 3.675 // Standard USD to AED rate
  const karatMultiplier = metal_id === 'XAU' ? (karat / 24) : 1
  
  // Base cost
  let price = spotPerGramUsd * weight_grams * fxAed * karatMultiplier
  
  // Apply spread
  if (spread_pct !== 0) {
    price = price * (1 + spread_pct)
  }
  
  return Number(price.toFixed(2))
}
