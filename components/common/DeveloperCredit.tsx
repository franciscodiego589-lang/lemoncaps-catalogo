// Assinatura de quem desenvolveu o site. Aparece nos TRÊS rodapés do catálogo
// (home, catálogo e carrinho), e por isso vive num componente só: texto de
// crédito repetido à mão em três arquivos é texto que diverge na primeira
// correção — e aqui há um CNPJ no meio, que não pode aparecer diferente em
// página diferente.
//
// O CNPJ foi confirmado pelo dono em 14/09/2026, antes de entrar no ar. É dado
// da empresa DESENVOLVEDORA (Beacon), não da fábrica cliente (Lemon Caps), cujos
// dados institucionais vivem em lib/catalog/regulatory-info.ts e não se
// misturam com estes.
const DEVELOPER_NAME = "Beacon";
const DEVELOPER_CNPJ = "64.764.725/0001-39";

export function DeveloperCredit() {
  return (
    <p className="lc-footer-credit">
      Desenvolvido por <span translate="no">{DEVELOPER_NAME}</span> · CNPJ {DEVELOPER_CNPJ}
    </p>
  );
}
