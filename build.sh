#!/usr/bin/env bash

# 1. Instalar dependencias backend
pip install -r requirements.txt

# 2. Migraciones + static
python manage.py migrate
python manage.py collectstatic --noinput

# 3. Construir frontend React
cd frontend
npm install
npm run build

# 4. Copiar contenido de build a staticfiles/static
cd ..
mkdir -p staticfiles/static
cp -r frontend/build/* staticfiles/static/
