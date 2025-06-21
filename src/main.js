// Import the budget manager class
import { BudgetManager } from './budget-manager.js'

// Initialize the budget manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const budgetManager = new BudgetManager()
    budgetManager.init()
    
    // Make it globally available for onclick handlers
    window.budgetManager = budgetManager
})