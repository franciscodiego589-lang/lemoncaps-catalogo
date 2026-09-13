"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, FileText, FlaskConical, LayoutDashboard, Package, Users, Wallet } from "lucide-react";

import { SignOutButton } from "@/components/admin/SignOutButton";

interface AdminNavProps {
  fullName: string;
  canManageQuotes: boolean;
}

const BASE_LINKS = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard, exact: true },
  { href: "/admin/catalogo", label: "Catálogo", icon: Package, exact: false },
  { href: "/admin/insumos", label: "Insumos", icon: FlaskConical, exact: false },
  { href: "/admin/custos", label: "Custos", icon: Wallet, exact: false },
  { href: "/admin/leads", label: "Leads", icon: Users, exact: false },
] as const;

export function AdminNav({ fullName, canManageQuotes }: AdminNavProps) {
  const pathname = usePathname();
  const links = canManageQuotes ? [...BASE_LINKS, { href: "/admin/orcamentos", label: "Orçamentos", icon: FileText, exact: false }] : BASE_LINKS;

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
      <div className="lc-admin-nav-links">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link key={href} href={href} className={`lc-admin-nav-link${isActive ? " is-active" : ""}`} aria-current={isActive ? "page" : undefined}>
              <Icon size={16} aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </div>
      <div className="lc-admin-nav-footer">
        <span className="lc-admin-nav-user">{fullName}</span>
        <SignOutButton />
      </div>
    </nav>
  );
}
