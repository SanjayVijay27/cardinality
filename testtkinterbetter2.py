import tkinter as tk

# Global dictionary to track box positions and content
boxes_info = {}

class DraggableBox:
    def __init__(self, canvas, x, y, width=100, height=50, text=''):
        self.canvas = canvas
        self.width = width
        self.height = height
        self.text = text

        # Create a rectangle with a shaded background
        self.rect = canvas.create_rectangle(
            x, y, x + width, y + height, fill='lightblue', tags='box'
        )

        # Create an entry widget for text inside the rectangle
        self.entry = tk.Entry(canvas)
        self.entry.insert(0, text)
        self.entry_window = canvas.create_window(
            x + width / 2, y + height / 2, window=self.entry, tags='box'
        )

        # Bind events for dragging
        self.canvas.tag_bind(self.rect, '<Button-1>', self.on_click)
        self.canvas.tag_bind(self.entry_window, '<Button-1>', self.on_click)
        self.canvas.tag_bind(self.rect, '<B1-Motion>', self.on_drag)
        self.canvas.tag_bind(self.entry_window, '<B1-Motion>', self.on_drag)
        self.canvas.tag_bind(self.rect, '<ButtonRelease-1>', self.on_release)
        self.canvas.tag_bind(self.entry_window, '<ButtonRelease-1>', self.on_release)

        # Store initial position
        self._drag_data = {'x': 0, 'y': 0}

        # Update global dictionary
        boxes_info[self.rect] = {
            'position': (x, y),
            'text': self.entry.get()
        }

    def on_click(self, event):
        '''Begining drag of an object'''
        # Record the item and its location
        self._drag_data['x'] = event.x
        self._drag_data['y'] = event.y

    def on_drag(self, event):
        '''Handle dragging of an object'''
        # Compute how much the mouse has moved
        delta_x = event.x - self._drag_data['x']
        delta_y = event.y - self._drag_data['y']

        # Move the rectangle and entry window
        self.canvas.move(self.rect, delta_x, delta_y)
        self.canvas.move(self.entry_window, delta_x, delta_y)

        # Update drag data
        self._drag_data['x'] = event.x
        self._drag_data['y'] = event.y

    def on_release(self, event):
        '''End drag of an object'''
        # Move the box to the top of the canvas stack
        self.canvas.tag_raise(self.rect)
        self.canvas.tag_raise(self.entry_window)

        # Update the position in the global dictionary
        x1, y1, x2, y2 = self.canvas.coords(self.rect)
        boxes_info[self.rect]['position'] = (x1, y1)
        boxes_info[self.rect]['text'] = self.entry.get()

def main():
    root = tk.Tk()
    root.title("Draggable Boxes with Editable Text")

    canvas = tk.Canvas(root, width=800, height=600, bg='white')
    canvas.pack(fill=tk.BOTH, expand=True)

    # Create a few draggable boxes
    DraggableBox(canvas, 50, 50, text='Box 1')
    DraggableBox(canvas, 200, 150, text='Box 2')
    DraggableBox(canvas, 350, 250, text='Box 3')

    root.mainloop()

if __name__ == "__main__":
    main()
