FROM python:3.10-alpine
WORKDIR /flaskserver
RUN apk add --no-cache postgresql-client gcc musl-dev python3-dev libffi-dev g++ make
COPY . /flaskserver
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
EXPOSE 5000
CMD ["flask", "run", "--host=0.0.0.0"]