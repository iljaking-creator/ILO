import assert from "node:assert/strict";
import { test } from "node:test";

import { resetConfig, getConfig } from "../config.js";
import { MediaService, MediaUnavailableError, resetMediaService } from "../media/higgsfield.js";

test("higgsfield capability is false without credentials", () => {
  const saved = process.env.HF_CREDENTIALS;
  delete process.env.HF_CREDENTIALS;
  resetConfig();
  assert.equal(getConfig().capabilities.higgsfield, false);
  if (saved !== undefined) process.env.HF_CREDENTIALS = saved;
  resetConfig();
});

test("higgsfield capability is true with KEY_ID:KEY_SECRET", () => {
  const saved = process.env.HF_CREDENTIALS;
  process.env.HF_CREDENTIALS = "id:secret";
  resetConfig();
  assert.equal(getConfig().capabilities.higgsfield, true);
  if (saved === undefined) delete process.env.HF_CREDENTIALS;
  else process.env.HF_CREDENTIALS = saved;
  resetConfig();
});

test("MediaService degrades without credentials", async () => {
  delete process.env.HF_CREDENTIALS;
  resetConfig();
  resetMediaService();
  const media = new MediaService();
  assert.equal(media.available(), false);
  await assert.rejects(() => media.generateImage("ein neon stadtbild"), MediaUnavailableError);
  resetConfig();
  resetMediaService();
});
