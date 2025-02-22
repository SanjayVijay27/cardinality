from table_functions import *

from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import pandas as pd
import time
from threading import Lock

shared_data = {"df":None}
lock = Lock()

class FileChangeHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.src_path == "packet.json":  # Change to your file path
            with lock:
                shared_data["df"] = pd.read_json("packet.json")

if __name__ == "__main__":
    path = "."  # Watch the current directory
    event_handler = FileChangeHandler()
    observer = Observer()
    observer.schedule(event_handler, path, recursive=False)
    observer.start()

    try:
        shared_data["df"] = pd.read_csv("data.csv")
        while True:
            with lock:
                shared_data["df"] = None    # replace with function output
            shared_data["df"].to_json("packet.json")
    except KeyboardInterrupt:
        observer.stop()
        shared_data["df"].to_csv("data.csv", index=False)
    observer.join()
