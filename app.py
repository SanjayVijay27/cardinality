from table_functions import *

from flask import Flask, render_template, request, jsonify, send_file
import pandas as pd

from google import genai

import os
from dotenv import load_dotenv

load_dotenv()

googleai_apikey = os.getenv('API_KEY')

app = Flask(__name__)

# Load the initial data from the CSV file
df = pd.read_csv('data.csv', quoting=1)




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
    global df
    df.loc[df['id'] == card_id, ['x', 'y', 'text', 'width', 'height']] = new_position['x'], new_position['y'], data.get('text'), data.get('width'), data.get('height')
    df = create_columns(df, data.get('text'), card_id)
    df.to_csv('data.csv', index=False, quoting=1)

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

@app.route('/get_data', methods=['GET'])
def get_data():
    data = df.to_json(orient='records')
    return data

@app.route('/add_card', methods=['POST'])
def add_card():
    data = request.get_json()
    new_card = {
        'id': data.get('card_id'),
        'x': data.get('new_position')['x'],
        'y': data.get('new_position')['y'],
        'text': data.get('text'),
        'width': data.get('width'),
        'height': data.get('height')
    }

    # Append the new card to the DataFrame
    global df
    new_card_df = pd.DataFrame([new_card])
    df = pd.concat([df, new_card_df], ignore_index=True)
    df = create_columns(df, new_card['text'], new_card['id'])
    df.to_csv('data.csv', index=False, quoting=1)

    return jsonify({'status': 'success', 'message': f"Card {new_card['id']} added"})

@app.route('/delete_card', methods=['POST'])
def delete_card():
    data = request.get_json()
    id = data.get('card_id')
    print(f"Deleting card {id}")

    # Delete the card from the dataframe
    global df
    df = df[df['id'].astype(str) != str(id)]
    df.to_csv('data.csv', index=False, quoting=1)

    return jsonify({'status': 'success', 'message': f"Card {id} deleted"})

@app.route('/gen_ai_output', methods=['POST'])
def gen_ai_output():
    data = request.get_json()
    user_prompt = data.get('input')
    newdf = df.drop(columns=['width', 'height', 'x', 'y'])
    newdf['text'] = newdf['text'].apply(lambda x: '\n'.join([line for line in x.split('\n') if '::' not in line]))
    newdf['text'] = newdf['text'].str.replace('\n', ' ')
    csv_string = newdf.to_csv(index=False)


    prompt = f"Read the following CSV data:\n{csv_string}\n\n. Output in regular text instead of markdown, meaning no use of '*' for boid. Now using that data, respond to the following command, and keep the answer concise, but show all your steps: {user_prompt}"
    
    client = genai.Client(api_key=googleai_apikey)
    response = client.models.generate_content(
        model="gemini-2.0-flash", contents= prompt
    )
    #print(response.text)



    AI_output = response.text
    print(response.text)

    return jsonify({'output': AI_output})

#test prompt: How much food is needed to feed all the tables? The food per table is calculated by the people * the food needed

if __name__ == '__main__':
    app.run(debug=True)