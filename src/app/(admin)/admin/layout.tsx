import { requireAdmin } from "@/server/authorization";
import { WorkspaceShell } from "@/components/layouts/workspace-shell";
export const metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  return (
    <WorkspaceShell area="admin" contentAdmin={session.user.role === "ADMIN"}>
      {children}
    </WorkspaceShell>
  );
}
