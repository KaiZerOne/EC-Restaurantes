from rest_framework import serializers

from usuarios.models import Usuario
from .models import Fichaje

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'apellido']

class FichajeSerializer(serializers.ModelSerializer):
    empleado = UserSerializer()  # 🔧 Serializa datos del empleado
    horas_trabajadas = serializers.SerializerMethodField()

    class Meta:
        model = Fichaje
        fields = ['id', 'empleado', 'restaurante', 'fecha_entrada', 'fecha_salida', 'horas_trabajadas', 'incidencia']

    def get_horas_trabajadas(self, obj):
        if obj.fecha_salida:
            duracion = obj.fecha_salida - obj.fecha_entrada
            return round(duracion.total_seconds() / 3600, 2)
        return 0.0

