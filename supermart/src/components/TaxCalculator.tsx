import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Calculator, Copy, RotateCcw, FileText, Plus } from 'lucide-react';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function GSTCalculator() {
  const [calculationType, setCalculationType] = useState<'exclusive' | 'inclusive'>('exclusive');
  const [amount, setAmount] = useState('');
  const [vatRate, setVatRate] = useState('16');
  const [results, setResults] = useState<{
    baseAmount: number;
    vatAmount: number;
    totalAmount: number;
  } | null>(null);

  const [multiItemCalc, setMultiItemCalc] = useState([
    { id: '1', description: '', amount: '', vatRate: '16', vatAmount: 0, total: 0 }
  ]);

  const calculateVAT = () => {
    const amt = parseFloat(amount);
    const rate = parseFloat(vatRate);

    if (isNaN(amt) || amt <= 0) {
      setResults(null);
      return;
    }

    let baseAmount: number;
    let vatAmount: number;
    let totalAmount: number;

    if (calculationType === 'exclusive') {
      // Amount is excluding VAT
      baseAmount = amt;
      vatAmount = (amt * rate) / 100;
      totalAmount = amt + vatAmount;
    } else {
      // Amount is including VAT
      totalAmount = amt;
      baseAmount = amt / (1 + rate / 100);
      vatAmount = amt - baseAmount;
    }

    setResults({
      baseAmount: Math.round(baseAmount * 100) / 100,
      vatAmount: Math.round(vatAmount * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
    });
  };

  const resetCalculator = () => {
    setAmount('');
    setResults(null);
  };

  const copyResults = () => {
    if (results) {
      const text = `VAT Calculation Results:
Base Amount: KSh ${results.baseAmount.toFixed(2)}
VAT (${vatRate}%): KSh ${results.vatAmount.toFixed(2)}
Total Amount: KSh ${results.totalAmount.toFixed(2)}`;
      navigator.clipboard.writeText(text);
    }
  };

  const addMultiItem = () => {
    const newItem = {
      id: Date.now().toString(),
      description: '',
      amount: '',
      vatRate: '16',
      vatAmount: 0,
      total: 0
    };
    setMultiItemCalc([...multiItemCalc, newItem]);
  };

  const updateMultiItem = (id: string, field: string, value: string) => {
    setMultiItemCalc(items => items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'amount' || field === 'vatRate') {
          const amt = parseFloat(updatedItem.amount) || 0;
          const rate = parseFloat(updatedItem.vatRate) || 0;
          updatedItem.vatAmount = (amt * rate) / 100;
          updatedItem.total = amt + updatedItem.vatAmount;
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
  const multiItemVATTotal = multiItemCalc.reduce((sum, item) => sum + item.vatAmount, 0);
  const multiItemBaseTotal = multiItemTotal - multiItemVATTotal;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1>KRA VAT Calculator</h1>
          <p className="text-muted-foreground">Calculate VAT for your transactions as per KRA guidelines</p>
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
          <TabsTrigger value="rates">VAT Rates</TabsTrigger>
        </TabsList>

        <TabsContent value="simple" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  VAT Calculator
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
                      <SelectItem value="exclusive">Amount Excluding VAT</SelectItem>
                      <SelectItem value="inclusive">Amount Including VAT</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {calculationType === 'exclusive' 
                      ? 'Enter the base amount without VAT' 
                      : 'Enter the total amount including VAT'}
                  </p>
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount">
                    Amount {calculationType === 'exclusive' ? '(Excluding VAT)' : '(Including VAT)'}
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

                {/* VAT Rate */}
                <div className="space-y-2">
                  <Label>VAT Rate</Label>
                  <Select value={vatRate} onValueChange={setVatRate}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0% (Zero-rated)</SelectItem>
                      <SelectItem value="8">8% (Reduced rate, e.g., petroleum)</SelectItem>
                      <SelectItem value="16">16% (Standard rate)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={calculateVAT} className="w-full gap-2">
                  <Calculator className="w-4 h-4" />
                  Calculate VAT
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
                        <span className="font-medium">KSh {results.baseAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">VAT ({vatRate}%):</span>
                        <span className="font-medium text-blue-600">KSh {results.vatAmount.toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between py-2">
                        <span>Total Amount:</span>
                        <span className="text-lg font-semibold">KSh {results.totalAmount.toFixed(2)}</span>
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
              <CardTitle>Multi-Item VAT Calculator</CardTitle>
              <Button onClick={addMultiItem} size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
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
                      <Label>Amount (KSh)</Label>
                      <Input
                        type="number"
                        value={item.amount}
                        onChange={(e) => updateMultiItem(item.id, 'amount', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label>VAT Rate (%)</Label>
                      <Select
                        value={item.vatRate}
                        onValueChange={(value) => updateMultiItem(item.id, 'vatRate', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0%</SelectItem>
                          <SelectItem value="8">8%</SelectItem>
                          <SelectItem value="16">16%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Total Amount</Label>
                      <Input
                        value={`KSh ${item.total.toFixed(2)}`}
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
                      <span>KSh {multiItemBaseTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total VAT:</span>
                      <span>KSh {multiItemVATTotal.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span>Grand Total:</span>
                      <span>KSh {multiItemTotal.toFixed(2)}</span>
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
              <CardTitle>VAT Rate Information</CardTitle>
              <p className="text-sm text-muted-foreground">
                Rates as per Kenya's Finance Act.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { 
                    rate: '16%', 
                    items: ['Standard rate for most goods and services'], 
                    color: 'bg-green-100 text-green-800' 
                  },
                  { 
                    rate: '8%', 
                    items: ['Reduced rate for petroleum products and certain essential items'], 
                    color: 'bg-yellow-100 text-yellow-800' 
                  },
                  { 
                    rate: '0%', 
                    items: ['Zero-rated items (exports, specific foodstuff, educational materials)'], 
                    color: 'bg-blue-100 text-blue-800' 
                  },
                ].map((category) => (
                  <Card key={category.rate}>
                    <CardContent className="pt-6">
                      <Badge className={`mb-3 ${category.color}`}>
                        {category.rate} VAT
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