import pandas as pd
import numpy as np
import os
from datetime import datetime, date, time
from sqlalchemy import create_engine

# Database URI
DB_URI = 'sqlite:///{}'.format(os.path.join(os.path.dirname(__file__), 'app.db'))

# Table name for incidents
INCIDENTS_TABLE = 'incidents'

# Data path
DATA_URI = os.path.join(os.path.dirname(__file__), '../../data/crime_cleaned.csv')

def main():
    # Read in as DataFrame
    crime_df = pd.read_csv(DATA_URI, dtype={'Time Occurred': str})

    # Keep certain columns
    columns = [
        'crime_code',
        'date',
        'time',
        'crime_code_description',  
        'longitude',
        'latitude',    
        'day_of_week'
        # 'DR Number',
        # 'Date Occurred',
        # 'Time Occurred',
        # 'Crime Code',
        # 'Crime Code Description',
        # 'Victim Age',
        # 'Victim Sex',
        # 'Victim Descent',
        # 'Weapon Used Code',
        # 'Weapon Description',
        # 'Address',
        # 'Cross Street',
        # 'Location'
    ]
    crime_df = crime_df[columns]

    # Rename columns to snake case
    # crime_df.columns = [d.lower().replace(' ', '_') for d in crime_df.columns]

    # Convert string coordinates to floats
    # def extract_coordinates(coord_str):
    #     try:
    #         tokens = coord_str.replace('(', '').replace(')', '').split(',')
    #         return [float(t.strip()) for t in tokens]
    #     except:
    #         return (np.nan, np.nan)
    # crime_df['longitude'], crime_df['latitude'] = zip(*crime_df['location'].map(extract_coordinates))
    # crime_df = crime_df.drop(columns=['location'])

    # Time parsers
    # def convert_date(date_str):
    #     try:
    #         return datetime.strptime(date_str, '%m/%d/%Y').date()
    #     except:
    #         return None

    # def convert_time(time_str):
    #     try:
    #         return datetime.strptime(time_str, '%H%M').time()
    #     except:
    #         return None

    # def convert_day_of_week(ts):
    #     return (ts.weekday() if isinstance(ts, date) else ts)

    # crime_df['date'] = crime_df.apply(lambda x: convert_date(x['date']), axis=1)
    # crime_df['time'] = crime_df.apply(lambda x: convert_time(x['time']), axis=1)
    # crime_df['day_of_week'] = crime_df.apply(lambda x: convert_day_of_week(x['date']), axis=1)
    # crime_df = crime_df.drop(columns=['date', 'time'])

    # Drop rows where timestamp is null
    crime_df = crime_df[~crime_df['date'].isnull()]
    crime_df = crime_df[~crime_df['time'].isnull()]

    # SQLite database
    engine = create_engine(DB_URI)

    # Open new connection
    with engine.connect() as conn:
        crime_df.to_sql(name=INCIDENTS_TABLE, con=conn, if_exists='replace')


if __name__ == '__main__':
    main()