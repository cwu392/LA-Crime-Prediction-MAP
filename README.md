# This is the course project of Data Visualization:
developed with Ben Chou, ChiLin Wu, Chiamin Wu, Dennis Sosa, Kairi Kozuma

This project is using historical criminal records from 2010 ~ 2016 in LA
to predict the regional dangerousness and visualize its result on the website.

Language: Python
Framework: Flask, HTML, CSS

# Quick Start

- `python3 -m virtualenv venv` to create the virtualenv folder.
    - This app uses **Python 3.6**
- `source venv/bin/activate` to activate the environment.
- `pip install -r src/requirements.txt` to install the requirements.
- Unzip data zip files in `/data`.
- `python src/app/init_db.py` to create local sqlite database.
    - This may take some time to run, please be patient!
- `python src/run.py` to run the webserver.
- Visit http://127.0.0.1:8080 (or whatever you configured the address to be)


=======
# LA-Crime-Prediction-MAP
LA criminal prediction

