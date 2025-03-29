#!/usr/bin/env bash

# 1. Instalar dependencias backend
pip install -r requirements.txt

# 2. Migraciones (Django)
python manage.py migrate

# 🧹 Limpiar carpeta antigua de estáticos
rm -rf staticfiles
mkdir staticfiles

# 3. Construir frontend React
cd frontend
npm install
npm run build

# 4. Copiar todo lo generado (build completo) a staticfiles
cd ..
cp -r frontend/build/* staticfiles/
