from django.contrib import admin
from .models import *

admin.site.register(CashDrawer)
admin.site.register(CashExpense)
admin.site.register(CashReconciliation)