import { pageSeo } from "@/server/page-seo";
import { AboutContent } from "@/features/company/company-pages";
export const generateMetadata = () => pageSeo("about");
export default function AboutPage() {
  return <AboutContent />;
}
