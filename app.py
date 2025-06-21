import os
import logging
import json
from flask import Flask, render_template, send_from_directory, request, jsonify

# Configure logging for debugging
logging.basicConfig(level=logging.DEBUG)

# Create the Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key")

@app.route('/')
def index():
    """Serve the main budget viewer page"""
    return render_template('index.html')

@app.route('/static/<path:filename>')
def serve_static(filename):
    """Serve static files"""
    return send_from_directory('static', filename)

@app.route('/api/budgets', methods=['GET'])
def get_budgets():
    """Get list of all budgets"""
    try:
        with open('static/budgets.json', 'r') as f:
            budgets_data = json.load(f)
        return jsonify(budgets_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/budgets', methods=['POST'])
def save_budget():
    """Save a new budget or update existing one"""
    try:
        data = request.get_json()
        
        if not data or 'budgetEntry' not in data or 'budgetData' not in data:
            return jsonify({'error': 'Invalid data format'}), 400
        
        budget_entry = data['budgetEntry']
        budget_data = data['budgetData']
        
        # Save the budget data to individual file
        budget_filename = f"static/{budget_entry['filename']}"
        with open(budget_filename, 'w') as f:
            json.dump(budget_data, f, indent=2)
        
        # Update budgets list
        with open('static/budgets.json', 'r') as f:
            budgets_data = json.load(f)
        
        # Check if updating existing budget
        existing_index = -1
        for i, budget in enumerate(budgets_data['budgets']):
            if budget['id'] == budget_entry['id']:
                existing_index = i
                break
        
        if existing_index >= 0:
            # Update existing
            budgets_data['budgets'][existing_index] = budget_entry
        else:
            # Add new budget to the beginning
            budgets_data['budgets'].insert(0, budget_entry)
        
        # Save updated budgets list
        with open('static/budgets.json', 'w') as f:
            json.dump(budgets_data, f, indent=2)
        
        return jsonify({'success': True, 'message': 'Budget saved successfully'})
        
    except Exception as e:
        app.logger.error(f"Error saving budget: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
