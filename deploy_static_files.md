# Deploying new static files for application 

This document assumes that you have a tarball of the static build files available at path ~/build-12-11-23.tar.gz on the pubapp server. 


## Delete the contents of the static files folder on Pubapps. 

The DEV and Production URL server up static files from different directories

### Dev 

```bash 
rm -rf ~/demogorgn/dev/DEMOGORGN-web/frontend/static/frontend/*
```

### Prod 

```bash 
rm -rf ~/demogorgn/prod/DEMOGORGN-web/frontend/static/frontend/*
```

## Change directories into static frontend directory and untar the static build files 

### Dev 

```bash 
cd ~/demogorgn/dev/DEMOGORGN-web/frontend/static/frontend/
tar -xvf ~/build-12-11-23.tar.gz
```

### Prod 

```bash 
cd ~/demogorgn/prod/DEMOGORGN-web/frontend/static/frontend/
tar -xvf ~/build-12-11-23.tar.gz
```
