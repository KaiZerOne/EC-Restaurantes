from django.urls import path

import fichajes
from .views import fichar, FichajeViewSet

urlpatterns = [
    path('fichar/', fichar, name='fichar'),  # 📌 Nueva URL para fichar
    path("fichajes/", FichajeViewSet.as_view({"get": "list", "post": "create"}), name="fichajes"),
]
