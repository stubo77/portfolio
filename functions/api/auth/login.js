/**
 * POST /api/auth/login
 *
 * Body: { email: string, password: string }
 * Returns: { token: string }
 *
 * Environment variables required (set in Cloudflare Pages dashboard):
 *   JWT_SECRET — random secret string
 *   AUTH_KV — KV namespace binding (create in dashboard → Functions → KV)
 */

import { signJWT, hashPassword, timingSafeEqual } from '../_utils/crypto.js';

export async function onRequestPost({ request, env }) {
  const headers = corsHeaders();

  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return json({ error: 'Email and password required.' }, 400, headers);
    }

    const stored = await env.AUTH_KV.get(`user:${email.toLowerCase()}`, 'json');
    if (!stored) {
      return json({ error: 'Invalid email or password.' }, 401, headers);
    }

    const hash = await hashPassword(password, stored.salt);
    if (!timingSafeEqual(hash, stored.passwordHash)) {
      return json({ error: 'Invalid email or password.' }, 401, headers);
    }

    const token = await signJWT(
      { sub: stored.id, email: stored.email, name: stored.name },
      env.JWT_SECRET,
      60 * 60 * 24 * 7 // 7 days
    );

    return json({ token, name: stored.name }, 200, headers);
  } catch (err) {
    console.error('login error', err);
    return json({ error: 'Server error.' }, 500, headers);
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

function json(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
