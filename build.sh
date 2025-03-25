#!/usr/bin/env bash

# 1. Instala backend
pip install -r requirements.txt

# 2. Migraciones y collectstatic
python manage.py migrate
python manage.py collectstatic --noinput

# 3. Construye frontend
cd frontend
npm install
npm run build

# 4. Copia React al directorio estático final
cd ..
mkdir -p staticfiles  # por si acaso
cp -r frontend/build/* staticfiles/
