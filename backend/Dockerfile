FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

RUN mkdir -p staticfiles && python manage.py collectstatic --noinput

EXPOSE 8000

CMD [ "gunicorn", "--bind", "0.0.0.0:8000", "core.wsgi:application" ]