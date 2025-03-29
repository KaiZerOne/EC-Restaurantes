#!/usr/bin/env bash

# Backend: instalar dependencias
pip install -r requirements.txt

# Migraciones
python manage.py migrate

# Frontend
cd frontend
npm install
npm run build
cd ..

# ⚠️ Creamos la estructura correcta
mkdir -p staticfiles/static

# Copiamos el *contenido entero del build*
cp -r frontend/build/* staticfiles/static/

# Static collect (Django lo moverá a staticfiles_collected)
python manage.py collectstatic --noinput
