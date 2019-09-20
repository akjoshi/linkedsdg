FROM python:3.6-alpine3.9
COPY . /app
WORKDIR /app
RUN unzip cubes.zip -n
RUN pip install -r requirements.txt
#ENTRYPOINT ["python"]
CMD ["python", "-u", "app.py"]