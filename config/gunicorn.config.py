import multiprocessing

bind = "0.0.0.0:5007"
workers = multiprocessing.cpu_count() * 2 + 1