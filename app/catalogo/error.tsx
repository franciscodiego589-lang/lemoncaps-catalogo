"use client";

import { useEffect } from "react";

// Error boundary da rota /catalogo (convenção do Next App Router: precisa ser
// Client Component). Pega qualquer falha lançada durante o carregamento dos
// dados em lib/data/formulas.ts (getCatalogData) e mostra uma tela sóbria, no
// visual do site, no lugar da tela de erro genérica do Next.
//
// Nunca renderiza error.message nem stack: em produção o Next já troca a
// mensagem original por um texto genérico + `digest` quando o erro vem de um
// Server Component (node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/error.md,
// seção "error.message") — mas mesmo em desenvolvimento, onde a mensagem real
// chegaria até aqui, esta tela nunca a exibe: o texto para o visitante é fixo,
// só o console (abaixo) recebe o erro completo, para quem estiver depurando.
//
// `retry` é a prop estável desde o Next 16.3.0 (este projeto usa 16.3.4) para
// "tentar de novo re-buscando os dados" — substitui o antigo `reset()` como
// forma recomendada quando se quer refazer a busca, não só limpar o estado de
// erro (node_modules/next/dist/docs/.../error.md, seções "retry" e "reset").
interface CatalogErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

// PENDENTE (dono do projeto): definir NEXT_PUBLIC_WHATSAPP_NUMBER em .env.local
// com o WhatsApp real da Lemon Caps. Sem essa variável configurada, nenhum
// número é inventado aqui — a tela mostra um texto neutro no lugar do botão.
// Nunca publicar um número de contato que não veio de uma fonte confirmada.
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
const WHATSAPP_MESSAGE = "Olá! Tentei acessar o catálogo Lemon Caps e a página não carregou.";

export default function CatalogoError({ error, retry }: CatalogErrorProps) {
  useEffect(() => {
    // Vai só para o console do servidor/navegador (nunca para a tela) — serve
    // para cruzar com error.digest no log do servidor quando precisar depurar.
    console.error("[app/catalogo/error.tsx] erro na rota do catálogo:", error);
  }, [error]);

  const whatsappHref = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
    : null;

  return (
    <div className="lc-container">
      <div className="lc-page-head">
        <h1>Não foi possível carregar o catálogo agora</h1>
        <p>
          Estamos com uma instabilidade momentânea para trazer as fórmulas. Isso costuma se resolver
          sozinho em instantes.
        </p>
      </div>

      <div className="lc-empty-state" role="alert">
        Tente novamente em alguns segundos. Se o catálogo continuar fora do ar, fale com a gente.
      </div>

      <div className="lc-modal-actions" style={{ maxWidth: 420, margin: "18px auto 0" }}>
        {whatsappHref ? (
          <a className="lc-btn lc-btn-ghost" href={whatsappHref} target="_blank" rel="noopener noreferrer">
            Falar no WhatsApp
          </a>
        ) : null}
        <button type="button" className="lc-btn lc-btn-primary" onClick={() => retry()}>
          Tentar novamente
        </button>
      </div>

      {!whatsappHref ? (
        <p className="lc-min-note" style={{ textAlign: "center", marginTop: "10px" }}>
          Se o problema continuar, entre em contato pelos canais habituais de atendimento.
        </p>
      ) : null}
    </div>
  );
}
