from django.contrib.auth.models import AbstractUser
from django.db import models
from restaurantes.models import Restaurante

class Usuario(AbstractUser):
    dni = models.CharField(max_length=20, unique=True)
    nombre = models.CharField(max_length=100, blank=True, null=True)
    apellido = models.CharField(max_length=100, blank=True, null=True)  # 📌 Ahora es opcional
    telefono = models.CharField(max_length=20, blank=True, null=True)
    correo = models.EmailField(blank=True, null=True)
    restaurante = models.ForeignKey(Restaurante, on_delete=models.CASCADE, null=True, blank=True)
    rol = models.CharField(
        max_length=50,
        choices=[
            ('empleado', 'Empleado'),
            ('gerente', 'Gerente'),
            ('admin', 'Administrador')
        ]
    )
    horas_contrato = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.dni})"
