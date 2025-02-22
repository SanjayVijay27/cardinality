from flask import Flask, render_template, request, jsonify, send_file
import pandas as pd

app = Flask(__name__)

# Load the initial data from the CSV file
df = pd.read_csv('data.csv')

@app.route('/')
def index():
    # Convert the DataFrame to a list of dictionaries
    cards_data = df.to_dict(orient='records')
    return render_template('index.html', cards_data=cards_data)

@app.route('/update_card_position', methods=['POST'])
def update_card_position():
    data = request.get_json()
    card_id = data.get('card_id')
    new_position = data.get('new_position')

    # Update the DataFrame
    df.loc[df['id'] == card_id, ['x', 'y']] = new_position['x'], new_position['y']
    df.to_csv('data.csv', index=False)

    return jsonify({'status': 'success', 'message': f"Card {card_id} moved to position {new_position}"})

@app.route('/update_data', methods=['GET'])
def update_data():
    data = pd.read_csv('data.csv')
    return data.to_json()

@app.route('/init_data', methods=['GET'])
def init_data():
    #data = pd.read_csv('data.csv')
    #return data.to_json()
    return send_file('static/initialData.json', mimetype='application/json')

if __name__ == '__main__':
    app.run(debug=True)