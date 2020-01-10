FROM python:3.6-alpine3.9
RUN apk add --update curl && rm -rf /var/cache/apk/*
WORKDIR /app
COPY ./requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt
COPY . /app
RUN unzip /app/cubes.zip -n
CMD ["python", "-u", "app.py"]