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
import { Progress } from './ui/progress';
import { Building2, Plus, MapPin, Users, TrendingUp, Package, AlertCircle, Truck } from 'lucide-react';

interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  county: string;
  phone: string;
  manager: string;
  status: 'active' | 'inactive' | 'maintenance';
  employees: number;
  dailySales: number;
  monthlySales: number;
  stockValue: number;
  lastSync: string;
  operatingHours: string;
}

interface StockTransfer {
  id: string;
  fromBranch: string;
  toBranch: string;
  product: string;
  quantity: number;
  status: 'pending' | 'in-transit' | 'completed';
  requestDate: string;
  completedDate?: string;
}

export function MultiLocationManagement() {
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  // Mock data - would come from Django API
  const [branches] = useState<Branch[]>([
    {
      id: '1',
      name: 'Main Store - Nairobi CBD',
      address: 'Kenyatta Avenue, CBD',
      city: 'Nairobi',
      county: 'Nairobi',
      phone: '+254 700 123 456',
      manager: 'Jane Wanjiku',
      status: 'active',
      employees: 25,
      dailySales: 150000,
      monthlySales: 4200000,
      stockValue: 2800000,
      lastSync: '2024-08-17 14:30',
      operatingHours: '6:00 AM - 10:00 PM'
    },
    {
      id: '2',
      name: 'Westlands Branch',
      address: 'Westlands Mall, 2nd Floor',
      city: 'Nairobi',
      county: 'Nairobi',
      phone: '+254 700 234 567',
      manager: 'David Kimani',
      status: 'active',
      employees: 18,
      dailySales: 95000,
      monthlySales: 2700000,
      stockValue: 1850000,
      lastSync: '2024-08-17 14:25',
      operatingHours: '7:00 AM - 9:00 PM'
    },
    {
      id: '3',
      name: 'Nakuru Branch',
      address: 'Kenyatta Avenue, Nakuru',
      city: 'Nakuru',
      county: 'Nakuru',
      phone: '+254 700 345 678',
      manager: 'Mary Njeri',
      status: 'active',
      employees: 15,
      dailySales: 75000,
      monthlySales: 2100000,
      stockValue: 1400000,
      lastSync: '2024-08-17 14:15',
      operatingHours: '6:30 AM - 9:30 PM'
    },
    {
      id: '4',
      name: 'Mombasa Road Branch',
      address: 'Mombasa Road, Industrial Area',
      city: 'Nairobi',
      county: 'Nairobi',
      phone: '+254 700 456 789',
      manager: 'Peter Ochieng',
      status: 'maintenance',
      employees: 12,
      dailySales: 0,
      monthlySales: 1800000,
      stockValue: 950000,
      lastSync: '2024-08-16 18:30',
      operatingHours: 'Closed for maintenance'
    }
  ]);

  const [stockTransfers] = useState<StockTransfer[]>([
    {
      id: '1',
      fromBranch: 'Main Store - Nairobi CBD',
      toBranch: 'Westlands Branch',
      product: 'Rice - 2kg Basmati',
      quantity: 50,
      status: 'pending',
      requestDate: '2024-08-17',
    },
    {
      id: '2',
      fromBranch: 'Main Store - Nairobi CBD',
      toBranch: 'Nakuru Branch',
      product: 'Cooking Oil - 1L',
      quantity: 30,
      status: 'in-transit',
      requestDate: '2024-08-16',
    },
    {
      id: '3',
      fromBranch: 'Westlands Branch',
      toBranch: 'Mombasa Road Branch',
      product: 'Sugar - 1kg White',
      quantity: 25,
      status: 'completed',
      requestDate: '2024-08-15',
      completedDate: '2024-08-16'
    }
  ]);

  const filteredBranches = selectedBranch === 'all' 
    ? branches 
    : branches.filter(branch => branch.id === selectedBranch);

  const totalSales = branches.reduce((sum, branch) => sum + branch.dailySales, 0);
  const totalEmployees = branches.reduce((sum, branch) => sum + branch.employees, 0);
  const totalStockValue = branches.reduce((sum, branch) => sum + branch.stockValue, 0);
  const activeBranches = branches.filter(branch => branch.status === 'active').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'maintenance': return 'destructive';
      default: return 'secondary';
    }
  };

  const getTransferStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'in-transit': return 'default';
      case 'completed': return 'default';
      default: return 'secondary';
    }
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
              <Button variant="outline" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Stock Transfer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Stock Transfer</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 gap-4 py-4">
                <div className="space-y-2">
                  <Label>From Branch</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.filter(b => b.status === 'active').map(branch => (
                        <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>To Branch</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.filter(b => b.status === 'active').map(branch => (
                        <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Product</Label>
                  <Input placeholder="Search product..." />
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input type="number" placeholder="Enter quantity" />
                </div>
                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Textarea placeholder="Reason for transfer (optional)" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsTransferOpen(false)}>Cancel</Button>
                <Button>Create Transfer</Button>
              </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Branch Name</Label>
                  <Input placeholder="Enter branch name" />
                </div>
                <div className="space-y-2">
                  <Label>Manager</Label>
                  <Input placeholder="Branch manager name" />
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
                  <Label>County</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select county" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nairobi">Nairobi</SelectItem>
                      <SelectItem value="mombasa">Mombasa</SelectItem>
                      <SelectItem value="kisumu">Kisumu</SelectItem>
                      <SelectItem value="nakuru">Nakuru</SelectItem>
                      <SelectItem value="eldoret">Uasin Gishu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input placeholder="+254 700 000 000" />
                </div>
                <div className="space-y-2">
                  <Label>Operating Hours</Label>
                  <Input placeholder="e.g., 6:00 AM - 10:00 PM" />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="active" defaultChecked />
                  <Label htmlFor="active">Active Branch</Label>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddBranchOpen(false)}>Cancel</Button>
                <Button>Add Branch</Button>
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
          <div className="flex items-center gap-4">
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {branches.map(branch => (
                  <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
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
                      <CardTitle className="text-lg">{branch.name}</CardTitle>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {branch.address}, {branch.city}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(branch.status)}>
                      {branch.status.charAt(0).toUpperCase() + branch.status.slice(1)}
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
                      <p className="font-medium">{branch.employees}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Daily Sales</p>
                      <p className="font-medium">KES {branch.dailySales.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Sales</p>
                      <p className="font-medium">KES {(branch.monthlySales / 1000000).toFixed(1)}M</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Stock Value</span>
                      <span className="text-sm font-medium">KES {(branch.stockValue / 1000000).toFixed(1)}M</span>
                    </div>
                    <Progress value={(branch.stockValue / 3000000) * 100} className="h-2" />
                  </div>

                  <div className="pt-2 border-t space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Operating Hours:</span>
                      <span>{branch.operatingHours}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last Sync:</span>
                      <span>{branch.lastSync}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Phone:</span>
                      <span>{branch.phone}</span>
                    </div>
                  </div>

                  {branch.status === 'maintenance' && (
                    <div className="flex items-center gap-2 p-2 bg-destructive/10 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      <span className="text-sm text-destructive">Branch under maintenance</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transfers" className="space-y-6">
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
                        <h4 className="font-medium">{transfer.product}</h4>
                        <Badge variant="outline">{transfer.quantity} units</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        From: <span className="font-medium">{transfer.fromBranch}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        To: <span className="font-medium">{transfer.toBranch}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Requested: {new Date(transfer.requestDate).toLocaleDateString()}
                        {transfer.completedDate && (
                          <span> • Completed: {new Date(transfer.completedDate).toLocaleDateString()}</span>
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
                        <span className="text-sm font-medium">{branch.name}</span>
                        <span className="text-sm">KES {branch.dailySales.toLocaleString()}</span>
                      </div>
                      <Progress value={(branch.dailySales / 150000) * 100} className="h-2" />
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
                        <span className="text-sm font-medium">{branch.name}</span>
                        <span className="text-sm">{branch.employees} employees</span>
                      </div>
                      <Progress value={(branch.employees / 25) * 100} className="h-2" />
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