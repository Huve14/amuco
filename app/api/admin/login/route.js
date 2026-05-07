import { cookies } from "next/headers";
import crypto from "crypto";

const ADMIN_PWD = process.env.ADMIN_PASSWORD?.trim();

function getSessionToken() {
  return crypto
    .createHash("sha256")
    .update("amuco-admin::" + ADMIN_PWD)
    .digest("hex");
}

export async function POST(req) {
  try {
    const { password } = await req.json();

    if (!ADMIN_PWD) {
      return Response.json({ error: "Admin not configured." }, { status: 500 });
    }

    if (!password || password.trim() !== ADMIN_PWD) {
      // Small delay to slow brute force
      await new Promise((r) => setTimeout(r, 400));
      return Response.json({ error: "Incorrect password." }, { status: 401 });
    }

    const token = getSessionToken();
    const cookieStore = await cookies();
    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    });

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  return Response.json({ success: true });
}

export { getSessionToken };
