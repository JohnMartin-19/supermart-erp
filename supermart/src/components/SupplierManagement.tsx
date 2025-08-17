import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Truck, Plus, Search, Phone, MapPin, Package, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  category: string;
  status: 'active' | 'inactive' | 'pending';
  paymentTerms: string;
  creditLimit: number;
  currentBalance: number;
  lastDelivery: string;
  totalOrders: number;
  rating: number;
  products: string[];
}

interface PurchaseOrder {
  id: string;
  supplier: string;
  orderDate: string;
  deliveryDate: string;
  status: 'pending' | 'approved' | 'delivered' | 'cancelled';
  totalAmount: number;
  items: { product: string; quantity: number; unitPrice: number }[];
}

export function SupplierManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);

  // Mock data - would come from Django API
  const [suppliers] = useState<Supplier[]>([
    {
      id: '1',
      name: 'Fresh Produce Supplies Ltd',
      contactPerson: 'John Mwangi',
      phone: '+254 722 111 222',
      email: 'john@freshproduce.co.ke',
      address: 'Wakulima Market, CBD',
      city: 'Nairobi',
      category: 'Fresh Produce',
      status: 'active',
      paymentTerms: '30 days',
      creditLimit: 500000,
      currentBalance: 125000,
      lastDelivery: '2024-08-17',
      totalOrders: 45,
      rating: 4.8,
      products: ['Tomatoes', 'Onions', 'Potatoes', 'Carrots']
    },
    {
      id: '2',
      name: 'Dairy Coop Kenya',
      contactPerson: 'Sarah Wanjiku',
      phone: '+254 733 222 333',
      email: 'procurement@dairycoop.co.ke',
      address: 'Industrial Area',
      city: 'Nairobi',
      category: 'Dairy Products',
      status: 'active',
      paymentTerms: '14 days',
      creditLimit: 300000,
      currentBalance: 85000,
      lastDelivery: '2024-08-16',
      totalOrders: 62,
      rating: 4.9,
      products: ['Milk', 'Yogurt', 'Cheese', 'Butter']
    },
    {
      id: '3',
      name: 'Grain Distributors East Africa',
      contactPerson: 'Peter Kimani',
      phone: '+254 700 333 444',
      address: 'Mombasa Road',
      city: 'Nairobi',
      category: 'Grains & Cereals',
      status: 'active',
      paymentTerms: '21 days',
      creditLimit: 800000,
      currentBalance: 245000,
      lastDelivery: '2024-08-15',
      totalOrders: 38,
      rating: 4.6,
      products: ['Rice', 'Wheat Flour', 'Maize', 'Beans']
    },
    {
      id: '4',
      name: 'Household Items Wholesale',
      contactPerson: 'Mary Njeri',
      phone: '+254 711 444 555',
      email: 'orders@householditems.co.ke',
      address: 'Eastleigh',
      city: 'Nairobi',
      category: 'Household Items',
      status: 'pending',
      paymentTerms: '30 days',
      creditLimit: 200000,
      currentBalance: 0,
      lastDelivery: '',
      totalOrders: 0,
      rating: 0,
      products: ['Detergents', 'Soaps', 'Cleaning Supplies']
    }
  ]);

  const [purchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: 'PO-001',
      supplier: 'Fresh Produce Supplies Ltd',
      orderDate: '2024-08-17',
      deliveryDate: '2024-08-18',
      status: 'approved',
      totalAmount: 85000,
      items: [
        { product: 'Tomatoes', quantity: 50, unitPrice: 800 },
        { product: 'Onions', quantity: 30, unitPrice: 1500 }
      ]
    },
    {
      id: 'PO-002',
      supplier: 'Dairy Coop Kenya',
      orderDate: '2024-08-16',
      deliveryDate: '2024-08-17',
      status: 'delivered',
      totalAmount: 125000,
      items: [
        { product: 'Milk 1L', quantity: 100, unitPrice: 55 },
        { product: 'Yogurt', quantity: 50, unitPrice: 120 }
      ]
    },
    {
      id: 'PO-003',
      supplier: 'Grain Distributors East Africa',
      orderDate: '2024-08-15',
      deliveryDate: '2024-08-19',
      status: 'pending',
      totalAmount: 180000,
      items: [
        { product: 'Rice 2kg', quantity: 100, unitPrice: 140 },
        { product: 'Wheat Flour 1kg', quantity: 200, unitPrice: 80 }
      ]
    }
  ]);

  const categories = ['all', 'Fresh Produce', 'Dairy Products', 'Grains & Cereals', 'Beverages', 'Household Items'];

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supplier.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supplier.phone.includes(searchQuery);
    const matchesCategory = selectedCategory === 'all' || supplier.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || supplier.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'pending': return 'secondary';
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
    return '⭐'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '⭐' : '');
  };

  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(s => s.status === 'active').length;
  const totalOutstanding = suppliers.reduce((sum, s) => sum + s.currentBalance, 0);
  const pendingOrders = purchaseOrders.filter(po => po.status === 'pending').length;

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
              <Button variant="outline" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Create Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Purchase Order</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Supplier</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.filter(s => s.status === 'active').map(supplier => (
                          <SelectItem key={supplier.id} value={supplier.id}>{supplier.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Delivery Date</Label>
                    <Input type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea placeholder="Additional notes or requirements" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateOrderOpen(false)}>Cancel</Button>
                <Button>Create Order</Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isAddSupplierOpen} onOpenChange={setIsAddSupplierOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Supplier
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Supplier</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input placeholder="Supplier company name" />
                </div>
                <div className="space-y-2">
                  <Label>Contact Person</Label>
                  <Input placeholder="Primary contact name" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input placeholder="+254 700 000 000" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="contact@supplier.com" />
                </div>
                <div className="col-span-full space-y-2">
                  <Label>Address</Label>
                  <Input placeholder="Full address" />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input placeholder="City" />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select>
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
                  <Label>Payment Terms</Label>
                  <Select>
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
                  <Label>Credit Limit (KES)</Label>
                  <Input type="number" placeholder="0" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddSupplierOpen(false)}>Cancel</Button>
                <Button>Add Supplier</Button>
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
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSuppliers.map((supplier) => (
              <Card key={supplier.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{supplier.name}</CardTitle>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {supplier.address}, {supplier.city}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(supplier.status)}>
                      {supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Contact Person</p>
                      <p className="font-medium">{supplier.contactPerson}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="font-medium">{supplier.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        Phone
                      </p>
                      <p className="font-medium">{supplier.phone}</p>
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
                      <p className="font-medium">{supplier.paymentTerms}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                      <p className="font-medium">{supplier.totalOrders}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Balance</p>
                      <p className={`font-medium ${supplier.currentBalance > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                        KES {supplier.currentBalance.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Delivery</p>
                      <p className="font-medium">
                        {supplier.lastDelivery ? new Date(supplier.lastDelivery).toLocaleDateString() : 'Never'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Products:</p>
                    <div className="flex flex-wrap gap-1">
                      {supplier.products.slice(0, 3).map((product, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {product}
                        </Badge>
                      ))}
                      {supplier.products.length > 3 && (
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
                      <p className="font-semibold">KES {order.totalAmount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        Order: {new Date(order.orderDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Delivery: {new Date(order.deliveryDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Items:</p>
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.product} (x{item.quantity})</span>
                          <span>KES {(item.quantity * item.unitPrice).toLocaleString()}</span>
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
                    .sort((a, b) => b.totalOrders - a.totalOrders)
                    .slice(0, 5)
                    .map((supplier) => (
                    <div key={supplier.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{supplier.name}</p>
                        <p className="text-sm text-muted-foreground">{supplier.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{supplier.totalOrders} orders</p>
                        <p className="text-sm text-muted-foreground">
                          {getRatingStars(supplier.rating)} {supplier.rating}
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
                    .filter(s => s.currentBalance > 0)
                    .sort((a, b) => b.currentBalance - a.currentBalance)
                    .map((supplier) => (
                    <div key={supplier.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{supplier.name}</p>
                        <p className="text-sm text-muted-foreground">{supplier.paymentTerms} terms</p>
                      </div>
                      <p className="font-medium text-orange-600">
                        KES {supplier.currentBalance.toLocaleString()}
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