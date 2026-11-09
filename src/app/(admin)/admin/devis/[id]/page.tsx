import { AdminQuoteDetail } from "@/features/quotes/admin-quotes";
export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <AdminQuoteDetail id={(await params).id} />;
}
