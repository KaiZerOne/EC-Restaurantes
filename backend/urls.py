from django.contrib import admin
from django.shortcuts import redirect
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from envio_pedidos.views import ProveedorViewSet, CategoriaViewSet, ProductoViewSet, PedidoViewSet, DetallePedidoViewSet
from fichajes.views import FichajeViewSet
from usuarios.views import UsuarioViewSet

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'fichajes', FichajeViewSet)
router.register(r'proveedores', ProveedorViewSet)
router.register(r'categorias', CategoriaViewSet)
router.register(r'productos', ProductoViewSet)
router.register(r'pedidos', PedidoViewSet)
router.register(r'detalles-pedido', DetallePedidoViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", lambda request: redirect("/admin/")),  # 🏠 Redirige al admin si entras a raíz
    path("fichajes/", include("fichajes.urls")),  # ✅ Esta es clave
    # 📌 Solo incluye las URLs de fichajes UNA vez
    path("api/", include(router.urls)),
    path("api/", include("usuarios.urls")),
    path("api/", include("fichajes.urls")),
    path("api/", include("envio_pedidos.urls")),
    path("api/", include("restaurantes.urls")),

    # 🔐 JWT auth endpoints
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
