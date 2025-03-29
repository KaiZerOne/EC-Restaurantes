#!/usr/bin/env bash

# 1. Instala backend Python
pip install -r requirements.txt

# 2. Aplica migraciones de Django
python manage.py migrate

# 3. Borra y crea carpetas necesarias
rm -rf staticfiles
mkdir -p staticfiles/static

# 4. Construye el frontend (React)
cd frontend
npm install
npm run build

# 5. Copia el contenido de React build a staticfiles/static
cd ..
cp -r frontend/build/* staticfiles/static/
