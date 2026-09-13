"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { setSessionCookie } from "@/lib/session";
import { LoginSchema } from "@/lib/validation";

export type LoginState = { error?: string };

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = LoginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Kullanıcı adı ve şifre gerekli." };
  }

  const { username, password } = parsed.data;
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminUsername || !adminPasswordHash) {
    return { error: "Sunucu yapılandırması eksik (ADMIN_USERNAME/ADMIN_PASSWORD_HASH)." };
  }

  const usernameOk = username === adminUsername;
  const passwordOk = await bcrypt.compare(password, adminPasswordHash);

  if (!usernameOk || !passwordOk) {
    return { error: "Kullanıcı adı veya şifre hatalı." };
  }

  await setSessionCookie(adminUsername);
  redirect("/admin");
}
