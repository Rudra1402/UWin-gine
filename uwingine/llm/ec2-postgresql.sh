#!/bin/bash
# Update and install necessary packages
sudo yum update -y
sudo dnf install postgresql15.x86_64 postgresql15-server  postgresql15-server-devel.x86_64 gcc git make -y

# Initialize PostgreSQL database
sudo postgresql-setup --initdb

# Enable and start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Install pgvector extension dependencies
cd /tmp
git clone https://github.com/pgvector/pgvector.git
cd pgvector

# Build and install pgvector
make PG_CONFIG=/usr/bin/pg_config
sudo make install

# Modify PostgreSQL configuration to allow necessary connections
echo "host all all 0.0.0.0/0 md5" | sudo tee -a /var/lib/pgsql/data/pg_hba.conf
echo "listen_addresses = '*'" | sudo tee -a /var/lib/pgsql/data/postgresql.conf

# Restart PostgreSQL to apply changes
sudo systemctl restart postgresql

# Create a PostgreSQL user and database for testing
sudo -i -u postgres psql -c "CREATE USER langchain WITH PASSWORD 'langchain321';"
sudo -i -u postgres psql -c "CREATE DATABASE langchain;"
sudo -i -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE langchain TO langchain;"
sudo -i -u postgres psql -c "ALTER USER langchain WITH SUPERUSER;"

# Enable pgvector extension in the database
sudo -i -u postgres psql -d langchain -c "CREATE EXTENSION vector;"

echo "PostgreSQL with pgvector setup complete on Amazon Linux 2."
