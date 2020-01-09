FROM ubuntu:bionic
RUN apt-get update
RUN apt-get -y install build-essential python-dev git python3 python3-dev python3-pip default-jdk
#RUN apt-get -y install python-pip
WORKDIR /app
COPY ./requirements.txt /app/requirements.txt
RUN pip3 install -r requirements.txt
COPY . /app
CMD ["python3", "-u", "app.py"]