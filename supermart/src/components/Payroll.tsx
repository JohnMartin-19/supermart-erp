import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  Users,
  DollarSign,
  FileText,
  Calendar,
  Plus,
  Download,
  Search,
  Calculator
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';

import { Toaster,toast } from 'sonner';

interface Employee {
  id: number;
  full_name: string;
  employee_id: string; 
  designation: string;
  department: string;
  is_active: boolean; 
  tenant: number;
  base_salary: string; 
}


export function Payroll() {
  const [selectedTab, setSelectedTab] = useState('employees');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    full_name: '',
    designation: '',
    department: '',
    baseSalary: '',
    hra: '',
    allowances: '',
  });

  const tenantDomain = localStorage.getItem('tenant_domain')
  const API_URL = `http://${tenantDomain}:8000/api/v1/payroll/employees/`;

  // ----------------------- FETCH EMPLOYEES -----------------------
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(API_URL, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [API_URL]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewEmployee(prevState => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSelectChange = (value: string, id: string) => {
    setNewEmployee(prevState => ({
      ...prevState,
      [id]: value,
    }));
  };

  // ----------------------- POST NEW EMPLOYEE -----------------------
  const handleAddEmployee = async () => {
    try {
      const payload = {
        tenant: parseInt(localStorage.getItem('tenant_id') || '0', 10),
        full_name: newEmployee.full_name,
        designation: newEmployee.designation,
        department: newEmployee.department,
        base_salary: parseFloat(newEmployee.baseSalary),
        hra: parseFloat(newEmployee.hra),
        allowances: parseFloat(newEmployee.allowances),
      };

      const token = localStorage.getItem('access_token');
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add employee');
      }

      const newEmployeeData = await response.json();
      setEmployees(prevEmployees => [...prevEmployees, newEmployeeData]);

      setNewEmployee({
        full_name: '',
        designation: '',
        department: '',
        baseSalary: '',
        hra: '',
        allowances: '',
      });
      setIsDialogOpen(false);
      // Replaced alert with a success toast
      toast.success('Employee added successfully!');

    } catch (error) {
      console.error("Failed to add employee:", error);
      // Replaced alert with an error toast
      toast.error(`Failed to add employee: ${error.message}`);
    }
  };


  const payrollSummary = {
    totalEmployees: employees.length,
    totalGrossSalary: employees.reduce((sum, emp) => sum + (parseFloat(emp.base_salary) || 0) + (parseFloat(emp.hra) || 0) + (parseFloat(emp.allowances) || 0), 0),
    totalDeductions: 0, // No deduction data in the provided API response
    totalNetSalary: 0,  // No net salary data in the provided API response
    pfContribution: 0,
    esiContribution: 0,
    tdsDeducted: 0
  };

  const payrollHistory = [
    { month: 'January 2025', totalPaid: 2092000, employees: 28, status: 'processing' },
    { month: 'December 2024', totalPaid: 2085000, employees: 28, status: 'completed' },
    { month: 'November 2024', totalPaid: 2078000, employees: 27, status: 'completed' },
    { month: 'October 2024', totalPaid: 2045000, employees: 26, status: 'completed' },
  ];

  const statutoryReports = [
    { name: 'PF Return (ECR)', period: 'January 2025', dueDate: '2025-02-15', status: 'pending' },
    { name: 'ESI Return', period: 'January 2025', dueDate: '2025-02-21', status: 'pending' },
    { name: 'TDS Return', period: 'Q3 FY2025', dueDate: '2025-01-31', status: 'pending' },
    { name: 'Form 16', period: 'FY 2024-25', dueDate: '2025-05-31', status: 'not-due' },
  ];

  return (
    <div className="p-6 space-y-6">
      <Toaster position="top-right" /> {/* Add the Toaster component */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Payroll Management</h1>
          <p className="text-muted-foreground">Manage employee salaries and statutory compliance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calculator className="w-4 h-4 mr-2" />
            Salary Calculator
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input id="full_name" placeholder="Enter full name" value={newEmployee.full_name} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="designation">Designation</Label>
                    <Input id="designation" placeholder="Enter designation" value={newEmployee.designation} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select onValueChange={(value) => handleSelectChange(value, 'department')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IT">IT</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="HR">HR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="baseSalary">Base Salary</Label>
                    <Input id="baseSalary" type="number" placeholder="50000" value={newEmployee.baseSalary} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hra">HRA</Label>
                    <Input id="hra" type="number" placeholder="15000" value={newEmployee.hra} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="allowances">Allowances</Label>
                    <Input id="allowances" type="number" placeholder="10000" value={newEmployee.allowances} onChange={handleInputChange} />
                  </div>
                </div>
                <Button className="w-full" onClick={handleAddEmployee}>Add Employee</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Payroll Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payrollSummary.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">Active employees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gross Salary</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSH{payrollSummary.totalGrossSalary?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Monthly total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deductions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSH{payrollSummary.totalDeductions?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">PF, ESI, TDS</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Salary</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">KSH{payrollSummary.totalNetSalary?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">After deductions</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="payroll">Payroll Run</TabsTrigger>
          <TabsTrigger value="statutory">Statutory Reports</TabsTrigger>
          <TabsTrigger value="history">Payroll History</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Salary Details</CardTitle>
              <div className="flex gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search employees..." className="pl-9" />
                </div>
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="it">IT</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading employees...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Designation</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead className="text-right">Base Salary</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <div>
                            {/* Changed to full_name and employee_id to match API */}
                            <p className="font-medium">{employee.full_name}</p>
                            <p className="text-sm text-muted-foreground">{employee.employee_id}</p>
                          </div>
                        </TableCell>
                        <TableCell>{employee.designation}</TableCell>
                        <TableCell>{employee.department}</TableCell>
                        {/* Changed to base_salary */}
                        <TableCell className="text-right">KSH{parseFloat(employee.base_salary).toLocaleString()}</TableCell>
                        <TableCell>
                          {/* Changed to is_active and updated badge logic */}
                          <Badge variant={employee.is_active ? 'default' : 'secondary'}>
                            {employee.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Process Payroll</CardTitle>
              <p className="text-sm text-muted-foreground">
                Process salary for January 2025 • {payrollSummary.totalEmployees} employees
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Salary Components</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Basic</span>
                      <span>KSH{(payrollSummary.totalGrossSalary * 0.6 / 1000).toFixed(1)}K</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total HRA</span>
                      <span>KSH{(payrollSummary.totalGrossSalary * 0.3 / 1000).toFixed(1)}K</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Allowances</span>
                      <span>KSH{(payrollSummary.totalGrossSalary * 0.1 / 1000).toFixed(1)}K</span>
                    </div>
                    <div className="border-t pt-2 font-medium">
                      <div className="flex justify-between">
                        <span>Gross Total</span>
                        <span>KSH{(payrollSummary.totalGrossSalary / 1000).toFixed(1)}K</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Deductions</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>PF (Employee)</span>
                      <span>KSH{(payrollSummary.pfContribution / 2 / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ESI (Employee)</span>
                      <span>KSH{(payrollSummary.esiContribution / 2 / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TDS</span>
                      <span>KSH{(payrollSummary.tdsDeducted / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="border-t pt-2 font-medium">
                      <div className="flex justify-between">
                        <span>Total Deductions</span>
                        <span>KSH{(payrollSummary.totalDeductions / 1000).toFixed(1)}K</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Employer Contributions</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>PF (Employer)</span>
                      <span>KSH{(payrollSummary.pfContribution / 2 / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ESI (Employer)</span>
                      <span>KSH{(payrollSummary.esiContribution / 2 / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Professional Tax</span>
                      <span>KSH5.6K</span>
                    </div>
                    <div className="border-t pt-2 font-medium">
                      <div className="flex justify-between">
                        <span>Total Contribution</span>
                        <span>KSH{((payrollSummary.pfContribution + payrollSummary.esiContribution) / 2 / 1000 + 5.6).toFixed(0)}K</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Net Payable Amount</p>
                  <p className="text-sm text-muted-foreground">Total amount to be transferred</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">KSH{payrollSummary.totalNetSalary?.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button className="flex-1">Process Payroll</Button>
                <Button variant="outline">Generate Payslips</Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statutory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Statutory Compliance Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Type</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statutoryReports.map((report, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{report.name}</TableCell>
                      <TableCell>{report.period}</TableCell>
                      <TableCell>{report.dueDate}</TableCell>
                      <TableCell>
                        <Badge variant={
                          report.status === 'completed' ? 'default' :
                          report.status === 'pending' ? 'secondary' : 'outline'
                        }>
                          {report.status.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                          {report.status === 'pending' && (
                            <Button size="sm">Generate</Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payroll Processing History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead className="text-right">Total Paid</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollHistory.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{record.month}</TableCell>
                      <TableCell>{record.employees}</TableCell>
                      <TableCell className="text-right">KSH{(record.totalPaid / 1000).toFixed(1)}K</TableCell>
                      <TableCell>
                        <Badge variant={record.status === 'completed' ? 'default' : 'secondary'}>
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
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