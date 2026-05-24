// Broker Adapter Pattern (Sandbox Mode)
// Simulates order execution with configurable latency, slippage, and failure rate.

export interface BrokerOrder {
  metal: 'XAU' | 'XAG';
  direction: 'short' | 'long';
  quantity_oz: number;
  target_price: number;
}

export interface BrokerExecution {
  broker_order_id: string;
  status: 'filled' | 'partial_fill' | 'failed';
  executed_price: number;
  slippage: number;
  error?: string;
}

export class BrokerAdapter {
  private sandboxMode: boolean = true;
  private latencyMs = 800;
  private failureRate = 0.05; // 5% chance to fail
  private maxSlippagePct = 0.005; // 0.5% max slippage simulation

  constructor(sandbox: boolean = true) {
    this.sandboxMode = sandbox;
  }

  async sendOrder(order: BrokerOrder): Promise<BrokerExecution> {
    if (!this.sandboxMode) {
      throw new Error("Live broker integration not implemented yet. Use sandbox.");
    }

    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, this.latencyMs));

    // Simulate random failure (Circuit breaker test)
    if (Math.random() < this.failureRate) {
      return {
        broker_order_id: `ERR-${Date.now()}`,
        status: 'failed',
        executed_price: 0,
        slippage: 0,
        error: "Broker API Timeout (Sandbox Simulation)"
      };
    }

    // Simulate slippage
    const slippageFactor = (Math.random() * this.maxSlippagePct * 2) - this.maxSlippagePct;
    const executedPrice = order.target_price * (1 + slippageFactor);

    // Simulate partial fills (10% chance)
    const status = Math.random() < 0.10 ? 'partial_fill' : 'filled';

    return {
      broker_order_id: `SBX-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      status,
      executed_price: Number(executedPrice.toFixed(2)),
      slippage: Number(slippageFactor.toFixed(4))
    };
  }
}

export const brokerClient = new BrokerAdapter(true);
