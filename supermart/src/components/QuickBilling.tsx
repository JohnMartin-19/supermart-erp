import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { Plus, Trash2, FileText, Download, Receipt } from 'lucide-react';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface BillItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  taxRate: number;
  amount: number;
}

interface VendorDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  gstin: string;
}

export function QuickBilling() {
  const [activeTab, setActiveTab] = useState('create-bill');
  const [vendorDetails, setVendorDetails] = useState<VendorDetails>({
    name: '',
    email: '',
    phone: '',
    address: '',
    gstin: ''
  });

  const [items, setItems] = useState<BillItem[]>([
    {
      id: '1',
      description: '',
      quantity: 1,
      rate: 0,
      taxRate: 18,
      amount: 0
    }
  ]);

  const [billNumber, setBillNumber] = useState(`BILL-${Date.now()}`);
  const [billDate, setBillDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  const addItem = () => {
    const newItem: BillItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      taxRate: 18,
      amount: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof BillItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const totalTax = items.reduce((sum, item) => sum + (item.amount * item.taxRate / 100), 0);
  const total = subtotal + totalTax;

  const recentBills = [
    {
      id: 'BILL-001',
      vendor: 'ABC Suppliers',
      amount: '₹45,000',
      date: '2025-01-25',
      status: 'pending',
    },
    {
      id: 'BILL-002',
      vendor: 'XYZ Materials',
      amount: '₹32,500',
      date: '2025-01-24',
      status: 'paid',
    },
    {
      id: 'BILL-003',
      vendor: 'PQR Services',
      amount: '₹18,750',
      date: '2025-01-23',
      status: 'overdue',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1>Quick Billing</h1>
          <p className="text-muted-foreground">Create and manage bills efficiently</p>
        </div>
        <Button className="gap-2 bg-green-600 hover:bg-green-700">
          <Receipt className="w-4 h-4" />
          New Bill
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create-bill">Create Bill</TabsTrigger>
          <TabsTrigger value="recent-bills">Recent Bills</TabsTrigger>
          <TabsTrigger value="bill-management">Management</TabsTrigger>
        </TabsList>

        <TabsContent value="create-bill" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Bill Details */}
            <div className="space-y-6">
              {/* Bill Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Bill Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="billNumber">Bill Number</Label>
                      <Input
                        id="billNumber"
                        value={billNumber}
                        onChange={(e) => setBillNumber(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="billDate">Bill Date</Label>
                      <Input
                        id="billDate"
                        type="date"
                        value={billDate}
                        onChange={(e) => setBillDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Vendor Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Vendor Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="vendorName">Vendor Name</Label>
                    <Input
                      id="vendorName"
                      value={vendorDetails.name}
                      onChange={(e) => setVendorDetails({...vendorDetails, name: e.target.value})}
                      placeholder="Enter vendor name"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="vendorEmail">Email</Label>
                      <Input
                        id="vendorEmail"
                        type="email"
                        value={vendorDetails.email}
                        onChange={(e) => setVendorDetails({...vendorDetails, email: e.target.value})}
                        placeholder="vendor@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vendorPhone">Phone</Label>
                      <Input
                        id="vendorPhone"
                        value={vendorDetails.phone}
                        onChange={(e) => setVendorDetails({...vendorDetails, phone: e.target.value})}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="vendorAddress">Address</Label>
                    <Textarea
                      id="vendorAddress"
                      value={vendorDetails.address}
                      onChange={(e) => setVendorDetails({...vendorDetails, address: e.target.value})}
                      placeholder="Enter vendor address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vendorGstin">GSTIN</Label>
                    <Input
                      id="vendorGstin"
                      value={vendorDetails.gstin}
                      onChange={(e) => setVendorDetails({...vendorDetails, gstin: e.target.value})}
                      placeholder="22AAAAA0000A1Z5"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Items */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Bill Items</CardTitle>
                  <Button onClick={addItem} size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Item
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item, index) => (
                    <div key={item.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Item {index + 1}</span>
                        {items.length > 1 && (
                          <Button
                            onClick={() => removeItem(item.id)}
                            size="sm"
                            variant="outline"
                            className="gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                      
                      <div>
                        <Label>Description</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          placeholder="Item description"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Quantity</Label>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div>
                          <Label>Rate (₹)</Label>
                          <Input
                            type="number"
                            value={item.rate}
                            onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Tax Rate (%)</Label>
                          <Select
                            value={item.taxRate.toString()}
                            onValueChange={(value: string) => updateItem(item.id, 'taxRate', parseFloat(value))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">0%</SelectItem>
                              <SelectItem value="5">5%</SelectItem>
                              <SelectItem value="12">12%</SelectItem>
                              <SelectItem value="18">18%</SelectItem>
                              <SelectItem value="28">28%</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Amount (₹)</Label>
                          <Input
                            value={item.amount.toFixed(2)}
                            disabled
                            className="bg-muted"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Totals Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Bill Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Tax:</span>
                      <span>₹{totalTax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span>Total Amount:</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button className="flex-1 gap-2">
                      <FileText className="w-4 h-4" />
                      Create Bill
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Download className="w-4 h-4" />
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="recent-bills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBills.map((bill) => (
                  <div key={bill.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{bill.id}</h4>
                      <p className="text-sm text-muted-foreground">{bill.vendor}</p>
                      <p className="text-xs text-muted-foreground">{bill.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{bill.amount}</p>
                      <Badge className={getStatusColor(bill.status)}>
                        {bill.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bill-management" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Bills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12</div>
                <p className="text-sm text-muted-foreground">Total: ₹2,45,000</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Overdue Bills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">3</div>
                <p className="text-sm text-muted-foreground">Total: ₹45,000</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Paid This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">₹8,90,000</div>
                <p className="text-sm text-muted-foreground">45 bills processed</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}