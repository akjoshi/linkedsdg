FROM openjdk:8-jdk-alpine
RUN apk add python3=3.6.9-r3
WORKDIR /app
COPY ./requirements.txt /app/requirements.txt
RUN pip3 install -r requirements.txt
COPY . /app

CMD ["gunicorn", "-c", "gunicorn.config.py", "app:app", "--log-level", "debug", "--timeout", "120"]
#CMD ["python3", "-u", "app.py"]