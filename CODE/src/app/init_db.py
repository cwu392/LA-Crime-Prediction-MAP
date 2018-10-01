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
    crime_df = pd.read_csv(DATA_URI)

    # Date parser
    def convert_date(date_str):
        try:
            return datetime.strptime(date_str, '%Y-%m-%d').date()
        except:
            return None

    # Time parser
    def convert_time(time_str):
        try:
            return datetime.strptime('{:04d}'.format(time_str), '%H%M').time()
        except:
            return None

    def convert_day_of_week(ts):
        return (ts.weekday() if isinstance(ts, date) else ts)

    crime_df['date'] = crime_df['date'].apply(convert_date)
    crime_df['time'] = crime_df['time'].apply(convert_time)

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