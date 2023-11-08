#!/bin/sh
#SBATCH --cpus-per-task=12
#SBATCH --mem=20gb
#SBATCH --time=00:30:00
#SBATCH --job-name=job_test
#SBATCH --mail-type=ALL
#SBATCH --mail-user=kerekovskik@ufl.edu
#SBATCH --output=serial_%j.out

pwd; hostname; date
/pubapps/emackie/miniconda3/envs/demogorgn_env/bin/python3 /pubapps/emackie/test_dir/DEMOGORGN-web/scripts/simulate.py --output_dir /pubapps/emackie/realizations --datafile /pubapps/emackie/data/PIG_data.csv --guid TEST_GUID --res 200 --num_realizations 2 --num_cpus 12
date