import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'
import { BudgetManager } from './budget-manager.js'

// Initialize the budget manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const budgetManager = new BudgetManager()
    budgetManager.init()
})