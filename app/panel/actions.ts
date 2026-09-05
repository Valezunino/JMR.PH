"use server";

import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createAdminSession, destroyAdminSession } from "@/lib/auth";
import { ensureSchema, getSql } from "@/lib/db";

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function setupAdmin(formData: FormData) {
  await ensureSchema();
  const email = value(formData, "email").toLowerCase();
  const password = value(formData, "password");
  const confirmation = value(formData, "confirmation");
  if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 10 || password !== confirmation) {
    redirect("/panel/configurar?error=Revisá+el+correo+y+usá+una+clave+de+10+caracteres+o+más");
  }
  const sql = getSql();
  const count = await sql`SELECT COUNT(*)::int AS total FROM jmr_admins`;
  if (Number(count[0]?.total) > 0) redirect("/panel/login?error=El+administrador+ya+está+configurado");
  const id = randomUUID();
  const hash = await bcrypt.hash(password, 12);
  await sql`INSERT INTO jmr_admins (id, email, password_hash) VALUES (${id}, ${email}, ${hash})`;
  await createAdminSession(id);
  redirect("/panel?bienvenida=1");
}

export async function loginAdmin(formData: FormData) {
  await ensureSchema();
  const email = value(formData, "email").toLowerCase();
  const password = value(formData, "password");
  const sql = getSql();
  const rows = await sql`SELECT id, password_hash FROM jmr_admins WHERE email = ${email} LIMIT 1`;
  const admin = rows[0] as { id: string; password_hash: string } | undefined;
  if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
    redirect("/panel/login?error=Correo+o+contraseña+incorrectos");
  }
  await createAdminSession(admin.id);
  redirect("/panel");
}

export async function logoutAdmin() {
  await destroyAdminSession();
  redirect("/panel/login");
}
