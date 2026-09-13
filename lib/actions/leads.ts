"use server";

import { z } from "zod";

import { requireStaffAction, StaffAuthError } from "@/lib/data/admin";
import { createClient } from "@/lib/supabase/server";
import { actionError, actionOk, friendlyDbError, type ActionResult } from "@/lib/actions/types";

// public.leads guarda dado pessoal real (LGPD) - exclusão é sempre lógica
// (deleted_at), nunca física, para manter a trilha de auditoria e permitir
// reverter um clique por engano. A listagem (lib/data/admin.ts) já filtra
// deleted_at is null, então o lead desaparece da tela imediatamente.
export async function softDeleteLead(id: string, reason?: string): Promise<ActionResult<{ id: string }>> {
  try {
    await requireStaffAction();
  } catch (error) {
    if (error instanceof StaffAuthError) return actionError(error.message);
    throw error;
  }

  const idParsed = z.string().uuid().safeParse(id);
  if (!idParsed.success) return actionError("Identificador de lead inválido.");

  const trimmedReason = (reason ?? "").trim();
  const reasonParsed = z
    .string()
    .max(500, "Motivo muito longo.")
    .safeParse(trimmedReason === "" ? "Removido pelo admin de leads." : trimmedReason);
  if (!reasonParsed.success) return actionError(reasonParsed.error.issues[0]?.message ?? "Motivo inválido.");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .update({ deleted_at: new Date().toISOString(), reason_deleted: reasonParsed.data })
    .eq("id", idParsed.data)
    .is("deleted_at", null)
    .select("id")
    .maybeSingle();

  if (error) return actionError(friendlyDbError(error));
  if (!data) return actionError("Lead não encontrado.");

  return actionOk({ id: data.id });
}
