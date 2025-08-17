import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Package, Plus, Search, Filter, Edit, Trash2, AlertTriangle, TrendingUp } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  barcode: string;
  category: string;
  price: number;
  costPrice: number;
  stockLevel: number;
  minStockLevel: number;
  supplier: string;
  description: string;
  isActive: boolean;
  vatApplicable: boolean;
  perishable: boolean;
  expiryDate?: string;
  unit: string;
}

export function ProductCatalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  
  // Mock data - would come from Django API
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Bread - White Loaf',
      barcode: '1234567890',
      category: 'Bakery',
      price: 50,
      costPrice: 35,
      stockLevel: 25,
      minStockLevel: 10,
      supplier: 'Fresh Bakery Ltd',
      description: 'Fresh white bread, baked daily',
      isActive: true,
      vatApplicable: true,
      perishable: true,
      expiryDate: '2024-08-20',
      unit: 'piece'
    },
    {
      id: '2',
      name: 'Milk - 1L Fresh',
      barcode: '2345678901',
      category: 'Dairy',
      price: 75,
      costPrice: 55,
      stockLevel: 50,
      minStockLevel: 20,
      supplier: 'Dairy Coop Kenya',
      description: 'Fresh pasteurized milk',
      isActive: true,
      vatApplicable: false,
      perishable: true,
      expiryDate: '2024-08-22',
      unit: 'liter'
    },
    {
      id: '3',
      name: 'Rice - 2kg Basmati',
      barcode: '4567890123',
      category: 'Grains',
      price: 180,
      costPrice: 140,
      stockLevel: 8,
      minStockLevel: 15,
      supplier: 'Grain Distributors',
      description: 'Premium basmati rice',
      isActive: true,
      vatApplicable: true,
      perishable: false,
      unit: 'kg'
    },
    {
      id: '4',
      name: 'Cooking Oil - 1L',
      barcode: '6789012345',
      category: 'Pantry',
      price: 250,
      costPrice: 200,
      stockLevel: 30,
      minStockLevel: 10,
      supplier: 'Oil Mills Kenya',
      description: 'Pure vegetable cooking oil',
      isActive: true,
      vatApplicable: true,
      perishable: false,
      unit: 'liter'
    }
  ]);

  const categories = ['all', 'Bakery', 'Dairy', 'Grains', 'Pantry', 'Beverages', 'Snacks', 'Household'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.barcode.includes(searchQuery) ||
                         product.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockProducts = products.filter(product => product.stockLevel <= product.minStockLevel);
  const perishableProducts = products.filter(product => product.perishable);

  const addProduct = () => {
    // Would integrate with Django API
    console.log('Adding new product...');
    setIsAddProductOpen(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1>Product Catalog</h1>
          <p className="text-muted-foreground">Manage your supermarket inventory</p>
        </div>
        <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" placeholder="Enter product name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="barcode">Barcode</Label>
                <Input id="barcode" placeholder="Scan or enter barcode" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
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
                <Label htmlFor="supplier">Supplier</Label>
                <Input id="supplier" placeholder="Enter supplier name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="costPrice">Cost Price (KES)</Label>
                <Input id="costPrice" type="number" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sellingPrice">Selling Price (KES)</Label>
                <Input id="sellingPrice" type="number" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stockLevel">Initial Stock</Label>
                <Input id="stockLevel" type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minStock">Minimum Stock Level</Label>
                <Input id="minStock" type="number" placeholder="0" />
              </div>
              <div className="col-span-full space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Product description" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="vat" />
                <Label htmlFor="vat">VAT Applicable</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="perishable" />
                <Label htmlFor="perishable">Perishable Item</Label>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>Cancel</Button>
              <Button onClick={addProduct}>Add Product</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="products">All Products</TabsTrigger>
          <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
          <TabsTrigger value="perishable">Perishable Items</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products by name, barcode, or supplier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge variant={product.isActive ? "default" : "secondary"}>
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-base line-clamp-2">{product.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Cost Price:</span>
                      <span className="text-sm">KES {product.costPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Selling Price:</span>
                      <span className="text-sm font-medium">KES {product.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Margin:</span>
                      <span className="text-sm text-green-600">
                        {((product.price - product.costPrice) / product.costPrice * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Stock Level:</span>
                      <Badge variant={product.stockLevel <= product.minStockLevel ? "destructive" : "secondary"}>
                        {product.stockLevel} {product.unit}
                      </Badge>
                    </div>
                    {product.stockLevel <= product.minStockLevel && (
                      <div className="flex items-center gap-1 text-xs text-destructive">
                        <AlertTriangle className="h-3 w-3" />
                        Low Stock Alert
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 text-xs">
                    {product.vatApplicable && (
                      <Badge variant="outline">VAT</Badge>
                    )}
                    {product.perishable && (
                      <Badge variant="outline">Perishable</Badge>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Barcode: {product.barcode}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="low-stock" className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <h3 className="font-medium">Products Running Low on Stock</h3>
            <Badge variant="destructive">{lowStockProducts.length} items</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockProducts.map((product) => (
              <Card key={product.id} className="border-destructive/20">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{product.name}</h4>
                    <Badge variant="destructive">
                      {product.stockLevel} / {product.minStockLevel}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                  <p className="text-sm">Supplier: {product.supplier}</p>
                  <Button size="sm" className="w-full mt-3">
                    <Package className="h-4 w-4 mr-2" />
                    Reorder Stock
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="perishable" className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            <h3 className="font-medium">Perishable Items</h3>
            <Badge variant="outline">{perishableProducts.length} items</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {perishableProducts.map((product) => (
              <Card key={product.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{product.name}</h4>
                    <Badge variant="outline">{product.stockLevel} {product.unit}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                  {product.expiryDate && (
                    <p className="text-sm text-orange-600">
                      Expires: {new Date(product.expiryDate).toLocaleDateString()}
                    </p>
                  )}
                  <p className="text-sm">Price: KES {product.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}