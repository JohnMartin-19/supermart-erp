import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Progress } from './ui/progress';
import { 
  FileText, 
  Calendar, 
  AlertCircle,
  CheckCircle,
  Download,
  Upload,
  Calculator
} from 'lucide-react';

export function TaxCompliance() {
  const [selectedTab, setSelectedTab] = useState('gst');

  const gstReturns = [
    { period: 'January 2025', type: 'GSTR-1', dueDate: '2025-02-11', status: 'pending', amount: 44260 },
    { period: 'January 2025', type: 'GSTR-3B', dueDate: '2025-02-20', status: 'pending', amount: 52340 },
    { period: 'December 2024', type: 'GSTR-1', dueDate: '2025-01-11', status: 'filed', amount: 38750 },
    { period: 'December 2024', type: 'GSTR-3B', dueDate: '2025-01-20', status: 'filed', amount: 45230 },
  ];

  const tdsReturns = [
    { period: 'Q3 FY2025', type: 'TDS Return', dueDate: '2025-01-31', status: 'pending', amount: 12340 },
    { period: 'Q2 FY2025', type: 'TDS Return', dueDate: '2024-10-31', status: 'filed', amount: 9870 },
    { period: 'Q1 FY2025', type: 'TDS Return', dueDate: '2024-07-31', status: 'filed', amount: 11250 },
  ];

  const taxSummary = {
    gstCollected: 44260,
    gstPaid: 8450,
    gstBalance: 35810,
    tdsDeducted: 12340,
    tdsDeposited: 9870,
    tdsBalance: 2470,
    totalTaxLiability: 38280
  };

  const upcomingDeadlines = [
    { type: 'GST GSTR-1', period: 'January 2025', dueDate: '2025-02-11', daysLeft: 14 },
    { type: 'GST GSTR-3B', period: 'January 2025', dueDate: '2025-02-20', daysLeft: 23 },
    { type: 'TDS Return', period: 'Q3 FY2025', dueDate: '2025-01-31', daysLeft: 3 },
    { type: 'Income Tax Return', period: 'FY2024-25', dueDate: '2025-07-31', daysLeft: 184 },
  ];

  const getDaysLeftBadge = (daysLeft: number) => {
    if (daysLeft <= 3) return 'destructive';
    if (daysLeft <= 7) return 'secondary';
    return 'default';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Tax Compliance</h1>
          <p className="text-muted-foreground">Manage GST, TDS, and VAT compliance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calculator className="w-4 h-4 mr-2" />
            Tax Calculator
          </Button>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            File Return
          </Button>
        </div>
      </div>

      {/* Tax Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">GST Collected</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{taxSummary.gstCollected.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TDS Deducted</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{taxSummary.tdsDeducted.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current quarter</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tax Liability</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">₹{taxSummary.totalTaxLiability.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Outstanding amount</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">95%</div>
            <p className="text-xs text-muted-foreground">On-time filings</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Deadlines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Upcoming Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingDeadlines.map((deadline, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">{deadline.type}</p>
                  <p className="text-sm text-muted-foreground">{deadline.period}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{deadline.dueDate}</p>
                  <Badge variant={getDaysLeftBadge(deadline.daysLeft)} className="text-xs">
                    {deadline.daysLeft} days left
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="gst">GST Returns</TabsTrigger>
          <TabsTrigger value="tds">TDS Returns</TabsTrigger>
          <TabsTrigger value="summary">Tax Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="gst" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>GST Return Filing</CardTitle>
              <div className="flex gap-2">
                <Button size="sm">Generate GSTR-1</Button>
                <Button size="sm" variant="outline">Generate GSTR-3B</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Return Type</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gstReturns.map((return_, index) => (
                    <TableRow key={index}>
                      <TableCell>{return_.period}</TableCell>
                      <TableCell>{return_.type}</TableCell>
                      <TableCell>{return_.dueDate}</TableCell>
                      <TableCell className="text-right">₹{return_.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={return_.status === 'filed' ? 'default' : 'secondary'}>
                          {return_.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                          {return_.status === 'pending' && (
                            <Button size="sm">File Return</Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tds" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>TDS Return Filing</CardTitle>
              <Button>Generate TDS Return</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Return Type</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tdsReturns.map((return_, index) => (
                    <TableRow key={index}>
                      <TableCell>{return_.period}</TableCell>
                      <TableCell>{return_.type}</TableCell>
                      <TableCell>{return_.dueDate}</TableCell>
                      <TableCell className="text-right">₹{return_.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={return_.status === 'filed' ? 'default' : 'secondary'}>
                          {return_.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                          {return_.status === 'pending' && (
                            <Button size="sm">File Return</Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>GST Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>GST Collected</span>
                  <span className="font-medium">₹{taxSummary.gstCollected.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST Paid</span>
                  <span className="font-medium">₹{taxSummary.gstPaid.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-medium">
                    <span>Net GST Liability</span>
                    <span>₹{taxSummary.gstBalance.toLocaleString()}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Payment Progress</span>
                    <span>76%</span>
                  </div>
                  <Progress value={76} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>TDS Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>TDS Deducted</span>
                  <span className="font-medium">₹{taxSummary.tdsDeducted.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>TDS Deposited</span>
                  <span className="font-medium">₹{taxSummary.tdsDeposited.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-medium">
                    <span>TDS Payable</span>
                    <span>₹{taxSummary.tdsBalance.toLocaleString()}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Deposit Progress</span>
                    <span>80%</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tax Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Monthly</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• GSTR-1 (11th)</li>
                    <li>• GSTR-3B (20th)</li>
                    <li>• TDS Payment (7th)</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Quarterly</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• TDS Return (31st)</li>
                    <li>• GSTR-2A Review</li>
                    <li>• Advance Tax (15th)</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Annually</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Income Tax Return</li>
                    <li>• GSTR-9 (31st Dec)</li>
                    <li>• Form 26AS</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Special</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Composition Scheme</li>
                    <li>• E-way Bills</li>
                    <li>• HSN Summary</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}