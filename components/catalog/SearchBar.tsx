import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="lc-search-wrap">
      <Search size={16} aria-hidden="true" />
      <input
        type="search"
        placeholder="Buscar fórmula…"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Buscar fórmula pelo nome"
        autoComplete="off"
        spellCheck={false}
      />
    </label>
  );
}
