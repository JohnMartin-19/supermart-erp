import { useState, useEffect } from 'react';
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
import { Package, Plus, Search, Filter, Edit, Trash2, AlertTriangle, TrendingUp, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface Product {
  id: string;
  name: string;
  barcode: string;
  category: string;
  selling_price: number;
  cost_price: number;
  current_stock: number;
  minimum_stock_level: number;
  supplier: string;
  description: string;
  is_active: boolean;
  vat_applicable: boolean;
  is_perishable: boolean;
  expiry_date?: string;
  unit: string;
}

interface Supplier {
  id: string;
  name: string;
}

export function ProductCatalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]); // New state for suppliers
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    barcode: '',
    category: '',
    selling_price: 0,
    cost_price: 0,
    initial_stock: 0,
    current_stock: 0,
    minimum_stock_level: 0,
    supplier: '',
    description: '',
    is_active: true,
    vat_applicable: false,
    is_perishable: false,
    expiry_date: '',
    unit: 'piece'
  });
  const [isAdding, setIsAdding] = useState(false);
  const [addProductError, setAddProductError] = useState<string | null>(null);
  const tenantDomain = localStorage.getItem('tenant_domain');

  // Fetching products and suppliers from their APIs
  useEffect(() => {
    const fetchProductsAndSuppliers = async () => {
      try {
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        };

        const [productsRes, suppliersRes] = await Promise.all([
          fetch(`http://${tenantDomain}:8000/api/v1/products/products/`, { headers }),
          fetch(`http://${tenantDomain}:8000/api/v1/suppliers/suppliers/`, { headers }),
        ]);

        if (!productsRes.ok || !suppliersRes.ok) {
          const errorData = await (productsRes.ok ? suppliersRes : productsRes).json();
          throw new Error(errorData.detail || 'Failed to fetch data.');
        }

        const productsData = await productsRes.json();
        const suppliersData = await suppliersRes.json();
        
        setProducts(productsData);
        setSuppliers(suppliersData);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductsAndSuppliers();
  }, [tenantDomain]);

  const categories = [
    'all',
    'dairy',
    'meat',
    'fruits',
    'vegetables',
    'grains',
    'nuts',
    'spices',
    'pasta',
    'canned_goods',
    'baking_supplies',
    'snacks',
    'pet_food',
    'household_items',
    'beverages',
    'personal_care',
    'baby_care',
    'pet_care',
    'office_supplies',
    'arts_and_crafts',
    'books_and_media',
    'sports_equipment',
    'musical_instruments',
    'outdoor_equipment',
    'tools',
    'furniture',
    'home_decor',
    'garden_supplies',
    'garage_and_storage',
    'auto_parts',
    'vintage_and_collectibles',
    'other'
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (product.barcode && product.barcode.includes(searchQuery)) ||
                          (product.supplier && product.supplier.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockProducts = products.filter(product => product.current_stock <= product.minimum_stock_level);
  const perishableProducts = products.filter(product => product.is_perishable);

  // Handle input changes for the "Add Product" form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    
    // Check if the input is for a numeric field and handle empty strings
    if (['minimum_stock_level', 'cost_price', 'selling_price'].includes(id)) {
      const numericValue = value === '' ? 0 : Number(value);
      setNewProduct(prev => ({
        ...prev,
        [id]: numericValue
      }));
    } else {
      setNewProduct(prev => ({
        ...prev,
        [id]: value
      }));
    }
  };

  // Dedicated handler for stock fields to handle numeric values
  const handleStockInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const numericValue = value === '' ? 0 : Number(value);
    setNewProduct(prev => ({
      ...prev,
      [id]: numericValue,
      // Automatically set current_stock to initial_stock value
      ...(id === 'initial_stock' && { current_stock: numericValue })
    }));
  };

  const handleSwitchChange = (id: string, checked: boolean) => {
    setNewProduct(prev => ({
      ...prev,
      [id]: checked
    }));
  };

  const handleSelectChange = (value: string) => {
    setNewProduct(prev => ({
      ...prev,
      category: value
    }));
  };

  const handleSupplierSelectChange = (value: string) => {
    setNewProduct(prev => ({
      ...prev,
      supplier: value,
    }));
  };

  const addProduct = async () => {
    setIsAdding(true);
    setAddProductError(null);

    const productPayload = {
      ...newProduct,
      selling_price: parseFloat(String(newProduct.selling_price)),
      cost_price: parseFloat(String(newProduct.cost_price)),
      initial_stock: parseInt(String(newProduct.initial_stock)),
      current_stock: parseInt(String(newProduct.current_stock)),
      minimum_stock_level: parseInt(String(newProduct.minimum_stock_level)),
    };

    try {
      const response = await fetch(`http://${tenantDomain}:8000/api/v1/products/products/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(productPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || JSON.stringify(errorData) || 'Failed to add product.');
      }

      const addedProduct = await response.json();
      setProducts(prevProducts => [...prevProducts, addedProduct]);
      setIsAddProductOpen(false); 
      setNewProduct({ 
        name: '',
        barcode: '',
        category: '',
        selling_price: 0,
        cost_price: 0,
        initial_stock: 0,
        current_stock: 0,
        minimum_stock_level: 0,
        supplier: '',
        description: '',
        is_active: true,
        vat_applicable: false,
        is_perishable: false,
        expiry_date: '',
        unit: 'piece'
      });
    } catch (err: any) {
      console.error("Failed to add product:", err);
      setAddProductError(err.message);
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading products...</p>
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
              {addProductError && (
                <Alert variant="destructive" className="col-span-full mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Failed to add product</AlertTitle>
                  <AlertDescription>{addProductError}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" placeholder="Enter product name" value={newProduct.name} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="barcode">Barcode</Label>
                <Input id="barcode" placeholder="Scan or enter barcode" value={newProduct.barcode} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={newProduct.category} onValueChange={handleSelectChange}>
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
                <Select value={newProduct.supplier} onValueChange={handleSupplierSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map(supplier => (
                      <SelectItem key={supplier.id} value={supplier.name}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost_price">Cost Price (KES)</Label>
                <Input id="cost_price" type="number" placeholder="0.00" value={newProduct.cost_price} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="selling_price">Selling Price (KES)</Label>
                <Input id="selling_price" type="number" placeholder="0.00" value={newProduct.selling_price} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="initial_stock">Initial Stock</Label>
                <Input id="initial_stock" type="number" placeholder="0" value={newProduct.initial_stock} onChange={handleStockInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minimum_stock_level">Minimum Stock Level</Label>
                <Input id="minimum_stock_level" type="number" placeholder="0" value={newProduct.minimum_stock_level} onChange={handleInputChange} />
              </div>
              <div className="col-span-full space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Product description" value={newProduct.description} onChange={handleInputChange} />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="vat_applicable" checked={newProduct.vat_applicable} onCheckedChange={(checked) => handleSwitchChange('vat_applicable', checked)} />
                <Label htmlFor="vat_applicable">VAT Applicable</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="is_perishable" checked={newProduct.is_perishable} onCheckedChange={(checked) => handleSwitchChange('is_perishable', checked)} />
                <Label htmlFor="is_perishable">Perishable Item</Label>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>Cancel</Button>
              <Button onClick={addProduct} disabled={isAdding}>
                {isAdding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isAdding ? 'Adding...' : 'Add Product'}
              </Button>
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
                    <Badge variant={product.is_active ? "default" : "secondary"}>
                      {product.is_active ? "Active" : "Inactive"}
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
                      <span className="text-sm">KES {product.cost_price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Selling Price:</span>
                      <span className="text-sm font-medium">KES {product.selling_price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Margin:</span>
                      <span className="text-sm text-green-600">
                        {((product.selling_price - product.cost_price) / product.cost_price * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Stock Level:</span>
                      <Badge variant={product.current_stock <= product.minimum_stock_level ? "destructive" : "secondary"}>
                        {product.current_stock} {product.unit}
                      </Badge>
                    </div>
                    {product.current_stock <= product.minimum_stock_level && (
                      <div className="flex items-center gap-1 text-xs text-destructive">
                        <AlertTriangle className="h-3 w-3" />
                        Low Stock Alert
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 text-xs">
                    {product.vat_applicable && (
                      <Badge variant="outline">VAT</Badge>
                    )}
                    {product.is_perishable && (
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
                      {product.current_stock} / {product.minimum_stock_level}
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
                    <Badge variant="outline">{product.current_stock} {product.unit}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                  {product.expiry_date && (
                    <p className="text-sm text-orange-600">
                      Expires: {new Date(product.expiry_date).toLocaleDateString()}
                    </p>
                  )}
                  <p className="text-sm">Price: KES {product.selling_price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}