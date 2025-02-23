import pandas as pd

def create_columns(df, text, id):
    pairs = text.split('\n')
    for pair in pairs:
        if "::" not in pair:
            continue
        key, value = pair.split('::')
        df.loc[df['id'] == id, key] = value
    return df
