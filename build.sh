#! /bin/bash

docker build . -t europe-west6-docker.pkg.dev/mip-mato/mip-portal-mockup/mip-mockup-image
if [ $? -eq 0 ]
then 
    docker push europe-west6-docker.pkg.dev/mip-mato/mip-portal-mockup/mip-mockup-image
fi