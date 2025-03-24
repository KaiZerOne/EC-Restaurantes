import datetime
import csv
import os
from django.core.management.base import BaseCommand
from django.utils.timezone import now, make_aware
from django.core.mail import EmailMessage
from fichajes.models import Fichaje, ResumenMensual, BackupConfig
from usuarios.models import Usuario

class Command(BaseCommand):
    help = "📦 Genera backup mensual de horas trabajadas por empleado"

    def handle(self, *args, **kwargs):
        hoy = now().date()
        anio = hoy.year
        mes = hoy.month

        inicio_mes = make_aware(datetime.datetime(anio, mes, 1))
        if mes == 12:
            fin_mes = make_aware(datetime.datetime(anio + 1, 1, 1)) - datetime.timedelta(seconds=1)
        else:
            fin_mes = make_aware(datetime.datetime(anio, mes + 1, 1)) - datetime.timedelta(seconds=1)

        self.stdout.write(f"📅 Backup del mes {mes}/{anio} ({inicio_mes.date()} - {fin_mes.date()})")

        empleados = Usuario.objects.filter(rol='empleado')
        data_backup = []

        for empleado in empleados:
            fichajes = Fichaje.objects.filter(
                empleado=empleado,
                fecha_entrada__gte=inicio_mes,
                fecha_entrada__lte=fin_mes
            )

            total_horas = 0
            for f in fichajes:
                if f.fecha_salida:
                    duracion = f.fecha_salida - f.fecha_entrada
                    total_horas += duracion.total_seconds() / 3600

            horas_contrato = empleado.horas_contrato or 0
            horas_compensables = round(total_horas - horas_contrato, 2)

            # Guardar en base de datos
            ResumenMensual.objects.create(
                empleado=empleado,
                restaurante=empleado.restaurante,
                mes=mes,
                anio=anio,
                horas_trabajadas=round(total_horas, 2),
                horas_contrato=horas_contrato,
                horas_compensables=horas_compensables
            )

            # Guardar para CSV
            data_backup.append([
                empleado.username,
                empleado.dni,
                empleado.restaurante.nombre if empleado.restaurante else "-",
                round(total_horas, 2),
                horas_contrato,
                horas_compensables
            ])

        # Crear carpeta backups si no existe
        if not os.path.exists("backups"):
            os.makedirs("backups")

        # Exportar CSV en carpeta backups/
        nombre_archivo = f"backups/resumen_mensual_{mes}_{anio}.csv"
        with open(nombre_archivo, mode='w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(['Empleado', 'DNI', 'Restaurante', 'Horas Trabajadas', 'Contrato', 'Compensables'])
            writer.writerows(data_backup)

        self.stdout.write(self.style.SUCCESS(f"📂 Backup mensual guardado en {nombre_archivo}"))

        # 📨 Enviar correo con el backup como adjunto
        try:
            config = BackupConfig.objects.first()
            if config:
                email = EmailMessage(
                    subject=f"📦 Resumen mensual fichajes - {mes}/{anio}",
                    body=f"Adjunto el backup mensual de fichajes de {mes}/{anio}.",
                    to=[config.correo_destino]
                )
                email.attach_file(nombre_archivo)
                email.send()
                self.stdout.write(self.style.SUCCESS(f"📨 Backup enviado a {config.correo_destino}"))
            else:
                self.stdout.write(self.style.WARNING("⚠️ No hay correo configurado para backups."))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Error enviando correo: {str(e)}"))
