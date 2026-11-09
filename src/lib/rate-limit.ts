/**
 * Small in-memory limiter + duplicate detector.
 * Good enough for one server instance. On serverless (Vercel) each instance has
 * its own memory, so put Upstash/Redis or Cloudflare rules in front for real
 * abuse protection. See DEPLOYMENT_GUIDE.md.
 */
const hits = new Map<string, number[]>();
const seen = new Map<string, number>();

export function rateLimited(key: string, max = 5, windowMs = 10 * 60_000, now = Date.now()) {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  return false;
}

/** Read-only check. Call markSeen() only AFTER the inquiry was actually saved,
 *  otherwise a failed save would turn the user's retry into a fake success. */
export function isDuplicate(fingerprint: string, windowMs = 10 * 60_000, now = Date.now()) {
  for (const [k, t] of seen) if (now - t > windowMs) seen.delete(k);
  return seen.has(fingerprint);
}

export function markSeen(fingerprint: string, now = Date.now()) {
  seen.set(fingerprint, now);
}

export function _resetForTests() {
  hits.clear();
  seen.clear();
}
