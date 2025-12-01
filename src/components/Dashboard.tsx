import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import OwnerDashboard from './dashboards/OwnerDashboard';
import SalespersonDashboard from './dashboards/SalespersonDashboard';
import DistributorDashboard from './dashboards/DistributorDashboard';
import Header from './Header';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'owner':
        return <OwnerDashboard />;
      case 'salesperson':
        return <SalespersonDashboard />;
      case 'distributor':
        return <DistributorDashboard />;
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderDashboard()}
      </main>
    </div>
  );
};

export default Dashboard;