import { getLLMText, source } from "@/lib/source";

export const revalidate = false;

export async function GET(
  _req: Request,
  { params }: RouteContext<"/[locale]/llms-full.txt">
) {
  const { locale } = await params;
  const scan = source.getPages(locale).map(getLLMText);
  const scanned = await Promise.all(scan);

  return new Response(scanned.join("\n\n"));
}
