import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Trash2, Plus, Minus, Calculator, CreditCard, Banknote, Receipt, Loader2, AlertCircle, Printer, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner';
//  interface to match the API response
interface Product {
  id: number; 
  name: string;
  description: string;
  category: string;
  cost_price: string;
  selling_price: string; 
  initial_stock: number;
  current_stock: number;
  minimum_stock_level: number;
  barcode: string;
  is_perishable: boolean;
  is_active: boolean;
}

// CartItem interface
interface CartItem {
  id: number;
  name: string;
  price: number; 
  quantity: number;
  barcode?: string;
  category: string;
}

export function PointOfSale() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountTendered, setAmountTendered] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');

  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [lastTransactionDetails, setLastTransactionDetails] = useState<any>(null);

  const tenantDomain = localStorage.getItem('tenant_domain');
  
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        setError("Authentication token not found. Please log in.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://${tenantDomain}:8000/api/v1/products/products/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch products. Please try again.');
        }

        const data = await response.json();
        setFetchedProducts(data);
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError(err.message || 'An unexpected error occurred while fetching products.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [tenantDomain]);

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    const sellingPrice = parseFloat(product.selling_price);

    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        id: product.id,
        name: product.name,
        price: sellingPrice,
        quantity: 1,
        barcode: product.barcode,
        category: product.category,
      }]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const vatRate = 0.16; 
  const vatAmount = subtotal * vatRate;
  const total = subtotal + vatAmount;
  const change = paymentMethod === 'cash' ? parseFloat(amountTendered) - total : 0;

  const filteredProducts = fetchedProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.barcode?.includes(searchQuery)
  );
  
  const validateForm = () => {
    if (cart.length === 0) {
      toast("Cart cannot be empty.");
      return false;
    }

    if (paymentMethod === 'mpesa' && !customerPhone) {
      toast("Customer phone number is required for M-Pesa payments.");
      return false;
    }

    if (paymentMethod === 'card') {
      if (!cardNumber || !expiryDate || !cvc) {
        toast("Card details are required.");
        return false;
      }
      
      if (cardNumber.length < 16) {
        toast("Card number must be 16 digits.");
        return false;
      }
      if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        toast("Expiry date must be in MM/YY format.");
        return false;
      }
      if (cvc.length < 3) {
        toast("CVC must be 3 or 4 digits.");
        return false;
      }
    }

    if (paymentMethod === 'cash' && parseFloat(amountTendered) < total) {
      toast("Amount tendered is insufficient.");
      return false;
    }

    return true;
  };

  const processPayment = () => {
    if (!validateForm()) {
      return;
    }

    const transactionId = `TRX-${Date.now()}`;
    const transactionTime = new Date().toLocaleString();

    const transactionDetails = {
      id: transactionId,
      time: transactionTime,
      customerName: customerName || 'N/A',
      customerAddress: customerAddress || 'N/A',
      items: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price
      })),
      subtotal: subtotal,
      vat: vatAmount,
      total: total,
      paymentMethod: paymentMethod,
      amountTendered: parseFloat(amountTendered) || total,
      change: change >= 0 ? change : 0,
      customerPhone: customerPhone || 'N/A',
    };

    setLastTransactionDetails(transactionDetails);
    setIsReceiptOpen(true);
    
  
    setCart([]);
    setAmountTendered('');
    setCustomerPhone('');
    setSearchQuery('');
    setCustomerName('');
    setCustomerAddress('');
    setCardNumber('');
    setExpiryDate('');
    setCvc('');
  };

  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1>Point of Sale</h1>
          <p className="text-muted-foreground">Process customer transactions</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Branch: Main Store</p>
          <p className="text-sm text-muted-foreground">Cashier: John Doe</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Search & Selection */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Product Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Search products by name or scan barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

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
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => addToCart(product)}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-sm line-clamp-2">{product.name}</h4>
                            <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                          </div>
                          <p className="font-semibold text-primary">KES {parseFloat(product.selling_price).toFixed(2)}</p>
                          {product.barcode && (
                            <p className="text-xs text-muted-foreground mt-1">{product.barcode}</p>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-3 text-center text-muted-foreground py-8">
                      No products found.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Shopping Cart & Payment */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Shopping Cart
                </span>
                <Badge variant="outline">{cart.length} items</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-64 overflow-y-auto space-y-3">
                {cart.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">Cart is empty</p>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{item.name}</h5>
                        <p className="text-sm text-muted-foreground">KES {item.price.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>KES {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (16%):</span>
                  <span>KES {vatAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>KES {total.toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Input
                  placeholder="Customer Name (optional)"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />

                <Input
                  placeholder="Customer Address (optional)"
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                />

                <Input
                  placeholder="Customer phone (optional)"
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required={paymentMethod === 'mpesa'}
                />

                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">
                      <div className="flex items-center gap-2">
                        <Banknote className="h-4 w-4" />
                        Cash Payment
                      </div>
                    </SelectItem>
                    <SelectItem value="mpesa">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        M-Pesa
                      </div>
                    </SelectItem>
                    <SelectItem value="card">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Card Payment
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                {paymentMethod === 'cash' && (
                  <div>
                    <Input
                      placeholder="Amount tendered"
                      type="number"
                      value={amountTendered}
                      onChange={(e) => setAmountTendered(e.target.value)}
                    />
                    {amountTendered && (
                      <p className="text-sm mt-1">
                        Change: <span className={change >= 0 ? 'text-green-600' : 'text-red-600'}>
                          KES {change >= 0 ? change.toFixed(2) : 'Insufficient amount'}
                        </span>
                      </p>
                    )}
                  </div>
                )}
                
                {paymentMethod === 'card' && (
                  <div className="space-y-2">
                    <Input
                      placeholder="Card Number"
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                    />
                    <div className="flex gap-2">
                      <Input
                        placeholder="MM/YY"
                        type="text"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        required
                      />
                      <Input
                        placeholder="CVC"
                        type="text"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}

                <Button
                  className="w-full"
                  onClick={processPayment}
                  disabled={cart.length === 0}
                >
                  Process Payment - KES {total.toFixed(2)}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Receipt Dialog */}
      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Transaction Receipt</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4"
              onClick={() => setIsReceiptOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-2xl font-bold">POS Receipt</h2>
            <div className="w-full text-left space-y-1 text-sm">
              <p><strong>Transaction ID:</strong> {lastTransactionDetails?.id}</p>
              <p><strong>Date & Time:</strong> {lastTransactionDetails?.time}</p>
              <p><strong>Cashier:</strong> John Doe</p>
              <p><strong>Customer Name:</strong> {lastTransactionDetails?.customerName}</p>
              <p><strong>Customer Address:</strong> {lastTransactionDetails?.customerAddress}</p>
            </div>
            
            <Separator className="w-full" />
            
            <div className="w-full text-left space-y-2">
              <h3 className="font-semibold text-lg">Items Purchased</h3>
              {lastTransactionDetails?.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">({item.quantity} x KES {item.price.toFixed(2)})</p>
                  </div>
                  <span>KES {item.total.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <Separator className="w-full" />
            
            <div className="w-full text-left space-y-1 text-sm">
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p>KES {lastTransactionDetails?.subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>VAT (16%)</p>
                <p>KES {lastTransactionDetails?.vat.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <p>Total</p>
                <p>KES {lastTransactionDetails?.total.toFixed(2)}</p>
              </div>
            </div>
            
            <Separator className="w-full" />
            
            <div className="w-full text-left space-y-1 text-sm">
              <div className="flex justify-between">
                <p>Payment Method</p>
                <p>{lastTransactionDetails?.paymentMethod.toUpperCase()}</p>
              </div>
              <div className="flex justify-between">
                <p>Amount Tendered</p>
                <p>KES {lastTransactionDetails?.amountTendered.toFixed(2)}</p>
              </div>
              <div className="flex justify-between font-bold text-green-600">
                <p>Change</p>
                <p>KES {lastTransactionDetails?.change.toFixed(2)}</p>
              </div>
            </div>

            <Button onClick={printReceipt} className="w-full mt-4">
              <Printer className="h-4 w-4 mr-2" />
              Print Receipt
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}