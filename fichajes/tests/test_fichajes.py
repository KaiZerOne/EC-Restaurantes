import pytest
from django.utils import timezone
from datetime import timedelta
from fichajes.models import Fichaje
from fichajes.utils import cerrar_fichajes_automaticamente
from restaurantes.models import Restaurante
from usuarios.models import Usuario

@pytest.mark.django_db
def test_fichaje_se_cierra_automaticamente_si_excede_9h():
    # 🔧 Creamos un restaurante
    restaurante = Restaurante.objects.create(nombre="Armentioa")

    # 🔧 Creamos un usuario
    usuario = Usuario.objects.create(username="Tania", dni="12345678A", restaurante=restaurante)

    # 🔧 Creamos un fichaje con fecha_entrada hace 10h
    fecha_entrada = timezone.now() - timedelta(hours=10)
    fichaje = Fichaje.objects.create(
        empleado=usuario,
        restaurante=restaurante,
        fecha_entrada=fecha_entrada
    )

    # 🔥 Llamamos a la función que debe cerrar el fichaje
    cerrar_fichajes_automaticamente(Fichaje)

    # 🧪 Volvemos a cargar el fichaje desde la base de datos
    fichaje.refresh_from_db()

    # ✅ Verificamos que se haya cerrado
    assert fichaje.fecha_salida is not None
    assert fichaje.incidencia == "Fichaje cerrado automáticamente por exceder 9 horas."

    # ✅ Verificamos que la duración sea 9h exactas
    duracion_esperada = timedelta(hours=9)
    assert fichaje.duracion == duracion_esperada
