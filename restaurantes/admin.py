from django.contrib import admin
from .models import Restaurante

class RestauranteAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'email', 'telefono', 'direccion')
    search_fields = ('nombre', 'email')

admin.site.register(Restaurante, RestauranteAdmin)
