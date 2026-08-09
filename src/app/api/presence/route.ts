import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

// Real presence count: each open tab sends a heartbeat every ~10s carrying a
// random per-tab client id. We store it in a Redis sorted set (member =
// client id, score = last-seen timestamp), drop anything older than the
// staleness window, and report how many members are left. No Redis env vars
// configured (e.g. local dev) => fall back to reporting "1" so the UI never
// breaks.
const PRESENCE_KEY = "kerala-radio:presence";
const STALE_AFTER_MS = 25_000;

function getRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function POST(req: NextRequest) {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ count: 1, backend: "none" });
  }

  try {
    const { clientId } = (await req.json()) as { clientId?: string };
    const id = clientId?.slice(0, 64) || crypto.randomUUID();
    const now = Date.now();

    await redis.zadd(PRESENCE_KEY, { score: now, member: id });
    await redis.zremrangebyscore(PRESENCE_KEY, 0, now - STALE_AFTER_MS);
    const count = await redis.zcard(PRESENCE_KEY);

    return NextResponse.json({ count: Math.max(1, count), backend: "redis" });
  } catch {
    return NextResponse.json({ count: 1, backend: "error" });
  }
}
