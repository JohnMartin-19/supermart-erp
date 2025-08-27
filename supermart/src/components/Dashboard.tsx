import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useEffect } from 'react';
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
} from 'lucide-react';
import { Badge } from './ui/badge';

interface DashboardProps {
  onQuickInvoice?: () => void;
  onQuickBilling?: () => void;
}

export function Dashboard({ onQuickInvoice, onQuickBilling }: DashboardProps) {

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      window.location.href = '/login';
    }
  }, []);

  const stats = [
    {
      title: 'Total Revenue',
      value: 'KSH 12,34,567',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
    },
    {
      title: 'Active Customers',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
    },
    {
      title: 'Inventory Items',
      value: '5,678',
      change: '-2.1%',
      trend: 'down',
      icon: Package,
    },
    {
      title: 'Pending Invoices',
      value: '23',
      change: '+15.3%',
      trend: 'up',
      icon: FileText,
    },
  ];

  const recentActivities = [
    { id: 1, type: 'invoice', message: 'Invoice #INV-001 created for ABC Corp', time: '2 mins ago', status: 'success' },
    { id: 2, type: 'payment', message: 'Payment received from XYZ Ltd - ₹50,000', time: '15 mins ago', status: 'success' },
    { id: 3, type: 'inventory', message: 'Low stock alert: Product A (10 units left)', time: '1 hour ago', status: 'warning' },
    { id: 4, type: 'tax', message: 'GST return filed successfully', time: '2 hours ago', status: 'success' },
    { id: 5, type: 'payroll', message: 'Salary processed for 25 employees', time: '1 day ago', status: 'success' },
  ];

  const quickActions = [
    {
      title: 'Create Invoice',
      description: 'Generate a new invoice quickly',
      icon: FileText,
      action: onQuickInvoice,
      colors: {
        bg: 'bg-blue-50 hover:bg-blue-100',
        border: 'border-blue-200',
        text: 'text-blue-900',
        icon: 'text-blue-600',
      },
    },
    {
      title: 'Quick Bill',
      description: 'Create and send bills instantly',
      icon: Receipt,
      action: onQuickBilling,
      colors: {
        bg: 'bg-green-50 hover:bg-green-100',
        border: 'border-green-200',
        text: 'text-green-900',
        icon: 'text-green-600',
      },
    },
    {
      title: 'GST Calculator',
      description: 'Calculate GST on transactions',
      icon: Calculator,
      action: () => console.log('GST Calculator'),
      colors: {
        bg: 'bg-purple-50 hover:bg-purple-100',
        border: 'border-purple-200',
        text: 'text-purple-900',
        icon: 'text-purple-600',
      },
    },
    {
      title: 'Quick Payment',
      description: 'Record payment received',
      icon: DollarSign,
      action: () => console.log('Quick Payment'),
      colors: {
        bg: 'bg-orange-50 hover:bg-orange-100',
        border: 'border-orange-200',
        text: 'text-orange-900',
        icon: 'text-orange-600',
      },
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };

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
            <Zap className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md text-left ${action.colors.bg} ${action.colors.border} ${action.colors.text}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <action.icon className={`w-6 h-6 ${action.colors.icon}`} />
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
              <div className="text-2xl font-bold">{stat.value}</div>
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
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  {getStatusIcon(activity.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
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