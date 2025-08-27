import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { CreditCard, DollarSign, ArrowUpRight, ArrowDownLeft, CheckCircle, Clock, Search } from 'lucide-react';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';

interface Payment {
  id: string;
  type: 'received' | 'made';
  amount: number;
  party: string;
  method: string;
  date: string;
  reference: string;
  status: 'completed' | 'pending' | 'failed';
  description: string;
}

export function QuickPayment() {
  const [activeTab, setActiveTab] = useState('record-payment');
  const [paymentType, setPaymentType] = useState<'received' | 'made'>('received');
  const [formData, setFormData] = useState({
    amount: '',
    party: '',
    method: 'cash',
    date: new Date().toISOString().split('T')[0],
    reference: '',
    description: '',
    invoiceNumber: '',
  });

  const [recentPayments] = useState<Payment[]>([
    {
      id: '1',
      type: 'received',
      amount: 50000,
      party: 'ABC Corp',
      method: 'Bank Transfer',
      date: '2025-01-27',
      reference: 'TXN123456',
      status: 'completed',
      description: 'Payment for Invoice #INV-001',
    },
    {
      id: '2',
      type: 'made',
      amount: 25000,
      party: 'XYZ Suppliers',
      method: 'Cheque',
      date: '2025-01-26',
      reference: 'CHQ789012',
      status: 'pending',
      description: 'Payment for raw materials',
    },
    {
      id: '3',
      type: 'received',
      amount: 75000,
      party: 'PQR Ltd',
      method: 'UPI',
      date: '2025-01-25',
      reference: 'UPI345678',
      status: 'completed',
      description: 'Advance payment',
    },
  ]);

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Payment recorded:', { ...formData, type: paymentType });
    // Reset form
    setFormData({
      amount: '',
      party: '',
      method: 'cash',
      date: new Date().toISOString().split('T')[0],
      reference: '',
      description: '',
      invoiceNumber: '',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const totalReceived = recentPayments
    .filter(p => p.type === 'received' && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalMade = recentPayments
    .filter(p => p.type === 'made' && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPayments = recentPayments.filter(p => p.status === 'pending').length;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1>Quick Payment</h1>
          <p className="text-muted-foreground">Record payments received and made</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={paymentType === 'received' ? 'default' : 'outline'}
            onClick={() => setPaymentType('received')}
            className="gap-2"
          >
            <ArrowDownLeft className="w-4 h-4" />
            Payment Received
          </Button>
          <Button 
            variant={paymentType === 'made' ? 'default' : 'outline'}
            onClick={() => setPaymentType('made')}
            className="gap-2"
          >
            <ArrowUpRight className="w-4 h-4" />
            Payment Made
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Received</p>
                <p className="text-2xl font-bold text-green-600">KSH{totalReceived.toLocaleString()}</p>
              </div>
              <ArrowDownLeft className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Made</p>
                <p className="text-2xl font-bold text-red-600">KSH{totalMade.toLocaleString()}</p>
              </div>
              <ArrowUpRight className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingPayments}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="record-payment">Record Payment</TabsTrigger>
          <TabsTrigger value="recent-payments">Recent Payments</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="record-payment" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {paymentType === 'received' ? (
                    <>
                      <ArrowDownLeft className="w-5 h-5 text-green-600" />
                      Record Payment Received
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="w-5 h-5 text-red-600" />
                      Record Payment Made
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="amount">Amount (KSH)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount"
                        value={formData.amount}
                        onChange={(e) => updateFormData('amount', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => updateFormData('date', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="party">
                      {paymentType === 'received' ? 'Customer/Party' : 'Vendor/Party'}
                    </Label>
                    <Input
                      id="party"
                      placeholder={paymentType === 'received' ? 'Enter customer name' : 'Enter vendor name'}
                      value={formData.party}
                      onChange={(e) => updateFormData('party', e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="method">Payment Method</Label>
                      <Select
                        value={formData.method}
                        onValueChange={(value) => updateFormData('method', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                          <SelectItem value="cheque">Cheque</SelectItem>
                          <SelectItem value="upi">UPI</SelectItem>
                          <SelectItem value="card">Credit/Debit Card</SelectItem>
                          <SelectItem value="wallet">Digital Wallet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="reference">Reference Number</Label>
                      <Input
                        id="reference"
                        placeholder="Transaction/Cheque number"
                        value={formData.reference}
                        onChange={(e) => updateFormData('reference', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="invoiceNumber">Invoice Number (Optional)</Label>
                    <Input
                      id="invoiceNumber"
                      placeholder="Related invoice number"
                      value={formData.invoiceNumber}
                      onChange={(e) => updateFormData('invoiceNumber', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Payment description or notes"
                      value={formData.description}
                      onChange={(e) => updateFormData('description', e.target.value)}
                    />
                  </div>

                  <Button type="submit" className="w-full gap-2">
                    <DollarSign className="w-4 h-4" />
                    Record Payment
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <DollarSign className="h-4 w-4" />
                  <AlertDescription>
                    Recording a <strong>{paymentType}</strong> payment of{' '}
                    <strong>KSH{formData.amount || '0'}</strong>
                    {formData.party && (
                      <>
                        {' '}{paymentType === 'received' ? 'from' : 'to'}{' '}
                        <strong>{formData.party}</strong>
                      </>
                    )}
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <h4>Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Search className="w-4 h-4" />
                      Find Invoice
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <CreditCard className="w-4 h-4" />
                      Add Bank Details
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4>Payment Guidelines</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Ensure all payment details are accurate</li>
                    <li>• Keep reference numbers for tracking</li>
                    <li>• Link payments to invoices when possible</li>
                    <li>• Verify bank account details for transfers</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recent-payments" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Payments</CardTitle>
              <div className="flex gap-2">
                <Input placeholder="Search payments..." className="w-64" />
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {payment.type === 'received' ? (
                          <ArrowDownLeft className="w-5 h-5 text-green-600" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-red-600" />
                        )}
                        {getStatusIcon(payment.status)}
                      </div>
                      <div>
                        <h4 className="font-medium">{payment.party}</h4>
                        <p className="text-sm text-muted-foreground">{payment.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {payment.method} • {payment.reference} • {payment.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${payment.type === 'received' ? 'text-green-600' : 'text-red-600'}`}>
                        {payment.type === 'received' ? '+' : '-'}KSH{payment.amount.toLocaleString()}
                      </p>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-methods" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { method: 'Bank Transfer', icon: CreditCard, description: 'Direct bank to bank transfer', fees: 'Usually free' },
              { method: 'UPI', icon: DollarSign, description: 'Unified Payments Interface', fees: 'Free for most transactions' },
              { method: 'Cheque', icon: CreditCard, description: 'Traditional cheque payments', fees: 'Bank charges may apply' },
              { method: 'Cash', icon: DollarSign, description: 'Physical cash transactions', fees: 'No fees' },
              { method: 'Credit/Debit Card', icon: CreditCard, description: 'Card payments', fees: '1-3% processing fee' },
              { method: 'Digital Wallet', icon: DollarSign, description: 'PayTM, PhonePe, etc.', fees: 'Varies by provider' },
            ].map((method) => (
              <Card key={method.method}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <method.icon className="w-6 h-6 text-primary" />
                    <h3 className="font-medium">{method.method}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                  <p className="text-xs text-muted-foreground">Fees: {method.fees}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}