FROM python:3.8-slim

RUN apt-get update && apt-get install -y libpq-dev gcc && apt-get clean

RUN mkdir /app
WORKDIR /app

# Install system dependencies and Node.js
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    libpq-dev \
    gcc \
    && curl -sL https://deb.nodesource.com/setup_14.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean


# Verify Node.js installation
RUN node -v

# Install npm explicitly if not included with Node.js
RUN apt-get install -y npm || true

# Verify npm installation
RUN npm -v

# # Install Node.js and npm
# RUN curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
#     apt-get install -y nodejs

RUN pip install --upgrade pip
COPY requirements.txt /app/
RUN pip install -r requirements.txt

# COPY ./backend /app

COPY ./entrypoint.sh /

# Expose the port Daphne will run on
EXPOSE 8000

ENTRYPOINT ["sh", "/entrypoint.sh"]
