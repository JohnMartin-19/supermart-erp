from django.db import models

RETURN_TYPES = [
        ('paye_return', 'PAYE Return'),
        ('corporation_tax', 'Corporation Tax'),
        ('withholding_tax', 'Withholding Tax'),
        ('capital_gains_tax', 'Capital Gains Tax'),
        ('rental_income_tax', 'Rental Income Tax'),
        ('vat_return', 'VAT Return'),
        ('excise_duty_return', 'Excise Duty Return'),
        ('customs_duties_return', 'Customs Duties Return'),
    ]

STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('filed', 'Filed'),
        ('overdue', 'Overdue'),
    ]

class TaxReturn(models.Model):
    period = models.CharField(max_length=50)  
    return_type = models.CharField(max_length=50, choices=RETURN_TYPES)
    due_date = models.DateField()
    amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    filed_date = models.DateField(null=True, blank=True)
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.get_return_type_display()} for {self.period}"
    



class TaxLiability(models.Model):
    TAX_TYPES = [
        ('vat', 'Value Added Tax (VAT)'),
        ('paye', 'Pay As You Earn (PAYE)'),
        ('withholding_tax', 'Withholding Tax'),
        ('corporation_tax', 'Corporation Tax'),
        ('excise_duty', 'Excise Duty'),
        ('income_tax', 'Income Tax'),
      
    ]

    
    period = models.CharField(max_length=50)
    tax_type = models.CharField(max_length=50, choices=TAX_TYPES)
    amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.get_tax_type_display()} for {self.period}: {self.amount}"

    class Meta:
        unique_together = ('period', 'tax_type', 'tenant')
        verbose_name_plural = "tax liabilities"