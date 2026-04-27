/**
 * POST /api/auth/register
 *
 * Body: { email: string, password: string, name: string }
 * Returns: { token: string }
 */

import { signJWT, hashPassword, generateSalt, generateId } from '../_utils/crypto.js';

export async function onRequestPost({ request, env }) {
  const headers = corsHeaders();

  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return json({ error: 'All fields are required.' }, 400, headers);
    }
    if (password.length < 8) {
      return json({ error: 'Password must be at least 8 characters.' }, 400, headers);
    }

    const key = `user:${email.toLowerCase()}`;
    const existing = await env.AUTH_KV.get(key);
    if (existing) {
      return json({ error: 'An account with this email already exists.' }, 409, headers);
    }

    const salt = generateSalt();
    const passwordHash = await hashPassword(password, salt);
    const id = generateId();

    await env.AUTH_KV.put(key, JSON.stringify({
      id,
      email: email.toLowerCase(),
      name,
      passwordHash,
      salt,
      createdAt: new Date().toISOString(),
    }));

    const token = await signJWT(
      { sub: id, email: email.toLowerCase(), name },
      env.JWT_SECRET,
      60 * 60 * 24 * 7
    );

    return json({ token, name }, 201, headers);
  } catch (err) {
    console.error('register error', err);
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
