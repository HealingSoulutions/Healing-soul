import ServiceCategoryPage from '../../components/ServiceCategoryPage';
import { getService } from '../../lib/services';

export default function Page() {
  return <ServiceCategoryPage service={getService('iv-injections')} />;
}
