from django.db import models



class Department(models.Model):
    name = models.CharField(max_length=100)
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE,related_name='departments')
    
    
    def __str__(self):
        return self.name
    
class Employees(models.Model):
    full_name = models.CharField(max_length=255)
    employee_id = models.CharField(max_length=50, unique=True)
    designation = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True)
    base_salary = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE)

    def __str__(self):
        return self.full_name
    
    
class Allowance(models.Model):
    employee = models.ForeignKey(Employees, on_delete=models.CASCADE, related_name='allowances')
    name = models.CharField(max_length=100)  
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name} allowance for {self.employee.full_name}"
    

class PayrollRun(models.Model):
    period_start_date = models.DateField()
    period_end_date = models.DateField()
    run_date = models.DateField(auto_now_add=True)
    is_processed = models.BooleanField(default=False)
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE)

    def __str__(self):
        return f"Payroll for {self.period_start_date} to {self.period_end_date}"
    
    
class Payslip(models.Model):
    employee = models.ForeignKey(Employees, on_delete=models.CASCADE)
    payroll_run = models.ForeignKey(PayrollRun, on_delete=models.CASCADE, related_name='payslips')
    gross_salary = models.DecimalField(max_digits=10, decimal_places=2)
    total_deductions = models.DecimalField(max_digits=10, decimal_places=2)
    net_salary = models.DecimalField(max_digits=10, decimal_places=2)
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE)

    def __str__(self):
        return f"Payslip for {self.employee.full_name} ({self.payroll_run})"
    
    

    