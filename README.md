# DEMOGORGN-web
<img src="https://i.imgur.com/5LRRmIO.png" width="70%" height="70%" />

### Dev Onboarding
1. Create Virtual Environment

```bash
python3 -m venv venv
```
2. Activate the virtual environment

```bash
source ./venv/bin/activate
```

3. Install Python3 dependencies:
```bash
pip3 install -r requirements_sgs_parallelization.txt
```

### Setup Dev Environment
There are 2 steps required to get the website setup on your local environment (start the frontend and backend servers):
1. Go into the frontend directory (ie: `cd frontend`)
2. Start dev server in frontend directory: `npm run dev`
3. Go to parent directory (~/DEMOGORGN-web): `cd ..`
4. Start Django (backend) server: `python3 ./manage.py runserver`
5. Local build should be hosted on http://127.0.0.1:8000/ by default


### Docker set up

```
docker container rm -f demogorgn_test 
docker image rm demogorgn:latest
docker build --platform linux/amd64 -t demogorgn . -f Dockerfile_oel8
docker run --platform linux/amd64  -d -p 9999:80 --name demogorgn_test demogorgn:latest
```