# fichajes/utils.py
from django.utils import timezone
from datetime import timedelta

def obtener_ip_cliente(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def calcular_duracion(fecha_entrada, fecha_salida):
    duracion = fecha_salida - fecha_entrada
    total_minutos = round(duracion.total_seconds() / 60)
    horas = total_minutos // 60
    minutos = total_minutos % 60
    return horas, minutos, duracion

def formatear_horas(duracion):
    total_min = int(duracion.total_seconds() // 60)
    horas = total_min // 60
    minutos = total_min % 60
    return f"{horas}h {minutos}min"

def cerrar_fichajes_automaticamente(FichajeModel):
    fichajes_abiertos = FichajeModel.objects.filter(fecha_salida__isnull=True)
    for fichaje in fichajes_abiertos:
        tiempo_transcurrido = timezone.now() - fichaje.fecha_entrada
        if tiempo_transcurrido > timedelta(hours=9):
            fichaje.fecha_salida = fichaje.fecha_entrada + timedelta(hours=9)
            fichaje.duracion = timedelta(hours=9)
            fichaje.incidencia = "Fichaje cerrado automáticamente por exceder 9 horas."
            fichaje.save()

def formatear_duracion(horas, minutos):
    return f"{horas}h {minutos}min"