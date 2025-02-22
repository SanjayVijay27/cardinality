from table_functions import *

from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import pandas as pd
import time

class FileChangeHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.src_path == "packet.json":  # Change to your file path
            print(f"{event.src_path} has been modified!")

if __name__ == "__main__":
    path = "."  # Watch the current directory
    event_handler = FileChangeHandler()
    observer = Observer()
    observer.schedule(event_handler, path, recursive=False)
    observer.start()

    try:
        df = pd.read_csv("data.csv")
        while True:
            time.sleep(1)  # Keep the script running
    except KeyboardInterrupt:
        observer.stop()
        df.to_csv('data.csv', index=False)
    observer.join()
