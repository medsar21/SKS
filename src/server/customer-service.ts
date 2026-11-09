import "server-only";
import { requireSession } from "@/server/authorization";
import { getDb } from "@/server/db";

export async function getMyCustomer() {
  const session = await requireSession();
  return getDb().customer.findUnique({
    where: { userId: session.user.id },
    select: {
      companyName: true,
      _count: { select: { quotes: true, orders: true } },
    },
  });
}
