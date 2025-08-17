import { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Accounting } from './components/Accounting';
import { Inventory } from './components/Inventory';
import { TaxCompliance } from './components/TaxCompliance';
import { Payroll } from './components/Payroll';
import { QuickInvoice } from './components/QuickInvoice';
import { QuickBilling } from './components/QuickBilling';
import { FloatingActionButton } from './components/FloatingActionButton';
import { PointOfSale } from './components/PointOfSale';
import { ProductCatalog } from './components/ProductCatalog';
import { CustomerManagement } from './components/CustomerManagement';
import { SupplierManagement } from './components/SupplierManagement';
import { MultiLocationManagement } from './components/MultiLocationManagement';
import { CashManagement } from './components/CashManagement';
import './styles/globals.css'
function Settings() {
  return (
    <div className="p-6">
      <h1>System Settings</h1>
      <p className="text-muted-foreground">Configure your supermarket chain ERP system</p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 border rounded-lg">
          <h3 className="font-medium mb-2">Chain Configuration</h3>
          <p className="text-sm text-muted-foreground">Manage supermarket chain information and branding</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="font-medium mb-2">Branch Management</h3>
          <p className="text-sm text-muted-foreground">Configure individual store locations and settings</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="font-medium mb-2">VAT & Tax Configuration</h3>
          <p className="text-sm text-muted-foreground">Configure Kenyan VAT rates and tax compliance settings</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="font-medium mb-2">Currency & Pricing</h3>
          <p className="text-sm text-muted-foreground">Set KES as primary currency and pricing policies</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="font-medium mb-2">User Roles & Access</h3>
          <p className="text-sm text-muted-foreground">Manage cashier, manager, and admin access levels</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="font-medium mb-2">POS Integration</h3>
          <p className="text-sm text-muted-foreground">Configure point of sale systems and payment methods</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="font-medium mb-2">Backup & Security</h3>
          <p className="text-sm text-muted-foreground">Manage data backup and security across all branches</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="font-medium mb-2">Reports & Analytics</h3>
          <p className="text-sm text-muted-foreground">Customize sales reports and chain-wide analytics</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="font-medium mb-2">Django API Configuration</h3>
          <p className="text-sm text-muted-foreground">Configure backend API endpoints and authentication</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeModule, setActiveModule] = useState('dashboard');

  const handleQuickInvoice = () => {
    setActiveModule('quick-invoice');
  };

  const handleQuickBilling = () => {
    setActiveModule('quick-billing');
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return (
          <Dashboard 
            onQuickInvoice={handleQuickInvoice}
            onQuickBilling={handleQuickBilling}
          />
        );
      case 'pos':
        return <PointOfSale />;
      case 'products':
        return <ProductCatalog />;
      case 'customers':
        return <CustomerManagement />;
      case 'suppliers':
        return <SupplierManagement />;
      case 'locations':
        return <MultiLocationManagement />;
      case 'cash':
        return <CashManagement />;
      case 'quick-invoice':
        return <QuickInvoice />;
      case 'quick-billing':
        return <QuickBilling />;
      case 'accounting':
        return <Accounting />;
      case 'inventory':
        return <Inventory />;
      case 'tax':
        return <TaxCompliance />;
      case 'payroll':
        return <Payroll />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <Dashboard 
            onQuickInvoice={handleQuickInvoice}
            onQuickBilling={handleQuickBilling}
          />
        );
    }
  };

  return (
    <Layout activeModule={activeModule} onModuleChange={setActiveModule}>
      {renderModule()}
      <FloatingActionButton 
        onQuickInvoice={handleQuickInvoice}
        onQuickBilling={handleQuickBilling}
      />
    </Layout>
  );
}