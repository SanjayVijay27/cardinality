# filepath: /c:/Users/Richard Li/Documents/GitHub/cardinality/app.py
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/update_card_position', methods=['POST'])
def update_card_position():
    data = request.json
    card_id = data.get('card_id')
    new_position = data.get('new_position')
    text = data.get('text')
    # Here you can handle the card position update and text content logic
    print(f"Card {card_id} moved to position {new_position} with text '{text}'")
    return jsonify({'status': 'success'})

if __name__ == '__main__':
    app.run(debug=True)