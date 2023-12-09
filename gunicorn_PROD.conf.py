import multiprocessing

raw_env = [
    'DJANGO_SETTINGS_MODULE=demogorgn.settings',
]

bind = "localhost:19280"
workers = multiprocessing.cpu_count() * 2 + 1
wsgi_app = "demogorgn.wsgi:application"