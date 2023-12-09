# Installing Miniconda On PubApps Server 

- [Download Miniconda installer script from official site.](https://docs.conda.io/projects/miniconda/en/latest/)
- scp the miniconda install files to pubapps server
- Make the installation script executable 
```bash
chmod 770 Miniconda3-latest-Linux-x86_64.sh
```
- Run the script and follow the interactive prompts, accepting the defaults 
```bash
./Miniconda3-latest-Linux-x86_64.sh
```
- Initialize Conda for the bash shell
```bash
~/miniconda3/bin/conda init bash
```
- Create an environment file with the following contents
```yaml 
name: demogorgn_env
channels:
  - conda-forge
  - defaults
dependencies:
  - python=3.10
  - scikit-gstat
  - numpy
  - matplotlib
  - scikit-learn
  - gstools
  - pandas
  - pip
  - pip:
      - gstatsim
      - django
      - djangorestframework
      - django-cors-headers
      - gunicorn
```
- Create the environment where environment.yml is the name of the yaml configuration file from the previous step.
```bash 
~/miniconda3/bin/conda env create -f environment.yml -n demogorgn_env
```
- Add the following to the bottom of the ~/.bashrc file. 
```
conda activate demogorgn_env
```
