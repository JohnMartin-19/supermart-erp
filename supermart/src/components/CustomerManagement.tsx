import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Users, Plus, Search, Phone, CreditCard, TrendingUp, Gift, UserPlus } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  membershipTier: 'regular' | 'silver' | 'gold' | 'platinum';
  loyaltyPoints: number;
  totalSpent: number;
  lastVisit: string;
  joinDate: string;
  isActive: boolean;
}

export function CustomerManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('all');
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);

  // Mock data - would come from Django API
  const [customers] = useState<Customer[]>([
    {
      id: '1',
      name: 'Grace Wanjiku',
      phone: '+254 722 123 456',
      email: 'grace@email.com',
      address: 'Karen, Nairobi',
      membershipTier: 'gold',
      loyaltyPoints: 2850,
      totalSpent: 485000,
      lastVisit: '2024-08-17',
      joinDate: '2023-05-15',
      isActive: true
    },
    {
      id: '2',
      name: 'David Kimani',
      phone: '+254 733 234 567',
      membershipTier: 'silver',
      loyaltyPoints: 1420,
      totalSpent: 285000,
      lastVisit: '2024-08-16',
      joinDate: '2023-08-20',
      isActive: true
    },
    {
      id: '3',
      name: 'Mary Njeri',
      phone: '+254 700 345 678',
      email: 'mary.njeri@email.com',
      address: 'Westlands, Nairobi',
      membershipTier: 'platinum',
      loyaltyPoints: 5200,
      totalSpent: 850000,
      lastVisit: '2024-08-17',
      joinDate: '2022-11-10',
      isActive: true
    },
    {
      id: '4',
      name: 'Peter Ochieng',
      phone: '+254 711 456 789',
      membershipTier: 'regular',
      loyaltyPoints: 450,
      totalSpent: 95000,
      lastVisit: '2024-08-15',
      joinDate: '2024-02-28',
      isActive: true
    }
  ]);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.phone.includes(searchQuery) ||
                         customer.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = selectedTier === 'all' || customer.membershipTier === selectedTier;
    return matchesSearch && matchesTier;
  });

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

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.isActive).length;
  const totalLoyaltyPoints = customers.reduce((sum, c) => sum + c.loyaltyPoints, 0);
  const averageSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1>Customer Management</h1>
          <p className="text-muted-foreground">Manage customer relationships and loyalty programs</p>
        </div>
        <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter customer name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="+254 700 000 000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input id="email" type="email" placeholder="customer@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address (Optional)</Label>
                <Input id="address" placeholder="Customer address" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tier">Membership Tier</Label>
                <Select>
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
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddCustomerOpen(false)}>Cancel</Button>
              <Button>Add Customer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Cards */}
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
                        {customer.name}
                        <span className="text-lg">{getTierIcon(customer.membershipTier)}</span>
                      </CardTitle>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <Phone className="h-3 w-3" />
                        {customer.phone}
                      </div>
                    </div>
                    <Badge className={getTierColor(customer.membershipTier)}>
                      {customer.membershipTier.charAt(0).toUpperCase() + customer.membershipTier.slice(1)}
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
                        {customer.loyaltyPoints.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Spent</p>
                      <p className="font-medium">KES {Math.round(customer.totalSpent / 1000)}K</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Last Visit</p>
                      <p className="text-xs">{new Date(customer.lastVisit).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Member Since</p>
                      <p className="text-xs">{new Date(customer.joinDate).toLocaleDateString()}</p>
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
                    <span>{customers.filter(c => c.membershipTier === 'regular').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <span>🥈</span> Silver
                    </span>
                    <span>{customers.filter(c => c.membershipTier === 'silver').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <span>🥇</span> Gold
                    </span>
                    <span>{customers.filter(c => c.membershipTier === 'gold').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <span>💎</span> Platinum
                    </span>
                    <span>{customers.filter(c => c.membershipTier === 'platinum').length}</span>
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
                    .sort((a, b) => b.totalSpent - a.totalSpent)
                    .slice(0, 5)
                    .map((customer, index) => (
                    <div key={customer.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getTierIcon(customer.membershipTier)}</span>
                        <span className="font-medium">{customer.name}</span>
                      </div>
                      <span>KES {Math.round(customer.totalSpent / 1000)}K</span>
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