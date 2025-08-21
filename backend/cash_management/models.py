from django.db import models


STATUS_CHOICES = [
    ('open', 'Open'),
    ('closed', 'Closed'),
]

class CashDrawer(models.Model):
    branch = models.ForeignKey('multi_location.Branch', on_delete=models.CASCADE)
    cashier = models.ForeignKey('auth.User', on_delete=models.SET_NULL, null=True, related_name='cash_drawers')
    opening_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    current_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='open')
    opened_at = models.DateTimeField(auto_now_add=True)
    closed_at = models.DateTimeField(null=True, blank=True)
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE)

    def __str__(self):
        return f"Cash Drawer at {self.branch.branch_name} ({self.cashier.get_full_name()})"
    
    
class CashExpense(models.Model):
    branch = models.ForeignKey('multi_location.Branch', on_delete=models.CASCADE)
    cash_drawer = models.ForeignKey(CashDrawer, on_delete=models.SET_NULL, null=True, related_name='expenses')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    recorded_at = models.DateTimeField(auto_now_add=True)
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE)

    def __str__(self):
        return f"Expense of KES {self.amount} from {self.branch.branch_name}"
    

class CashReconciliation(models.Model):
    cash_drawer = models.ForeignKey(CashDrawer, on_delete=models.CASCADE, related_name='reconciliations')
    actual_cash_count = models.DecimalField(max_digits=10, decimal_places=2)
    notes = models.TextField(blank=True)
    recorded_at = models.DateTimeField(auto_now_add=True)
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE)

    def __str__(self):
        return f"Reconciliation for {self.cash_drawer} on {self.recorded_at.date()}"