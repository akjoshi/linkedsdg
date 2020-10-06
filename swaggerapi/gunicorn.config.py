import multiprocessing

bind = "0.0.0.0:5003"
workers = multiprocessing.cpu_count() * 2 + 1