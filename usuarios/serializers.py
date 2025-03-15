from rest_framework import serializers
from django.contrib.auth import get_user_model

Usuario = get_user_model()

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ["id", "username", "dni", "nombre", "apellido", "telefono", "correo", "restaurante", "rol", "horas_contrato"]