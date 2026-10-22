import Image from "next/image";
import Link from "next/link";

import { ActiveToggle } from "@/components/admin/ActiveToggle";
import { FeaturedToggle } from "@/components/admin/FeaturedToggle";
import { LineSwitch } from "@/components/admin/LineSwitch";
import { PRODUCT_FORMAT_LABELS } from "@/components/admin/enum-labels";
import { FORMAT_ICONS } from "@/lib/catalog/format-catalog";
import { lineAllowsActiveWithoutPrice } from "@/lib/catalog/price-rule";
import type { AdminFormulaListItemDTO } from "@/lib/data/admin";
import { centsToBRL } from "@/lib/money";

interface FormulaAdminTableProps {
  formulas: AdminFormulaListItemDTO[];
}

// Miniatura do pote na linha. 44px é o mesmo tamanho do alvo de toque mínimo
// usado nos controles ao lado - a linha inteira acaba com uma altura só.
const THUMB_SIZE = 44;

// As cinco pendências que se resolvem NESTA tela, com o rótulo curto que cabe
// numa linha de tabela. São exatamente as mesmas medidas pelo painel de visão
// geral (lib/data/admin-dashboard.ts) - nenhuma pendência nova foi inventada
// aqui: a diferença é que lá elas são contadas, e aqui aparecem produto a
// produto, que é onde cada uma se resolve. "Sem custo" fica de fora de
// propósito: custo mora em outra tabela e tem tela própria (/admin/custos).
function pendenciasDaLinha(formula: AdminFormulaListItemDTO): string[] {
  const pendencias: string[] = [];
  if (formula.mockupPath === null) pendencias.push("Sem foto");
  if (formula.listPriceCents === null) pendencias.push("Sem preço");
  if (!formula.hasIngredientsList) pendencias.push("Sem ingredientes");
  if (!formula.hasWarnings) pendencias.push("Sem advertências");
  if (formula.complianceVerifiedAt === null) pendencias.push("Sem selo");
  return pendencias;
}

export function FormulaAdminTable({ formulas }: FormulaAdminTableProps) {
  if (formulas.length === 0) {
    return <p className="lc-admin-empty">Nenhuma fórmula encontrada para este filtro.</p>;
  }

  return (
    // O contêiner já rola sozinho no horizontal (.lc-admin-table-wrap tem
    // overflow-x:auto): em 390px quem rola é a tabela, nunca a página.
    <div className="lc-admin-table-wrap">
      <table className="lc-admin-table lc-admin-catalog-table">
        <thead>
          <tr>
            <th scope="col">Produto</th>
            <th scope="col">Linha</th>
            <th scope="col">Pendências</th>
            <th scope="col" className="lc-admin-col-num">
              Preço
            </th>
            <th scope="col">Destaque</th>
            <th scope="col">Situação</th>
            <th scope="col">Ações</th>
          </tr>
        </thead>
        <tbody>
          {formulas.map((formula) => {
            const pendencias = pendenciasDaLinha(formula);
            const FormatIcon = FORMAT_ICONS[formula.format];

            return (
              <tr key={formula.id}>
                {/* Uma célula só para o produto: a foto identifica, o nome domina
                    (é o dado principal) e segmento/linha/formato descem para uma
                    linha de apoio, menor e em cinza. Antes eram quatro colunas de
                    mesmo peso visual, e o olho não sabia onde pousar. */}
                <td>
                  <div className="lc-admin-produto">
                    {formula.mockupPath ? (
                      <Image
                        src={formula.mockupPath}
                        alt={`Pote de ${formula.name}`}
                        width={THUMB_SIZE}
                        height={THUMB_SIZE}
                        className="lc-admin-produto-thumb"
                      />
                    ) : (
                      // Sem foto pareada, o ícone do FORMATO no lugar - mesma
                      // escolha do card público (nunca um buraco na tela). O
                      // "Sem foto" continua dito por escrito na coluna de
                      // pendências, que é onde a informação é acionável.
                      <span className="lc-admin-produto-thumb lc-admin-produto-thumb--vazia" aria-hidden="true">
                        <FormatIcon size={20} />
                      </span>
                    )}
                    <span className="lc-admin-produto-texto">
                      <Link href={`/admin/catalogo/${formula.id}`} className="lc-admin-produto-nome">
                        {formula.name}
                      </Link>
                      <span className="lc-admin-produto-meta">
                        {formula.segmentName} · {PRODUCT_FORMAT_LABELS[formula.format]}
                      </span>
                    </span>
                  </div>
                </td>

                <td>
                  <LineSwitch formulaId={formula.id} formulaName={formula.name} initialLine={formula.line} />
                </td>

                <td>
                  {pendencias.length === 0 ? (
                    // Traço, e não "tudo certo": os cinco itens conferidos estarem
                    // preenchidos não é promessa de cadastro perfeito. O leitor de
                    // tela recebe a frase exata, que um "-" sozinho não daria.
                    <>
                      <span aria-hidden="true">—</span>
                      <span className="lc-sr-only">Nenhuma pendência entre os cinco itens conferidos.</span>
                    </>
                  ) : (
                    <span className="lc-admin-pend-chips">
                      {pendencias.map((pendencia) => (
                        <span key={pendencia} className="lc-admin-pend-chip">
                          {pendencia}
                        </span>
                      ))}
                    </span>
                  )}
                </td>

                <td className="lc-admin-col-num">
                  {formula.listPriceCents !== null ? (
                    centsToBRL(formula.listPriceCents)
                  ) : (
                    <>
                      <span aria-hidden="true">—</span>
                      <span className="lc-sr-only">Preço não definido.</span>
                    </>
                  )}
                </td>

                <td>
                  <FeaturedToggle
                    formulaId={formula.id}
                    formulaName={formula.name}
                    initialFeatured={formula.featuredAt !== null}
                    active={formula.active}
                  />
                </td>

                <td>
                  <ActiveToggle
                    formulaId={formula.id}
                    initialActive={formula.active}
                    canActivate={formula.listPriceCents !== null || lineAllowsActiveWithoutPrice(formula.line)}
                  />
                </td>

                <td className="lc-admin-col-actions">
                  <Link href={`/admin/catalogo/${formula.id}`} className="lc-admin-row-action">
                    Editar
                    <span className="lc-sr-only"> {formula.name}</span>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
