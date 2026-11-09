import { requireSession } from "@/server/authorization";
import { WorkspaceShell } from "@/components/layouts/workspace-shell";
export const metadata = {
  title: "Espace client",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireSession();
  return <WorkspaceShell area="customer">{children}</WorkspaceShell>;
}
