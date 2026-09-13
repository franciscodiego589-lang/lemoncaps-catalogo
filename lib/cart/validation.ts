// Validação de nome e WhatsApp do formulário de identificação do carrinho.
// O padrão abaixo espelha, caractere por caractere, a checagem feita dentro
// das duas RPCs públicas (supabase/migrations/20260912225011_rate_limit_rpc.sql,
// fn_capture_lead e fn_generate_quote: `p_whatsapp !~ '^\+?[0-9]{10,15}$'`) —
// nunca deixar o formulário aceitar algo que o banco recusaria depois.
export const WHATSAPP_PATTERN = /^\+?[0-9]{10,15}$/;

// O visitante digita com parênteses, traço ou espaço ("(65) 99999-0000"); o
// banco só aceita dígitos e um "+" opcional na frente. Normaliza antes de
// validar e antes de enviar às RPCs, para os dois lados (formulário e banco)
// concordarem sobre o mesmo valor.
export function normalizeWhatsapp(rawValue: string): string {
  const trimmed = rawValue.trim();
  const hasLeadingPlus = trimmed.startsWith("+");
  const digitsOnly = trimmed.replace(/\D/g, "");
  return hasLeadingPlus ? `+${digitsOnly}` : digitsOnly;
}

export function isValidWhatsapp(normalizedValue: string): boolean {
  return WHATSAPP_PATTERN.test(normalizedValue);
}

export function isValidCustomerName(value: string): boolean {
  return value.trim().length > 0;
}
