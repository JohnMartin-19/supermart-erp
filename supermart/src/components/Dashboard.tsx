import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Package,
  FileText,
  Receipt,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Calculator,
  Loader2,
} from 'lucide-react';
import { Badge } from './ui/badge';

interface DashboardProps {
  onQuickInvoice?: () => void;
  onQuickBilling?: () => void;
  onGSTCalculator?: () => void;
  onQuickPayment?: () => void;
}

interface Activity {
  id: number;
  action_type: string;
  message: string;
  timestamp: string;
  tenant: number;
}

export function Dashboard({ onQuickInvoice, onQuickBilling, onGSTCalculator, onQuickPayment }: DashboardProps) {
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalInventories, setTotalInventories] = useState(0);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);

  const tenantDomain = localStorage.getItem('tenant_domain');

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      window.location.href = '/login';
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      };

      try {
        const [customersRes, inventoriesRes, invoicesRes, activitiesRes] = await Promise.all([
          fetch(`http://${tenantDomain}:8000/api/v1/customers/customers/`, { headers }),
          fetch(`http://${tenantDomain}:8000/api/v1/inventory/inventories/`, { headers }),
          fetch(`http://${tenantDomain}:8000/api/v1/invoice/quick_invoices/`, { headers }),
          fetch(`http://${tenantDomain}:8000/api/v1/activities/recent_activities/`, { headers }),
        ]);

        if (!customersRes.ok || !inventoriesRes.ok || !invoicesRes.ok || !activitiesRes.ok) {
          throw new Error('Failed to fetch data from one or more endpoints.');
        }

        const customersData = await customersRes.json();
        const inventoriesData = await inventoriesRes.json();
        const invoicesData = await invoicesRes.json();
        const activitiesData = await activitiesRes.json();

        setTotalCustomers(customersData.length);
        setTotalInventories(inventoriesData.length);
        setTotalInvoices(invoicesData.length);
        setRecentActivities(activitiesData);

        const calculatedRevenue = invoicesData.reduce((sum: number, invoice: any) => {
          return sum + (invoice.total_amount ? parseFloat(invoice.total_amount) : 0);
        }, 0);
        setTotalRevenue(calculatedRevenue);

      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [tenantDomain]);

  const stats = [
    {
      title: 'Total Revenue',
      value: isLoading ? '...' : `KSH ${totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
    },
    {
      title: 'Active Customers',
      value: isLoading ? '...' : totalCustomers.toString(),
      change: '+8.2%',
      trend: 'up',
      icon: Users,
    },
    {
      title: 'Inventory Items',
      value: isLoading ? '...' : totalInventories.toString(),
      change: '-2.1%',
      trend: 'down',
      icon: Package,
    },
    {
      title: 'Total Invoices',
      value: isLoading ? '...' : totalInvoices.toString(),
      change: '+15.3%',
      trend: 'up',
      icon: FileText,
    },
  ];

  const quickActions = [
    {
      title: 'Create Invoice',
      description: 'Generate a new invoice quickly',
      icon: FileText,
      action: onQuickInvoice,
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-900',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Quick Bill',
      description: 'Create and send bills instantly',
      icon: Receipt,
      action: onQuickBilling,
      color: 'bg-green-50 hover:bg-green-100 border-green-200 text-green-900',
      iconColor: 'text-green-600',
    },
    {
      title: 'Tax Calculator',
      description: 'Calculate Tax on transactions',
      icon: Calculator,
      action: onGSTCalculator,
      color: 'bg-red-50 hover:bg-red-100 border-red-200 text-red-900',
      iconColor: 'text-red-600',
    },
    {
      title: 'Quick Payment',
      description: 'Record payment received',
      icon: DollarSign,
      action: onQuickPayment,
      color: 'bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-900',
      iconColor: 'text-orange-600',
    },
  ];

  const getStatusIcon = (actionType: string) => {
    switch (actionType) {
      case 'payment_received':
      case 'invoice_created':
      case 'customer_added':
      case 'tax_filed':
      case 'payroll_processed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inventory_alert':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "just now";
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-4">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-muted-foreground">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-4 text-red-600">
        <AlertCircle className="h-8 w-8" />
        <p className="text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1>Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your business.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={onQuickInvoice} className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Zap className="w-4 h-4" />
            Quick Invoice
          </Button>
          <Button onClick={onQuickBilling} variant="outline" className="gap-2">
            <Receipt className="w-4 h-4" />
            Quick Bill
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-red-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md text-left ${action.color}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                </div>
                <h3 className="font-medium mb-1">{action.title}</h3>
                <p className="text-sm opacity-80">{action.description}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {stat.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    {getStatusIcon(activity.action_type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatTimestamp(activity.timestamp)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center">No recent activity.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm">Overdue Invoices</span>
                <Badge variant="destructive">5</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm">Draft Invoices</span>
                <Badge variant="secondary">12</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm">Paid This Month</span>
                <Badge variant="outline">KSH 8,45,670</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm">Pending Payments</span>
                <Badge variant="secondary">KSH 2,34,890</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}