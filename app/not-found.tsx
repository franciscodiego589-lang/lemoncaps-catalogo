import Link from "next/link";
import { ArrowLeft, PackageSearch } from "lucide-react";

// Página 404 do site inteiro. Antes desta existir, um endereço errado caía na
// tela padrão do Next — "404: This page could not be found.", em inglês, sem
// marca nenhuma. Num catálogo B2B, quem chega por link velho ou por endereço
// digitado errado é cliente, e essa tela é a última chance de não perdê-lo.
export const metadata = {
  title: "Página não encontrada | Lemon Caps",
};

export default function NotFound() {
  return (
    <main className="lc-erro-page">
      <div className="lc-erro-card">
        <PackageSearch size={44} aria-hidden="true" className="lc-erro-icone" />
        <h1>Não encontramos esta página</h1>
        <p>
          O endereço pode ter mudado, ou o produto que você procura saiu do catálogo. Todas as
          fórmulas disponíveis estão na página do catálogo.
        </p>
        <div className="lc-erro-acoes">
          <Link href="/catalogo" className="lc-btn lc-btn-primary">
            <ArrowLeft size={16} aria-hidden="true" />
            Ver o catálogo
          </Link>
          <Link href="/" className="lc-btn lc-btn-ghost">
            Ir para a página inicial
          </Link>
        </div>
      </div>
    </main>
  );
}
