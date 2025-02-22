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
    print(data)
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
    data = pd.read_csv('data.csv')
    return data.to_json(orient='records')
    #return send_file('static/initialData.json', mimetype='application/json')

@app.route('/add_card', methods=['POST'])
def add_card():
    data = request.get_json()
    new_card = {
        'id': data.get('card_id'),
        'x': data.get('new_position')['x'],
        'y': data.get('new_position')['y'],
        'text': data.get('text')
    }

    # Append the new card to the DataFrame
    global df
    new_card_df = pd.DataFrame([new_card])
    df = pd.concat([df, new_card_df], ignore_index=True)
    df.to_csv('data.csv', index=False)

    return jsonify({'status': 'success', 'message': f"Card {new_card['id']} added"})

@app.route('/delete_card', methods=['POST'])
def delete_card():
    data = request.get_json()
    id = data.get('card_id')
    print(f"Deleting card {id}")

    # Delete the card from the dataframe
    global df
    df = df[df['id'].astype(str) != str(id)]
    df.to_csv('data.csv', index=False)

    return jsonify({'status': 'success', 'message': f"Card {id} deleted"})

if __name__ == '__main__':
    app.run(debug=True)