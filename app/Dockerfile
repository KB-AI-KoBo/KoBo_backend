# AI (Flask)
FROM python:3.11.9 AS flask
WORKDIR /
ENV FLASK_APP=/app.py
ENV FLASK_RUN_HOST=0.0.0.0
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs
EXPOSE 8080
