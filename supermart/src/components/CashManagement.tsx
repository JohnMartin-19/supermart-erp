import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Banknote, CreditCard, TrendingUp, TrendingDown, Plus, Calendar, Building2, Eye, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

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
  opening_balance: number;
  current_balance: number;
  total_sales: number;
  total_expenses: number;
  status: 'open' | 'closed';
  opened_at: string;
  closed_at?: string;
}

export function CashManagement() {
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedDate, setSelectedDate] = useState('today');
  const [isReconcileOpen, setIsReconcileOpen] = useState(false);
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);

  // States for fetching cash drawers
  const [cashDrawers, setCashDrawers] = useState<CashDrawer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States for the Record Expense form
  const [newExpense, setNewExpense] = useState({ branch: '', amount: 0, description: '' });
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [expenseError, setExpenseError] = useState<string | null>(null);
  const [expenseSuccess, setExpenseSuccess] = useState(false);

  // States for the Reconcile form
  const [reconciliation, setReconciliation] = useState({ branch: '', actual_count: 0, notes: '' });
  const [isReconciling, setIsReconciling] = useState(false);
  const [reconciliationError, setReconciliationError] = useState<string | null>(null);
  const [reconciliationSuccess, setReconciliationSuccess] = useState(false);

  // Mock data for transactions as no API endpoint was provided
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
  ]);

  const branches = ['all', ...Array.from(new Set(cashDrawers.map(d => d.branch)))];

  // Fetch cash drawers on component mount
  useEffect(() => {
    const fetchCashDrawers = async () => {
      try {
        const response = await fetch('http://murimart.localhost:8000/api/v1/cash/cash_drawers/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to fetch cash drawers.');
        }
        
        const data = await response.json();
        setCashDrawers(data);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCashDrawers();
  }, []);

  // Handlers for form submissions
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingExpense(true);
    setExpenseError(null);
    setExpenseSuccess(false);

    try {
      const payload = {
        amount: newExpense.amount,
        description: newExpense.description,
        branch: newExpense.branch,
        // Assuming cashier info comes from the backend or context
      };

      const response = await fetch('http://murimart.localhost:8000/api/v1/cash/cash_expenses/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || JSON.stringify(errorData) || 'Failed to record expense.');
      }
      
      setExpenseSuccess(true);
      setNewExpense({ branch: '', amount: 0, description: '' });

      // Refresh data after successful addition
      // Note: A more efficient approach would be to update the state directly
      setTimeout(() => {
        window.location.reload(); 
      }, 1000);

    } catch (err: any) {
      setExpenseError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsAddingExpense(false);
    }
  };

  const handleReconciliation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsReconciling(true);
    setReconciliationError(null);
    setReconciliationSuccess(false);

    try {
      const payload = {
        branch: reconciliation.branch,
        actual_count: reconciliation.actual_count,
        notes: reconciliation.notes,
        // Assuming cashier info comes from the backend or context
      };

      const response = await fetch('http://murimart.localhost:8000/api/v1/cash/cash_reconciliations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || JSON.stringify(errorData) || 'Failed to reconcile cash drawer.');
      }

      setReconciliationSuccess(true);
      setReconciliation({ branch: '', actual_count: 0, notes: '' });

      // Refresh data after successful reconciliation
      // Note: A more efficient approach would be to update the state directly
      setTimeout(() => {
        window.location.reload(); 
      }, 1000);

    } catch (err: any) {
      setReconciliationError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsReconciling(false);
    }
  };

  const filteredDrawers = selectedBranch === 'all' 
    ? cashDrawers 
    : cashDrawers.filter(drawer => drawer.branch === selectedBranch);

  const filteredTransactions = selectedBranch === 'all'
    ? transactions
    : transactions.filter(transaction => transaction.branch === selectedBranch);

  const totalCash = cashDrawers.reduce((sum, drawer) => sum + (drawer.current_balance || 0), 0);
  const totalSales = cashDrawers.reduce((sum, drawer) => sum + (drawer.total_sales || 0), 0);
  const totalExpenses = cashDrawers.reduce((sum, drawer) => sum + (drawer.total_expenses || 0), 0);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading cash drawers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

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
              <form onSubmit={handleAddExpense}>
                <div className="grid grid-cols-1 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="branch-expense">Branch</Label>
                    <Select
                      value={newExpense.branch}
                      onValueChange={(value) => setNewExpense({ ...newExpense, branch: value })}
                    >
                      <SelectTrigger id="branch-expense">
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
                    <Label htmlFor="amount-expense">Amount (KES)</Label>
                    <Input 
                      id="amount-expense" 
                      type="number" 
                      placeholder="0.00" 
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description-expense">Description</Label>
                    <Textarea 
                      id="description-expense" 
                      placeholder="What was this expense for?"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                      required
                    />
                  </div>
                </div>
                {isAddingExpense && (
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Recording expense...</span>
                  </div>
                )}
                {expenseError && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{expenseError}</AlertDescription>
                  </Alert>
                )}
                {expenseSuccess && (
                  <Alert className="mt-4 border-green-500">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>Expense recorded successfully!</AlertDescription>
                  </Alert>
                )}
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" type="button" onClick={() => setIsExpenseOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isAddingExpense}>
                    {isAddingExpense ? 'Recording...' : 'Record Expense'}
                  </Button>
                </div>
              </form>
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
              <form onSubmit={handleReconciliation}>
                <div className="grid grid-cols-1 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="branch-reconcile">Branch</Label>
                    <Select
                      value={reconciliation.branch}
                      onValueChange={(value) => setReconciliation({ ...reconciliation, branch: value })}
                    >
                      <SelectTrigger id="branch-reconcile">
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
                    <Label htmlFor="count-reconcile">Actual Cash Count (KES)</Label>
                    <Input 
                      id="count-reconcile" 
                      type="number" 
                      placeholder="0.00" 
                      value={reconciliation.actual_count}
                      onChange={(e) => setReconciliation({ ...reconciliation, actual_count: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes-reconcile">Notes</Label>
                    <Textarea 
                      id="notes-reconcile" 
                      placeholder="Any discrepancies or notes"
                      value={reconciliation.notes}
                      onChange={(e) => setReconciliation({ ...reconciliation, notes: e.target.value })}
                    />
                  </div>
                </div>
                {isReconciling && (
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Reconciling...</span>
                  </div>
                )}
                {reconciliationError && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{reconciliationError}</AlertDescription>
                  </Alert>
                )}
                {reconciliationSuccess && (
                  <Alert className="mt-4 border-green-500">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>Reconciliation successful!</AlertDescription>
                  </Alert>
                )}
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" type="button" onClick={() => setIsReconcileOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isReconciling}>
                    {isReconciling ? 'Reconciling...' : 'Reconcile'}
                  </Button>
                </div>
              </form>
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
                      <p className="font-semibold">KES {drawer.opening_balance.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Balance</p>
                      <p className="font-semibold">KES {drawer.current_balance.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Sales</p>
                      <p className="font-semibold text-green-600">KES {drawer.total_sales.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Expenses</p>
                      <p className="font-semibold text-red-600">KES {drawer.total_expenses.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Opened:</span>
                      <span>{new Date(drawer.opened_at).toLocaleString()}</span>
                    </div>
                    {drawer.closed_at && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Closed:</span>
                        <span>{new Date(drawer.closed_at).toLocaleString()}</span>
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