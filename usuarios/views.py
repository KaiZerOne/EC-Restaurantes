from rest_framework import viewsets
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAdminUser, IsAuthenticated

from .serializers import UsuarioSerializer

Usuario = get_user_model()

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    def get_permissions(self):
        """
        - Si es 'list' (GET /usuarios/), solo admins pueden ver todos los usuarios.
        - Si es otra acción (retrieve, update, delete), cualquier usuario autenticado puede ver su propio perfil.
        """
        if self.action == 'list':
            self.permission_classes = [IsAdminUser]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()