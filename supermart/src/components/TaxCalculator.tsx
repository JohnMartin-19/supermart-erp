import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Calculator, Copy, RotateCcw, FileText } from 'lucide-react';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';

export function GSTCalculator() {
  const [calculationType, setCalculationType] = useState<'exclusive' | 'inclusive'>('exclusive');
  const [amount, setAmount] = useState('');
  const [gstRate, setGstRate] = useState('18');
  const [results, setResults] = useState<{
    baseAmount: number;
    gstAmount: number;
    totalAmount: number;
  } | null>(null);

  const [multiItemCalc, setMultiItemCalc] = useState([
    { id: '1', description: '', amount: '', gstRate: '18', gstAmount: 0, total: 0 }
  ]);

  const calculateGST = () => {
    const amt = parseFloat(amount);
    const rate = parseFloat(gstRate);

    if (isNaN(amt) || amt <= 0) {
      setResults(null);
      return;
    }

    let baseAmount: number;
    let gstAmount: number;
    let totalAmount: number;

    if (calculationType === 'exclusive') {
      // Amount is excluding GST
      baseAmount = amt;
      gstAmount = (amt * rate) / 100;
      totalAmount = amt + gstAmount;
    } else {
      // Amount is including GST
      totalAmount = amt;
      baseAmount = amt / (1 + rate / 100);
      gstAmount = amt - baseAmount;
    }

    setResults({
      baseAmount: Math.round(baseAmount * 100) / 100,
      gstAmount: Math.round(gstAmount * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
    });
  };

  const resetCalculator = () => {
    setAmount('');
    setResults(null);
  };

  const copyResults = () => {
    if (results) {
      const text = `GST Calculation Results:
Base Amount: ₹${results.baseAmount.toFixed(2)}
GST (${gstRate}%): ₹${results.gstAmount.toFixed(2)}
Total Amount: ₹${results.totalAmount.toFixed(2)}`;
      navigator.clipboard.writeText(text);
    }
  };

  const addMultiItem = () => {
    const newItem = {
      id: Date.now().toString(),
      description: '',
      amount: '',
      gstRate: '18',
      gstAmount: 0,
      total: 0
    };
    setMultiItemCalc([...multiItemCalc, newItem]);
  };

  const updateMultiItem = (id: string, field: string, value: string) => {
    setMultiItemCalc(items => items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'amount' || field === 'gstRate') {
          const amt = parseFloat(updatedItem.amount) || 0;
          const rate = parseFloat(updatedItem.gstRate) || 0;
          updatedItem.gstAmount = (amt * rate) / 100;
          updatedItem.total = amt + updatedItem.gstAmount;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const removeMultiItem = (id: string) => {
    setMultiItemCalc(items => items.filter(item => item.id !== id));
  };

  const multiItemTotal = multiItemCalc.reduce((sum, item) => sum + item.total, 0);
  const multiItemGSTTotal = multiItemCalc.reduce((sum, item) => sum + item.gstAmount, 0);
  const multiItemBaseTotal = multiItemTotal - multiItemGSTTotal;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1>GST Calculator</h1>
          <p className="text-muted-foreground">Calculate GST amounts for your transactions</p>
        </div>
        <Button onClick={resetCalculator} variant="outline" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      </div>

      <Tabs defaultValue="simple" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="simple">Simple Calculator</TabsTrigger>
          <TabsTrigger value="multi">Multi-Item Calculator</TabsTrigger>
          <TabsTrigger value="rates">GST Rates</TabsTrigger>
        </TabsList>

        <TabsContent value="simple" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  GST Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Calculation Type */}
                <div className="space-y-2">
                  <Label>Calculation Type</Label>
                  <Select
                    value={calculationType}
                    onValueChange={(value: 'exclusive' | 'inclusive') => setCalculationType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exclusive">Amount Excluding GST</SelectItem>
                      <SelectItem value="inclusive">Amount Including GST</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {calculationType === 'exclusive' 
                      ? 'Enter the base amount without GST' 
                      : 'Enter the total amount including GST'}
                  </p>
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount">
                    Amount {calculationType === 'exclusive' ? '(Excluding GST)' : '(Including GST)'}
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-right"
                  />
                </div>

                {/* GST Rate */}
                <div className="space-y-2">
                  <Label>GST Rate</Label>
                  <Select value={gstRate} onValueChange={setGstRate}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0% (Nil rated)</SelectItem>
                      <SelectItem value="0.25">0.25% (Gold/Silver)</SelectItem>
                      <SelectItem value="3">3% (Gold/Silver)</SelectItem>
                      <SelectItem value="5">5% (Essential items)</SelectItem>
                      <SelectItem value="12">12% (Standard items)</SelectItem>
                      <SelectItem value="18">18% (Most goods)</SelectItem>
                      <SelectItem value="28">28% (Luxury items)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={calculateGST} className="w-full gap-2">
                  <Calculator className="w-4 h-4" />
                  Calculate GST
                </Button>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card>
              <CardHeader>
                <CardTitle>Calculation Results</CardTitle>
              </CardHeader>
              <CardContent>
                {results ? (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Base Amount:</span>
                        <span className="font-medium">₹{results.baseAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">GST ({gstRate}%):</span>
                        <span className="font-medium text-blue-600">₹{results.gstAmount.toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between py-2">
                        <span>Total Amount:</span>
                        <span className="text-lg font-semibold">₹{results.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={copyResults} variant="outline" size="sm" className="gap-2">
                        <Copy className="w-4 h-4" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <FileText className="w-4 h-4" />
                        Export
                      </Button>
                    </div>

                    {/* GST Breakdown */}
                    <Alert>
                      <AlertDescription>
                        <div className="text-sm space-y-1">
                          <p><strong>CGST + SGST:</strong> ₹{(results.gstAmount / 2).toFixed(2)} each</p>
                          <p><strong>IGST:</strong> ₹{results.gstAmount.toFixed(2)} (for inter-state)</p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Enter amount and click calculate to see results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="multi" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Multi-Item GST Calculator</CardTitle>
              <Button onClick={addMultiItem} size="sm" className="gap-2">
                <Calculator className="w-4 h-4" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {multiItemCalc.map((item, index) => (
                <div key={item.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Item {index + 1}</span>
                    {multiItemCalc.length > 1 && (
                      <Button
                        onClick={() => removeMultiItem(item.id)}
                        size="sm"
                        variant="outline"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <Label>Description</Label>
                      <Input
                        value={item.description}
                        onChange={(e) => updateMultiItem(item.id, 'description', e.target.value)}
                        placeholder="Item description"
                      />
                    </div>
                    <div>
                      <Label>Amount (₹)</Label>
                      <Input
                        type="number"
                        value={item.amount}
                        onChange={(e) => updateMultiItem(item.id, 'amount', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label>GST Rate (%)</Label>
                      <Select
                        value={item.gstRate}
                        onValueChange={(value) => updateMultiItem(item.id, 'gstRate', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0%</SelectItem>
                          <SelectItem value="5">5%</SelectItem>
                          <SelectItem value="12">12%</SelectItem>
                          <SelectItem value="18">18%</SelectItem>
                          <SelectItem value="28">28%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Total Amount</Label>
                      <Input
                        value={`₹${item.total.toFixed(2)}`}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Multi-Item Summary */}
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Base Amount:</span>
                      <span>₹{multiItemBaseTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total GST:</span>
                      <span>₹{multiItemGSTTotal.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span>Grand Total:</span>
                      <span>₹{multiItemTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>GST Rate Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { rate: '0%', items: ['Essential items like rice, wheat, salt, milk'], color: 'bg-green-100 text-green-800' },
                  { rate: '5%', items: ['Essential items, medicines, packaged food'], color: 'bg-blue-100 text-blue-800' },
                  { rate: '12%', items: ['Computers, processed food, ayurvedic medicines'], color: 'bg-yellow-100 text-yellow-800' },
                  { rate: '18%', items: ['Most goods and services, soaps, electronics'], color: 'bg-orange-100 text-orange-800' },
                  { rate: '28%', items: ['Luxury items, cars, cigarettes, aerated drinks'], color: 'bg-red-100 text-red-800' },
                ].map((category) => (
                  <Card key={category.rate}>
                    <CardContent className="pt-6">
                      <Badge className={`mb-3 ${category.color}`}>
                        {category.rate} GST
                      </Badge>
                      <ul className="text-sm space-y-1">
                        {category.items.map((item, index) => (
                          <li key={index} className="text-muted-foreground">• {item}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}