"use server";

// Registro de APROVAÇÃO DA FICHA TÉCNICA pelo responsável técnico
// (public.formula_sheet_approvals, migration 20260916000000).
//
// Este arquivo tem UMA função de escrita, e é de propósito: aqui só se INSERE. Não
// existe editar aprovação, não existe apagar aprovação. Assinatura de RT é ato com
// valor legal e o histórico é o produto - corrigir a linha anterior apagaria justamente
// o que a auditoria do cliente vem conferir. Errou? Aprova de novo, e as duas linhas
// ficam à vista, na ordem em que aconteceram.
//
// E isso não depende de este arquivo continuar existindo assim: o papel `authenticated`
// só tem SELECT e INSERT nessa tabela, e não há policy de UPDATE nem de DELETE - a RLS
// nega os dois. Mesmo que alguém escrevesse uma action de update amanhã, o banco
// recusaria.
import { z } from "zod";

import { actionError, actionOk, zodIssuesToFieldErrors, type ActionResult } from "@/lib/actions/types";
import { requireStaffAction, StaffAuthError } from "@/lib/data/admin";
import { revalidateCatalogCache } from "@/lib/data/formulas";
import { createClient } from "@/lib/supabase/server";

// Hora do meio-dia no fuso do Brasil continental para a data escolhida no formulário.
// O input HTML de data devolve só "AAAA-MM-DD"; virar Date direto disso o JavaScript
// interpreta como MEIA-NOITE EM UTC, e meia-noite UTC é o DIA ANTERIOR em qualquer
// fuso brasileiro - a tela mostraria a assinatura um dia antes do que o RT assinou.
// Meio-dia com deslocamento explícito mantém o dia certo em toda a faixa de fusos em
// que este catálogo é lido (a exibição usa America/Cuiaba, ver formatComplianceDate).
const MEIO_DIA_BRASIL = "T12:00:00-03:00";
const DATA_ISO = /^\d{4}-\d{2}-\d{2}$/;

const registerSchema = z.object({
  formulaId: z.string().uuid("Fórmula inválida."),
  sheetVersion: z.number().int("Use um número inteiro.").min(1, "A versão da ficha começa em 1."),
  // Vazio é aceito por pedido do dono (17/09/2026): fica gravado como "PENDENTE",
  // nunca como string vazia, para o histórico nunca parecer célula em branco por erro
  // de exibição - é uma aprovação sem responsável técnico definido ainda, e diz isso.
  approvedByName: z
    .string()
    .trim()
    .max(200, "Nome muito longo.")
    .transform((v) => (v === "" ? "PENDENTE" : v)),
  approvedByLicense: z
    .string()
    .trim()
    .max(60, "Registro muito longo.")
    .transform((v) => (v === "" ? "PENDENTE" : v)),
  // Vazio = agora (o instante do registro). Preenchido = a data em que o RT assinou,
  // que pode ser anterior ao lançamento no sistema (ficha assinada em papel e digitada
  // depois é caso real).
  approvedAtDate: z
    .string()
    .trim()
    .nullable()
    .refine((v) => v === null || v === "" || DATA_ISO.test(v), { message: "Data inválida." }),
  notes: z
    .string()
    .trim()
    .nullable()
    .transform((v) => (v === null || v === "" ? null : v))
    .refine((v) => v === null || v.length <= 2000, { message: "Observação muito longa." }),
});

export type RegisterSheetApprovalInput = z.input<typeof registerSchema>;

export interface RegisterSheetApprovalResult {
  id: string;
  approvedAt: string;
}

export async function registerSheetApproval(
  input: RegisterSheetApprovalInput,
): Promise<ActionResult<RegisterSheetApprovalResult>> {
  try {
    await requireStaffAction();
  } catch (error) {
    if (error instanceof StaffAuthError) return actionError(error.message);
    throw error;
  }

  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) return actionError("Corrija os campos destacados.", zodIssuesToFieldErrors(parsed.error));

  const { formulaId, sheetVersion, approvedByName, approvedByLicense, approvedAtDate, notes } = parsed.data;

  const supabase = await createClient();

  // A fórmula precisa existir e não estar excluída ANTES de gravar a assinatura: uma
  // aprovação órfã (ou apontando para fórmula apagada) é pior que nenhuma, porque
  // parece documentação e não é. A FK já barraria id inexistente; esta checagem
  // acrescenta o caso da fórmula soft-deletada, que a FK não vê.
  const { data: formula, error: formulaError } = await supabase
    .from("formulas")
    .select("id, technical_sheet_version")
    .eq("id", formulaId)
    .is("deleted_at", null)
    .maybeSingle();

  if (formulaError) {
    console.error("[registerSheetApproval] falha ao conferir a fórmula:", formulaError);
    return actionError("Não foi possível registrar a aprovação agora. Tente novamente em instantes.");
  }
  if (!formula) return actionError("Fórmula não encontrada.");

  const { data, error } = await supabase
    .from("formula_sheet_approvals")
    .insert({
      formula_id: formulaId,
      sheet_version: sheetVersion,
      approved_by_name: approvedByName,
      approved_by_license: approvedByLicense,
      notes,
      // Só manda approved_at quando o usuário escolheu uma data; sem isso o default
      // now() do banco resolve, e o instante gravado é o do servidor, não o do relógio
      // do navegador de quem registrou.
      ...(approvedAtDate ? { approved_at: `${approvedAtDate}${MEIO_DIA_BRASIL}` } : {}),
    })
    .select("id, approved_at")
    .single();

  if (error || !data) {
    console.error("[registerSheetApproval] erro ao gravar aprovação:", error);
    return actionError("Não foi possível registrar a aprovação agora. Tente novamente em instantes.");
  }

  // A assinatura aparece no dossiê público - o cache do catálogo precisa cair, senão
  // a aprovação recém-registrada demoraria até 5 minutos para aparecer no site.
  revalidateCatalogCache();

  return actionOk({ id: data.id, approvedAt: data.approved_at });
}
