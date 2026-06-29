import type { JobResult } from "./types.js";

/** Base error for all connector failures. */
export class HiggsfieldError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "HiggsfieldError";
  }
}

/** Thrown when credentials are missing or malformed. */
export class HiggsfieldAuthError extends HiggsfieldError {
  constructor(message: string) {
    super(message);
    this.name = "HiggsfieldAuthError";
  }
}

/** Thrown when the API returns a non-2xx response. */
export class HiggsfieldApiError extends HiggsfieldError {
  readonly status: number;
  readonly body: string;

  constructor(status: number, body: string) {
    super(`Higgsfield API returned ${status}: ${body}`);
    this.name = "HiggsfieldApiError";
    this.status = status;
    this.body = body;
  }
}

/** Thrown when a job ends in a non-completed terminal state. */
export class HiggsfieldJobError extends HiggsfieldError {
  readonly result: JobResult;

  constructor(result: JobResult) {
    super(
      `Higgsfield job ${result.requestId} ended with status "${result.status}"` +
        (result.raw.error ? `: ${result.raw.error}` : ""),
    );
    this.name = "HiggsfieldJobError";
    this.result = result;
  }
}

/** Thrown when polling exceeds the configured maximum wait time. */
export class HiggsfieldTimeoutError extends HiggsfieldError {
  constructor(requestId: string, maxPollMs: number) {
    super(
      `Timed out after ${maxPollMs}ms waiting for Higgsfield job ${requestId}`,
    );
    this.name = "HiggsfieldTimeoutError";
  }
}
