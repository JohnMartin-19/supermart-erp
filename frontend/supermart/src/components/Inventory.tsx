import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import {
  Plus,
  Search,
  Filter,
  Package,
  AlertTriangle,
  TrendingUp,
  ShoppingCart,
  Truck,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';

// Define the structure of an inventory item
interface InventoryItem {
  id: number;
  product: number;
  branch: number;
  current_stock: number;
  min_stock: number;
  max_stock: number;
  tenant: number;
}

// Define the structure of a product based on your new API response
interface Product {
  id: number;
  name: string;
  sku: string;
  categories: string;
  supplier: string;
  price: string;
  inventory: InventoryItem[];
  stock_status: string;
  tenant: number;
}

export function Inventory() {
  const [selectedTab, setSelectedTab] = useState('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalInventoryValue, setTotalInventoryValue] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
 
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    categories: '',
    supplier: '',
    price: '',
    current_stock: 0,
    min_stock: 0,
    max_stock: 0,
  });

  const accessToken = localStorage.getItem('access_token');
  const tenantDomain = localStorage.getItem('tenant_domain')
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    if (!accessToken) {
      setError("Authentication token not found. Please log in.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://${tenantDomain}:8000/api/v1/inventory/products/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products. Please check the network or API endpoint.');
      }

      const data = await response.json();
      setProducts(data);
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [accessToken]);

  // Calculate total inventory value whenever products change
  useEffect(() => {
    const calculateTotalValue = () => {
      const total = products.reduce((sum, product) => {
        const currentStock = product.inventory.length > 0 ? product.inventory[0].current_stock : 0;
        const price = parseFloat(product.price);
        return sum + (currentStock * price);
      }, 0);
      setTotalInventoryValue(total);
    };

    if (products.length > 0) {
      calculateTotalValue();
    }
  }, [products]);

  // Handle input changes for the new product form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [id]: id === 'current_stock' || id === 'min_stock' || id === 'max_stock' ? parseInt(value) : value,
    }));
  };

  // Handle select changes for the new product form
  const handleSelectChange = (id: string, value: string) => {
    setNewProduct(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handle the POST request to add a new product
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!accessToken) {
      setError("Authentication token not found. Please log in.");
      setIsLoading(false);
      return;
    }

    const payload = {
      name: newProduct.name,
      sku: newProduct.sku,
      categories: newProduct.categories,
      supplier: newProduct.supplier,
      price: newProduct.price,
      inventory: [{
        current_stock: newProduct.current_stock,
        min_stock: newProduct.min_stock,
        max_stock: newProduct.max_stock,
      }]
    };

    try {
      const response = await fetch(`http://${tenantDomain}:8000/api/v1/inventory/products/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add product. Please try again.');
      }

      // If successful, re-fetch products to update the list
      await fetchProducts();

      // Close the dialog and clear the form
      setIsDialogOpen(false);
      setNewProduct({
        name: '',
        sku: '',
        categories: '',
        supplier: '',
        price: '',
        current_stock: 0,
        min_stock: 0,
        max_stock: 0,
      });

    } catch (err: any) {
      console.error("Error adding product:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data for other tabs will remain unchanged for now
  const orders = [
    { id: 'ORD-001', customer: 'Tech Solutions Ltd', products: 3, total: 15600, status: 'processing', date: '2025-01-28' },
    { id: 'ORD-002', customer: 'Global Industries', products: 2, total: 8500, status: 'shipped', date: '2025-01-27' },
    { id: 'ORD-003', customer: 'Metro Systems', products: 5, total: 12300, status: 'delivered', date: '2025-01-25' },
    { id: 'ORD-004', customer: 'Prime Corp', products: 1, total: 3200, status: 'pending', date: '2025-01-24' },
  ];

  const suppliers = [
    { id: 'SUP-001', name: 'Tech Supplies Co.', contact: 'John Doe', phone: '+91 9876543210', email: 'john@techsupplies.com', status: 'active' },
    { id: 'SUP-002', name: 'Cable World', contact: 'Jane Smith', phone: '+91 9876543211', email: 'jane@cableworld.com', status: 'active' },
    { id: 'SUP-003', name: 'Desk Solutions', contact: 'Mike Johnson', phone: '+91 9876543212', email: 'mike@desksolutions.com', status: 'inactive' },
  ];

  const getStockStatus = (current: number, min: number) => {
    if (current === 0) return 'out-of-stock';
    if (current <= min) return 'low-stock';
    return 'in-stock';
  };

  const getStockPercentage = (current: number, max: number) => {
    if (max === 0) return 0;
    return (current / max) * 100;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Inventory Management</h1>
          <p className="text-muted-foreground">Track stock levels and manage orders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input 
                      id="name" 
                      placeholder="Enter product name" 
                      value={newProduct.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="sku">SKU</Label>
                    <Input 
                      id="sku" 
                      placeholder="Enter SKU" 
                      value={newProduct.sku}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="categories">Category</Label>
                    <Select onValueChange={(value) => handleSelectChange('categories', value)} value={newProduct.categories}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Accessories">Accessories</SelectItem>
                        <SelectItem value="Furniture">Furniture</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="supplier">Supplier</Label>
                    <Select onValueChange={(value) => handleSelectChange('supplier', value)} value={newProduct.supplier}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tech Supplies Co.">Tech Supplies Co.</SelectItem>
                        <SelectItem value="Cable World">Cable World</SelectItem>
                        <SelectItem value="Desk Solutions">Desk Solutions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="current_stock">Current Stock</Label>
                    <Input 
                      id="current_stock" 
                      type="number" 
                      placeholder="0" 
                      value={newProduct.current_stock}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="min_stock">Min Stock</Label>
                    <Input 
                      id="min_stock" 
                      type="number" 
                      placeholder="0" 
                      value={newProduct.min_stock}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="max_stock">Max Stock</Label>
                    <Input 
                      id="max_stock" 
                      type="number" 
                      placeholder="0" 
                      value={newProduct.max_stock}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    placeholder="0" 
                    value={newProduct.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                    Add Product
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+12</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {products.filter(p => p.inventory.length > 0 && p.inventory[0].current_stock <= p.inventory[0].min_stock).length}
            </div>
            <p className="text-xs text-muted-foreground">Items below minimum</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+5.2%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSH {totalInventoryValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current inventory value</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Inventory</CardTitle>
              <div className="flex gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search products..." className="pl-9" />
                </div>
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Stock Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Products</SelectItem>
                    <SelectItem value="in-stock">In Stock</SelectItem>
                    <SelectItem value="low-stock">Low Stock</SelectItem>
                    <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  <span className="mt-4 text-sm text-muted-foreground">Loading products...</span>
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}
              {!isLoading && !error && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Stock Level</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Supplier</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.length > 0 ? (
                      products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.sku}</TableCell>
                          <TableCell>{product.categories}</TableCell>
                          <TableCell>
                            {product.inventory.length > 0 ? product.inventory[0].current_stock : 'N/A'}
                          </TableCell>
                          <TableCell>
                            {product.inventory.length > 0 ? (
                              <div className="space-y-1">
                                <Progress
                                  value={getStockPercentage(product.inventory[0].current_stock, product.inventory[0].max_stock)}
                                  className="h-2"
                                />
                                <div className="text-xs text-muted-foreground">
                                  {product.inventory[0].current_stock}/{product.inventory[0].max_stock}
                                </div>
                              </div>
                            ) : 'N/A'}
                          </TableCell>
                          <TableCell>KSH {parseFloat(product.price).toLocaleString()}</TableCell>
                          <TableCell>
                            {product.inventory.length > 0 ? (
                              <Badge variant={
                                getStockStatus(product.inventory[0].current_stock, product.inventory[0].min_stock) === 'in-stock' ? 'default' :
                                getStockStatus(product.inventory[0].current_stock, product.inventory[0].min_stock) === 'low-stock' ? 'secondary' : 'destructive'
                              }>
                                {getStockStatus(product.inventory[0].current_stock, product.inventory[0].min_stock).replace('-', ' ')}
                              </Badge>
                            ) : (
                              <Badge variant="destructive">No Inventory</Badge>
                            )}
                          </TableCell>
                          <TableCell>{product.supplier}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                          No products found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Order
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.products} items</TableCell>
                      <TableCell>KSH {order.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={
                          order.status === 'delivered' ? 'default' :
                          order.status === 'shipped' ? 'secondary' :
                          order.status === 'processing' ? 'outline' : 'destructive'
                        }>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Truck className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Management</CardTitle>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Supplier
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell>{supplier.id}</TableCell>
                      <TableCell>{supplier.name}</TableCell>
                      <TableCell>{supplier.contact}</TableCell>
                      <TableCell>{supplier.phone}</TableCell>
                      <TableCell>{supplier.email}</TableCell>
                      <TableCell>
                        <Badge variant={supplier.status === 'active' ? 'default' : 'secondary'}>
                          {supplier.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}