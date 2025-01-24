import { DocNode, DocNodeBase } from "@deno/doc/types";
import {
  containsNamespaceDef,
  containsWrappedElements,
  SymbolDoc,
} from "../types.ts";

export function flattenItems(
  items: (SymbolDoc<DocNode | DocNodeBase>)[],
) {
  const flattened: SymbolDoc<DocNode | DocNodeBase>[] = [];
  for (const item of items) {
    if (item.data.kind === "namespace") {
      if (
        containsNamespaceDef(item.data) &&
        containsWrappedElements(item.data.namespaceDef)
      ) {
        const eles = item.data.namespaceDef.wrappedElements as SymbolDoc<
          DocNode
        >[];

        flattened.push(...flattenItems(eles));
      } else {
        throw new Error("NamespaceDef does not have wrappedElements");
      }
    } else {
      flattened.push(item);
    }
  }
  return flattened;
}

export const nbsp = "\u00A0";

export function createSymbolLookupMap(items: Map<string, SymbolDoc<DocNodeBase>[]>) {
  const symbolLookup = new Map<string, SymbolDoc[]>();
  for (const [_, symbols] of items.entries()) {
    for (const symbol of symbols) {
      if (!symbolLookup.has(symbol.identifier)) {
        symbolLookup.set(symbol.identifier, []);
      }

      const existing = symbolLookup.get(symbol.identifier) || [];
      existing.push(symbol);
      symbolLookup.set(symbol.identifier, existing);
    }
  }

  return symbolLookup;
}
