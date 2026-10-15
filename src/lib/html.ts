const ALLOWED_TAGS = ['strong', 'b', 'em', 'i', 'u'];

/**
 * Convierte el texto del banner en HTML seguro: escapa todo y solo restaura
 * etiquetas de formato sin atributos (<strong>, <b>, <em>, <i>, <u>, <br>).
 */
export function toSafeInlineHtml(input: string): string {
  const escaped = input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const tagPattern = new RegExp(`&lt;(\\/?)(${ALLOWED_TAGS.join('|')})&gt;`, 'gi');
  return escaped
    .replace(tagPattern, (_m, slash: string, tag: string) => `<${slash}${tag.toLowerCase()}>`)
    .replace(/&lt;br\s*\/?&gt;/gi, '<br>');
}
