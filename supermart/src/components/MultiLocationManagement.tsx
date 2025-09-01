import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Progress } from './ui/progress';
import { Building2, Plus, MapPin, Users, TrendingUp, Package, AlertCircle, Truck, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

// --- Interface Declarations ---
interface Branch {
  id: number;
  branch_name: string;
  address: string;
  city: string;
  county: string;
  phone_number: string;
  manager: string;
  is_active: boolean;
  operating_hours: string;
  employees?: number;
  dailySales?: number;
  monthlySales?: number;
  stockValue?: number;
}

interface StockTransfer {
  id: number;
  from_branch: number;
  to_branch: number;
  product: number;
  quantity: number;
  status: 'pending' | 'in-transit' | 'completed' | 'cancelled';
  request_date: string;
  completed_date?: string;
}

interface Product {
  id: number;
  name: string;
}

export function MultiLocationManagement() {
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  // State for API data
  const [branches, setBranches] = useState<Branch[]>([]);
  const [stockTransfers, setStockTransfers] = useState<StockTransfer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const tenantDomain = localStorage.getItem('tenant_domain')
  // Loading and error states
  const [isLoadingBranches, setIsLoadingBranches] = useState(true);
  const [loadingBranchesError, setLoadingBranchesError] = useState<string | null>(null);
  const [isLoadingTransfers, setIsLoadingTransfers] = useState(true);
  const [loadingTransfersError, setLoadingTransfersError] = useState<string | null>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [loadingProductsError, setLoadingProductsError] = useState<string | null>(null);

  // New state for the stock transfer form
  const [newTransfer, setNewTransfer] = useState({
    from_branch: '',
    to_branch: '',
    product_id: '',
    quantity: 0,
    reason: '',
  });

  // State for the new branch form
  const [newBranch, setNewBranch] = useState({
    branch_name: '',
    address: '',
    city: '',
    county: '',
    phone_number: '',
    manager: '',
    is_active: true,
    operating_hours: '',
  });

  const BRANCH_COUNTIES = [
    'Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita-Taveta',
    'Garissa', 'Wajir', 'Mandera', 'Marsabit', 'Isiolo', 'Meru',
    'Tharaka-Nithi', 'Embu', 'Kitui', 'Machakos', 'Makueni', 'Nyandarua',
    'Nyeri', 'Kirinyaga', "Murang'a", 'Kiambu', 'Turkana', 'West Pokot',
    'Samburu', 'Trans-Nzoia', 'Uasin Gishu', 'Elgeyo-Marakwet', 'Nandi',
    'Baringo', 'Laikipia', 'Nakuru', 'Narok', 'Kajiado', 'Kericho',
    'Bomet', 'Kakamega', 'Vihiga', 'Bungoma', 'Busia', 'Siaya', 'Kisumu',
    'Homa Bay', 'Migori', 'Kisii', 'Nyamira', 'Nairobi'
  ];

  const [isCreatingTransfer, setIsCreatingTransfer] = useState(false);
  const [createTransferError, setCreateTransferError] = useState<string | null>(null);
  const [createTransferSuccess, setCreateTransferSuccess] = useState(false);

  const [isCreatingBranch, setIsCreatingBranch] = useState(false);
  const [createBranchError, setCreateBranchError] = useState<string | null>(null);
  const [createBranchSuccess, setCreateBranchSuccess] = useState(false);

  // --- Data Fetching Hooks ---

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch(`http://${tenantDomain}:8000/api/v1/multi_location/branches/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to fetch branches.');
        }
        const data = await response.json();
        setBranches(data);
      } catch (err: any) {
        setLoadingBranchesError(err.message || 'An unexpected error occurred.');
      } finally {
        setIsLoadingBranches(false);
      }
    };
    fetchBranches();
  }, []);

  useEffect(() => {
    const fetchStockTransfers = async () => {
      try {
        const response = await fetch(`http://${tenantDomain}:8000/api/v1/multi_location/stock_transfers/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to fetch stock transfers.');
        }
        const data = await response.json();
        setStockTransfers(data);
      } catch (err: any) {
        setLoadingTransfersError(err.message || 'An unexpected error occurred.');
      } finally {
        setIsLoadingTransfers(false);
      }
    };
    fetchStockTransfers();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://${tenantDomain}:8000/api/v1/products/products/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to fetch products.');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err: any) {
        setLoadingProductsError(err.message || 'An unexpected error occurred.');
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // --- Form Handling and Helper Functions ---

  const handleCreateTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingTransfer(true);
    setCreateTransferError(null);
    setCreateTransferSuccess(false);

    if (!newTransfer.from_branch || !newTransfer.to_branch || !newTransfer.product_id || newTransfer.quantity <= 0) {
      setCreateTransferError('Please fill in all required fields.');
      setIsCreatingTransfer(false);
      return;
    }

    try {
      const payload = {
        from_branch: Number(newTransfer.from_branch),
        to_branch: Number(newTransfer.to_branch),
        product: Number(newTransfer.product_id),
        quantity: Number(newTransfer.quantity),
        notes: newTransfer.reason,
      };

      const response = await fetch(`http://{tenantDomain}:8000/api/v1/multi_location/stock_transfers/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok || response.status === 201) {
        const createdTransfer: StockTransfer = await response.json();
        setStockTransfers(prevTransfers => [createdTransfer, ...prevTransfers]);
        setCreateTransferSuccess(true);
        
        setNewTransfer({
          from_branch: '',
          to_branch: '',
          product_id: '',
          quantity: 0,
          reason: '',
        });

        setTimeout(() => {
          setIsTransferOpen(false);
        }, 1500);

      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || JSON.stringify(errorData) || 'Failed to create stock transfer.');
      }

    } catch (err: any) {
      setCreateTransferError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsCreatingTransfer(false);
    }
  };

  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingBranch(true);
    setCreateBranchError(null);
    setCreateBranchSuccess(false);

    if (!newBranch.branch_name || !newBranch.manager || !newBranch.address || !newBranch.city || !newBranch.county || !newBranch.phone_number || !newBranch.operating_hours) {
        setCreateBranchError('Please fill in all required fields.');
        setIsCreatingBranch(false);
        return;
    }

    try {
        const response = await fetch(`http://{tenantDomain}:8000/api/v1/multi_location/branches/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            },
            body: JSON.stringify(newBranch),
        });

        if (response.ok || response.status === 201) {
            const createdBranch: Branch = await response.json();
            setBranches(prevBranches => [...prevBranches, createdBranch]);
            setCreateBranchSuccess(true);
            setNewBranch({
                branch_name: '',
                address: '',
                city: '',
                county: '',
                phone_number: '',
                manager: '',
                is_active: true,
                operating_hours: '',
            });

            setTimeout(() => {
                setIsAddBranchOpen(false);
            }, 1500);
        } else {
            const errorData = await response.json();
            throw new Error(errorData.detail || JSON.stringify(errorData) || 'Failed to create branch.');
        }
    } catch (err: any) {
        setCreateBranchError(err.message || 'An unexpected error occurred.');
    } finally {
        setIsCreatingBranch(false);
    }
  };

  const getBranchName = (id: number) => {
    const branch = branches.find(b => b.id === id);
    return branch ? branch.branch_name : 'Unknown Branch';
  };
  
  const getProductName = (id: number) => {
    const product = products.find(p => p.id === id);
    return product ? product.name : 'Unknown Product';
  };

  const filteredBranches = selectedBranch === 'all' 
    ? branches 
    : branches.filter(branch => String(branch.id) === selectedBranch);

  const totalSales = branches.reduce((sum, branch) => sum + (branch.dailySales || 0), 0);
  const totalEmployees = branches.reduce((sum, branch) => sum + (branch.employees || 0), 0);
  const totalStockValue = branches.reduce((sum, branch) => sum + (branch.stockValue || 0), 0);
  const activeBranches = branches.filter(branch => branch.is_active).length;

  const getStatusColor = (is_active: boolean) => {
    return is_active ? 'default' : 'secondary';
  };

  const getTransferStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'in-transit': return 'default';
      case 'completed': return 'default';
      default: return 'secondary';
    }
  };
  
  const renderLoadingOrError = (isLoading: boolean, error: string | null, message: string) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-muted-foreground">{message}</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }
    return null;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1>Multi-Location Management</h1>
          <p className="text-muted-foreground">Manage your supermarket chain branches</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2" onClick={() => {
                setIsTransferOpen(true);
                setCreateTransferError(null);
                setCreateTransferSuccess(false);
              }}>
                <Truck className="h-4 w-4" />
                Stock Transfer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Stock Transfer</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateTransfer}>
                <div className="grid grid-cols-1 gap-4 py-4">
                  <div className="space-y-2">
                    <Label>From Branch</Label>
                    <Select
                      value={newTransfer.from_branch}
                      onValueChange={(value) => setNewTransfer({ ...newTransfer, from_branch: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select source branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.filter(b => b.is_active).map(branch => (
                          <SelectItem key={branch.id} value={String(branch.id)}>{branch.branch_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>To Branch</Label>
                    <Select
                      value={newTransfer.to_branch}
                      onValueChange={(value) => setNewTransfer({ ...newTransfer, to_branch: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.filter(b => b.is_active).map(branch => (
                          <SelectItem key={branch.id} value={String(branch.id)}>{branch.branch_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Product</Label>
                    <Select
                      value={newTransfer.product_id}
                      onValueChange={(value) => setNewTransfer({ ...newTransfer, product_id: value })}
                      disabled={isLoadingProducts}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingProducts ? "Loading products..." : "Select a product"} />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map(product => (
                          <SelectItem key={product.id} value={String(product.id)}>{product.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {loadingProductsError && <p className="text-sm text-red-500 mt-1">{loadingProductsError}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      placeholder="Enter quantity"
                      value={newTransfer.quantity}
                      onChange={(e) => setNewTransfer({ ...newTransfer, quantity: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Reason</Label>
                    <Textarea
                      placeholder="Reason for transfer (optional)"
                      value={newTransfer.reason}
                      onChange={(e) => setNewTransfer({ ...newTransfer, reason: e.target.value })}
                    />
                  </div>
                </div>
                
                {isCreatingTransfer && (
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Creating transfer...</span>
                  </div>
                )}
                {createTransferError && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{createTransferError}</AlertDescription>
                  </Alert>
                )}
                {createTransferSuccess && (
                  <Alert className="mt-4 border-green-500">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>Stock transfer created successfully!</AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" type="button" onClick={() => setIsTransferOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isCreatingTransfer}>
                    {isCreatingTransfer ? 'Creating...' : 'Create Transfer'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isAddBranchOpen} onOpenChange={setIsAddBranchOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Branch
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Branch</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateBranch}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="branch_name">Branch Name</Label>
                    <Input 
                        id="branch_name" 
                        placeholder="Enter branch name" 
                        value={newBranch.branch_name}
                        onChange={(e) => setNewBranch({ ...newBranch, branch_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manager">Manager</Label>
                    <Input 
                        id="manager" 
                        placeholder="Branch manager name"
                        value={newBranch.manager}
                        onChange={(e) => setNewBranch({ ...newBranch, manager: e.target.value })}
                    />
                  </div>
                  <div className="col-span-full space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input 
                        id="address" 
                        placeholder="Full address" 
                        value={newBranch.address}
                        onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input 
                        id="city" 
                        placeholder="City" 
                        value={newBranch.city}
                        onChange={(e) => setNewBranch({ ...newBranch, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="county">County</Label>
                    <Select
                        value={newBranch.county}
                        onValueChange={(value) => setNewBranch({ ...newBranch, county: value })}
                    >
                        <SelectTrigger id="county">
                            <SelectValue placeholder="Select county" />
                        </SelectTrigger>
                        <SelectContent>
                            {BRANCH_COUNTIES.map((county) => (
                                <SelectItem key={county} value={county}>
                                    {county}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone_number">Phone</Label>
                    <Input 
                        id="phone_number" 
                        placeholder="+254 700 000 000" 
                        value={newBranch.phone_number}
                        onChange={(e) => setNewBranch({ ...newBranch, phone_number: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="operating_hours">Operating Hours</Label>
                    <Input 
                        id="operating_hours" 
                        placeholder="e.g., 6:00 AM - 10:00 PM" 
                        value={newBranch.operating_hours}
                        onChange={(e) => setNewBranch({ ...newBranch, operating_hours: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                        id="active" 
                        checked={newBranch.is_active}
                        onCheckedChange={(checked) => setNewBranch({ ...newBranch, is_active: checked })}
                    />
                    <Label htmlFor="active">Active Branch</Label>
                  </div>
                </div>

                {isCreatingBranch && (
                    <div className="mt-4 flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">Adding branch...</span>
                    </div>
                )}
                {createBranchError && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{createBranchError}</AlertDescription>
                    </Alert>
                )}
                {createBranchSuccess && (
                    <Alert className="mt-4 border-green-500">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>Branch added successfully!</AlertDescription>
                    </Alert>
                )}

                <DialogFooter className="mt-6">
                    <Button variant="outline" type="button" onClick={() => setIsAddBranchOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={isCreatingBranch}>
                        {isCreatingBranch ? 'Adding...' : 'Add Branch'}
                    </Button>
                </DialogFooter>
              </form>
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
                <p className="text-sm text-muted-foreground">Total Branches</p>
                <p className="text-2xl">{branches.length}</p>
                <p className="text-sm text-green-600">{activeBranches} active</p>
              </div>
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Daily Sales</p>
                <p className="text-2xl">KES {totalSales.toLocaleString()}</p>
                <p className="text-sm text-green-600">All branches</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Employees</p>
                <p className="text-2xl">{totalEmployees}</p>
                <p className="text-sm text-muted-foreground">Across all branches</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Stock Value</p>
                <p className="text-2xl">KES {(totalStockValue / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-muted-foreground">Chain-wide inventory</p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="branches" className="space-y-6">
        <TabsList>
          <TabsTrigger value="branches">Branch Overview</TabsTrigger>
          <TabsTrigger value="transfers">Stock Transfers</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="branches" className="space-y-6">
          {renderLoadingOrError(isLoadingBranches, loadingBranchesError, 'Loading branches...')}
          
          <div className="flex items-center gap-4">
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {branches.map(branch => (
                  <SelectItem key={branch.id} value={String(branch.id)}>{branch.branch_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredBranches.map((branch) => (
              <Card key={branch.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{branch.branch_name}</CardTitle>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {branch.address}, {branch.city}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(branch.is_active)}>
                      {branch.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Manager</p>
                      <p className="font-medium">{branch.manager}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Employees</p>
                      <p className="font-medium">{branch.employees || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Daily Sales</p>
                      <p className="font-medium">KES {(branch.dailySales || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Sales</p>
                      <p className="font-medium">KES {((branch.monthlySales || 0) / 1000000).toFixed(1)}M</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Stock Value</span>
                      <span className="text-sm font-medium">KES {((branch.stockValue || 0) / 1000000).toFixed(1)}M</span>
                    </div>
                    <Progress value={((branch.stockValue || 0) / 3000000) * 100} className="h-2" />
                  </div>

                  <div className="pt-2 border-t space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Operating Hours:</span>
                      <span>{branch.operating_hours}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Phone:</span>
                      <span>{branch.phone_number}</span>
                    </div>
                  </div>

                  {branch.is_active === false && (
                    <div className="flex items-center gap-2 p-2 bg-destructive/10 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      <span className="text-sm text-destructive">Branch is inactive</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transfers" className="space-y-6">
          {renderLoadingOrError(isLoadingTransfers, loadingTransfersError, 'Loading stock transfers...')}

          <div className="flex items-center justify-between">
            <h3 className="font-medium">Stock Transfer Requests</h3>
            <Badge variant="outline">{stockTransfers.length} transfers</Badge>
          </div>

          <div className="space-y-4">
            {stockTransfers.map((transfer) => (
              <Card key={transfer.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{getProductName(transfer.product)}</h4>
                        <Badge variant="outline">{transfer.quantity} units</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        From: <span className="font-medium">{getBranchName(transfer.from_branch)}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        To: <span className="font-medium">{getBranchName(transfer.to_branch)}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Requested: {new Date(transfer.request_date).toLocaleDateString()}
                        {transfer.completed_date && (
                          <span> • Completed: {new Date(transfer.completed_date).toLocaleDateString()}</span>
                        )}
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge variant={getTransferStatusColor(transfer.status)}>
                        {transfer.status.charAt(0).toUpperCase() + transfer.status.slice(1)}
                      </Badge>
                      {transfer.status === 'pending' && (
                        <div className="space-x-2">
                          <Button size="sm" variant="outline">Approve</Button>
                          <Button size="sm" variant="destructive">Reject</Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {branches.map((branch) => (
                    <div key={branch.id} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{branch.branch_name}</span>
                        <span className="text-sm">KES {(branch.dailySales || 0).toLocaleString()}</span>
                      </div>
                      <Progress value={((branch.dailySales || 0) / 150000) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Employee Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {branches.map((branch) => (
                    <div key={branch.id} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{branch.branch_name}</span>
                        <span className="text-sm">{branch.employees || 0} employees</span>
                      </div>
                      <Progress value={((branch.employees || 0) / 25) * 100} className="h-2" />
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