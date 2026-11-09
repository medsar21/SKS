import { ServicesPage } from "@/features/services/services-page";
import { pageSeo } from "@/server/page-seo";
export const generateMetadata = () => pageSeo("services");
export default function Page() {
  return <ServicesPage />;
}
