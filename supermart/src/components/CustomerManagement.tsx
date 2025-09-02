import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Users, Plus, Search, Phone, CreditCard, TrendingUp, Gift, UserPlus, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Progress } from './ui/progress';

interface Customer {
  id: number;
  full_name: string;
  phone_number: string;
  email?: string;
  address?: string;
  membership_tier: number;
  member_since: string;
  last_visit: string;
  loyalty_points?: number;
  total_spent?: number;
  is_active?: boolean;
}

interface TransformedCustomer extends Omit<Customer, 'membership_tier'> {
  membership_tier: number;
  membership_tier_string: 'regular' | 'silver' | 'gold' | 'platinum';
}

// A mapping from string tier names to their numerical IDs for POST requests
// const tierMap = {
//   regular: 1,
//   silver: 2,
//   gold: 3,
//   platinum: 4,
// };

// Helper function to map numerical tiers to string names for the UI
const mapTierNumberToString = (tierNumber: number): 'regular' | 'silver' | 'gold' | 'platinum' => {
  switch (tierNumber) {
    case 1:
      return 'regular';
    case 2:
      return 'silver';
    case 3:
      return 'gold';
    case 4:
      return 'platinum';
    default:
      return 'regular';
  }
};

export function CustomerManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('all');
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [customers, setCustomers] = useState<TransformedCustomer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for the new customer form
  const [newCustomer, setNewCustomer] = useState({
    full_name: '',
    phone_number: '',
    email: '',
    address: '',
    membership_tier: 'regular',
  });
  const [isAdding, setIsAdding] = useState(false);
  const [addCustomerError, setAddCustomerError] = useState<string | null>(null);
  const [addCustomerSuccess, setAddCustomerSuccess] = useState(false);
  const tenantDomain = localStorage.getItem("tenant_domain")
  const fetchCustomers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://${tenantDomain}:8000/api/v1/customers/customers/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch customers.');
      }

      const data: Customer[] = await response.json();
      
      const transformedData: TransformedCustomer[] = data.map((customer) => ({
        ...customer,
        membership_tier_string: mapTierNumberToString(customer.membership_tier),
      }));

      setCustomers(transformedData);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    setAddCustomerError(null);
    setAddCustomerSuccess(false);

    try {
      const payload = {
        full_name: newCustomer.full_name,
        phone_number: newCustomer.phone_number,
        email: newCustomer.email,
        address: newCustomer.address,
        // Convert the string tier from the form to the numerical ID for the backend
        membership_tier: newCustomer.membership_tier,
       
      };

      const response = await fetch(`http://${tenantDomain}:8000/api/v1/customers/customers/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add customer.');
      }

      const addedCustomer: Customer = await response.json();
      
      // Transform the added customer data to match the UI state
      const transformedAddedCustomer: TransformedCustomer = {
        ...addedCustomer,
        membership_tier_string: mapTierNumberToString(addedCustomer.membership_tier),
      };

      setCustomers(prevCustomers => [...prevCustomers, transformedAddedCustomer]);
      setAddCustomerSuccess(true);

      // Reset the form after successful submission
      setNewCustomer({
        full_name: '',
        phone_number: '',
        email: '',
        address: '',
        membership_tier: 'regular',
      });

    } catch (err: any) {
      setAddCustomerError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsAdding(false);
      // Close dialog after a short delay to show success/error message
      setTimeout(() => {
        setIsAddCustomerOpen(false);
      }, 1500);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'silver': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'platinum': return '💎';
      case 'gold': return '🥇';
      case 'silver': return '🥈';
      default: return '👤';
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.phone_number?.includes(searchQuery) ||
                         customer.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = selectedTier === 'all' || customer.membership_tier_string === selectedTier;
    return matchesSearch && matchesTier;
  });

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.is_active).length;
  const totalLoyaltyPoints = customers.reduce((sum, c) => sum + (c.loyalty_points || 0), 0);
  const averageSpent = customers.length > 0 ? customers.reduce((sum, c) => sum + (c.total_spent || 0), 0) / customers.length : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading customers...</p>
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
          <h1>Customer Management</h1>
          <p className="text-muted-foreground">Manage customer relationships and loyalty programs</p>
        </div>
        <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2" onClick={() => {
              setIsAddCustomerOpen(true);
              setAddCustomerError(null);
              setAddCustomerSuccess(false);
            }}>
              <Plus className="h-4 w-4" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCustomer}>
              <div className="grid grid-cols-1 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    placeholder="Enter customer name"
                    value={newCustomer.full_name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, full_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    placeholder="+254 700 000 000"
                    value={newCustomer.phone_number}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone_number: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="customer@email.com"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address (Optional)</Label>
                  <Input
                    id="address"
                    placeholder="Customer address"
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="membership_tier">Membership Tier</Label>
                  <Select
                    value={newCustomer.membership_tier}
                    onValueChange={(value) => setNewCustomer({ ...newCustomer, membership_tier: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="silver">Silver</SelectItem>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="platinum">Platinum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {isAdding && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Adding customer...</span>
                </div>
              )}
              {addCustomerError && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{addCustomerError}</AlertDescription>
                </Alert>
              )}
              {addCustomerSuccess && (
                <Alert className="mt-4 border-green-500">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>Customer added successfully!</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" type="button" onClick={() => setIsAddCustomerOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isAdding}>
                  {isAdding ? 'Adding...' : 'Add Customer'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <p className="text-2xl">{totalCustomers}</p>
                <p className="text-sm text-green-600">{activeCustomers} active</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Spend</p>
                <p className="text-2xl">KES {Math.round(averageSpent / 1000)}K</p>
                <p className="text-sm text-muted-foreground">Per customer</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Loyalty Points</p>
                <p className="text-2xl">{Math.round(totalLoyaltyPoints / 1000)}K</p>
                <p className="text-sm text-muted-foreground">Total issued</p>
              </div>
              <Gift className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New This Month</p>
                <p className="text-2xl">12</p>
                <p className="text-sm text-green-600">+15% growth</p>
              </div>
              <UserPlus className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="customers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="customers">Customer List</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty Program</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers by name, phone, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedTier} onValueChange={setSelectedTier}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="platinum">Platinum</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        {customer.full_name}
                        <span className="text-lg">{getTierIcon(customer.membership_tier_string)}</span>
                      </CardTitle>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <Phone className="h-3 w-3" />
                        {customer.phone_number}
                      </div>
                    </div>
                    <Badge className={getTierColor(customer.membership_tier_string)}>
                      {customer.membership_tier_string.charAt(0).toUpperCase() + customer.membership_tier_string.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {customer.email && (
                    <p className="text-sm text-muted-foreground">{customer.email}</p>
                  )}
                  {customer.address && (
                    <p className="text-sm text-muted-foreground">{customer.address}</p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground">Loyalty Points</p>
                      <p className="font-medium flex items-center gap-1">
                        <Gift className="h-3 w-3" />
                        {(customer.loyalty_points || 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Spent</p>
                      <p className="font-medium">KES {Math.round((customer.total_spent || 0) / 1000)}K</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Last Visit</p>
                      <p className="text-xs">{new Date(customer.last_visit).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Member Since</p>
                      <p className="text-xs">{new Date(customer.member_since).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      View History
                    </Button>
                    <Button size="sm" variant="outline">
                      <CreditCard className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="loyalty" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Loyalty Program Tiers</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage customer loyalty tiers and rewards
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">👤</div>
                    <h4 className="font-medium">Regular</h4>
                    <p className="text-sm text-muted-foreground">0 - KES 50,000</p>
                    <p className="text-xs mt-2">1 point per KES 100</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">🥈</div>
                    <h4 className="font-medium">Silver</h4>
                    <p className="text-sm text-muted-foreground">KES 50K - 200K</p>
                    <p className="text-xs mt-2">1.5 points per KES 100</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">🥇</div>
                    <h4 className="font-medium">Gold</h4>
                    <p className="text-sm text-muted-foreground">KES 200K - 500K</p>
                    <p className="text-xs mt-2">2 points per KES 100</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">💎</div>
                    <h4 className="font-medium">Platinum</h4>
                    <p className="text-sm text-muted-foreground">KES 500K+</p>
                    <p className="text-xs mt-2">3 points per KES 100</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rewards Catalog</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <h5 className="font-medium">KES 50 Shopping Voucher</h5>
                    <p className="text-sm text-muted-foreground">Redeemable on any purchase</p>
                  </div>
                  <Badge variant="outline">500 points</Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <h5 className="font-medium">Free Delivery</h5>
                    <p className="text-sm text-muted-foreground">Free delivery within Nairobi</p>
                  </div>
                  <Badge variant="outline">200 points</Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <h5 className="font-medium">10% Discount</h5>
                    <p className="text-sm text-muted-foreground">On next purchase</p>
                  </div>
                  <Badge variant="outline">300 points</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Distribution by Tier</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <span>👤</span> Regular
                    </span>
                    <span>{customers.filter(c => c.membership_tier_string === 'regular').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <span>🥈</span> Silver
                    </span>
                    <span>{customers.filter(c => c.membership_tier_string === 'silver').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <span>🥇</span> Gold
                    </span>
                    <span>{customers.filter(c => c.membership_tier_string === 'gold').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <span>💎</span> Platinum
                    </span>
                    <span>{customers.filter(c => c.membership_tier_string === 'platinum').length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Customers by Spending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {customers
                    .sort((a, b) => (b.total_spent || 0) - (a.total_spent || 0))
                    .slice(0, 5)
                    .map((customer) => (
                    <div key={customer.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getTierIcon(customer.membership_tier_string)}</span>
                        <span className="font-medium">{customer.full_name}</span>
                      </div>
                      <span>KES {Math.round((customer.total_spent || 0) / 1000)}K</span>
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