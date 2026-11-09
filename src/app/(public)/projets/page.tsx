import { pageSeo } from "@/server/page-seo";
import { ProjectsContent } from "@/features/company/company-pages";
export const generateMetadata = () => pageSeo("projects");
export default function ProjectsPage() {
  return <ProjectsContent />;
}
