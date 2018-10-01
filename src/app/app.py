from flask import Flask
from .init_db import DB_URI, INCIDENTS_TABLE
import json
from datetime import datetime, date, time

class CustomJSONEncoder(json.JSONEncoder):
    """Custom encoder to handle date and time"""

    def default(self, obj):
        if isinstance(obj, time):
            return str(obj)
        elif isinstance(obj, date):
            return str(obj)
        else:
            return super.default(obj)


def create_app():
    # Main flask application
    """Flask application factory. Initializes and returns Flask application.

    Returns:
        Initialized Flask application
    """

    # Create Flask appliaction
    app = Flask(__name__, instance_relative_config=True)

    app.json_encoder = CustomJSONEncoder
    # Load default src/config.py
    app.config.from_object('config')

    # Load src/instance/config.py
    # Configurations in this file override the default values
    try:
        app.config.from_pyfile('config.py')
    except FileNotFoundError as e:
        print(' * - File /src/instance/config.py does not exist!')
        print(' * - Default configuration used')
        print(' * - Create /src/instance/config.py with actual configuration for deployment')

    # SQLite database
    app.config['SQLALCHEMY_DATABASE_URI'] = DB_URI

    # Initialize db object
    from .models import db
    db.init_app(app)
    with app.app_context():
        db.reflect()

    # Register views
    from .views import index_bp, data_bp
    app.register_blueprint(index_bp)
    app.register_blueprint(data_bp)

    return app
