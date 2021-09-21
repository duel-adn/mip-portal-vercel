#! /bin/sh
PROJECT=mip-mato
NAME=mip-mockup-image
TAG=europe-west6-docker.pkg.dev/$PROJECT/mip-portal-mockup/$NAME
gcloud run deploy $NAME \
--image=$TAG \
--platform=managed \
--region=europe-west6 \
--project=$PROJECT