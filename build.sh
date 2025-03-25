#!/usr/bin/env bash

# 1. Instalar backend
pip install -r requirements.txt

# 2. Migrate y collectstatic
python manage.py migrate
python manage.py collectstatic --noinput

# 3. Construir el frontend
cd frontend
npm install
npm run build

# 4. Copiar a staticfiles
cd ..
cp -r frontend/build/* staticfiles/
