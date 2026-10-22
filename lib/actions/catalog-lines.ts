"use server";

import { z } from "zod";

import { isToggleableLine, type ToggleableLine } from "@/lib/catalog/catalog-lines";
import { actionError, actionOk, GENERIC_ACTION_ERROR, type ActionResult } from "@/lib/actions/types";
import { requireStaffAction, StaffAuthError } from "@/lib/data/admin";
import { revalidateCatalogCache } from "@/lib/data/formulas";
import { createClient } from "@/lib/supabase/server";

// Liga/desliga uma aba do catálogo público (pedido do dono, 21/10/2026). Mesma
// trava das demais actions do admin: sessão de staff aqui, e a policy
// catalog_lines_update do banco como backstop. Não mexe em nenhuma fórmula.
export async function setCatalogLineEnabled(
  line: string,
  enabled: boolean,
): Promise<ActionResult<{ line: ToggleableLine; enabled: boolean }>> {
  let userId: string | null = null;
  try {
    const session = await requireStaffAction();
    userId = session.userId ?? null;
  } catch (error) {
    if (error instanceof StaffAuthError) return actionError(error.message);
    throw error;
  }

  if (!isToggleableLine(line)) return actionError("Linha inválida.");
  const enabledParsed = z.boolean().safeParse(enabled);
  if (!enabledParsed.success) return actionError("Valor inválido.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("catalog_lines")
    .upsert({ line, enabled: enabledParsed.data, updated_at: new Date().toISOString(), updated_by: userId }, { onConflict: "line" });

  if (error) {
    console.error("[setCatalogLineEnabled] falha ao gravar public.catalog_lines:", { message: error.message, code: error.code });
    return actionError(GENERIC_ACTION_ERROR);
  }

  revalidateCatalogCache();
  return actionOk({ line, enabled: enabledParsed.data });
}
