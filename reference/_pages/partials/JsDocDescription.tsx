import { JsDoc } from "@deno/doc/types";
import { DetailedSection } from "./DetailedSection.tsx";
import { MarkdownContent } from "../primitives/MarkdownContent.tsx";
import { ReferenceContext } from "../../types.ts";

export function JsDocDescription(
  { jsDoc, context }: { jsDoc: JsDoc | undefined; context: ReferenceContext },
) {
  if (!jsDoc?.doc) {
    return null;
  }

  return (
    <DetailedSection>
      <MarkdownContent text={jsDoc?.doc || ""} context={context} />
    </DetailedSection>
  );
}
