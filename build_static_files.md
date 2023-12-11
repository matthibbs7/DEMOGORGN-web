# Build Static Files 

This document explains how to create the static build artifacts for the application and package them so that they can be copied to the pubapps servers. 

## Pull down the latest changes to the project

```bash
git checkout main
git pull
```
## Change Directory to the frontend directory

```bash 
cd frontend
```

## Run the build command 

```bash 
npm run build
```

## Tarball the contents of the static frontend directory 

The tarball will have to manually be copied to the pubapps server. 

```bash 
cd static/frontend/ 
tar -czvf ../../../build-12-11-23.tar.gz ./*
```