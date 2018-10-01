# DESCRIPTION
Authors: Ben Chou, ChiLin Wu, Chiamin Wu, Dennis Sosa, Kairi Kozuma
This package contains a Flask web server that can be used to analyze crime data with a map. The LA crime dataset was used as a basis for plotting crime, which is available here: https://www.kaggle.com/cityofLA/crime-in-los-angeles/data. The setup builds a local SQLite database from the included csv file, and the web server retrieves elements from that database.

The website has two modes for analyzing crime. In the regular mode, temporal and type filters can be applied, so that the map is relevant to the particular user. In prediction mode, crime labels can be predicted using linear regression.

Language: Python Framework: Flask, HTML, CSS

# INSTALLATION
## Temporal Map Web Server
- `python3 -m virtualenv venv` to create the virtualenv folder.
    - This app uses **Python 3.6**
- `source venv/bin/activate` to activate the environment.
- `cd CODE` to change to CODE directory.
- `pip install -r src/requirements.txt` to install the requirements.
- Unzip data zip files in `/data`.
- `python src/app/init_db.py` to create local sqlite database.
    - This may take some time to run, please be patient!

## Data Studio Dashboard setup steps
- Open a Google Cloud Platform https://cloud.google.com/.
- Import the original csv file from Kaggle https://www.kaggle.com/cityofLA/crime-in-los-angeles/data into Googl Data Storage (DS).
- Use BigQuery (BQ) to setup a dataset, to import the file from Data Storage, and to clean the data.
- Reimport the cleaned dataset from BQ back to DS. Then, build the dashboard at DS.
- Finally, put DS's embedded code into `index.html`.

# EXECUTION
- `python src/run.py` to run the webserver.
- Visit http://127.0.0.1:8080 (or whatever you configured the address to be)

