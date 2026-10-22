"use client";

import Link from "next/link";
import { useEffect } from "react";

// Error boundary da área /admin inteira (achado A2 da auditoria de
// 14/09/2026: sem este arquivo, qualquer exceção não tratada na renderização
// de uma página do admin subia até a tela de erro genérica do Next, e o
// operador perdia a tela inteira sem caminho de volta).
//
// Contrato clássico do App Router - conferido no código real instalado
// (node_modules/next/dist/client/components/error-boundary.js, linhas
// 110-115): o Next passa `error`, `reset` (só limpa o estado local do
// boundary, tenta renderizar de novo sem sair da tela) e também `retry`
// (reset + router.refresh()). Aqui usamos `reset`, que já é suficiente para
// o operador tentar de novo sem perder o lugar onde estava - é o mesmo
// contrato pedido para este arquivo.
//
// Nunca renderiza error.message: pode vazar detalhe interno do servidor
// (nome de coluna, mensagem do Postgres/RLS etc.). O texto para o operador é
// sempre fixo; só o console recebe o erro completo (para quem for depurar) e
// a tela mostra o `digest` quando existir - é o identificador que o Next
// gera para cruzar com o log do servidor, sem ele não dá para achar a
// ocorrência lá.
interface AdminErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: AdminErrorProps) {
  useEffect(() => {
    console.error("[app/admin/error.tsx] erro numa página da área administrativa:", error);
  }, [error]);

  return (
    <>
      <div className="lc-admin-page-head">
        <div>
          <h1>Algo deu errado nesta tela</h1>
          <p>Não foi possível concluir o carregamento agora. Isso costuma se resolver ao tentar de novo.</p>
        </div>
      </div>

      <div className="lc-admin-panel">
        {/* role="alert": o conteúdo desta área do admin foi substituído por
            este aviso sem que o operador tivesse pedido - mesmo motivo do
            role="alert" em app/catalogo/error.tsx (outro segmento, mesma
            situação: interromper é o comportamento certo aqui). */}
        <p className="lc-admin-error" role="alert">
          Não foi possível carregar esta tela agora.
        </p>
        {error.digest ? (
          <p className="lc-admin-panel-row-meta">
            Código para o suporte técnico: <code>{error.digest}</code>
          </p>
        ) : null}

        <div className="lc-admin-form-actions">
          <button type="button" className="lc-btn lc-btn-primary" onClick={() => reset()}>
            Tentar de novo
          </button>
          <Link href="/admin" className="lc-btn lc-btn-ghost">
            Voltar para a visão geral do admin
          </Link>
        </div>
      </div>
    </>
  );
}
