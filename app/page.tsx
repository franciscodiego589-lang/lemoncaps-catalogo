import { redirect } from "next/navigation";

// A home do catálogo público é o /catalogo. A landing de marca (jornada,
// apresentação) é etapa futura (ver docs/ESTRUTURA.md, seção 3) — até lá,
// "/" só encaminha para a grade de fórmulas.
export default function Home() {
  redirect("/catalogo");
}
