FROM ubuntu:bionic
COPY . /app
WORKDIR /app
RUN apt-get update
RUN apt-get -y install build-essential python-dev git python3 python3-dev python3-pip
RUN pip3 install -r requirements.txt
RUN python3 -m spacy download en_core_web_sm
#ENTRYPOINT ["python3"]
CMD ["python3","-u", "app.py"]