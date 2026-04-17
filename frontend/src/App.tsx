import { useState } from 'react';
import Layout from './adapters/ui/layout/Layout';
import RoutesTab from './adapters/ui/pages/RoutesTab/RoutesTab';
import CompareTab from './adapters/ui/pages/CompareTab/CompareTab';
import BankingTab from './adapters/ui/pages/BankingTab/BankingTab';
import PoolingTab from './adapters/ui/pages/PoolingTab/PoolingTab';

export type TabType = 'routes' | 'compare' | 'banking' | 'pooling';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('routes');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'routes':
        return <RoutesTab />;
      case 'compare':
        return <CompareTab />;
      case 'banking':
        return <BankingTab />;
      case 'pooling':
        return <PoolingTab />;
      default:
        return <RoutesTab />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderTabContent()}
    </Layout>
  );
}

export default App;
