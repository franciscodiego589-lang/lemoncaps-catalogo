"use client";

import { useEffect, useTransition } from "react";

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

// DECISÃO DO DONO em 14/09/2026 — os botões de WhatsApp saíram do site inteiro,
// este incluído. Motivo dele: "o cliente já entra direto no catálogo depois de
// entrar em contato com o comercial", ou seja, quem vê esta tela de erro já tem
// com quem falar. Fica "Tentar novamente", que é a ação que resolve o problema
// desta tela, e a nota de rodapé que remete ao atendimento habitual.

export default function CatalogoError({ error, retry }: CatalogErrorProps) {
  // Retorno visual do "Tentar novamente" (achado da auditoria de 13/09/2026:
  // quem acabou de ver um erro clicava e não sabia se tinha funcionado —
  // nenhuma troca de texto, nenhum botão desabilitado, nada). Mesmo padrão do
  // "Gerando…" de components/cart/CustomerForm.tsx.
  //
  // useTransition, e não um useState solto, porque o próprio `retry` do Next
  // já roda dentro de startTransition (node_modules/next/dist/client/
  // components/error-boundary.js: `retry = () => startTransition(() => {
  // this.context?.refresh(); this.reset(); })`). Envolvendo a chamada na
  // transition daqui, `isRetrying` acompanha a busca de verdade e se desliga
  // sozinho nos dois desfechos: deu certo, este componente é substituído pelo
  // catálogo; deu errado de novo, o boundary re-renderiza com o novo erro e o
  // botão volta a ficar clicável. Um useState manual travaria em "Tentando…"
  // para sempre no segundo caso, que é justamente quando o cliente mais
  // precisa poder tentar outra vez.
  const [isRetrying, startRetry] = useTransition();

  useEffect(() => {
    // Vai só para o console do servidor/navegador (nunca para a tela) — serve
    // para cruzar com error.digest no log do servidor quando precisar depurar.
    console.error("[app/catalogo/error.tsx] erro na rota do catálogo:", error);
  }, [error]);

  return (
    <div className="lc-container">
      <div className="lc-page-head">
        <h1>Não foi possível carregar o catálogo agora</h1>
        <p>
          Estamos com uma instabilidade momentânea para trazer as fórmulas. Isso costuma se resolver
          sozinho em instantes.
        </p>
      </div>

      {/* `role="alert"` MANTIDO de propósito (a auditoria de 13/09/2026 mandou
          julgar caso a caso, e trocou por aria-live="polite" só as mensagens
          de validação de campo do formulário do carrinho).
          Aqui é outra coisa: a página inteira que o visitante pediu não
          carregou e o conteúdo foi substituído por esta tela. Interromper é o
          comportamento certo — o que o leitor de tela estivesse falando é o
          conteúdo antigo, que não existe mais, e não há foco movido nem
          aria-describedby para garantir o anúncio por outro caminho (no
          formulário há: o foco vai para o campo inválido e a mensagem está
          ligada a ele). Rebaixar para "polite" arriscaria deixar o visitante
          esperando por um catálogo que nunca vai aparecer. */}
      <div className="lc-empty-state" role="alert">
        Tente novamente em alguns segundos. Se o catálogo continuar fora do ar, fale com a gente.
      </div>

      <div className="lc-modal-actions" style={{ maxWidth: 420, margin: "18px auto 0" }}>
        <button
          type="button"
          className="lc-btn lc-btn-primary"
          onClick={() => startRetry(() => retry())}
          disabled={isRetrying}
          aria-busy={isRetrying}
        >
          {isRetrying ? "Tentando…" : "Tentar novamente"}
        </button>
      </div>

      <p className="lc-min-note" style={{ textAlign: "center", marginTop: "10px" }}>
        Se o problema continuar, entre em contato pelos canais habituais de atendimento.
      </p>
    </div>
  );
}
