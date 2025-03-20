from django.urls import path
from .views import fichar, FichajeViewSet, saldo_semanal, validar_contrasenia_panel, compensar_fichaje

urlpatterns = [
    path("fichar/", fichar, name="fichar"),
    path("fichajes/", FichajeViewSet.as_view({"get": "list", "post": "create"}), name="fichajes"),
    path("validar-panel/", validar_contrasenia_panel, name="validar_panel"),
    path("saldo-semanal/", saldo_semanal, name="saldo_semanal"),
    path('compensar/<int:fichaje_id>/', compensar_fichaje, name='compensar_fichaje'),
]
