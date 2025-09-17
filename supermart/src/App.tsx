import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
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
import { SignUp } from './components/SignUp';
import { Login } from './components/Login';
import { GSTCalculator } from './components/TaxCalculator';
import { QuickPayment } from './components/QuickPayment';
import { Toaster } from 'sonner';
import { Loader2 } from 'lucide-react';

import './styles/globals.css';
import { toast } from 'sonner';

// Reusable Overlay Component
const Overlay = ({ message }: { message: string }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center gap-4 text-center">
      <Loader2 className="h-10 w-10 text-primary animate-spin" />
      <h3 className="text-lg font-semibold">{message}</h3>
      <p className="text-sm text-muted-foreground">This may take a moment.</p>
    </div>
  </div>
);

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showDelayOverlay, setShowDelayOverlay] = useState(false);
  const [currentView, setCurrentView] = useState('landing'); // Added state for view

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      setIsLoggedIn(true);
      setCurrentView('app'); // Set view to 'app' if already logged in
    }
  }, []);

  const handleQuickInvoice = () => {
    setActiveModule('quick-invoice');
  };

  const handleQuickBilling = () => {
    setActiveModule('quick-billing');
  };
  const handleGSTCalculator = () => {
    setActiveModule('gst-calculator');
  };

  const handleQuickPayment = () => {
    setActiveModule('quick-payment');
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return (
          <Dashboard
            onQuickInvoice={handleQuickInvoice}
            onQuickBilling={handleQuickBilling}
            onGSTCalculator={handleGSTCalculator}
            onQuickPayment={handleQuickPayment}
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
      case 'gst-calculator':
        return <GSTCalculator />;
      case 'quick-payment':
        return <QuickPayment />;
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

  const handleSignUp = async (userData: any) => {
    setIsAuthLoading(true);
    setShowDelayOverlay(true);
    setAuthError('');

    try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/authentication/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();
        const tenant = data.tenant_domain
        if(tenant){
          localStorage.setItem('tenant_domain', tenant)
        }
        if (response.ok) {
            setTimeout(() => {
                setShowDelayOverlay(false);
                toast.success('Account created successfully!', {
                    description: 'You can now log in with your new credentials.',
                });
                setShowSignup(false);
            }, 5000);
        } else {
            setAuthError(data.detail || 'Registration failed. Please try again.');
            setShowDelayOverlay(false);
        }
    } catch (error) {
        setAuthError('An error occurred. Please try again later.');
        console.error('Registration error:', error);
        setShowDelayOverlay(false);
    } finally {
        setIsAuthLoading(false);
    }
  };

  const handleLogin = async (email: string, username: string, password: string) => {
    setIsAuthLoading(true);
    setAuthError('');
    try {
        const tenantDomain = localStorage.getItem('tenant_domain')
        const response = await fetch(`http://${tenantDomain}:8000/api/v1/authentication/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);

            const tenantDomain = data.tenant_domain;
            localStorage.setItem('tenant_domain', tenantDomain);

            setIsLoggedIn(true);
            setCurrentView('app'); // Set view to 'app' on successful login
        } else {
            setAuthError(data.detail || 'Login failed. Please check your credentials.');
        }
    } catch (error) {
        setAuthError('An error occurred. Please try again later.');
        console.error('Login error:', error);
    } finally {
        setIsAuthLoading(false);
    }
};

  const handleLogout = async () => {
    setIsLogoutLoading(true);
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    fetch('http://murimart.localhost:8000/api/v1/authentication/logout/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ refresh: refreshToken }),
    }).catch(error => {
      console.error('Logout API call failed:', error);
    });

    setTimeout(() => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setIsLoggedIn(false);
      setActiveModule('dashboard');
      setIsLogoutLoading(false);
      setCurrentView('landing'); // Return to the landing page after logout
    }, 5000);
  };

  if (currentView === 'landing') {
    return <LandingPage onEnterApp={() => setCurrentView('app')} />;
  }

  if (!isLoggedIn) {
    if (showSignup) {
      return (
        <SignUp
          onSignUp={handleSignUp}
          onSwitchToLogin={() => setShowSignup(false)}
          isLoading={isAuthLoading || showDelayOverlay}
          error={authError}
        />
      );
    }
    return (
      <>
        <Login
          onLogin={handleLogin}
          onSwitchToSignup={() => setShowSignup(true)}
          isLoading={isAuthLoading}
          error={authError}
        />
        <Toaster />
      </>
    );
  }

  return (
    <>
      {isLogoutLoading && <Overlay message="Logging you out..." />}
      <Layout activeModule={activeModule} onModuleChange={setActiveModule} onLogout={handleLogout}>
        {renderModule()}
        <FloatingActionButton
          onQuickInvoice={handleQuickInvoice}
          onQuickBilling={handleQuickBilling}
          onGSTCalculator={handleGSTCalculator}
          onQuickPayment={handleQuickPayment}
        />
      </Layout>
      <Toaster />
    </>
  );
}