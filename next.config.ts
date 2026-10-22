import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build autocontido para rodar em container (deploy na VPS, 14/09/2026): o
  // Next copia para .next/standalone só o servidor e as dependências que ele de
  // fato usa, em vez de exigir a node_modules inteira dentro da imagem. Não muda
  // nada no comportamento do site nem no `next dev`.
  output: "standalone",

  // Deixa de anunciar "X-Powered-By: Next.js" em toda resposta. Não fecha
  // nenhuma porta sozinho, mas é informação de reconhecimento entregue de graça
  // a quem estuda o alvo — achado da varredura de segurança de 14/09/2026.
  poweredByHeader: false,

  async redirects() {
    return [
      {
        // /fabricacao existiu por algumas horas em 13/09/2026, como página
        // separada. No mesmo dia o dono decidiu que a fabricação em marca
        // própria passaria a ser a PORTA DE ENTRADA do site — o conteúdo foi
        // para app/page.tsx e este endereço deixou de existir.
        //
        // Redireciona em vez de simplesmente sumir porque o endereço pode ter
        // sido copiado, enviado por mensagem ou indexado nesse intervalo: quem
        // tiver o link antigo chega ao conteúdo, não a um 404.
        //
        // `permanent: true` emite 308 (Permanent Redirect), que é o equivalente
        // moderno do 301 — mesma semântica de "mudou de endereço para sempre"
        // para buscador e para navegador, com a diferença de preservar o método
        // da requisição. Vive aqui, e não numa página que chama redirect(),
        // porque redirecionamento de configuração é resolvido ANTES do
        // roteamento: não renderiza React nem consulta o banco.
        //
        // O caminho inverso NÃO existe: a raiz responde com conteúdo, nunca com
        // um salto. É o endereço que o dono divulga.
        source: "/fabricacao",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
