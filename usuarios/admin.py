from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario

class UsuarioAdmin(UserAdmin):
    list_display = ('username', 'email', 'dni', 'telefono', 'rol', 'restaurante', 'horas_contrato', 'is_staff')
    search_fields = ('username', 'email', 'dni')
    list_filter = ('rol', 'restaurante', 'is_staff')

    # ⚙️ Campos editables en el detalle de usuario
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Información personal', {'fields': ('email', 'dni', 'telefono', 'rol', 'restaurante', 'horas_contrato')}),
        ('Permisos', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
    )

    # ⚙️ Campos al crear nuevo usuario
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'dni', 'telefono', 'rol', 'restaurante', 'horas_contrato', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )

    ordering = ('username',)

admin.site.register(Usuario, UsuarioAdmin)

