import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Banknote, CreditCard, TrendingUp, TrendingDown, Plus, Calendar, Building2, Eye } from 'lucide-react';

interface CashTransaction {
  id: string;
  type: 'sale' | 'expense' | 'deposit' | 'withdrawal';
  amount: number;
  description: string;
  branch: string;
  cashier: string;
  timestamp: string;
  paymentMethod: 'cash' | 'mpesa' | 'card';
}

interface CashDrawer {
  id: string;
  branch: string;
  cashier: string;
  openingBalance: number;
  currentBalance: number;
  totalSales: number;
  totalExpenses: number;
  status: 'open' | 'closed';
  openedAt: string;
  closedAt?: string;
}

export function CashManagement() {
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedDate, setSelectedDate] = useState('today');
  const [isReconcileOpen, setIsReconcileOpen] = useState(false);
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);

  // Mock data - would come from Django API
  const [cashDrawers] = useState<CashDrawer[]>([
    {
      id: '1',
      branch: 'Main Store - Nairobi CBD',
      cashier: 'Alice Wanjiku',
      openingBalance: 10000,
      currentBalance: 45230,
      totalSales: 125000,
      totalExpenses: 3500,
      status: 'open',
      openedAt: '2024-08-17 08:00:00',
    },
    {
      id: '2',
      branch: 'Westlands Branch',
      cashier: 'John Kimani',
      openingBalance: 8000,
      currentBalance: 28750,
      totalSales: 85000,
      totalExpenses: 2000,
      status: 'open',
      openedAt: '2024-08-17 08:30:00',
    },
    {
      id: '3',
      branch: 'Nakuru Branch',
      cashier: 'Mary Njeri',
      openingBalance: 6000,
      currentBalance: 0,
      totalSales: 75000,
      totalExpenses: 1500,
      status: 'closed',
      openedAt: '2024-08-16 08:00:00',
      closedAt: '2024-08-16 20:00:00',
    }
  ]);

  const [transactions] = useState<CashTransaction[]>([
    {
      id: '1',
      type: 'sale',
      amount: 2450,
      description: 'Customer purchase - Receipt #R001',
      branch: 'Main Store - Nairobi CBD',
      cashier: 'Alice Wanjiku',
      timestamp: '2024-08-17 14:30:00',
      paymentMethod: 'cash'
    },
    {
      id: '2',
      type: 'sale',
      amount: 1850,
      description: 'Customer purchase - Receipt #R002',
      branch: 'Main Store - Nairobi CBD',
      cashier: 'Alice Wanjiku',
      timestamp: '2024-08-17 14:25:00',
      paymentMethod: 'mpesa'
    },
    {
      id: '3',
      type: 'expense',
      amount: 500,
      description: 'Office supplies purchase',
      branch: 'Main Store - Nairobi CBD',
      cashier: 'Alice Wanjiku',
      timestamp: '2024-08-17 13:45:00',
      paymentMethod: 'cash'
    },
    {
      id: '4',
      type: 'sale',
      amount: 3200,
      description: 'Customer purchase - Receipt #W001',
      branch: 'Westlands Branch',
      cashier: 'John Kimani',
      timestamp: '2024-08-17 14:20:00',
      paymentMethod: 'card'
    },
    {
      id: '5',
      type: 'deposit',
      amount: 5000,
      description: 'Cash deposit from manager',
      branch: 'Westlands Branch',
      cashier: 'John Kimani',
      timestamp: '2024-08-17 12:00:00',
      paymentMethod: 'cash'
    }
  ]);

  const branches = ['all', 'Main Store - Nairobi CBD', 'Westlands Branch', 'Nakuru Branch', 'Mombasa Road Branch'];

  const filteredDrawers = selectedBranch === 'all' 
    ? cashDrawers 
    : cashDrawers.filter(drawer => drawer.branch === selectedBranch);

  const filteredTransactions = selectedBranch === 'all'
    ? transactions
    : transactions.filter(transaction => transaction.branch === selectedBranch);

  const totalCash = cashDrawers.reduce((sum, drawer) => sum + drawer.currentBalance, 0);
  const totalSales = cashDrawers.reduce((sum, drawer) => sum + drawer.totalSales, 0);
  const totalExpenses = cashDrawers.reduce((sum, drawer) => sum + drawer.totalExpenses, 0);
  const openDrawers = cashDrawers.filter(drawer => drawer.status === 'open').length;

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'sale': return '💰';
      case 'expense': return '💸';
      case 'deposit': return '📥';
      case 'withdrawal': return '📤';
      default: return '💳';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'sale': return 'text-green-600';
      case 'deposit': return 'text-blue-600';
      case 'expense': return 'text-red-600';
      case 'withdrawal': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash': return <Banknote className="h-3 w-3" />;
      case 'mpesa': return <CreditCard className="h-3 w-3" />;
      case 'card': return <CreditCard className="h-3 w-3" />;
      default: return <Banknote className="h-3 w-3" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1>Cash Management</h1>
          <p className="text-muted-foreground">Monitor cash flow and drawer operations</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isExpenseOpen} onOpenChange={setIsExpenseOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Record Expense
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Cash Expense</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Branch</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.slice(1).map(branch => (
                        <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Amount (KES)</Label>
                  <Input type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="What was this expense for?" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsExpenseOpen(false)}>Cancel</Button>
                <Button>Record Expense</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isReconcileOpen} onOpenChange={setIsReconcileOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Cash Reconciliation
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cash Drawer Reconciliation</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Branch</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.slice(1).map(branch => (
                        <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Actual Cash Count (KES)</Label>
                  <Input type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea placeholder="Any discrepancies or notes" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsReconcileOpen(false)}>Cancel</Button>
                <Button>Reconcile</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Cash</p>
                <p className="text-2xl">KES {totalCash.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">In all drawers</p>
              </div>
              <Banknote className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Daily Sales</p>
                <p className="text-2xl">KES {totalSales.toLocaleString()}</p>
                <p className="text-sm text-green-600">Today's revenue</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Daily Expenses</p>
                <p className="text-2xl">KES {totalExpenses.toLocaleString()}</p>
                <p className="text-sm text-red-600">Today's costs</p>
              </div>
              <TrendingDown className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Drawers</p>
                <p className="text-2xl">{openDrawers}</p>
                <p className="text-sm text-muted-foreground">Currently active</p>
              </div>
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="drawers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="drawers">Cash Drawers</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="drawers" className="space-y-6">
          <div className="flex items-center gap-4">
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {branches.map(branch => (
                  <SelectItem key={branch} value={branch}>
                    {branch === 'all' ? 'All Branches' : branch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredDrawers.map((drawer) => (
              <Card key={drawer.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{drawer.branch}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Cashier: {drawer.cashier}
                      </p>
                    </div>
                    <Badge variant={drawer.status === 'open' ? 'default' : 'secondary'}>
                      {drawer.status.charAt(0).toUpperCase() + drawer.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Opening Balance</p>
                      <p className="font-semibold">KES {drawer.openingBalance.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Balance</p>
                      <p className="font-semibold">KES {drawer.currentBalance.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Sales</p>
                      <p className="font-semibold text-green-600">KES {drawer.totalSales.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Expenses</p>
                      <p className="font-semibold text-red-600">KES {drawer.totalExpenses.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Opened:</span>
                      <span>{new Date(drawer.openedAt).toLocaleString()}</span>
                    </div>
                    {drawer.closedAt && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Closed:</span>
                        <span>{new Date(drawer.closedAt).toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-3 w-3 mr-2" />
                      View Details
                    </Button>
                    {drawer.status === 'open' && (
                      <Button size="sm" variant="outline">
                        Close Drawer
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <div className="flex items-center gap-4">
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {branches.map(branch => (
                  <SelectItem key={branch} value={branch}>
                    {branch === 'all' ? 'All Branches' : branch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="w-40">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <Card key={transaction.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getTransactionIcon(transaction.type)}</div>
                      <div>
                        <h4 className="font-medium">{transaction.description}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{transaction.branch}</span>
                          <span>{transaction.cashier}</span>
                          <div className="flex items-center gap-1">
                            {getPaymentMethodIcon(transaction.paymentMethod)}
                            {transaction.paymentMethod.charAt(0).toUpperCase() + transaction.paymentMethod.slice(1)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                        {transaction.type === 'expense' || transaction.type === 'withdrawal' ? '-' : '+'}
                        KES {transaction.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Method Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Banknote className="h-4 w-4" />
                      <span>Cash</span>
                    </div>
                    <span className="font-medium">65%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span>M-Pesa</span>
                    </div>
                    <span className="font-medium">25%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span>Card</span>
                    </div>
                    <span className="font-medium">10%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cash Flow Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Cash In:</span>
                    <span className="font-medium text-green-600">KES {totalSales.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Cash Out:</span>
                    <span className="font-medium text-red-600">KES {totalExpenses.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-medium">Net Cash Flow:</span>
                    <span className="font-semibold text-green-600">
                      KES {(totalSales - totalExpenses).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}