from django.contrib import admin
from .models import Proveedor, Categoria, Producto, Pedido, DetallePedido, EmailConfig

admin.site.register(Proveedor)
admin.site.register(Categoria)
admin.site.register(Producto)
admin.site.register(Pedido)
admin.site.register(DetallePedido)
admin.site.register(EmailConfig)