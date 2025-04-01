#!/usr/bin/env bash

# 1. Backend
pip install -r requirements.txt
python manage.py migrate

# 2. Limpiar y crear carpetas
rm -rf staticfiles
mkdir -p staticfiles

# 3. Frontend: construir React
cd frontend
npm install
npm run build
cd ..

# 4. Copiar TODO el build en staticfiles/
cp -r frontend/build/* staticfiles/

# 5. collectstatic (usa solo el contenido de staticfiles/static)
python manage.py collectstatic --noinput

if [ "$INITIAL_DATA" = "true" ]; then
  echo "📥 Importando datos iniciales..."
  python manage.py loaddata full_data.json
else
  echo "ℹ️ Variable INITIAL_DATA no activada. No se importa nada."
fi