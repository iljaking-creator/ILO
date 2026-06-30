/**
 * Channel adapter contract. A channel turns provider events into
 * `InboundMessage`, calls the shared engine, and renders the reply back.
 * `start()` returns a stop function for graceful shutdown.
 */
export interface ChannelAdapter {
  readonly name: string;
  start(): Promise<() => void>;
}

/** Small async sleep used by pollers. */
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
