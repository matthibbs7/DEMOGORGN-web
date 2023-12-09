
# Managing The Gunicorn Server

## Introduction

This document provides instructions for managing the Gunicorn server in both development and production environments for the DEMOGORGN project. Gunicorn is a Python WSGI HTTP Server for UNIX systems, widely used for deploying Python web applications.

## Getting Started

### Starting the Gunicorn Server

#### Start Dev Gunicorn

To initiate the Gunicorn server in a development environment, execute:

```bash 
cd /pubapps/emackie/demogorgn/dev/DEMOGORGN-web/
nohup /pubapps/emackie/miniconda3/envs/demogorgn_env/bin/python /pubapps/emackie/miniconda3/envs/demogorgn_env/bin/gunicorn -c /pubapps/emackie/demogorgn/dev/DEMOGORGN-web/gunicorn_DEV.conf.py > /pubapps/emackie/demogorgn/dev/DEMOGORGN-web/gunicorn_nohup.log 2>&1 &
```

#### Start Prod Gunicorn

For the production environment, use:

```bash 
cd /pubapps/emackie/demogorgn/prod/DEMOGORGN-web/
nohup /pubapps/emackie/miniconda3/envs/demogorgn_env/bin/python /pubapps/emackie/miniconda3/envs/demogorgn_env/bin/gunicorn -c /pubapps/emackie/demogorgn/prod/DEMOGORGN-web/gunicorn_PROD.conf.py > /pubapps/emackie/demogorgn/prod/DEMOGORGN-web/gunicorn_nohup.log 2>&1 &
```

## Stopping the Gunicorn Server

When stopping the Gunicorn server, it's crucial to correctly identify and terminate the parent process. The parent process is responsible for spawning and managing child processes.

### Stop Dev Gunicorn

To stop the Gunicorn server in the development environment:

```bash 
(demogorgn_env) [emackie@pubweb1 ~]$ ps -ef|grep _DEV
```

This command outputs the list of Gunicorn processes. Identify the parent process by looking at the second column (PID) and the third column (PPID, or Parent Process ID). The parent process is the one whose PID does not appear as a PPID in any other line.

For example:

```
UID        PID  PPID  C STIME TTY          TIME CMD
emackie   9893 31316  0 12:21 pts/1    00:00:03 /path/to/gunicorn -c ..._DEV
emackie   9932  9893  0 12:21 pts/1    00:00:02 /path/to/gunicorn -c ..._DEV
```

In this example, process 9893 is the parent process, as its PID is the PPID of process 9932. To terminate it, use:

```bash
(demogorgn_env) [emackie@pubweb1 ~]$ kill -9 9893
```

### Stop Prod Gunicorn

Follow a similar approach for the production environment:

```bash
(demogorgn_env) [emackie@pubweb1 ~]$ ps -ef|grep _PROD
```

Identify the parent process and use its PID with the `kill -9` command to stop it.

---

Ensure you have the necessary permissions before executing these commands. Stopping the wrong process can lead to unintended system behaviors. Always verify the PID of the parent Gunicorn process carefully.
