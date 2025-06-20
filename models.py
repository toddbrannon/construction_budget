from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from app import db

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)
    password_hash = db.Column(db.String(256), nullable=False)
    first_name = db.Column(db.String(50), nullable=True)
    last_name = db.Column(db.String(50), nullable=True)
    role = db.Column(db.String(20), default='user')
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime, nullable=True)
    
    def set_password(self, password):
        """Set password hash"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check password against hash"""
        return check_password_hash(self.password_hash, password)
    
    def __repr__(self):
        return f'<User {self.username}>'

class Budget(db.Model):
    __tablename__ = 'budgets'
    
    id = db.Column(db.Integer, primary_key=True)
    budget_id = db.Column(db.String(100), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    project_name = db.Column(db.String(200), nullable=False)
    client = db.Column(db.String(200), nullable=False)
    address = db.Column(db.Text, nullable=True)
    total_budget = db.Column(db.Numeric(12, 2), nullable=False)
    status = db.Column(db.String(20), default='planning')
    data_file = db.Column(db.String(200), nullable=False)  # JSON filename
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    user = db.relationship('User', backref=db.backref('budgets', lazy=True))
    
    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return {
            'id': self.budget_id,
            'projectName': self.project_name,
            'client': self.client,
            'address': self.address,
            'totalBudget': float(self.total_budget),
            'status': self.status,
            'filename': self.data_file,
            'dateCreated': self.created_at.strftime('%Y-%m-%d'),
            'lastModified': self.updated_at.strftime('%Y-%m-%d')
        }
    
    def __repr__(self):
        return f'<Budget {self.project_name}>'