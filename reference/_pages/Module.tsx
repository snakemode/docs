import { DocNode, DocNodeModuleDoc } from "@deno/doc/types";
import { LumeDocument, ReferenceContext, SymbolDoc } from "../types.ts";
import ReferencePage from "../_layouts/ReferencePage.tsx";

type Props = { data: DocNode; context: ReferenceContext };

export default function* getPages(
  item: SymbolDoc<DocNodeModuleDoc>,
  context: ReferenceContext,
): IterableIterator<LumeDocument> {
  yield {
    title: item.name,
    url:
      `${context.root}/${context.packageName.toLocaleLowerCase()}/${item.identifier}`,
    content: <Module data={item.data} context={context} />,
  };
}

export function Module({ data, context }: Props) {
  return (
    <ReferencePage
      context={context}
      navigation={{ category: context.packageName, currentItemName: data.name }}
    >
      I am a module, my name is {data.name}

      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </ReferencePage>
  );
}
