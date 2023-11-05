# Use Oracle Enterprise Linux 7 as the base image
FROM oraclelinux:8-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /pubapps/emackie/demogorgn/dev

# Install system dependencies
RUN yum install -y gcc openssl-devel bzip2-devel libffi-devel
RUN yum install -y wget make yum-utils

# Install Python 3
RUN yum install -y oracle-epel-release-el7
RUN yum install -y python3 python3-devel python3-pip

# Install Node.js for the React build process
RUN yum install -y nodejs npm

# Install Gunicorn
RUN pip3 install gunicorn

# Install Nginx
RUN yum install -y nginx

# Copy the Django REST API and React frontend into the image
COPY ./api /pubapps/emackie/demogorgn/dev/api
COPY ./frontend /pubapps/emackie/demogorgn/dev/frontend
COPY ./requirements.txt /pubapps/emackie/demogorgn/dev/requirements.txt
COPY ./requirements_sgs_parallelization.txt /pubapps/emackie/demogorgn/dev/requirements_sgs_parallelization.txt

# Install Python dependencies
#RUN pip3 install -v -r requirements_sgs_parallelization.txt
RUN pip3 install -r requirements.txt

# Build the React frontend
RUN cd frontend && npm install && npm run build

# Copy the Nginx configuration file
COPY ./nginx.conf /etc/nginx/nginx.conf

# Copy the Gunicorn configuration file
COPY ./gunicorn.conf.py /pubapps/emackie/demogorgn/dev/gunicorn.conf.py

# Make port 80 available to the world outside this container
EXPOSE 80

# Start Nginx and Gunicorn
CMD service nginx start && gunicorn -c gunicorn.conf.py api.wsgi
