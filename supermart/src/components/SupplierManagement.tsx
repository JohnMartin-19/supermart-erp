import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Truck, Plus, Search, Phone, MapPin, Package, Calendar, AlertTriangle, CheckCircle, Loader2, X, PlusCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface Supplier {
  id: string;
  company_name: string;
  contact_person: string;
  phone_number: string;
  email?: string;
  address: string;
  city: string;
  category: string;
  status: 'active' | 'inactive' | 'pending';
  payment_terms: string;
  credit_limit: number;
  current_balance: number;
  last_delivery: string;
  total_orders: number;
  rating: number;
  products: string[];
  is_active: boolean; 
}

interface PurchaseOrder {
  id: string;
  supplier: string;
  order_date: string;
  delivery_date: string;
  status: 'pending' | 'approved' | 'delivered' | 'cancelled';
  total_amount: number;
  items: { product: string; quantity: number; unit_price: number }[];
}

export function SupplierManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [newSupplier, setNewSupplier] = useState({
    company_name: '',
    contact_person: '',
    phone_number: '',
    email: '',
    address: '',
    city: '',
    category: '',
    payment_terms: '',
    credit_limit: 0,
  });

  const [isAdding, setIsAdding] = useState(false);
  const [addSupplierError, setAddSupplierError] = useState<string | null>(null);
  const [addSupplierSuccess, setAddSupplierSuccess] = useState(false);

  // State for the new purchase order form
  const [newOrder, setNewOrder] = useState({
    supplier_id: '',
    delivery_date: '',
    items: [{ product: '', quantity: 0, unit_price: 0 }],
  });
  const [isCreating, setIsCreating] = useState(false);
  const [createOrderError, setCreateOrderError] = useState<string | null>(null);
  const [createOrderSuccess, setCreateOrderSuccess] = useState(false);

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: 'PO-001',
      supplier: 'Fresh Produce Supplies Ltd',
      order_date: '2024-08-17',
      delivery_date: '2024-08-18',
      status: 'approved',
      total_amount: 85000,
      items: [
        { product: 'Tomatoes', quantity: 50, unit_price: 800 },
        { product: 'Onions', quantity: 30, unit_price: 1500 }
      ]
    },
    {
      id: 'PO-002',
      supplier: 'Dairy Coop Kenya',
      order_date: '2024-08-16',
      delivery_date: '2024-08-17',
      status: 'delivered',
      total_amount: 125000,
      items: [
        { product: 'Milk 1L', quantity: 100, unit_price: 55 },
        { product: 'Yogurt', quantity: 50, unit_price: 120 }
      ]
    },
    {
      id: 'PO-003',
      supplier: 'Grain Distributors East Africa',
      order_date: '2024-08-15',
      delivery_date: '2024-08-19',
      status: 'pending',
      total_amount: 180000,
      items: [
        { product: 'Rice 2kg', quantity: 100, unit_price: 140 },
        { product: 'Wheat Flour 1kg', quantity: 200, unit_price: 80 }
      ]
    }
  ]);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('http://murimart.localhost:8000/api/v1/suppliers/suppliers/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch suppliers.');
      }

      const data = await response.json();
      setSuppliers(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    setAddSupplierError(null);
    setAddSupplierSuccess(false);

    try {
      const payload = {
        ...newSupplier,
        credit_limit: Number(newSupplier.credit_limit), 
        is_active: true,
      };

      const response = await fetch('http://murimart.localhost:8000/api/v1/suppliers/suppliers/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || JSON.stringify(errorData) || 'Failed to add supplier.');
      }

      const addedSupplier: Supplier = await response.json();
      
      setSuppliers(prevSuppliers => [...prevSuppliers, addedSupplier]);
      setAddSupplierSuccess(true);

      setNewSupplier({
        company_name: '',
        contact_person: '',
        phone_number: '',
        email: '',
        address: '',
        city: '',
        category: '',
        payment_terms: '',
        credit_limit: 0,
      });

    } catch (err: any) {
      setAddSupplierError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsAdding(false);
      setTimeout(() => {
        setIsAddSupplierOpen(false);
      }, 1500);
    }
  };
  
  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setCreateOrderError(null);
    setCreateOrderSuccess(false);

    // Filter out empty items
    const validItems = newOrder.items.filter(item => item.product && item.quantity > 0 && item.unit_price > 0);

    if (!newOrder.supplier_id || !newOrder.delivery_date || validItems.length === 0) {
      setCreateOrderError('Please fill in all required fields and add at least one item.');
      setIsCreating(false);
      return;
    }

    // Calculate total amount
    const totalAmount = validItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);

    try {
      const payload = {
        supplier: newOrder.supplier_id,
        delivery_date: newOrder.delivery_date,
        total_amount: totalAmount,
        items: validItems,
      };

      const response = await fetch('http://murimart.localhost:8000/api/v1/suppliers/purchase_orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || JSON.stringify(errorData) || 'Failed to create purchase order.');
      }

      const createdOrder: PurchaseOrder = await response.json();
      
      // Add the newly created order to the state
      const supplierName = suppliers.find(s => s.id === createdOrder.supplier)?.company_name || 'Unknown Supplier';
      setPurchaseOrders(prevOrders => [...prevOrders, { ...createdOrder, supplier: supplierName }]);
      setCreateOrderSuccess(true);
      
      // Reset the form
      setNewOrder({
        supplier_id: '',
        delivery_date: '',
        items: [{ product: '', quantity: 0, unit_price: 0 }],
      });

    } catch (err: any) {
      setCreateOrderError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsCreating(false);
      setTimeout(() => {
        setIsCreateOrderOpen(false);
      }, 1500);
    }
  };
  
  const handleAddItem = () => {
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, { product: '', quantity: 0, unit_price: 0 }],
    });
  };

  const handleRemoveItem = (index: number) => {
    setNewOrder({
      ...newOrder,
      items: newOrder.items.filter((_, i) => i !== index),
    });
  };

  const handleItemChange = (index: number, field: keyof typeof newOrder.items[0], value: string | number) => {
    const updatedItems = newOrder.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setNewOrder({ ...newOrder, items: updatedItems });
  };

  const categories = ['all', 'Fresh Produce', 'Dairy Products', 'Grains & Cereals', 'Beverages', 'Household Items'];

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supplier.contact_person?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supplier.phone_number?.includes(searchQuery);
    const matchesCategory = selectedCategory === 'all' || supplier.category === selectedCategory;
    
    const matchesStatus = selectedStatus === 'all' || (selectedStatus === 'active' && supplier.is_active) || (selectedStatus === 'inactive' && !supplier.is_active);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: 'active' | 'inactive') => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      default: return 'secondary';
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'approved': return 'default';
      case 'delivered': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getRatingStars = (rating: number) => {
    if (typeof rating !== 'number' || isNaN(rating)) {
        return '';
    }
    return '⭐'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '⭐' : '');
  };

  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(s => s.is_active).length;
  const totalOutstanding = suppliers.reduce((sum, s) => sum + (s.current_balance || 0), 0);
  const pendingOrders = purchaseOrders.filter(po => po.status === 'pending').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading suppliers...</p>
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
          <h1>Supplier Management</h1>
          <p className="text-muted-foreground">Manage suppliers and procurement</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateOrderOpen} onOpenChange={setIsCreateOrderOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2" onClick={() => {
                setIsCreateOrderOpen(true);
                setCreateOrderError(null);
                setCreateOrderSuccess(false);
              }}>
                <Package className="h-4 w-4" />
                Create Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Purchase Order</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateOrder}>
                <div className="grid grid-cols-1 gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="supplier_id">Supplier</Label>
                      <Select
                        value={newOrder.supplier_id}
                        onValueChange={(value) => setNewOrder({ ...newOrder, supplier_id: value })}
                      >
                        <SelectTrigger id="supplier_id">
                          <SelectValue placeholder="Select supplier" />
                        </SelectTrigger>
                        <SelectContent>
                          {suppliers.filter(s => s.is_active).map(supplier => (
                            <SelectItem key={supplier.id} value={supplier.id}>{supplier.company_name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="delivery_date">Delivery Date</Label>
                      <Input
                        id="delivery_date"
                        type="date"
                        value={newOrder.delivery_date}
                        onChange={(e) => setNewOrder({ ...newOrder, delivery_date: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <Label>Order Items</Label>
                      <Button type="button" variant="ghost" size="sm" onClick={handleAddItem}>
                        <PlusCircle className="h-4 w-4 mr-2" /> Add Item
                      </Button>
                    </div>
                    {newOrder.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-6 gap-2 items-end">
                        <div className="col-span-3">
                          <Label htmlFor={`product-${index}`}>Product</Label>
                          <Input
                            id={`product-${index}`}
                            placeholder="Product name"
                            value={item.product}
                            onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                          />
                        </div>
                        <div className="col-span-1">
                          <Label htmlFor={`quantity-${index}`}>Qty</Label>
                          <Input
                            id={`quantity-${index}`}
                            type="number"
                            placeholder="0"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                          />
                        </div>
                        <div className="col-span-1">
                          <Label htmlFor={`price-${index}`}>Price</Label>
                          <Input
                            id={`price-${index}`}
                            type="number"
                            placeholder="0"
                            value={item.unit_price}
                            onChange={(e) => handleItemChange(index, 'unit_price', Number(e.target.value))}
                          />
                        </div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveItem(index)} disabled={newOrder.items.length === 1}>
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {isCreating && (
                    <div className="mt-4 flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">Creating order...</span>
                    </div>
                  )}
                  {createOrderError && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{createOrderError}</AlertDescription>
                    </Alert>
                  )}
                  {createOrderSuccess && (
                    <Alert className="mt-4 border-green-500">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <AlertTitle>Success</AlertTitle>
                      <AlertDescription>Purchase order created successfully!</AlertDescription>
                    </Alert>
                  )}
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" type="button" onClick={() => setIsCreateOrderOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? 'Creating...' : 'Create Order'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isAddSupplierOpen} onOpenChange={setIsAddSupplierOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2" onClick={() => {
                setIsAddSupplierOpen(true);
                setAddSupplierError(null);
                setAddSupplierSuccess(false);
              }}>
                <Plus className="h-4 w-4" />
                Add Supplier
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Supplier</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddSupplier}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Company Name</Label>
                    <Input 
                      id="company_name" 
                      placeholder="Supplier company name" 
                      value={newSupplier.company_name}
                      onChange={(e) => setNewSupplier({ ...newSupplier, company_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_person">Contact Person</Label>
                    <Input 
                      id="contact_person" 
                      placeholder="Primary contact name" 
                      value={newSupplier.contact_person}
                      onChange={(e) => setNewSupplier({ ...newSupplier, contact_person: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone_number">Phone</Label>
                    <Input 
                      id="phone_number" 
                      placeholder="+254 700 000 000" 
                      value={newSupplier.phone_number}
                      onChange={(e) => setNewSupplier({ ...newSupplier, phone_number: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="contact@supplier.com" 
                      value={newSupplier.email}
                      onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                    />
                  </div>
                  <div className="col-span-full space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address" 
                      placeholder="Full address" 
                      value={newSupplier.address}
                      onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city" 
                      placeholder="City" 
                      value={newSupplier.city}
                      onChange={(e) => setNewSupplier({ ...newSupplier, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newSupplier.category}
                      onValueChange={(value) => setNewSupplier({ ...newSupplier, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment_terms">Payment Terms</Label>
                    <Select
                      value={newSupplier.payment_terms}
                      onValueChange={(value) => setNewSupplier({ ...newSupplier, payment_terms: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select terms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="credit_limit">Credit Limit (KES)</Label>
                    <Input 
                      id="credit_limit" 
                      type="number" 
                      placeholder="0" 
                      value={newSupplier.credit_limit}
                      onChange={(e) => setNewSupplier({ ...newSupplier, credit_limit: Number(e.target.value) })}
                    />
                  </div>
                </div>

                {isAdding && (
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Adding supplier...</span>
                  </div>
                )}
                {addSupplierError && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{addSupplierError}</AlertDescription>
                  </Alert>
                )}
                {addSupplierSuccess && (
                  <Alert className="mt-4 border-green-500">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>Supplier added successfully!</AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" type="button" onClick={() => setIsAddSupplierOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isAdding}>
                    {isAdding ? 'Adding...' : 'Add Supplier'}
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
                <p className="text-sm text-muted-foreground">Total Suppliers</p>
                <p className="text-2xl">{totalSuppliers}</p>
                <p className="text-sm text-green-600">{activeSuppliers} active</p>
              </div>
              <Truck className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Outstanding Amount</p>
                <p className="text-2xl">KES {Math.round(totalOutstanding / 1000)}K</p>
                <p className="text-sm text-muted-foreground">Payable</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Orders</p>
                <p className="text-2xl">{pendingOrders}</p>
                <p className="text-sm text-muted-foreground">Awaiting approval</p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl">24</p>
                <p className="text-sm text-green-600">Deliveries</p>
              </div>
              <CheckCircle className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="suppliers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="suppliers" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search suppliers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSuppliers.map((supplier) => (
              <Card key={supplier.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{supplier.company_name}</CardTitle>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {supplier.address ? `${supplier.address}, ${supplier.city}` : 'N/A'}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(supplier.is_active ? 'active' : 'inactive')}>
                      {supplier.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Contact Person</p>
                      <p className="font-medium">{supplier.contact_person || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="font-medium">{supplier.category || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        Phone
                      </p>
                      <p className="font-medium">{supplier.phone_number || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Rating</p>
                      <p className="font-medium">
                        {supplier.rating > 0 ? `${getRatingStars(supplier.rating)} ${supplier.rating}` : 'Not rated'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Terms</p>
                      <p className="font-medium">{supplier.payment_terms || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                      <p className="font-medium">{supplier.total_orders || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Balance</p>
                      <p className={`font-medium ${supplier.current_balance > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                        KES {(supplier.current_balance || 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Delivery</p>
                      <p className="font-medium">
                        {supplier.last_delivery ? new Date(supplier.last_delivery).toLocaleDateString() : 'Never'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Products:</p>
                    <div className="flex flex-wrap gap-1">
                      {supplier.products?.map((product, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {product}
                        </Badge>
                      ))}
                      {supplier.products && supplier.products.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{supplier.products.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Package className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <div className="space-y-4">
            {purchaseOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        {order.id}
                        <Badge variant={getOrderStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </h4>
                      <p className="text-sm text-muted-foreground">{order.supplier}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">KES {order.total_amount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        Order: {new Date(order.order_date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Delivery: {new Date(order.delivery_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Items:</p>
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.product} (x{item.quantity})</span>
                          <span>KES {(item.quantity * item.unit_price).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {order.status === 'pending' && (
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      <Button size="sm" variant="outline">Approve</Button>
                      <Button size="sm" variant="destructive">Cancel</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Suppliers by Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suppliers
                    .sort((a, b) => (b.total_orders || 0) - (a.total_orders || 0))
                    .slice(0, 5)
                    .map((supplier) => (
                    <div key={supplier.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{supplier.company_name}</p>
                        <p className="text-sm text-muted-foreground">{supplier.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{supplier.total_orders || 0} orders</p>
                        <p className="text-sm text-muted-foreground">
                          {getRatingStars(supplier.rating)} {supplier.rating || 0}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Outstanding Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suppliers
                    .filter(s => (s.current_balance || 0) > 0)
                    .sort((a, b) => (b.current_balance || 0) - (a.current_balance || 0))
                    .map((supplier) => (
                    <div key={supplier.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{supplier.company_name}</p>
                        <p className="text-sm text-muted-foreground">{supplier.payment_terms || 'N/A'} terms</p>
                      </div>
                      <p className="font-medium text-orange-600">
                        KES {(supplier.current_balance || 0).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}