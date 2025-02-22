import tkinter as tk

# Global dictionary to track box positions and text.
nodes = {}  # key: node id (rectangle id), value: {"position": (x, y), "text": "..."}

# Global dictionary to store our Box instances, keyed by their rectangle id.
boxes = {}

# Global variables for current drag operation.
current_box = None
drag_offset_x = 0
drag_offset_y = 0

class Box:
    def __init__(self, canvas, x, y, size=150, text=""):
        self.canvas = canvas
        self.x = x
        self.y = y
        self.size = size
        
        # Create the rectangle (background square) and assign a "draggable" tag.
        self.rect = canvas.create_rectangle(x, y, x + size, y + size,
                                              fill="lightgrey", outline="black",
                                              tags=("draggable",))
        # Create an Entry widget for text editing.
        self.entry = tk.Entry(canvas, bd=0, justify="center")
        self.entry.insert(0, text)
        # Embed the Entry widget inside the rectangle; position it centered.
        self.window = canvas.create_window(x + size/2, y + size/2, window=self.entry)
        
        # Initialize the global dictionary entry for this box.
        nodes[self.rect] = {"position": (x, y), "text": text}

    def move(self, dx, dy):
        """Move both the rectangle and its text widget."""
        self.canvas.move(self.rect, dx, dy)
        self.canvas.move(self.window, dx, dy)
        self.x += dx
        self.y += dy
        # Update global node info.
        nodes[self.rect]["position"] = (self.x, self.y)

    def update_text(self):
        """Update the stored text from the Entry widget."""
        nodes[self.rect]["text"] = self.entry.get()

    def lift(self):
        """Raise the box so it appears on top of all other items."""
        self.canvas.tag_raise(self.rect)
        self.canvas.tag_raise(self.window)

def on_canvas_click(event):
    """On mouse down, check if a box background is clicked and start drag if so."""
    global current_box, drag_offset_x, drag_offset_y
    canvas = event.widget
    # Find all items under the cursor.
    items = canvas.find_overlapping(event.x, event.y, event.x, event.y)
    # Iterate in reverse order (topmost first).
    for item in reversed(items):
        # Only consider items with the "draggable" tag (our box background).
        if "draggable" in canvas.gettags(item):
            current_box = boxes.get(item)
            if current_box:
                # Calculate offset between click point and the box's top-left corner.
                coords = canvas.coords(current_box.rect)  # returns [x1, y1, x2, y2]
                drag_offset_x = event.x - coords[0]
                drag_offset_y = event.y - coords[1]
                break  # Only drag the topmost box.
                
def on_canvas_drag(event):
    """During dragging, move the selected box."""
    global current_box, drag_offset_x, drag_offset_y
    if current_box:
        # Determine new top-left position based on the mouse position and the offset.
        new_x = event.x - drag_offset_x
        new_y = event.y - drag_offset_y
        # Get current position (top-left) of the box.
        coords = current_box.canvas.coords(current_box.rect)
        current_x, current_y = coords[0], coords[1]
        dx = new_x - current_x
        dy = new_y - current_y
        current_box.move(dx, dy)
        
def on_canvas_release(event):
    """On release, update the box's text, lift it to the top, and end dragging."""
    global current_box
    if current_box:
        current_box.update_text()
        current_box.lift()
        current_box = None

def main():
    root = tk.Tk()
    root.title("Draggable Boxes with Text")
    root.geometry("600x400")
    
    canvas = tk.Canvas(root, bg="white")
    canvas.pack(fill="both", expand=True)
    
    # Bind canvas events for drag-and-drop.
    canvas.bind("<ButtonPress-1>", on_canvas_click)
    canvas.bind("<B1-Motion>", on_canvas_drag)
    canvas.bind("<ButtonRelease-1>", on_canvas_release)
    
    # Create a couple of boxes.
    b1 = Box(canvas, 50, 50, size=150, text="Box 1")
    boxes[b1.rect] = b1
    b2 = Box(canvas, 120, 120, size=150, text="Box 2")
    boxes[b2.rect] = b2
    
    root.mainloop()

if __name__ == '__main__':
    main()
