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
1. In Project Root start Django (backend) server: `DEV_MODE=TRUE python3 manage.py runserver` . This will start django on port 8000. Take note of the DEV_MODE=TRUE env variable being set as part of the command.
2. Go into the frontend directory (ie: `cd frontend`)
3. Install any dependencies that may be missing: `npm install`
4. Run this command: `npm run start` . This will server up static files on port 3000 and proxy requests sent to /api/* to django at port 8000
5. Project is available at http://localhost:3000 from the browser.


### Further Project Documentation

* [Managing The Gunicorn Server](managing_gunicorn.md)
* [Installing Miniconda on Pubapps](miniconda_setup.md)
* [Building the static files](build_static_files.md)
* [Deploying the static files](deploy_static_files.md)



