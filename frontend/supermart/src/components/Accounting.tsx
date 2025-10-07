import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Plus, 
  Download, 
  Filter, 
  Search,
  FileText,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

export function Accounting() {
  const [selectedTab, setSelectedTab] = useState('ledger');

  const ledgerEntries = [
    { id: 'LE001', date: '2025-01-28', account: 'Sales Revenue', debit: 0, credit: 45000, description: 'Payment from Tech Solutions Ltd' },
    { id: 'LE002', date: '2025-01-28', account: 'Office Expenses', debit: 2500, credit: 0, description: 'Office supplies purchase' },
    { id: 'LE003', date: '2025-01-27', account: 'Accounts Receivable', debit: 32500, credit: 0, description: 'Invoice to Global Industries' },
    { id: 'LE004', date: '2025-01-27', account: 'GST Payable', debit: 0, credit: 5850, description: 'GST on sales' },
  ];

  const invoices = [
    { id: 'INV-001', client: 'Tech Solutions Ltd', amount: 45000, gst: 8100, total: 53100, status: 'paid', date: '2025-01-28' },
    { id: 'INV-002', client: 'Global Industries', amount: 32500, gst: 5850, total: 38350, status: 'pending', date: '2025-01-27' },
    { id: 'INV-003', client: 'Metro Systems', amount: 18750, gst: 3375, total: 22125, status: 'overdue', date: '2025-01-25' },
  ];

  const reports = [
    { name: 'Profit & Loss Statement', description: 'Monthly P&L report', period: 'January 2025' },
    { name: 'Balance Sheet', description: 'Financial position statement', period: 'As of Jan 28, 2025' },
    { name: 'Cash Flow Statement', description: 'Cash inflows and outflows', period: 'January 2025' },
    { name: 'GST Report', description: 'GST summary and details', period: 'January 2025' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Accounting</h1>
          <p className="text-muted-foreground">Manage your financial records and reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>New Ledger Entry</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="account">Account</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">Sales Revenue</SelectItem>
                        <SelectItem value="expenses">Office Expenses</SelectItem>
                        <SelectItem value="receivables">Accounts Receivable</SelectItem>
                        <SelectItem value="gst">GST Payable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="debit">Debit Amount</Label>
                    <Input id="debit" type="number" placeholder="0" />
                  </div>
                  <div>
                    <Label htmlFor="credit">Credit Amount</Label>
                    <Input id="credit" type="number" placeholder="0" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter description..." />
                </div>
                <Button className="w-full">Add Entry</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ledger">Ledger</TabsTrigger>
          <TabsTrigger value="invoices">GST Invoices</TabsTrigger>
          <TabsTrigger value="reports">Financial Reports</TabsTrigger>
          <TabsTrigger value="accounts">Chart of Accounts</TabsTrigger>
        </TabsList>

        <TabsContent value="ledger" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Ledger</CardTitle>
              <div className="flex gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search entries..." className="pl-9" />
                </div>
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Accounts</SelectItem>
                    <SelectItem value="sales">Sales Revenue</SelectItem>
                    <SelectItem value="expenses">Expenses</SelectItem>
                    <SelectItem value="assets">Assets</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Entry ID</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Debit</TableHead>
                    <TableHead className="text-right">Credit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ledgerEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>{entry.id}</TableCell>
                      <TableCell>{entry.account}</TableCell>
                      <TableCell>{entry.description}</TableCell>
                      <TableCell className="text-right">
                        {entry.debit > 0 ? `KSH {entry.debit.toLocaleString()}` : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {entry.credit > 0 ? `KSH {entry.credit.toLocaleString()}` : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>GST Invoices</CardTitle>
              <Button className="ml-auto">
                <Plus className="w-4 h-4 mr-2" />
                Create Invoice
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">GST</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.id}</TableCell>
                      <TableCell>{invoice.client}</TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell className="text-right">KSH {invoice.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-right">KSH {invoice.gst.toLocaleString()}</TableCell>
                      <TableCell className="text-right">KSH{invoice.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={
                          invoice.status === 'paid' ? 'default' : 
                          invoice.status === 'pending' ? 'secondary' : 'destructive'
                        }>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((report, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    {report.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                  <p className="text-xs text-muted-foreground mb-4">Period: {report.period}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button size="sm">View</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chart of Accounts</CardTitle>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Account
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Assets', 'Liabilities', 'Equity', 'Revenue', 'Expenses'].map((category) => (
                  <div key={category} className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">{category}</h3>
                    <div className="space-y-2 ml-4">
                      {category === 'Assets' && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span>Cash and Bank</span>
                            <span>KSH 1,25,000</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Accounts Receivable</span>
                            <span>KSH 85,500</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Inventory</span>
                            <span>KSH 2,45,000</span>
                          </div>
                        </>
                      )}
                      {category === 'Revenue' && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span>Sales Revenue</span>
                            <span>KSH 2,45,890</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Service Revenue</span>
                            <span>KSH45,000</span>
                          </div>
                        </>
                      )}
                      {category === 'Expenses' && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span>Office Expenses</span>
                            <span>KSH 25,000</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Salaries</span>
                            <span>KSH 1,80,000</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}