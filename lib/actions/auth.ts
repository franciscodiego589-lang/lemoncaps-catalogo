"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import { actionError, zodIssuesToFieldErrors, type ActionResult } from "@/lib/actions/types";

const signInSchema = z.object({
  email: z.string().trim().min(1, "Informe o e-mail.").email("E-mail em formato inválido."),
  password: z.string().min(1, "Informe a senha."),
});

// Mensagem única para qualquer falha de login (e-mail não existe, senha
// errada) - nunca revela qual dos dois casos aconteceu, para não confirmar a
// existência de um e-mail a quem tenta adivinhar.
const INVALID_CREDENTIALS_MESSAGE = "E-mail ou senha inválidos.";
const NOT_STAFF_MESSAGE = "Este usuário não tem acesso à área administrativa.";

// Server Action de login. Recebe FormData (funciona com <form action={signIn}>
// nativo, com ou sem JavaScript) e devolve ActionResult - nunca lança para o
// cliente, nunca redireciona em caso de erro (quem decide o que mostrar é o
// formulário).
export async function signIn(formData: FormData): Promise<ActionResult<undefined>> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return actionError("Corrija os campos destacados.", zodIssuesToFieldErrors(parsed.error));
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    // A mensagem ao usuário continua genérica de propósito (não revela se o e-mail
    // existe), mas o operador precisa distinguir "senha errada" de "Supabase fora
    // do ar" — sem este log, os dois casos eram indistinguíveis.
    console.error("[signIn] falha na autenticação:", error.message);
  }
  if (error || !data.user) {
    return actionError(INVALID_CREDENTIALS_MESSAGE);
  }

  // Autenticou de verdade - agora confirma que é staff ATIVO (substitui a
  // antiga senha fixa "0212"). A partir daqui não há mais risco de
  // enumeração de e-mail (quem chegou aqui já provou conhecer a senha certa
  // para este e-mail), então a mensagem pode ser específica.
  const { data: profile, error: profileError } = await supabase
    .from("staff_profiles")
    .select("active")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (profileError) {
    console.error("[signIn] falha ao consultar staff_profiles:", profileError.message);
  }
  if (profileError || !profile || !profile.active) {
    await supabase.auth.signOut();
    return actionError(NOT_STAFF_MESSAGE);
  }

  // Volta para a página que o usuário tentava abrir antes do proxy.ts
  // redirecionar para o login (parâmetro "redirect" de app/login/page.tsx e
  // do próprio proxy). Só aceita caminho relativo começando em "/admin" -
  // nunca um domínio externo (contra open redirect) nem a própria tela de
  // login (loop).
  const redirectToRaw = formData.get("redirectTo");
  const redirectTo =
    typeof redirectToRaw === "string" && redirectToRaw.startsWith("/admin") && redirectToRaw !== "/admin/login" && redirectToRaw !== "/login"
      ? redirectToRaw
      : "/admin";

  redirect(redirectTo);
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
