import { AdminQuotes } from "@/features/quotes/admin-quotes";
export default async function QuotesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <AdminQuotes query={await searchParams} />;
}
