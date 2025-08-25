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

// Interface for a cash transaction, used for both sales and expenses
interface CashTransaction {
  id: string;
  type: 'sale' | 'expense' | 'deposit' | 'withdrawal';
  amount: number;
  description: string;
  branch: string;
  cashier: string;
  recorded_at: string;
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

// Interface for the fetched expense data
interface ExpenseData {
  id: string;
  branch: number; // Assuming branch is an ID
  cash_drawer: number;
  amount: string;
  description: string;
  recorded_at: string;
  tenant: number;
}


export function CashManagement() {
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedDate, setSelectedDate] = useState('today');
  const [isReconcileOpen, setIsReconcileOpen] = useState(false);
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);

  // States for fetched data
  const [cashDrawers, setCashDrawers] = useState<CashDrawer[]>([]);
  const [cashExpenses, setCashExpenses] = useState<ExpenseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States for the Record Expense form
  const [newExpense, setNewExpense] = useState({ cash_drawer_id: '', amount: 0, description: '' });
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [expenseError, setExpenseError] = useState<string | null>(null);
  const [expenseSuccess, setExpenseSuccess] = useState(false);

  // States for the Reconcile form
  const [reconciliation, setReconciliation] = useState({ cash_drawer_id: '', actual_count: 0, notes: '' });
  const [isReconciling, setIsReconciling] = useState(false);
  const [reconciliationError, setReconciliationError] = useState<string | null>(null);
  const [reconciliationSuccess, setReconciliationSuccess] = useState(false);

  // Mock sales data to be displayed alongside real expenses
  const [salesTransactions] = useState<CashTransaction[]>([
    {
      id: '1',
      type: 'sale',
      amount: 2450,
      description: 'Customer purchase - Receipt #R001',
      branch: 'Main Store - Nairobi CBD',
      cashier: 'Alice Wanjiku',
      recorded_at: '2025-08-26T09:30:00Z',
      paymentMethod: 'cash'
    },
    {
      id: '2',
      type: 'sale',
      amount: 1850,
      description: 'Customer purchase - Receipt #R002',
      branch: 'Main Store - Nairobi CBD',
      cashier: 'Alice Wanjiku',
      recorded_at: '2025-08-26T09:25:00Z',
      paymentMethod: 'mpesa'
    },
  ]);

  // Combined transactions for display
  const allTransactions: CashTransaction[] = [
    ...salesTransactions,
    ...cashExpenses.map(exp => ({
      id: exp.id,
      type: 'expense' as 'expense',
      amount: parseFloat(exp.amount),
      description: exp.description,
      branch: cashDrawers.find(d => d.id === String(exp.cash_drawer))?.branch || `Branch ${exp.branch}`,
      cashier: cashDrawers.find(d => d.id === String(exp.cash_drawer))?.cashier || 'N/A',
      recorded_at: exp.recorded_at,
      paymentMethod: 'cash' as 'cash',
    }))
  ].sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime());

  const branches = ['all', ...Array.from(new Set(cashDrawers.map(d => d.branch)))];

  // Fetch all required data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const drawersResponse = await fetch('http://murimart.localhost:8000/api/v1/cash/cash_drawers/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        const expensesResponse = await fetch('http://murimart.localhost:8000/api/v1/cash/cash_expenses/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        if (!drawersResponse.ok || !expensesResponse.ok) {
          const drawersError = !drawersResponse.ok ? await drawersResponse.json() : null;
          const expensesError = !expensesResponse.ok ? await expensesResponse.json() : null;
          throw new Error(drawersError?.detail || expensesError?.detail || 'Failed to fetch data.');
        }

        const drawersData = await drawersResponse.json();
        const expensesData = await expensesResponse.json();
        
        setCashDrawers(drawersData);
        setCashExpenses(expensesData);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handlers for form submissions
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingExpense(true);
    setExpenseError(null);
    setExpenseSuccess(false);

    try {
      const payload = {
        cash_drawer: newExpense.cash_drawer_id,
        amount: newExpense.amount,
        description: newExpense.description,
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
      setNewExpense({ cash_drawer_id: '', amount: 0, description: '' });

      // Refresh data after successful addition
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
        cash_drawer: reconciliation.cash_drawer_id,
        actual_cash_count: reconciliation.actual_count,
        notes: reconciliation.notes,
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
      setReconciliation({ cash_drawer_id: '', actual_count: 0, notes: '' });

      // Refresh data after successful reconciliation
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
    ? allTransactions
    : allTransactions.filter(transaction => transaction.branch === selectedBranch);

  const totalCash = cashDrawers.reduce((sum, drawer) => sum + (drawer.current_balance ?? 0), 0);
  const totalSales = salesTransactions.reduce((sum, sale) => sum + sale.amount, 0);

  // Calculate total expenses for the day
  const today = new Date().toLocaleDateString();
  const todayExpenses = cashExpenses
    .filter(exp => new Date(exp.recorded_at).toLocaleDateString() === today)
    .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

  const openDrawers = cashDrawers.filter(drawer => drawer.status === 'open').length;

  // Calculate total expenses per branch
  const totalExpensesByBranch = cashExpenses.reduce((map, exp) => {
    const branchName = cashDrawers.find(d => d.id === String(exp.cash_drawer))?.branch || `Branch ${exp.branch}`;
    const currentTotal = map.get(branchName) || 0;
    map.set(branchName, currentTotal + parseFloat(exp.amount));
    return map;
  }, new Map());


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
                    <Label htmlFor="cash-drawer-expense">Cash Drawer</Label>
                    <Select
                      value={newExpense.cash_drawer_id}
                      onValueChange={(value) => setNewExpense({ ...newExpense, cash_drawer_id: value })}
                    >
                      <SelectTrigger id="cash-drawer-expense">
                        <SelectValue placeholder="Select an open cash drawer" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Filter to show only currently open cash drawers */}
                        {cashDrawers
                          .filter(drawer => drawer.status === 'open')
                          .map(drawer => (
                            <SelectItem key={drawer.id} value={drawer.id}>
                              {drawer.branch} - {drawer.cashier}
                            </SelectItem>
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
                    <Label htmlFor="branch-reconcile">Cash Drawer</Label>
                    <Select
                      value={reconciliation.cash_drawer_id}
                      onValueChange={(value) => setReconciliation({ ...reconciliation, cash_drawer_id: value })}
                    >
                      <SelectTrigger id="branch-reconcile">
                        <SelectValue placeholder="Select an open cash drawer" />
                      </SelectTrigger>
                      <SelectContent>
                        {cashDrawers
                          .filter(drawer => drawer.status === 'open')
                          .map(drawer => (
                            <SelectItem key={drawer.id} value={drawer.id}>
                              {drawer.branch} - {drawer.cashier}
                            </SelectItem>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Cash</p>
                <p className="text-2xl">KES {(totalCash ?? 0).toLocaleString()}</p>
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
                <p className="text-2xl">KES {(totalSales ?? 0).toLocaleString()}</p>
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
                <p className="text-2xl">KES {(todayExpenses ?? 0).toLocaleString()}</p>
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
                      <p className="font-semibold">KES {(drawer.opening_balance ?? 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Balance</p>
                      <p className="font-semibold">KES {(drawer.current_balance ?? 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Sales</p>
                      <p className="font-semibold text-green-600">KES {(drawer.total_sales ?? 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Expenses</p>
                      <p className="font-semibold text-red-600">KES {(drawer.total_expenses ?? 0).toLocaleString()}</p>
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
                        {new Date(transaction.recorded_at).toLocaleString()}
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
                <CardTitle>Total Expenses by Branch</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from(totalExpensesByBranch).map(([branch, total]) => (
                    <div key={branch} className="flex justify-between items-center">
                      <span className="text-muted-foreground">{branch}</span>
                      <span className="font-medium text-red-600">KES {total.toLocaleString()}</span>
                    </div>
                  ))}
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
                    <span className="font-medium text-red-600">KES {todayExpenses.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-medium">Net Cash Flow:</span>
                    <span className="font-semibold text-green-600">
                      KES {(totalSales - todayExpenses).toLocaleString()}
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