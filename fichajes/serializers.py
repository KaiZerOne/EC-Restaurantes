from rest_framework import serializers
from .models import Fichaje
from usuarios.models import Usuario  # ✅ Importamos el modelo correcto

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ["id", "nombre", "apellido"]  # ✅ Usamos nombre y apellido del modelo Usuario

class FichajeSerializer(serializers.ModelSerializer):
    empleado = UsuarioSerializer(read_only=True)  # ✅ Se usa Usuario en lugar de Empleado
    horas_trabajadas = serializers.SerializerMethodField()  # ✅ Calculamos las horas trabajadas

    class Meta:
        model = Fichaje
        fields = ["id", "empleado", "restaurante", "fecha_entrada", "fecha_salida", "horas_trabajadas", "incidencia"]

    def get_horas_trabajadas(self, obj):
        if obj.fecha_entrada and obj.fecha_salida:
            diferencia = obj.fecha_salida - obj.fecha_entrada
            return round(diferencia.total_seconds() / 3600, 2)
        return 0  # ✅ Si no ha salido, devuelve 0 horas
