/**
 * Higgsfield connector for ILO.
 *
 * Public entry point — re-exports the connector, its types, and error classes.
 */
export { HiggsfieldConnector } from "./client.js";
export {
  HiggsfieldError,
  HiggsfieldAuthError,
  HiggsfieldApiError,
  HiggsfieldJobError,
  HiggsfieldTimeoutError,
} from "./errors.js";
export type {
  ConnectorConfig,
  JobStatus,
  JobResponse,
  JobResult,
  ImageInput,
  TextToImageParams,
  ImageToVideoParams,
  WebhookConfig,
} from "./types.js";
