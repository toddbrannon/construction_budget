class BudgetViewer {
    constructor() {
        this.budgetData = null;
        this.grandTotal = 0;
        this.isNewBudgetMode = false;
        this.isEditMode = false;
        this.currentBudgetId = null;
        this.budgetsList = [];
        this.filteredBudgets = [];
        this.currentView = 'dashboard';
        this.newBudgetData = {
            project: { name: '', client: '', address: '' },
            trades: {}
        };
        this.tradeCounter = 0;
        this.tradeCategories = [
            'PROFESSIONAL SERVICES',
            'GENERAL CONDITIONS',
            'TEMPORARY CONDITIONS',
            'SHELL',
            'MASONRY',
            'DECKING',
            'WATERPROOFING',
            'ROOFING / SIDING',
            'EXTERIOR WINDOWS & DOORS',
            'FRAMING & DRYWALL',
            'PLUMBING',
            'ELECTRICAL & LOW VOLTAGE',
            'HEATING & COOLING',
            'NATURAL GAS & PROPANE',
            'FLOORING',
            'INTERIOR TRIM PACKAGE',
            'EXTERIOR TRIM PACKAGE',
            'PAINT',
            'TYPE / MARBLE / TOPS',
            'CABINETRY AND BUILT-INS',
            'APPLIANCES',
            'BATHROOM ACCESSORIES',
            'OTHER AMENITIES',
            'EXTERIOR ACCESSORIES',
            'DRIVEWAY',
            'POOL',
            'SEAWALL AND DOCK',
            'LANDSCAPING / IRRIGATION',
            'SITE WORK',
            'PEST CONTROL',
            'SMS DIRECT SERVICES'
        ];
        
        this.tradeNames = [
            'Professional Services',
            'General Conditions',
            'Temporary Conditions',
            'Shell',
            'Masonry',
            'Decking',
            'Waterproofing',
            'Roofing / Siding',
            'Exterior Windows & Doors',
            'Framing & Drywall',
            'Plumbing',
            'Electrical & Low Voltage',
            'Heating & Cooling',
            'Natural Gas & Propane',
            'Flooring',
            'Interior Trim Package',
            'Exterior Trim Package',
            'Paint',
            'Tile / Marble / Tops',
            'Cabinetry and Built-ins',
            'Appliances',
            'Bathroom Accessories',
            'Other Amenities',
            'Exterior Accessories',
            'Driveway',
            'Pool',
            'Seawall and Dock',
            'Landscaping / Irrigation',
            'Site Work',
            'Pest Control',
            'SMS Direct Services'
        ];
    }

    async init() {
        this.setupEventListeners();
        await this.loadBudgetsList();
    }

    setupEventListeners() {
        // New budget button
        document.getElementById('newBudgetBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.showNewBudgetForm();
        });
        
        // Create blank budget
        document.getElementById('createBlankBudget').addEventListener('click', (e) => {
            e.preventDefault();
            this.showNewBudgetForm();
        });
        
        // Save new budget
        document.getElementById('saveNewBudget').addEventListener('click', (e) => {
            e.preventDefault();
            this.saveNewBudget();
        });
        
        // Cancel new budget
        document.getElementById('cancelNewBudget').addEventListener('click', (e) => {
            e.preventDefault();
            this.hideNewBudgetForm();
        });
        
        // Add trade section
        document.getElementById('addTradeSection').addEventListener('click', (e) => {
            e.preventDefault();
            this.addNewTrade();
        });
        
        // Search and filter functionality
        document.getElementById('searchBudgets').addEventListener('input', (e) => {
            this.filterBudgets();
        });
        
        document.getElementById('filterStatus').addEventListener('change', (e) => {
            this.filterBudgets();
        });
        
        document.getElementById('sortBudgets').addEventListener('change', (e) => {
            this.sortBudgets();
        });
        
        // Export PDF
        document.getElementById('exportPdfBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.exportToPDF();
        });
    }

    async loadBudgetsList() {
        try {
            const response = await fetch('/api/budgets');
            if (response.ok) {
                this.budgetsList = await response.json();
                this.filteredBudgets = [...this.budgetsList];
                this.renderBudgetsList();
                this.hideLoadingMessage();
            } else {
                console.error('Failed to load budgets');
                this.hideLoadingMessage();
                this.showEmptyState();
            }
        } catch (error) {
            console.error('Error loading budgets:', error);
            this.hideLoadingMessage();
            this.showEmptyState();
        }
    }

    hideLoadingMessage() {
        document.getElementById('loadingMessage').classList.add('d-none');
        document.getElementById('dashboardContent').classList.remove('d-none');
    }

    showEmptyState() {
        document.getElementById('noBudgetsMessage').classList.remove('d-none');
        document.getElementById('budgetsList').classList.add('d-none');
    }

    renderBudgetsList() {
        const container = document.getElementById('budgetsList');
        
        if (this.filteredBudgets.length === 0) {
            this.showEmptyState();
            return;
        }
        
        document.getElementById('noBudgetsMessage').classList.add('d-none');
        container.classList.remove('d-none');
        
        container.innerHTML = this.filteredBudgets.map(budget => `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100 budget-card" data-budget-id="${budget.budget_id}">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h6 class="card-subtitle mb-0 text-muted">${budget.client}</h6>
                        <span class="badge bg-${this.getStatusColor(budget.status)}">${budget.status}</span>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${budget.project_name}</h5>
                        <p class="card-text text-muted small">${budget.address || 'No address specified'}</p>
                        <div class="budget-amount mb-3">
                            <strong class="text-primary fs-5">$${this.formatCurrency(budget.total_budget)}</strong>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent">
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">
                                Last modified: ${this.formatDate(budget.updated_at)}
                            </small>
                            <div class="btn-group">
                                <button class="btn btn-sm btn-outline-primary" onclick="budgetViewer.loadBudget('${budget.data_file}')">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-secondary" onclick="budgetViewer.editBudget('${budget.budget_id}')">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    getStatusColor(status) {
        const colors = {
            'planning': 'warning',
            'active': 'success',
            'completed': 'info',
            'on-hold': 'secondary'
        };
        return colors[status] || 'secondary';
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US').format(amount);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString();
    }

    async loadBudget(filename) {
        try {
            const response = await fetch(`/static/sample_budgets/${filename}`);
            if (response.ok) {
                this.budgetData = await response.json();
                this.renderBudget();
                this.switchView('budget');
            } else {
                this.showError('Failed to load budget data');
            }
        } catch (error) {
            console.error('Error loading budget:', error);
            this.showError('Error loading budget data');
        }
    }

    renderBudget() {
        if (!this.budgetData) return;
        
        this.renderProjectInfo();
        this.renderTradeSections();
        this.calculateGrandTotal();
        this.showExportButton();
    }

    renderProjectInfo() {
        const project = this.budgetData.project;
        document.getElementById('projectName').textContent = project.name || 'Untitled Project';
        document.getElementById('projectClient').textContent = project.client || 'No client specified';
        document.getElementById('projectAddress').textContent = project.address || 'No address specified';
    }

    renderTradeSections() {
        const container = document.getElementById('tradeSections');
        const trades = this.budgetData.trades || {};
        
        container.innerHTML = Object.entries(trades).map(([tradeKey, trade]) => 
            this.createTradeSection(tradeKey, trade)
        ).join('');
    }

    createTradeSection(tradeKey, trade) {
        const lineItems = trade.lineItems || trade.line_items || [];
        const subtotal = this.calculateTradeSubtotal(lineItems);
        
        return `
            <div class="trade-section mb-4">
                <div class="card">
                    <div class="card-header">
                        <div class="d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">${trade.name}</h5>
                            <div>
                                <span class="badge bg-primary me-2">${lineItems.length} items</span>
                                <strong>$${this.formatCurrency(subtotal)}</strong>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        ${lineItems.map(item => this.createLineItemHTML(item)).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    createLineItemHTML(item) {
        const budget = item.budgetAmount || item.budget || 0;
        return `
            <div class="line-item mb-3 p-3 border rounded">
                <div class="row">
                    <div class="col-md-3">
                        <strong>${item.category}</strong>
                    </div>
                    <div class="col-md-3">
                        ${item.vendor}
                    </div>
                    <div class="col-md-2">
                        <strong class="text-success">$${this.formatCurrency(budget)}</strong>
                    </div>
                    <div class="col-md-4">
                        <small class="text-muted">${item.notes || ''}</small>
                    </div>
                </div>
            </div>
        `;
    }

    calculateTradeSubtotal(lineItems) {
        return lineItems.reduce((total, item) => {
            const budget = item.budgetAmount || item.budget || 0;
            return total + parseFloat(budget);
        }, 0);
    }

    calculateGrandTotal() {
        const trades = this.budgetData.trades || {};
        this.grandTotal = Object.values(trades).reduce((total, trade) => {
            const lineItems = trade.lineItems || trade.line_items || [];
            return total + this.calculateTradeSubtotal(lineItems);
        }, 0);
        
        document.getElementById('grandTotal').textContent = `$${this.formatCurrency(this.grandTotal)}`;
    }

    showNewBudgetForm() {
        this.isNewBudgetMode = true;
        this.resetNewBudgetForm();
        this.switchView('new');
    }

    hideNewBudgetForm() {
        this.isNewBudgetMode = false;
        this.switchView('dashboard');
    }

    resetNewBudgetForm() {
        document.getElementById('newProjectName').value = '';
        document.getElementById('newProjectClient').value = '';
        document.getElementById('newProjectAddress').value = '';
        document.getElementById('newTradesContainer').innerHTML = '';
        this.newBudgetData = {
            project: { name: '', client: '', address: '' },
            trades: {}
        };
        this.tradeCounter = 0;
        this.addNewTrade();
        
        const saveButton = document.getElementById('saveNewBudget');
        saveButton.innerHTML = '<i class="fas fa-save me-2"></i>Save Budget';
    }

    addNewTrade() {
        this.tradeCounter++;
        const tradeKey = `trade_${this.tradeCounter}`;
        
        const tradeHTML = `
            <div class="trade-section mb-4" data-trade-key="${tradeKey}">
                <div class="card">
                    <div class="card-header">
                        <div class="d-flex justify-content-between align-items-center">
                            <select class="form-select trade-name" style="max-width: 300px;">
                                <option value="">Select Trade Category</option>
                                ${this.tradeNames.map(name => `<option value="${name}">${name}</option>`).join('')}
                            </select>
                            <button type="button" class="btn btn-outline-danger btn-sm remove-trade">
                                <i class="fas fa-times"></i> Remove Trade
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="line-items-container">
                            <!-- Line items will be added here -->
                        </div>
                        <button type="button" class="btn btn-outline-primary btn-sm add-line-item">
                            <i class="fas fa-plus me-2"></i>Add Line Item
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('newTradesContainer').insertAdjacentHTML('beforeend', tradeHTML);
        
        // Set up event listeners for the new trade section
        const newTradeSection = document.querySelector(`[data-trade-key="${tradeKey}"]`);
        
        // Remove trade button
        newTradeSection.querySelector('.remove-trade').addEventListener('click', (e) => {
            e.preventDefault();
            newTradeSection.remove();
        });
        
        // Add line item button
        newTradeSection.querySelector('.add-line-item').addEventListener('click', (e) => {
            e.preventDefault();
            const container = newTradeSection.querySelector('.line-items-container');
            const tradeName = newTradeSection.querySelector('.trade-name').value;
            this.addLineItem(container, tradeName);
        });
        
        // Trade name change
        newTradeSection.querySelector('.trade-name').addEventListener('change', (e) => {
            const tradeName = e.target.value;
            const container = newTradeSection.querySelector('.line-items-container');
            // Update existing line items with new trade context if needed
        });
        
        // Add initial line item
        const container = newTradeSection.querySelector('.line-items-container');
        this.addLineItem(container, '');
    }

    addLineItem(container, tradeName) {
        const lineItemHTML = `
            <div class="line-item mb-3 p-3 border rounded">
                <div class="row g-3">
                    <div class="col-md-3">
                        <label class="form-label">Category</label>
                        <select class="form-select item-category" required>
                            <option value="">Select Category</option>
                            ${this.tradeCategories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Vendor</label>
                        <input type="text" class="form-control item-vendor" placeholder="Enter vendor name" required>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Budget Amount</label>
                        <input type="number" class="form-control item-budget" placeholder="0" min="0" step="0.01" required>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Notes</label>
                        <textarea class="form-control item-notes" rows="1" placeholder="Optional notes"></textarea>
                    </div>
                    <div class="col-md-1 d-flex align-items-end">
                        <button type="button" class="btn btn-outline-danger btn-sm remove-line-item">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', lineItemHTML);
        
        // Set up remove line item functionality
        const newLineItem = container.lastElementChild;
        newLineItem.querySelector('.remove-line-item').addEventListener('click', (e) => {
            e.preventDefault();
            newLineItem.remove();
        });
        
        return newLineItem;
    }

    async saveNewBudget() {
        if (!this.validateNewBudget()) {
            return;
        }
        
        this.collectNewBudgetData();
        
        try {
            const response = await fetch('/api/budgets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.newBudgetData)
            });
            
            if (response.ok) {
                const result = await response.json();
                this.showSuccessMessage('Budget saved successfully!');
                await this.loadBudgetsList();
                this.hideNewBudgetForm();
            } else {
                const error = await response.json();
                this.showError(error.error || 'Failed to save budget');
            }
        } catch (error) {
            console.error('Error saving budget:', error);
            this.showError('Error saving budget');
        }
    }

    validateNewBudget() {
        const projectName = document.getElementById('newProjectName').value.trim();
        const projectClient = document.getElementById('newProjectClient').value.trim();
        
        if (!projectName || !projectClient) {
            alert('Please fill in the project name and client name.');
            return false;
        }
        
        const trades = document.querySelectorAll('[data-trade-key]');
        let hasValidTrade = false;
        
        for (const trade of trades) {
            const tradeNameSelect = trade.querySelector('.trade-name');
            const tradeName = tradeNameSelect ? tradeNameSelect.value.trim() : '';
            const lineItems = trade.querySelectorAll('.line-item');
            
            if (tradeName && lineItems.length > 0) {
                let hasValidItem = false;
                for (const item of lineItems) {
                    const categorySelect = item.querySelector('.item-category');
                    const category = categorySelect ? categorySelect.value.trim() : '';
                    const vendor = item.querySelector('.item-vendor').value.trim();
                    const budget = parseFloat(item.querySelector('.item-budget').value) || 0;
                    
                    if (category && vendor && budget > 0) {
                        hasValidItem = true;
                        break;
                    }
                }
                if (hasValidItem) {
                    hasValidTrade = true;
                    break;
                }
            }
        }
        
        if (!hasValidTrade) {
            alert('Please add at least one complete trade section with valid line items.');
            return false;
        }
        
        return true;
    }

    collectNewBudgetData() {
        this.newBudgetData.project = {
            name: document.getElementById('newProjectName').value.trim(),
            client: document.getElementById('newProjectClient').value.trim(),
            address: document.getElementById('newProjectAddress').value.trim()
        };
        
        this.newBudgetData.trades = {};
        const trades = document.querySelectorAll('[data-trade-key]');
        
        trades.forEach(trade => {
            const tradeKey = trade.dataset.tradeKey;
            const tradeNameSelect = trade.querySelector('.trade-name');
            const tradeName = tradeNameSelect.value.trim();
            
            if (tradeName) {
                const lineItems = [];
                const itemElements = trade.querySelectorAll('.line-item');
                
                itemElements.forEach(item => {
                    const categorySelect = item.querySelector('.item-category');
                    const category = categorySelect.value.trim();
                    const vendor = item.querySelector('.item-vendor').value.trim();
                    const budget = parseFloat(item.querySelector('.item-budget').value) || 0;
                    const notes = item.querySelector('.item-notes').value.trim();
                    
                    if (category && vendor && budget > 0) {
                        lineItems.push({
                            category,
                            vendor,
                            budget,
                            notes
                        });
                    }
                });
                
                if (lineItems.length > 0) {
                    this.newBudgetData.trades[tradeKey] = {
                        name: tradeName,
                        lineItems
                    };
                }
            }
        });
    }

    switchView(view) {
        this.currentView = view;
        
        // Hide all views
        document.getElementById('loadingMessage').classList.add('d-none');
        document.getElementById('dashboardContent').classList.add('d-none');
        document.getElementById('budgetContent').classList.add('d-none');
        document.getElementById('newBudgetForm').classList.add('d-none');
        
        // Show selected view
        switch (view) {
            case 'dashboard':
                document.getElementById('dashboardContent').classList.remove('d-none');
                this.hideExportButton();
                break;
            case 'budget':
                document.getElementById('budgetContent').classList.remove('d-none');
                this.showExportButton();
                break;
            case 'new':
                document.getElementById('newBudgetForm').classList.remove('d-none');
                this.hideExportButton();
                break;
        }
    }

    showExportButton() {
        document.getElementById('exportPdfBtn').classList.remove('d-none');
    }

    hideExportButton() {
        document.getElementById('exportPdfBtn').classList.add('d-none');
    }

    filterBudgets() {
        const searchTerm = document.getElementById('searchBudgets').value.toLowerCase();
        const statusFilter = document.getElementById('filterStatus').value;
        
        this.filteredBudgets = this.budgetsList.filter(budget => {
            const matchesSearch = !searchTerm || 
                budget.project_name.toLowerCase().includes(searchTerm) ||
                budget.client.toLowerCase().includes(searchTerm) ||
                (budget.address && budget.address.toLowerCase().includes(searchTerm));
            
            const matchesStatus = !statusFilter || budget.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        });
        
        this.renderBudgetsList();
    }

    sortBudgets() {
        const sortBy = document.getElementById('sortBudgets').value;
        
        this.filteredBudgets.sort((a, b) => {
            switch (sortBy) {
                case 'projectName':
                    return a.project_name.localeCompare(b.project_name);
                case 'totalBudget':
                    return parseFloat(b.total_budget) - parseFloat(a.total_budget);
                case 'dateCreated':
                    return new Date(b.created_at) - new Date(a.created_at);
                case 'lastModified':
                default:
                    return new Date(b.updated_at) - new Date(a.updated_at);
            }
        });
        
        this.renderBudgetsList();
    }

    exportToPDF() {
        if (!this.budgetData) return;
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(20);
        doc.text('Construction Budget', 20, 30);
        
        // Add project info
        doc.setFontSize(12);
        doc.text(`Project: ${this.budgetData.project.name}`, 20, 50);
        doc.text(`Client: ${this.budgetData.project.client}`, 20, 60);
        doc.text(`Address: ${this.budgetData.project.address}`, 20, 70);
        
        // Add grand total
        doc.setFontSize(14);
        doc.text(`Total Budget: $${this.formatCurrency(this.grandTotal)}`, 20, 90);
        
        let yPos = 110;
        
        // Add trade sections
        Object.entries(this.budgetData.trades).forEach(([tradeKey, trade]) => {
            if (yPos > 250) {
                doc.addPage();
                yPos = 30;
            }
            
            const lineItems = trade.lineItems || trade.line_items || [];
            const subtotal = this.calculateTradeSubtotal(lineItems);
            
            doc.setFontSize(12);
            doc.text(`${trade.name} - $${this.formatCurrency(subtotal)}`, 20, yPos);
            yPos += 10;
            
            lineItems.forEach(item => {
                if (yPos > 250) {
                    doc.addPage();
                    yPos = 30;
                }
                
                const budget = item.budgetAmount || item.budget || 0;
                doc.setFontSize(10);
                doc.text(`  ${item.category} - ${item.vendor} - $${this.formatCurrency(budget)}`, 25, yPos);
                yPos += 8;
            });
            
            yPos += 5;
        });
        
        doc.save(`${this.budgetData.project.name}_budget.pdf`);
    }

    showSuccessMessage(message) {
        // Simple alert for now - could be enhanced with toast notifications
        alert(message);
    }

    showError(message) {
        // Simple alert for now - could be enhanced with toast notifications
        alert(`Error: ${message}`);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.budgetViewer = new BudgetViewer();
    window.budgetViewer.init();
});