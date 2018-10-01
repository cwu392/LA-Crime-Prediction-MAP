from . import INCIDENTS_TABLE
from . import db

# Incident model
class Incident(db.Model):
    __tablename__ = INCIDENTS_TABLE
    index = db.Column(db.Integer, primary_key=True)
    __table_args__ = {
        'extend_existing': True
    }

    def as_dict(self):
        """Helper method to convert to dictionary

        Returns:
            (dict) of {field: value}
        """
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
