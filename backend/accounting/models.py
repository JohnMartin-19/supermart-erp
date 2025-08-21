from django.db import models



class Accounting(models.Model):
    name  = models.CharField(max_length = 100)
    description = models.TextField()
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE)
    
    def __str__(self):
        return self.name
    
    
class JournalEntry(models.Model):
    date = models.DateField(auto_now=True)
    account = models.ForeignKey(Accounting, on_delete=models.CASCADE)
    debit_amount = models.DecimalField(max_digits=10,decimal_places=2, default=0)
    credit_amount = models.DecimalField(max_digits=10,decimal_places=2, default=0)
    description = models.TextField()
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE)
    
    def __str__(self):
        return f"Entry on {self.date} for {self.account.name}"


