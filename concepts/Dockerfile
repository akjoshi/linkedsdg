FROM python:3.6-slim
WORKDIR /app
COPY ./requirements.txt /app/requirements.txt
RUN pip3 install -r requirements.txt
RUN python3 -m spacy download en_core_web_sm
COPY . /app
#CMD ["gunicorn", "-c", "gunicorn.config.py", "app:create_app()", "--preload", "--log-level", "debug", "--timeout", "120"]
CMD ["python3","-u", "app.py"]