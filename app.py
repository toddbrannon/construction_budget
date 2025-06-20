import os
import logging
import json
from datetime import datetime
from flask import Flask, render_template, send_from_directory, request, jsonify, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from sqlalchemy.orm import DeclarativeBase
from werkzeug.middleware.proxy_fix import ProxyFix

# Configure logging for debugging
logging.basicConfig(level=logging.DEBUG)

class Base(DeclarativeBase):
    pass

# Create Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key-change-in-production")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# Database configuration
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    'pool_pre_ping': True,
    "pool_recycle": 300,
}

# Initialize extensions
db = SQLAlchemy(app, model_class=Base)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.login_message = 'Please log in to access this page.'

@login_manager.user_loader
def load_user(user_id):
    from models import User
    return User.query.get(int(user_id))

@app.route('/')
def index():
    """Serve the main budget viewer page"""
    if not current_user.is_authenticated:
        return redirect(url_for('login'))
    return render_template('index.html', user=current_user)

@app.route('/static/<path:filename>')
def serve_static(filename):
    """Serve static files"""
    return send_from_directory('static', filename)

@app.route('/login', methods=['GET', 'POST'])
def login():
    """Login page"""
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        from models import User
        username = request.form.get('username')
        password = request.form.get('password')
        
        if not username or not password:
            flash('Please provide both username and password.', 'error')
            return render_template('login.html')
        
        user = User.query.filter_by(username=username).first()
        
        if user and user.check_password(password):
            login_user(user, remember=True)
            user.last_login = datetime.utcnow()
            db.session.commit()
            
            next_page = request.args.get('next')
            if next_page:
                return redirect(next_page)
            return redirect(url_for('index'))
        else:
            flash('Invalid username or password.', 'error')
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    """Logout user"""
    logout_user()
    flash('You have been logged out successfully.', 'success')
    return redirect(url_for('login'))

@app.route('/api/budgets', methods=['GET'])
@login_required
def get_budgets():
    """Get list of user's budgets"""
    try:
        from models import Budget
        user_budgets = Budget.query.filter_by(user_id=current_user.id).order_by(Budget.updated_at.desc()).all()
        budgets_data = {
            'budgets': [budget.to_dict() for budget in user_budgets]
        }
        return jsonify(budgets_data)
    except Exception as e:
        app.logger.error(f"Error fetching budgets: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/budgets', methods=['POST'])
@login_required
def save_budget():
    """Save a new budget or update existing one"""
    try:
        from models import Budget
        data = request.get_json()
        
        if not data or 'budgetEntry' not in data or 'budgetData' not in data:
            return jsonify({'error': 'Invalid data format'}), 400
        
        budget_entry = data['budgetEntry']
        budget_data = data['budgetData']
        
        # Save the budget data to individual file
        budget_filename = f"static/user_{current_user.id}_{budget_entry['filename']}"
        with open(budget_filename, 'w') as f:
            json.dump(budget_data, f, indent=2)
        
        # Check if updating existing budget
        existing_budget = Budget.query.filter_by(
            budget_id=budget_entry['id'],
            user_id=current_user.id
        ).first()
        
        if existing_budget:
            # Update existing budget
            existing_budget.project_name = budget_entry['projectName']
            existing_budget.client = budget_entry['client']
            existing_budget.address = budget_entry.get('address', '')
            existing_budget.total_budget = budget_entry['totalBudget']
            existing_budget.status = budget_entry.get('status', 'planning')
        else:
            # Create new budget
            new_budget = Budget(
                budget_id=budget_entry['id'],
                user_id=current_user.id,
                project_name=budget_entry['projectName'],
                client=budget_entry['client'],
                address=budget_entry.get('address', ''),
                total_budget=budget_entry['totalBudget'],
                status=budget_entry.get('status', 'planning'),
                data_file=budget_filename
            )
            db.session.add(new_budget)
        
        db.session.commit()
        return jsonify({'success': True, 'message': 'Budget saved successfully'})
        
    except Exception as e:
        app.logger.error(f"Error saving budget: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/init-db')
def init_db():
    """Initialize database with test data"""
    try:
        from models import User, Budget
        
        # Create tables
        db.create_all()
        
        # Check if test user already exists
        existing_user = User.query.filter_by(username='shoppers').first()
        if existing_user:
            return jsonify({'message': 'Database already initialized with test user'})
        
        # Create test user
        test_user = User(
            username='shoppers',
            email='shoppers@example.com',
            first_name='Test',
            last_name='User',
            role='admin'
        )
        test_user.set_password('password123')
        
        db.session.add(test_user)
        db.session.commit()
        
        app.logger.info("Database initialized with test user: shoppers / password123")
        return jsonify({
            'message': 'Database initialized successfully',
            'test_user': 'shoppers',
            'test_password': 'password123'
        })
        
    except Exception as e:
        app.logger.error(f"Error initializing database: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Create tables and test user on startup
with app.app_context():
    try:
        from models import User, Budget
        db.create_all()
        
        # Create test user if it doesn't exist
        if not User.query.filter_by(username='shoppers').first():
            test_user = User(
                username='shoppers',
                email='shoppers@example.com',
                first_name='Test',
                last_name='User',
                role='admin'
            )
            test_user.set_password('password123')
            db.session.add(test_user)
            db.session.commit()
            app.logger.info("Created test user: shoppers / password123")
    except Exception as e:
        app.logger.error(f"Error during startup initialization: {str(e)}")