import { ReferenceContext } from "../../types.ts";

export function LinkCode({ symbol }: { symbol: string }) {
  const target = "~/" + symbol;

  return (
    <a href={target}>
      <code>{symbol}</code>
    </a>
  );
}

export function insertLinkCodes(text: string, context: ReferenceContext) {
  // replace each text occurance of {@linkcode foo} with <LinkCode symbol="foo" />
  if (!text) {
    return "";
  }

  const parts = text.split(/(\{@linkcode\s+[^}]+\})/g);

  const partsAfterSub = parts.map((part) => {
    const match = part.match(/\{@linkcode\s+([^}]+)\}/);
    if (!match) {
      return part;
    }

    const symbolParts = match[1].trim();

    const [url, title] = symbolParts.includes("|")
      ? symbolParts.split("|").map((s) => s.trim())
      : [symbolParts, symbolParts];

    // Edge case where markdown inserts full URL
    if (url.startsWith("<a href")) {
      return url.replace(
        /<a href="([^"]+)">([^<]+)<\/a>/,
        (_, url, __) => (`<a href="${url}"><code>${title}</code></a>`),
      );
    }

    if (url.startsWith("http")) {
      return `<a href="${url}"><code>${title}</code></a>`;
    }

    if (!context || context.symbolLookup === undefined) {
      console.log("context", context);
      throw new Error("context.symbolLookup is undefined");
    }

    // Work out what symbol this is referencing.
    if (context.symbolLookup.has(url)) {
      const symbolOptions = context.symbolLookup.get(url);
      if (symbolOptions) {
        // We'll take the first for now, perhaps find the one in the nearest package
        const target = symbolOptions[0].url;
        return `<a href="${target}"><code>${title}</code></a>`;
      }
    }

    return `<code>${title}</code>`;
  });

  return partsAfterSub.join("").trim();
}

export function linkCodeAndParagraph(text: string, context: ReferenceContext) {
  if (!text?.trim()) {
    return null;
  }

  const withLinkCode = insertLinkCodes(text, context);

  const paragraphs = withLinkCode
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const elements = paragraphs.map((paragraph, index) => (
    <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }}>
    </p>
  ));

  return elements;
}
