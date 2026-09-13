"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

interface SelectFilterOption {
  value: string;
  label: string;
}

interface SelectFilterSpec {
  param: string;
  label: string;
  options: SelectFilterOption[];
}

interface AdminFilterBarProps {
  searchParam: string;
  searchLabel: string;
  searchPlaceholder?: string;
  selects?: SelectFilterSpec[];
}

// Barra de busca + filtros reutilizável (catálogo, insumos, leads). Atualiza
// a URL (searchParams) e deixa o Server Component da página buscar de novo no
// banco - nunca filtra uma lista já carregada no cliente, para a busca
// funcionar igual com 28 ou com 2.800 fórmulas. Busca com debounce; selects
// aplicam na hora.
export function AdminFilterBar({ searchParam, searchLabel, searchPlaceholder, selects = [] }: AdminFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get(searchParam) ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function updateParam(param: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(param, value);
    else params.delete(param);
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleSearchChange(value: string) {
    setSearchValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateParam(searchParam, value), 350);
  }

  return (
    <div className="lc-admin-toolbar">
      <div className="lc-field">
        <label className="lc-field-label" htmlFor={`filter-${searchParam}`}>
          {searchLabel}
        </label>
        <input
          id={`filter-${searchParam}`}
          type="search"
          className="lc-admin-search-input"
          value={searchValue}
          placeholder={searchPlaceholder}
          onChange={(event) => handleSearchChange(event.target.value)}
        />
      </div>
      {selects.map((select) => (
        <div className="lc-field" key={select.param}>
          <label className="lc-field-label" htmlFor={`filter-${select.param}`}>
            {select.label}
          </label>
          <select
            id={`filter-${select.param}`}
            className="lc-admin-select"
            defaultValue={searchParams.get(select.param) ?? select.options[0]?.value ?? ""}
            onChange={(event) => updateParam(select.param, event.target.value)}
          >
            {select.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
