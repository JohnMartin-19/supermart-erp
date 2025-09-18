from django.db import models

from decimal import Decimal

class Department(models.Model):
    name = models.CharField(max_length=100)
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE,related_name='departments')
    
    
    def __str__(self):
        return self.name
    
class Employees(models.Model):
    full_name = models.CharField(max_length=255)
    employee_id = models.CharField(max_length=50, unique=True)
    designation = models.CharField(max_length=100)
    department = models.CharField(max_length=100, null=True)
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
    
    

def calculate_payslip(employee, payroll_run):
    base_salary = employee.base_salary
    allowances = sum([a.amount for a in employee.allowances.all()])
    
    gross_salary = base_salary + allowances

    # ---- NSSF (Simplified Example) ----
    nssf = min(Decimal('1080.00'), gross_salary * Decimal('0.06'))  # capped at ~1080

    # ---- NHIF  ----
    nhif = get_nhif_contribution(gross_salary)

    # ---- PAYE deductions ----
    taxable_income = gross_salary - nssf
    paye = calculate_paye(taxable_income)

    # ---- total deductions ----
    total_deductions = nssf + nhif + paye

    # ---- Net salary ----
    net_salary = gross_salary - total_deductions

    # ---- Create Payslip ----
    payslip = Payslip.objects.create(
        employee=employee,
        payroll_run=payroll_run,
        gross_salary=gross_salary,
        total_deductions=total_deductions,
        net_salary=net_salary,
        tenant=employee.tenant
    )
    return payslip

def get_nhif_contribution(salary):
    if salary <= 5999:
        return Decimal('150')
    elif salary <= 7999:
        return Decimal('300')
    elif salary <= 11999:
        return Decimal('400')
    elif salary <= 14999:
        return Decimal('500')
    elif salary <= 19999:
        return Decimal('600')
    elif salary <= 24999:
        return Decimal('750')
    elif salary <= 29999:
        return Decimal('850')
    elif salary <= 34999:
        return Decimal('900')
    elif salary <= 39999:
        return Decimal('950')
    elif salary <= 44999:
        return Decimal('1000')
    elif salary <= 49999:
        return Decimal('1100')
    elif salary <= 59999:
        return Decimal('1200')
    elif salary <= 69999:
        return Decimal('1300')
    elif salary <= 79999:
        return Decimal('1400')
    elif salary <= 89999:
        return Decimal('1500')
    elif salary <= 99999:
        return Decimal('1600')
    else:
        return Decimal('1700')


def calculate_paye(taxable_income):
    bands = [
        (24000, Decimal('0.10')),
        (32333, Decimal('0.25')),
        (Decimal('999999999'), Decimal('0.30')),  # upper cap
    ]
    tax = Decimal('0')
    prev_limit = 0

    for limit, rate in bands:
        if taxable_income > limit:
            tax += (limit - prev_limit) * rate
            prev_limit = limit
        else:
            tax += (taxable_income - prev_limit) * rate
            break

    # Apply personal relief
    relief = Decimal('2400')
    return max(tax - relief, Decimal('0'))

    