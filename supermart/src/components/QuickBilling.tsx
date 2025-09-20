import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { Plus, Trash2, FileText, Download, Receipt, Loader2, AlertCircle } from 'lucide-react';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

// Interface for API response
interface BillResponse {
  id: string;
  bill_number: string;
  bill_date: string;
  vendor_name: string;
  subtotal: number;
  total_tax: number;
  total_amount: number;
}

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

interface CreatedBillOverview extends BillResponse {
  items: BillItem[];
  dueDate: string;
  notes: string;
  vendor_email: string;
  vendor_phone: string;
  vendor_address: string;
}

// Simple overlay component for loading state
const Overlay = ({ message }: { message: string }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center gap-4 text-center">
      <Loader2 className="h-10 w-10 text-primary animate-spin" />
      <h3 className="text-lg font-semibold">{message}</h3>
      <p className="text-sm text-muted-foreground">This may take a moment.</p>
    </div>
  </div>
);

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
  const [currentCashier, setCurrentCashier] = useState<string | null>(null);
  const [currentCompany, setCurrentCompany] = useState<string | null>(null);
  const [billNumber, setBillNumber] = useState(`BILL-${Date.now()}`);
  const [billDate, setBillDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdBill, setCreatedBill] = useState<CreatedBillOverview | null>(null);
  const [recentBills, setRecentBills] = useState<any[]>([]);
  const [isFetchingRecent, setIsFetchingRecent] = useState(false);
  const [recentBillsError, setRecentBillsError] = useState<string | null>(null);
  const tenantDomain = localStorage.getItem('tenant_domain')
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

  const handleCreateBill = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const payload = {
      bill_number: billNumber,
      bill_date: billDate,
      due_date: dueDate || null,
      notes: notes,
      vendor_name: vendorDetails.name,
      vendor_email: vendorDetails.email,
      vendor_phone: vendorDetails.phone,
      vendor_address: vendorDetails.address,
      vendor_gstin: vendorDetails.gstin,
      items: items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        tax_rate: item.taxRate,
      })),
    };
    const access_token = localStorage.getItem('access_token');
        if (access_token) {
          const payloadBase64 = access_token.split(".")[1];
          const decodedPayload = JSON.parse(atob(payloadBase64));
          if (decodedPayload.username && decodedPayload.company_name) {
            setCurrentCashier(decodedPayload.username);
            setCurrentCompany(decodedPayload.company_name)
          }
        }
    try {
      const response = await fetch(`http://${tenantDomain}:8000/api/v1/billing/bills/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || JSON.stringify(errorData) || 'Failed to create bill.');
      }

      const newBill = await response.json();

      // Normalize backend response to match frontend state
      const normalizedItems = newBill.items.map((item: any) => ({
        ...item,
        taxRate: item.tax_rate,
        amount: Number(item.quantity) * Number(item.rate),
      }));

      setTimeout(() => {
        setCreatedBill({
          ...newBill,
          items: normalizedItems,
          dueDate: newBill.due_date,
          notes: newBill.notes,
          vendor_email: newBill.vendor_email,
          vendor_phone: newBill.vendor_phone,
          vendor_address: newBill.vendor_address,
        });
        setIsLoading(false);
      }, 7000);

    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'An unexpected error occurred.');
    }
  };

  useEffect(() => {
    if (activeTab === 'recent-bills') {
      const fetchRecentBills = async () => {
        setIsFetchingRecent(true);
        setRecentBillsError(null);
        try {
          const response = await fetch(`http://${tenantDomain}:8000/api/v1/billing/bills/`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch recent bills.');
          }

          const data = await response.json();
          setRecentBills(data);
        } catch (err: any) {
          setRecentBillsError(err.message);
        } finally {
          setIsFetchingRecent(false);
        }
      };

      fetchRecentBills();
    }
  }, [activeTab]);

  if (createdBill) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1>Bill Overview</h1>
          <Button onClick={() => setCreatedBill(null)} variant="outline">Create New Bill</Button>
        </div>
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-xl font-bold"> {currentCompany}</h2>
                <p className="text-muted-foreground">
                  <br />
                  served by:{currentCashier}
                </p>
              </div>
              <div className="text-right">
                <h2 className="text-3xl font-bold text-primary mb-2">BILL</h2>
                <p><strong>Bill #:</strong> {createdBill.bill_number}</p>
                <p><strong>Date:</strong> {createdBill.bill_date}</p>
                <p><strong>Due Date:</strong> {createdBill.dueDate || 'N/A'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <h3 className="text-md font-bold text-muted-foreground mb-2">Bill To:</h3>
                <p>{createdBill.vendor_name}</p>
                <p>{createdBill.vendor_address}</p>
                <p>Email: {createdBill.vendor_email}</p>
                <p>Phone: {createdBill.vendor_phone}</p>
              </div>
            </div>

            <div className="w-full overflow-x-auto mb-8">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-2 text-left text-sm font-medium text-muted-foreground">Description</th>
                    <th className="p-2 text-right text-sm font-medium text-muted-foreground">Qty</th>
                    <th className="p-2 text-right text-sm font-medium text-muted-foreground">Rate</th>
                    <th className="p-2 text-right text-sm font-medium text-muted-foreground">Tax</th>
                    <th className="p-2 text-right text-sm font-medium text-muted-foreground">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {createdBill.items.map((item, index) => (
                    <tr key={index} className="border-b last:border-b-0">
                      <td className="p-2 text-left">{item.description}</td>
                      <td className="p-2 text-right">{item.quantity}</td>
                      <td className="p-2 text-right">KSH{Number(item.rate).toFixed(2)}</td>
                      <td className="p-2 text-right">{item.taxRate}%</td>
                      <td className="p-2 text-right">KSH{Number(item.amount).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mb-8">
              <div className="w-full sm:w-80">
                <div className="flex justify-between py-1">
                  <span>Subtotal:</span>
                  <span>KSH{Number(createdBill.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Tax:</span>
                  <span>KSH{Number(createdBill.total_tax).toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>KSH{Number(createdBill.total_amount).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {createdBill.notes && (
              <div>
                <h3 className="text-md font-bold mb-2">Notes:</h3>
                <p className="text-muted-foreground">{createdBill.notes}</p>
              </div>
            )}

          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 relative">
      {isLoading && <Overlay message="Creating bill, please be patient..." />}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1>Quick Billing</h1>
          <p className="text-muted-foreground">Create and manage bills efficiently</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create-bill">Create Bill</TabsTrigger>
          <TabsTrigger value="recent-bills">Recent Bills</TabsTrigger>
          <TabsTrigger value="bill-management">Management</TabsTrigger>
        </TabsList>

        <TabsContent value="create-bill" className="space-y-6">
          <form onSubmit={handleCreateBill}>
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
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
                    <Button onClick={addItem} type="button" size="sm" className="gap-2">
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
                              type="button"
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
                            <Label>Rate (KSH)</Label>
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
                            <Label>Amount (KSH)</Label>
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
                
                <Card>
                  <CardHeader>
                    <CardTitle>Bill Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>KSH{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Tax:</span>
                        <span>KSH{totalTax.toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span>Total Amount:</span>
                        <span>KSH{total.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button 
                        type="submit"
                        className="flex-1 gap-2"
                        disabled={isLoading}
                      >
                        <FileText className="w-4 h-4" />
                        Create Bill
                      </Button>
                      <Button variant="outline" type="button" className="gap-2">
                        <Download className="w-4 h-4" />
                        Preview
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="recent-bills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bills</CardTitle>
            </CardHeader>
            <CardContent>
              {isFetchingRecent ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  <span className="text-muted-foreground">Loading bills...</span>
                </div>
              ) : recentBillsError ? (
                <div className="flex items-center gap-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  <span>{recentBillsError}</span>
                </div>
              ) : recentBills.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">No recent bills found.</div>
              ) : (
                <div className="space-y-4">
                  {recentBills.map((bill) => (
                    <div key={bill.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{bill.bill_number}</h4>
                        <p className="text-sm text-muted-foreground">{bill.vendor_name}</p>
                        <p className="text-xs text-muted-foreground">{bill.bill_date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">KSH{bill.total_amount.toFixed(2)}</p>
                        <Badge className={getStatusColor(bill.status || 'pending')}>
                          {bill.status || 'pending'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                <p className="text-sm text-muted-foreground">Total: KSH2,45,000</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Overdue Bills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">3</div>
                <p className="text-sm text-muted-foreground">Total: KSH45,000</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Paid This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">KSH8,90,000</div>
                <p className="text-sm text-muted-foreground">45 bills processed</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}