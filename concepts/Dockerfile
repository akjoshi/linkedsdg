FROM ubuntu:bionic
RUN apt-get update
RUN apt-get -y install build-essential python-dev git python3 python3-dev python3-pip
WORKDIR /app
COPY ./requirements.txt /app/requirements.txt
RUN pip3 install -r requirements.txt
RUN python3 -m spacy download en_core_web_sm
COPY . /app

CMD ["python3","-u", "app.py"]