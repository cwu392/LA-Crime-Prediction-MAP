"""Views for flask, routing requests to appropriate functions"""
from flask import jsonify, Blueprint, render_template, request
from datetime import datetime, date, time
from .models.incident import Incident


# Routes
index_bp = Blueprint('index', __name__, url_prefix='/')
data_bp = Blueprint('data', __name__, url_prefix='/data')

@index_bp.route('')
def main_map():
    return render_template('index.html')


@data_bp.route('')
def get_data_endpoint():
    start_date = request.args.get('startDate');
    end_date = request.args.get('endDate');
    try:
        start_date = datetime.strptime(start_date, '%Y-%m-%d');
        end_date = datetime.strptime(end_date, '%Y-%m-%d');
    except:
        start_date = None
        end_date = None
    datapoints = get_data(start_date=start_date, end_date=end_date)
    return jsonify(datapoints)


def get_data(start_date=None, end_date=None, start_time=None, end_time=None):
    query = Incident.query
    if (start_date is not None) and (end_date is not None):
        query = (query
            .filter(Incident.date >= start_date)
            .filter(Incident.date <= end_date)
        )
    if (start_time is not None) and (end_time is not None):
        query = (query
            .filter(Incident.time >= start_time)
            .filter(Incident.time <= end_time)
        )
    data = query.limit(1000)
    return [d.as_dict() for d in data]