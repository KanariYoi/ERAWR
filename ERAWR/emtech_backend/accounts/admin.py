from django.contrib import admin
from .models import Service, AddOn, Bundle

# Register your models here.

admin.site.register(Service)
admin.site.register(AddOn)
admin.site.register(Bundle)
