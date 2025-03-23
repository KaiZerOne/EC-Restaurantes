from django.db import models

from django.db import models

class Restaurante(models.Model):
    nombre = models.CharField(max_length=100)
    email = models.EmailField(null=True, blank=True)  # 📌 Ahora es opcional
    telefono = models.CharField(max_length=15)
    direccion = models.TextField()

    def __str__(self):
        return self.nombre

