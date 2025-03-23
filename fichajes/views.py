from datetime import datetime, timedelta

from django.contrib import messages
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth import authenticate
from django.db.models import Sum, ExpressionWrapper, F, DurationField
from django.shortcuts import get_object_or_404, redirect
from django.utils.dateparse import parse_date
from django.utils.timezone import now
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.utils import timezone
from rest_framework.viewsets import ModelViewSet
from .serializers import FichajeSerializer
from usuarios.models import Usuario
from .models import Fichaje, ConfiguracionAcceso
import logging
from .utils import (
    obtener_ip_cliente,
    calcular_duracion,
    formatear_duracion,
    cerrar_fichajes_automaticamente
)

logger = logging.getLogger('fichajes')

@api_view(["POST"])
@permission_classes([AllowAny])  # 📌 Permitir acceso sin autenticación solo para fichar
def fichar(request):
    dni = request.data.get("dni", "").strip().upper()  # ✅ Normaliza el DNI
    if not dni:
        return Response({"error": "DNI requerido."}, status=400)

    usuario = Usuario.objects.filter(dni=dni).first()
    if not usuario:
        return Response({"error": "Usuario no encontrado."}, status=404)

    if not usuario.restaurante:
        return Response({"error": "Usuario sin restaurante asignado."}, status=400)

    ip = obtener_ip_cliente(request)
    fichaje_abierto = Fichaje.objects.filter(empleado=usuario, fecha_salida__isnull=True).first()

    if fichaje_abierto:
        fecha_salida = timezone.now()
        horas, minutos, duracion_td = calcular_duracion(fichaje_abierto.fecha_entrada, fecha_salida)
        fichaje_abierto.fecha_salida = fecha_salida
        fichaje_abierto.duracion = duracion_td
        fichaje_abierto.save()
        logger.info(f"📤 SALIDA | {usuario.username} | IP: {ip} | {horas}h {minutos}min")
        return Response({
            "mensaje": f"{usuario.username} fichó SALIDA.",
            "fecha_entrada": fichaje_abierto.fecha_entrada,
            "fecha_salida": fecha_salida,
            "duracion": f"{horas}h {minutos}min",
            "restaurante": usuario.restaurante.nombre
        })

    fecha_entrada = timezone.now()
    Fichaje.objects.create(
        empleado=usuario,
        restaurante=usuario.restaurante,
        fecha_entrada=fecha_entrada
    )
    logger.info(f"📥 ENTRADA | {usuario.username} | IP: {ip}")
    return Response({
        "mensaje": f"{usuario.username} fichó ENTRADA.",
        "fecha_entrada": fecha_entrada,
        "restaurante": usuario.restaurante.nombre
    })


class FichajeViewSet(ModelViewSet):
    queryset = Fichaje.objects.select_related('empleado').all()
    serializer_class = FichajeSerializer

    def get_queryset(self):
        # 🔥 Ejecutar cierre automático antes de retornar queryset
        cerrar_fichajes_automaticamente(Fichaje)

        queryset = super().get_queryset()
        empleado = self.request.query_params.get('empleado', '')
        fecha_str = self.request.query_params.get('fecha', '')

        if empleado:
            queryset = queryset.filter(empleado__username__icontains=empleado)

        if fecha_str:
            fecha = parse_date(fecha_str)
            if fecha:
                queryset = queryset.filter(fecha_entrada__date=fecha)

        return queryset

@api_view(["POST"])
@permission_classes([AllowAny])  # ✅ Permitir sin autenticación
def validar_contrasenia_panel(request):
    contrasenia = request.data.get("password", "")
    acceso = ConfiguracionAcceso.objects.first()

    if acceso and contrasenia == acceso.contrasenia_panel:
        return Response({"valido": True})
    return Response({"valido": False}, status=401)

@api_view(["GET"])
def saldo_semanal(request):
    hoy = now().date()
    inicio_semana = hoy - timedelta(days=hoy.weekday())  # Lunes actual

    fichajes = Fichaje.objects.filter(fecha_entrada__date__gte=inicio_semana)

    saldos = {}

    for fichaje in fichajes:
        empleado = fichaje.empleado.username
        contrato_horas = fichaje.empleado.horas_contrato or 40

        duracion_horas = fichaje.duracion.total_seconds() / 3600 if fichaje.duracion else 0

        if empleado not in saldos:
            saldos[empleado] = {"trabajadas": 0, "contrato": contrato_horas}

        saldos[empleado]["trabajadas"] += duracion_horas

    for empleado in saldos:
        trabajadas = saldos[empleado]["trabajadas"]
        contrato = saldos[empleado]["contrato"]
        saldo = trabajadas - contrato
        saldos[empleado]["saldo"] = round(saldo, 2)

    return Response(saldos)

@staff_member_required
def compensar_fichaje(request, fichaje_id):
    fichaje = get_object_or_404(Fichaje, id=fichaje_id)

    # ✅ Poner duración a cero y marcar compensado
    fichaje.duracion = timedelta(0)
    fichaje.compensado = True
    fichaje.save()

    messages.success(request, f"Horas compensadas para {fichaje.empleado.username}.")
    return redirect('/admin/fichajes/fichaje/')