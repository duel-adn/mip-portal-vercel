CREATE USER MIP_CMS_USR WITH 
    NOCREATEDB LOGIN NOCREATEROLE
    ENCRYPTED PASSWORD 'MIP_CMS_USR';

CREATE DATABASE MIP_CMS_DB
    WITH OWNER = postgres
    TEMPLATE = template0
    ENCODING = 'UTF8'
    TABLESPACE = pg_default
    LC_COLLATE = 'it_IT'
    LC_CTYPE = 'it_IT'
   CONNECTION LIMIT = -1;

GRANT ALL PRIVILEGES ON DATABASE MIP_CMS_DB TO MIP_CMS_USR;

CREATE EXTENSION POSTGIS;
CREATE EXTENSION POSTGIS_TOPOLOGY;
CREATE EXTENSION POSTGIS_TIGER_GEOCODER CASCADE;