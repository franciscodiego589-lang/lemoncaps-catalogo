"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, FileText, FlaskConical, LayoutDashboard, Package, Users, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { SignOutButton } from "@/components/admin/SignOutButton";

interface AdminNavProps {
  fullName: string;
  canManageQuotes: boolean;
}

interface AdminNavLink {
  href: string;
  label: string;
  icon: LucideIcon;
  exact: boolean;
}

interface AdminNavGrupo {
  /** null = sem rótulo (a visão geral fica solta no topo, como âncora). */
  titulo: string | null;
  id: string;
  links: AdminNavLink[];
}

// Agrupado por assunto em vez de uma lista corrida de seis itens. São dois
// trabalhos diferentes que passam por aqui: manter o cadastro em ordem
// (catálogo, insumos, custos) e atender quem chegou (leads, orçamentos). Ler
// seis rótulos seguidos obrigava a lembrar qual era qual toda vez.
const GRUPOS: AdminNavGrupo[] = [
  {
    titulo: null,
    id: "lc-nav-grupo-inicio",
    links: [{ href: "/admin", label: "Visão geral", icon: LayoutDashboard, exact: true }],
  },
  {
    titulo: "Cadastro",
    id: "lc-nav-grupo-cadastro",
    links: [
      { href: "/admin/catalogo", label: "Catálogo", icon: Package, exact: false },
      { href: "/admin/insumos", label: "Insumos", icon: FlaskConical, exact: false },
      { href: "/admin/custos", label: "Custos", icon: Wallet, exact: false },
    ],
  },
  {
    titulo: "Comercial",
    id: "lc-nav-grupo-comercial",
    links: [{ href: "/admin/leads", label: "Leads", icon: Users, exact: false }],
  },
];

const LINK_ORCAMENTOS: AdminNavLink = { href: "/admin/orcamentos", label: "Orçamentos", icon: FileText, exact: false };

export function AdminNav({ fullName, canManageQuotes }: AdminNavProps) {
  const pathname = usePathname();

  // Cópia nova em vez de empurrar o item no array do módulo: GRUPOS é
  // constante de módulo e sobrevive entre renderizações — mutar aqui
  // duplicaria "Orçamentos" a cada navegação.
  const grupos = canManageQuotes
    ? GRUPOS.map((grupo) => (grupo.id === "lc-nav-grupo-comercial" ? { ...grupo, links: [...grupo.links, LINK_ORCAMENTOS] } : grupo))
    : GRUPOS;

  return (
    <nav className="lc-admin-nav lc-glass" aria-label="Navegação administrativa">
      <div className="lc-admin-nav-brand">
        <span className="lc-brand-dot" aria-hidden="true" />
        Lemon Caps
      </div>
      {/* Volta para o site público. Fica no TOPO, logo abaixo da marca, e com
          contraste cheio: já esteve no rodapé em cor secundária e o dono não o
          encontrou — pediu o botão de novo depois de ele já existir. Saída de
          tela precisa estar onde o olho chega primeiro, não onde sobra espaço.
          Não desloga: a sessão continua de pé para voltar ao painel. */}
      <Link href="/catalogo" className="lc-admin-nav-voltar">
        <ArrowLeft size={16} aria-hidden="true" />
        Voltar ao catálogo
      </Link>
      <div className="lc-admin-nav-grupos">
        {grupos.map((grupo) => (
          <div
            key={grupo.id}
            className="lc-admin-nav-grupo"
            role={grupo.titulo ? "group" : undefined}
            aria-labelledby={grupo.titulo ? grupo.id : undefined}
          >
            {grupo.titulo ? (
              <span className="lc-admin-nav-grupo-titulo" id={grupo.id}>
                {grupo.titulo}
              </span>
            ) : null}
            <div className="lc-admin-nav-links">
              {grupo.links.map(({ href, label, icon: Icon, exact }) => {
                const isActive = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`lc-admin-nav-link${isActive ? " is-active" : ""}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon size={16} aria-hidden="true" />
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="lc-admin-nav-footer">
        <span className="lc-admin-nav-user">{fullName}</span>
        <SignOutButton />
      </div>
    </nav>
  );
}
