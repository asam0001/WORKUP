import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { env } from "./env";
import { SessionPayload, UserRole } from "@/types";
import { logger } from "./logger";

export const SESSION_COOKIE_NAME = "workup_session";
const JWT_SECRET_BYTES = new TextEncoder().encode(env.JWT_SECRET);
const SESSION_EXPIRY = "7d";
const SESSION_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string): Promise<{ token: string; expiresAt: Date; user: { id: string; email: string; role: string; name: string } }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true, name: true, status: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.status !== "active") {
    throw new Error("User account is suspended");
  }

  const expiresAt = new Date(Date.now() + SESSION_EXPIRY_MS);

  // Create session in database
  const session = await prisma.session.create({
    data: {
      userId: user.id,
      token: crypto.randomUUID(),
      expiresAt,
    },
  });

  // Generate signed JWT containing session and user metadata
  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    role: user.role as UserRole,
    name: user.name,
    sessionId: session.id,
  };

  const jwt = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_EXPIRY)
    .sign(JWT_SECRET_BYTES);

  return { token: jwt, expiresAt, user };
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET_BYTES);
    const sessionPayload = payload as unknown as SessionPayload;

    // Check if session still exists in database and is not expired
    const dbSession = await prisma.session.findUnique({
      where: { id: sessionPayload.sessionId },
      include: { user: true },
    });

    if (!dbSession || dbSession.expiresAt < new Date()) {
      return null;
    }

    if (dbSession.user.status !== "active") {
      return null;
    }

    return sessionPayload;
  } catch (err) {
    logger.debug("Failed session verification", { error: String(err) });
    return null;
  }
}

export async function getCurrentUser(): Promise<SessionPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifySession(token);
  } catch {
    return null;
  }
}

export async function revokeSession(sessionId: string): Promise<void> {
  try {
    await prisma.session.delete({
      where: { id: sessionId },
    });
  } catch (err) {
    logger.warn("Could not delete session from DB", { sessionId }, err);
  }
}

export function setSessionCookie(responseHeaders: Headers, token: string, expiresAt: Date) {
  const isProd = env.NODE_ENV === "production";
  const cookieValue = `${SESSION_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Expires=${expiresAt.toUTCString()}${
    isProd ? "; Secure" : ""
  }`;
  responseHeaders.append("Set-Cookie", cookieValue);
}

export function clearSessionCookie(responseHeaders: Headers) {
  const isProd = env.NODE_ENV === "production";
  const cookieValue = `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT${
    isProd ? "; Secure" : ""
  }`;
  responseHeaders.append("Set-Cookie", cookieValue);
}
