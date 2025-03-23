from django.db import models
from django.utils import timezone
from datetime import timedelta
from usuarios.models import Usuario
from restaurantes.models import Restaurante


class Fichaje(models.Model):
    empleado = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='fichajes')
    restaurante = models.ForeignKey(Restaurante, on_delete=models.CASCADE)
    fecha_entrada = models.DateTimeField()
    fecha_salida = models.DateTimeField(blank=True, null=True)
    duracion = models.DurationField(blank=True, null=True)
    compensado = models.BooleanField(default=False)  # ✅ NUEVO

    # Control de incidencias
    automatica = models.BooleanField(default=False)  # Si el sistema cerró automáticamente
    incidencia = models.TextField(blank=True, null=True)  # Razón de la incidencia

    def save(self, *args, **kwargs):
        """
        - Calcula duración si hay fecha de salida.
        - Cierra automáticamente si pasan más de 9 horas sin fichar salida.
        """
        if not self.fecha_salida:
            # Si ha pasado más de 9 horas desde la entrada, cerramos el fichaje automáticamente
            if timezone.now() - self.fecha_entrada >= timedelta(hours=9):
                self.fecha_salida = self.fecha_entrada + timedelta(hours=9)
                self.automatica = True
                self.incidencia = "Fichaje cerrado automáticamente por exceder 9 horas."

        if self.fecha_entrada and self.fecha_salida:
            self.duracion = self.fecha_salida - self.fecha_entrada

        super().save(*args, **kwargs)

    def horas_trabajadas(self) -> str:
        """
        Retorna la duración en formato 'X horas y Y minutos'.
        """
        if self.duracion:
            total_minutos = int(self.duracion.total_seconds() // 60)
        elif self.fecha_entrada and not self.fecha_salida:
            total_minutos = int((timezone.now() - self.fecha_entrada).total_seconds() // 60)
        else:
            return "0 horas y 0 minutos"

        horas = total_minutos // 60
        minutos = total_minutos % 60

        if minutos == 0:
            return f"{horas} horas"
        else:
            return f"{horas} horas y {minutos} minutos"

    def __str__(self):
        salida = self.fecha_salida if self.fecha_salida else '---'
        return f"Fichaje {self.pk} - {self.empleado} ({self.fecha_entrada} -> {salida})"

    def horas_extras(self):
        if not self.duracion or not self.empleado.horas_contrato:
            return 0
        horas_trabajadas = self.duracion.total_seconds() / 3600
        saldo = horas_trabajadas - self.empleado.horas_contrato
        return 0 if self.compensado else saldo  # ✅ Cero si compensado


class ConfiguracionAcceso(models.Model):
    contrasenia_panel = models.CharField(max_length=100)

    def __str__(self):
        return "Contraseña de Acceso al Panel"