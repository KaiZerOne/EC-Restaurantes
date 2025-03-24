#!/usr/bin/env bash

# Instalar dependencias backend
pip install -r requirements.txt

# Migraciones y collectstatic (si usas archivos estáticos)
python manage.py migrate
python manage.py collectstatic --noinput

# Construir el frontend (React)
cd frontend
npm install
npm run build

# Mover la build de React a carpeta estática de Django (si usas STATICFILES_DIRS)
cd ..
