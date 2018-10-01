"""Views for flask, routing requests to appropriate functions"""
from flask import jsonify, Blueprint, render_template, request
from datetime import datetime, date, time
import random
from .models.incident import Incident


# Routes
index_bp = Blueprint('index', __name__, url_prefix='/')
data_bp = Blueprint('data', __name__, url_prefix='/data')

@index_bp.route('')
def main_map():
    return render_template('index.html')


@data_bp.route('')
def get_data_endpoint():
    start_date = request.args.get('startDate')
    end_date = request.args.get('endDate')
    day_of_week = request.args.get('dayOfWeek')
    try:
        start_date = datetime.strptime(start_date, '%Y-%m-%d')
        end_date = datetime.strptime(end_date, '%Y-%m-%d')
        day_of_week = [int(v) for v in day_of_week.replace('[','').replace(']', '').split(',')]
    except:
        start_date = None
        end_date = None
        day_of_week = None
    datapoints = get_data(start_date=start_date, end_date=end_date, day_of_week=day_of_week)
    return jsonify(datapoints)


def get_data(start_date=None, end_date=None, day_of_week=None, sample_size=None):
    query = Incident.query
    
    if (start_date is not None) and (end_date is not None):
        query = (query
            .filter(Incident.date >= start_date)
            .filter(Incident.date <= end_date)
        )
    if (day_of_week is not None):
        query = (query
            .filter(Incident.day_of_week.in_(day_of_week))
        )
    # data = query.limit(sample_size)
    data = query.all()
    if sample_size is not None:
        data = random.sample(data, sample_size)
    return [d.as_dict() for d in data]
