from datetime import timedelta

from django.contrib import admin, messages
from django.shortcuts import get_object_or_404, redirect
from django.utils.html import format_html
from django.utils.timezone import now

from .models import Fichaje, ConfiguracionAcceso


@admin.register(Fichaje)
class FichajeAdmin(admin.ModelAdmin):
    list_display = (
        'get_nombre_empleado', 'fecha_entrada', 'fecha_salida', 'get_duracion',
        'get_restaurante', 'incidencia', 'horas_extras', 'acciones_compensar'
    )
    list_filter = ('restaurante', 'fecha_entrada', 'empleado')

    def get_duracion(self, obj):
        if obj.duracion:
            horas = int(obj.duracion.total_seconds() // 3600)
            minutos = int((obj.duracion.total_seconds() % 3600) // 60)
            return f"{horas}h {minutos}min"
        return "-"
    get_duracion.short_description = "Duración"

    def get_restaurante(self, obj):
        return obj.restaurante.nombre if obj.restaurante else "-"
    get_restaurante.short_description = "Restaurante"

    def horas_extras(self, obj):
        if not obj.duracion or not obj.empleado.horas_contrato:
            return "-"

        hoy = now().date()
        inicio_semana = hoy - timedelta(days=hoy.weekday())

        fichajes_semana = Fichaje.objects.filter(
            empleado=obj.empleado,
            fecha_entrada__date__gte=inicio_semana
        ).order_by('fecha_entrada')

        total_horas = sum([
            f.duracion.total_seconds() for f in fichajes_semana if f.duracion
        ]) / 3600

        contrato = obj.empleado.horas_contrato or 40
        saldo = total_horas - contrato

        if obj == fichajes_semana.last():
            if abs(saldo) < 0.01:
                return "-"
            horas = int(abs(saldo))
            minutos = int((abs(saldo) * 60) % 60)
            signo = "+" if saldo > 0 else "-"
            return f"{signo}{horas}h {minutos}min"

        return "-"

    def acciones_compensar(self, obj):
        return format_html(
            '<a class="button" href="{}">🧹 Compensar</a>',
            f'/fichajes/compensar/{obj.id}/'
        )
    acciones_compensar.short_description = "Acciones"

    def get_nombre_empleado(self, obj):
        return f"{obj.empleado.first_name} {obj.empleado.last_name} ({obj.empleado.username})"

    get_nombre_empleado.short_description = "Empleado"

def compensar_horas(request, fichaje_id):
    fichaje = get_object_or_404(Fichaje, id=fichaje_id)
    fichaje.duracion = timedelta(0)
    fichaje.save()
    messages.success(request, f"Horas compensadas de {fichaje.empleado.username}.")
    return redirect("/admin/fichajes/fichaje/")