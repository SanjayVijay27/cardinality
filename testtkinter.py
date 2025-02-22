import tkinter as tk


class DraggableRectangle:
    _id_counter = 1  # Class variable for generating unique ids

    def __init__(self, canvas, x1, y1, x2, y2, **kwargs):
        self.canvas = canvas
        # Store initial position and size
        self.x = x1
        self.y = y1
        self.width = x2 - x1
        self.height = y2 - y1
        # Create the rectangle on the canvas
        self.canvas_item = canvas.create_rectangle(x1, y1, x2, y2, **kwargs)
        # Assign a unique id to this rectangle
        self.unique_id = DraggableRectangle._id_counter
        DraggableRectangle._id_counter += 1

    def update_position(self):
        """Update the stored position using the canvas coordinates."""
        coords = self.canvas.coords(self.canvas_item)  # returns [x1, y1, x2, y2]
        self.x = coords[0]
        self.y = coords[1]

class DragDropCanvas(tk.Canvas):
    def __init__(self, master, **kwargs):
        super().__init__(master, **kwargs)
        # Dictionary to track positions of nodes: {item_id: {"x": ..., "y": ..., "width": ..., "height": ...}}
        self.nodes = {}
        self._drag_data = {"x": 0, "y": 0, "item": None}
        # Bind mouse events to canvas
        self.bind("<ButtonPress-1>", self.on_item_press)
        self.bind("<ButtonRelease-1>", self.on_item_release)
        self.bind("<B1-Motion>", self.on_item_motion)



    def add_node(self, id, x1, y1, x2, y2):
        self.nodes[id] = {
            "x": x1,
            "y": y1,
            "width": x2 - x1,
            "height": y2 - y1
        }
        return id
    

    def add_rectangle(self, x1, y1, x2, y2, **kwargs):
        """Creates a rectangle and stores its initial position in the nodes dictionary."""
        item = self.create_rectangle(x1, y1, x2, y2, **kwargs)
        self.nodes[item] = {
            "x": x1,
            "y": y1,
            "width": x2 - x1,
            "height": y2 - y1
        }
        return item


    def on_item_press(self, event):
        # Use find_overlapping to check if the click is directly on an item.
        items = self.find_overlapping(event.x, event.y, event.x, event.y)
        if items:
            # If multiple items overlap, choose the top-most one (last in the list)
            item = items[-1]
            self._drag_data["item"] = item
            self._drag_data["x"] = event.x
            self._drag_data["y"] = event.y
            # Bring the clicked item to the top
            self.tag_raise(self._drag_data["item"])
        else:
            # Clicked on an empty space; do nothing.
            self._drag_data["item"] = None

    def on_item_motion(self, event):
        if self._drag_data["item"]:
            # Calculate how far the mouse has moved
            dx = event.x - self._drag_data["x"]
            dy = event.y - self._drag_data["y"]
            # Move the selected item by the mouse movement
            self.move(self._drag_data["item"], dx, dy)
            # Update the tracking data
            self._drag_data["x"] = event.x
            self._drag_data["y"] = event.y
        
            # Update the node's position in the dictionary
            coords = self.coords(self._drag_data["item"])  # returns [x1, y1, x2, y2]
            if self._drag_data["item"] in self.nodes:
                self.nodes[self._drag_data["item"]]["x"] = coords[0]
                self.nodes[self._drag_data["item"]]["y"] = coords[1]
            else:
                #self.add_node(event. coords[0],coords[1],coords[2],coords[3])
                pass

    def on_item_release(self, event):
        # Reset the drag data
        self._drag_data["item"] = None

def main():
    root = tk.Tk()
    root.title("Drag and Drop Canvas Example")

    # Create our custom canvas
    canvas = DragDropCanvas(root, width=500, height=500, bg="white")
    canvas.pack(fill="both", expand=True)

    # Create some boxes (rectangles) on the canvas
    canvas.create_rectangle(50, 50, 150, 150, fill="red")
    canvas.create_rectangle(200, 50, 300, 150, fill="green")
    canvas.create_rectangle(350, 50, 450, 150, fill="blue")


    # Optionally, print the nodes dictionary every 2 seconds to see live updates
    def print_nodes():
        print("Current node positions:")
        for item_id, data in canvas.nodes.items():
            print(f"Item {item_id}: {data}")
        root.after(2000, print_nodes)
    print_nodes()

    root.mainloop()

if __name__ == "__main__":
    main()
