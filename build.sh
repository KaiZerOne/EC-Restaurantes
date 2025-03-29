#!/usr/bin/env bash

pip install -r requirements.txt
python manage.py migrate

rm -rf staticfiles
mkdir -p staticfiles

cd frontend
npm install
npm run build
cd ..

cp -r frontend/build/* staticfiles/

python manage.py collectstatic --noinput
