#!/usr/bin/env bash

# 1. Backend
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput

# 2. Frontend
cd frontend
npm install
npm run build
cd ..

# 3. Copia build a staticfiles
mkdir -p staticfiles
cp -r frontend/build/* staticfiles/
