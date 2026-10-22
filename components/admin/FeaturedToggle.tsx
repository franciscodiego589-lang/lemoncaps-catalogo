"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { toast } from "sonner";

import { setFormulaFeatured } from "@/lib/actions/formulas";
import { ROTULO_DESTAQUE } from "@/lib/catalog/featured";

interface FeaturedToggleProps {
  formulaId: string;
  /** Entra no nome acessível: numa lista de 27 linhas, "Destaque" sozinho não diz de quê. */
  formulaName: string;
  initialFeatured: boolean;
  /** Fórmula inativa não aparece na vitrine - o destaque fica guardado, esperando ela voltar ao ar. */
  active: boolean;
}

// Mesma mecânica do ActiveToggle ao lado (e pelo mesmo motivo): destacar é
// reversível, então nada de modal de confirmação - toast com "Desfazer", que é
// o padrão deste admin para ação que se desfaz num clique.
//
// Estado NÃO é comunicado só por cor (regra de acessibilidade da tarefa): a
// estrela é sólida quando é destaque e vazada quando não é (forma), o botão
// carrega aria-pressed (estado anunciado por leitor de tela) e o nome acessível
// diz o produto e o que o clique vai fazer.
export function FeaturedToggle({ formulaId, formulaName, initialFeatured, active }: FeaturedToggleProps) {
  const [featured, setFeatured] = useState(initialFeatured);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function applyChange(next: boolean, { silent = false }: { silent?: boolean } = {}) {
    startTransition(async () => {
      // try/catch (achado A2 da auditoria de 14/09/2026): mesmo motivo do
      // ActiveToggle ao lado - sem isto, uma rejeição de setFormulaFeatured
      // virava erro não tratado no cliente.
      try {
        const result = await setFormulaFeatured(formulaId, next);
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        setFeatured(next);
        // Refaz a página do servidor: é o que atualiza o aviso de "destaques
        // demais" no topo e reordena a lista (destaque sobe para o começo).
        router.refresh();
        if (silent) return;

        // Aviso honesto em vez de trava: destacar produto fora do ar não é erro
        // (pode ser preparação para o relançamento), mas ninguém vai ver.
        if (next && !active) {
          toast.warning("Fórmula inativa: o destaque só aparece no catálogo quando ela for ativada.");
          return;
        }
        toast.success(next ? "Fórmula em destaque no catálogo." : "Destaque removido.", {
          action: {
            label: "Desfazer",
            onClick: () => applyChange(!next, { silent: true }),
          },
        });
      } catch (caught) {
        console.error("[FeaturedToggle] falha ao atualizar destaque:", caught);
        toast.error("Não foi possível atualizar o destaque agora. Tente novamente.");
      }
    });
  }

  return (
    <button
      type="button"
      className={`lc-admin-featured-btn${featured ? " is-featured" : ""}`}
      onClick={() => applyChange(!featured)}
      disabled={isPending}
      aria-pressed={featured}
      aria-label={
        featured
          ? `${formulaName}: em destaque no catálogo. Clique para tirar do destaque.`
          : `${formulaName}: sem destaque. Clique para destacar no catálogo.`
      }
    >
      <Star size={15} aria-hidden="true" fill={featured ? "currentColor" : "none"} strokeWidth={featured ? 1.5 : 2} />
      <span>{ROTULO_DESTAQUE}</span>
    </button>
  );
}
