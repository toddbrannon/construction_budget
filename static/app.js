class BudgetViewer {
    constructor() {
        this.budgetData = null;
        this.grandTotal = 0;
        this.isNewBudgetMode = false;
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
        
        this.init();
    }
    
    async init() {
        try {
            await this.loadBudgetData();
            this.renderBudget();
            this.setupEventListeners();
            this.hideLoading();
        } catch (error) {
            console.error('Failed to initialize budget viewer:', error);
            this.showError('Failed to load budget data. Please refresh the page and try again.');
            this.hideLoading();
        }
    }
    
    async loadBudgetData() {
        try {
            const response = await fetch('/static/budget.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.budgetData = await response.json();
            
            // Validate required data structure
            if (!this.budgetData.project || !this.budgetData.trades) {
                throw new Error('Invalid budget data structure');
            }
        } catch (error) {
            console.error('Error loading budget data:', error);
            throw error;
        }
    }
    
    renderBudget() {
        if (!this.budgetData) return;
        
        this.renderProjectInfo();
        this.renderTradeSections();
        this.calculateGrandTotal();
    }
    
    renderProjectInfo() {
        const project = this.budgetData.project;
        
        document.getElementById('projectName').textContent = project.name || 'N/A';
        document.getElementById('projectClient').textContent = project.client || 'N/A';
        document.getElementById('projectAddress').textContent = project.address || 'N/A';
    }
    
    renderTradeSections() {
        const tradeSectionsContainer = document.getElementById('tradeSections');
        tradeSectionsContainer.innerHTML = '';
        
        Object.entries(this.budgetData.trades).forEach(([tradeKey, trade]) => {
            if (!trade.line_items || trade.line_items.length === 0) {
                return; // Skip trades with no line items
            }
            
            const tradeSection = this.createTradeSection(tradeKey, trade);
            tradeSectionsContainer.appendChild(tradeSection);
        });
    }
    
    createTradeSection(tradeKey, trade) {
        const subtotal = this.calculateTradeSubtotal(trade.line_items);
        
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'trade-section card mb-3';
        sectionDiv.innerHTML = `
            <div class="card-header">
                <div class="d-flex justify-content-between align-items-center">
                    <h4 class="mb-0">
                        <button class="btn btn-link text-decoration-none p-0 text-start trade-toggle" 
                                type="button" data-trade="${tradeKey}">
                            <i class="fas fa-chevron-down me-2 trade-icon"></i>
                            ${this.escapeHtml(trade.name)}
                        </button>
                    </h4>
                    <div class="currency text-end">
                        <strong>${this.formatCurrency(subtotal)}</strong>
                    </div>
                </div>
            </div>
            <div class="card-body trade-content" id="trade-${tradeKey}">
                <div class="row d-none d-md-flex text-muted mb-2">
                    <div class="col-md-3"><small><strong>Category</strong></small></div>
                    <div class="col-md-3"><small><strong>Vendor</strong></small></div>
                    <div class="col-md-2"><small><strong>Budget</strong></small></div>
                    <div class="col-md-4"><small><strong>Notes</strong></small></div>
                </div>
                ${trade.line_items.map(item => this.createLineItemHTML(item)).join('')}
                <hr class="my-3">
                <div class="row">
                    <div class="col">
                        <strong>Subtotal: ${this.escapeHtml(trade.name)}</strong>
                    </div>
                    <div class="col-auto">
                        <strong class="currency">${this.formatCurrency(subtotal)}</strong>
                    </div>
                </div>
            </div>
        `;
        
        return sectionDiv;
    }
    
    createLineItemHTML(item) {
        return `
            <div class="row mb-2 py-2 border-bottom border-secondary align-items-center">
                <div class="col-12 col-sm-6 col-md-3 mb-2 mb-sm-1 mb-md-0">
                    <div class="d-flex flex-column">
                        <strong class="d-md-none text-muted small">Trade Category</strong>
                        <span class="fw-medium">${this.escapeHtml(item.category)}</span>
                    </div>
                </div>
                <div class="col-12 col-sm-6 col-md-3 mb-2 mb-sm-1 mb-md-0">
                    <div class="d-flex flex-column">
                        <strong class="d-md-none text-muted small">Vendor</strong>
                        <span>${this.escapeHtml(item.vendor)}</span>
                    </div>
                </div>
                <div class="col-6 col-md-2 mb-2 mb-md-0">
                    <div class="d-flex flex-column">
                        <strong class="d-md-none text-muted small">Budget</strong>
                        <span class="currency fw-bold text-success">${this.formatCurrency(item.budget)}</span>
                    </div>
                </div>
                <div class="col-6 col-md-4">
                    ${item.notes ? `
                        <div class="d-flex flex-column">
                            <strong class="d-md-none text-muted small">Notes</strong>
                            <small class="text-muted">${this.escapeHtml(item.notes)}</small>
                        </div>
                    ` : '<span class="d-md-none"></span>'}
                </div>
            </div>
        `;
    }
    
    calculateTradeSubtotal(lineItems) {
        return lineItems.reduce((sum, item) => sum + (item.budget || 0), 0);
    }
    
    calculateGrandTotal() {
        this.grandTotal = 0;
        
        Object.values(this.budgetData.trades).forEach(trade => {
            if (trade.line_items && trade.line_items.length > 0) {
                this.grandTotal += this.calculateTradeSubtotal(trade.line_items);
            }
        });
        
        document.getElementById('grandTotal').textContent = this.formatCurrency(this.grandTotal);
    }
    
    setupEventListeners() {
        // Toggle trade sections
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('trade-toggle')) {
                this.toggleTradeSection(e.target);
            }
        });
        
        // PDF export
        document.getElementById('exportPdfBtn').addEventListener('click', () => {
            this.exportToPDF();
        });
        
        // New budget functionality
        document.getElementById('newBudgetBtn').addEventListener('click', () => {
            this.showNewBudgetForm();
        });
        
        document.getElementById('cancelNewBudget').addEventListener('click', () => {
            this.hideNewBudgetForm();
        });
        
        document.getElementById('addTradeBtn').addEventListener('click', () => {
            this.addNewTrade();
        });
        
        document.getElementById('saveNewBudget').addEventListener('click', () => {
            this.saveNewBudget();
        });
        
        document.getElementById('previewBudget').addEventListener('click', () => {
            this.previewNewBudget();
        });
        
        // Enable PDF export button
        document.getElementById('exportPdfBtn').disabled = false;
    }
    
    toggleTradeSection(toggleBtn) {
        const tradeKey = toggleBtn.dataset.trade;
        const tradeContent = document.getElementById(`trade-${tradeKey}`);
        const icon = toggleBtn.querySelector('.trade-icon');
        const section = toggleBtn.closest('.trade-section');
        
        if (section.classList.contains('collapsed')) {
            section.classList.remove('collapsed');
            tradeContent.style.display = 'block';
            icon.classList.remove('fa-chevron-right');
            icon.classList.add('fa-chevron-down');
        } else {
            section.classList.add('collapsed');
            tradeContent.style.display = 'none';
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-right');
        }
    }
    
    async exportToPDF() {
        const button = document.getElementById('exportPdfBtn');
        const originalText = button.innerHTML;
        
        try {
            // Show loading state
            button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Generating PDF...';
            button.disabled = true;
            
            // Expand all sections for PDF
            const collapsedSections = document.querySelectorAll('.trade-section.collapsed');
            collapsedSections.forEach(section => {
                section.classList.remove('collapsed');
                const content = section.querySelector('.trade-content');
                if (content) content.style.display = 'block';
            });
            
            // Create PDF
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            await this.generatePDFContent(pdf);
            
            // Save PDF
            const projectName = this.budgetData.project.name || 'Construction Budget';
            const fileName = `${projectName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_budget.pdf`;
            pdf.save(fileName);
            
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            // Restore button state
            button.innerHTML = originalText;
            button.disabled = false;
        }
    }
    
    async generatePDFContent(pdf) {
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 20;
        let yPosition = margin;
        
        // Add project header
        pdf.setFontSize(20);
        pdf.setFont(undefined, 'bold');
        pdf.text('Construction Budget Report', margin, yPosition);
        yPosition += 15;
        
        // Project information
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'normal');
        pdf.text(`Project: ${this.budgetData.project.name}`, margin, yPosition);
        yPosition += 7;
        pdf.text(`Client: ${this.budgetData.project.client}`, margin, yPosition);
        yPosition += 7;
        pdf.text(`Address: ${this.budgetData.project.address}`, margin, yPosition);
        yPosition += 15;
        
        // Add trades with improved formatting
        for (const [tradeKey, trade] of Object.entries(this.budgetData.trades)) {
            if (!trade.line_items || trade.line_items.length === 0) continue;
            
            // Check if we need a new page for trade section
            if (yPosition > pageHeight - 80) {
                pdf.addPage();
                yPosition = margin;
            }
            
            // Trade section header with gray background
            pdf.setFillColor(220, 220, 220);
            pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 12, 'F');
            
            pdf.setFontSize(14);
            pdf.setFont(undefined, 'bold');
            pdf.setTextColor(0, 0, 0);
            const subtotal = this.calculateTradeSubtotal(trade.line_items);
            pdf.text(trade.name, margin + 2, yPosition + 3);
            pdf.text(this.formatCurrency(subtotal), pageWidth - margin - 30, yPosition + 3);
            yPosition += 15;
            
            // Table headers
            pdf.setFontSize(10);
            pdf.setFont(undefined, 'bold');
            pdf.setFillColor(240, 240, 240);
            pdf.rect(margin, yPosition - 3, pageWidth - 2 * margin, 8, 'F');
            
            pdf.text('Trade Category', margin + 2, yPosition + 2);
            pdf.text('Vendor', margin + 60, yPosition + 2);
            pdf.text('Budget', margin + 110, yPosition + 2);
            pdf.text('Notes', margin + 140, yPosition + 2);
            yPosition += 10;
            
            // Line items in table format
            pdf.setFont(undefined, 'normal');
            pdf.setTextColor(0, 0, 0);
            
            trade.line_items.forEach((item, index) => {
                if (yPosition > pageHeight - 25) {
                    pdf.addPage();
                    yPosition = margin;
                    
                    // Repeat table headers on new page
                    pdf.setFont(undefined, 'bold');
                    pdf.setFillColor(240, 240, 240);
                    pdf.rect(margin, yPosition - 3, pageWidth - 2 * margin, 8, 'F');
                    pdf.text('Trade Category', margin + 2, yPosition + 2);
                    pdf.text('Vendor', margin + 60, yPosition + 2);
                    pdf.text('Budget', margin + 110, yPosition + 2);
                    pdf.text('Notes', margin + 140, yPosition + 2);
                    yPosition += 10;
                    pdf.setFont(undefined, 'normal');
                }
                
                // Alternating row background
                if (index % 2 === 0) {
                    pdf.setFillColor(250, 250, 250);
                    pdf.rect(margin, yPosition - 3, pageWidth - 2 * margin, 8, 'F');
                }
                
                // Item details in table format
                const categoryText = pdf.splitTextToSize(item.category, 55);
                const vendorText = pdf.splitTextToSize(item.vendor, 45);
                const notesText = item.notes ? pdf.splitTextToSize(item.notes, 40) : [];
                
                pdf.text(categoryText, margin + 2, yPosition + 2);
                pdf.text(vendorText, margin + 60, yPosition + 2);
                pdf.text(this.formatCurrency(item.budget), margin + 110, yPosition + 2);
                if (notesText.length > 0) {
                    pdf.text(notesText, margin + 140, yPosition + 2);
                }
                
                // Adjust yPosition based on text height
                const maxLines = Math.max(categoryText.length, vendorText.length, notesText.length, 1);
                yPosition += maxLines * 4 + 2;
            });
            
            yPosition += 8;
        }
        
        // Grand total with enhanced styling
        if (yPosition > pageHeight - 40) {
            pdf.addPage();
            yPosition = margin;
        }
        
        pdf.setFillColor(0, 100, 200);
        pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 15, 'F');
        
        pdf.setFontSize(16);
        pdf.setFont(undefined, 'bold');
        pdf.setTextColor(255, 255, 255);
        pdf.text('GRAND TOTAL:', margin + 2, yPosition + 5);
        pdf.text(this.formatCurrency(this.grandTotal), pageWidth - margin - 50, yPosition + 5);
    }
    
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount || 0);
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        
        errorText.textContent = message;
        errorDiv.classList.remove('d-none');
    }
    
    hideLoading() {
        document.getElementById('loadingIndicator').classList.add('d-none');
        document.getElementById('budgetContent').classList.remove('d-none');
    }
    
    showNewBudgetForm() {
        document.getElementById('budgetContent').classList.add('d-none');
        document.getElementById('newBudgetForm').classList.remove('d-none');
        document.getElementById('loadingIndicator').classList.add('d-none');
        this.isNewBudgetMode = true;
        this.resetNewBudgetForm();
    }
    
    hideNewBudgetForm() {
        document.getElementById('newBudgetForm').classList.add('d-none');
        document.getElementById('budgetContent').classList.remove('d-none');
        this.isNewBudgetMode = false;
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
        this.addNewTrade(); // Add one trade section by default
    }
    
    addNewTrade() {
        this.tradeCounter++;
        const tradeKey = `trade_${this.tradeCounter}`;
        
        const tradeDiv = document.createElement('div');
        tradeDiv.className = 'card mb-3';
        tradeDiv.dataset.tradeKey = tradeKey;
        tradeDiv.innerHTML = `
            <div class="card-header">
                <div class="d-flex justify-content-between align-items-center">
                    <h6 class="mb-0">Trade Section ${this.tradeCounter}</h6>
                    <button type="button" class="btn btn-outline-danger btn-sm remove-trade">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="card-body">
                <div class="row mb-3">
                    <div class="col-12">
                        <label class="form-label">Trade Name *</label>
                        <select class="form-select trade-name" required>
                            <option value="">Select Trade Name</option>
                            ${this.tradeNames.map(name => 
                                `<option value="${name}">${name}</option>`
                            ).join('')}
                        </select>
                    </div>
                </div>
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <label class="form-label mb-0">Line Items</label>
                    <button type="button" class="btn btn-outline-primary btn-sm add-line-item">
                        <i class="fas fa-plus me-1"></i>Add Item
                    </button>
                </div>
                <div class="line-items-container">
                    <!-- Line items will be added here -->
                </div>
            </div>
        `;
        
        document.getElementById('newTradesContainer').appendChild(tradeDiv);
        
        // Add event listeners
        tradeDiv.querySelector('.remove-trade').addEventListener('click', () => {
            tradeDiv.remove();
        });
        
        tradeDiv.querySelector('.add-line-item').addEventListener('click', () => {
            this.addLineItem(tradeDiv.querySelector('.line-items-container'));
        });
        
        // Add one line item by default
        this.addLineItem(tradeDiv.querySelector('.line-items-container'));
    }
    
    addLineItem(container) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'row mb-2 line-item';
        
        // Generate category dropdown options
        const categoryOptions = this.tradeCategories.map(category => 
            `<option value="${category}">${category}</option>`
        ).join('');
        
        itemDiv.innerHTML = `
            <div class="col-12 col-sm-6 col-md-3 mb-2">
                <select class="form-select form-select-sm item-category" required>
                    <option value="">Select Category</option>
                    ${categoryOptions}
                </select>
            </div>
            <div class="col-12 col-sm-6 col-md-3 mb-2">
                <input type="text" class="form-control form-control-sm item-vendor" placeholder="Vendor" required>
            </div>
            <div class="col-8 col-md-2 mb-2">
                <input type="number" class="form-control form-control-sm item-budget" placeholder="Budget" step="0.01" min="0" required>
            </div>
            <div class="col-12 col-md-3 mb-2">
                <input type="text" class="form-control form-control-sm item-notes" placeholder="Notes (optional)">
            </div>
            <div class="col-4 col-md-1 mb-2">
                <button type="button" class="btn btn-outline-danger btn-sm remove-line-item w-100">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        container.appendChild(itemDiv);
        
        // Add remove functionality
        itemDiv.querySelector('.remove-line-item').addEventListener('click', () => {
            itemDiv.remove();
        });
    }
    
    saveNewBudget() {
        if (!this.validateNewBudget()) {
            return;
        }
        
        this.collectNewBudgetData();
        this.budgetData = { ...this.newBudgetData };
        this.renderBudget();
        this.hideNewBudgetForm();
        
        // Show success message
        const alert = document.createElement('div');
        alert.className = 'alert alert-success alert-dismissible fade show';
        alert.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            Budget saved successfully!
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.querySelector('.container').insertBefore(alert, document.querySelector('.container').firstChild);
        
        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 3000);
    }
    
    previewNewBudget() {
        if (!this.validateNewBudget()) {
            return;
        }
        
        this.collectNewBudgetData();
        const originalData = this.budgetData;
        this.budgetData = { ...this.newBudgetData };
        this.renderBudget();
        this.hideNewBudgetForm();
        
        // Show preview notice
        const alert = document.createElement('div');
        alert.className = 'alert alert-info alert-dismissible fade show';
        alert.innerHTML = `
            <i class="fas fa-eye me-2"></i>
            Preview mode - Budget not saved yet. 
            <button type="button" class="btn btn-link p-0 ms-2" id="backToEdit">Edit</button>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.querySelector('.container').insertBefore(alert, document.querySelector('.container').firstChild);
        
        document.getElementById('backToEdit').addEventListener('click', () => {
            this.budgetData = originalData;
            this.showNewBudgetForm();
            alert.remove();
        });
    }
    
    validateNewBudget() {
        const projectName = document.getElementById('newProjectName').value.trim();
        const projectClient = document.getElementById('newProjectClient').value.trim();
        
        if (!projectName || !projectClient) {
            alert('Please fill in the required project information (Project Name and Client).');
            return false;
        }
        
        const trades = document.querySelectorAll('[data-trade-key]');
        if (trades.length === 0) {
            alert('Please add at least one trade section.');
            return false;
        }
        
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
        // Collect project info
        this.newBudgetData.project = {
            name: document.getElementById('newProjectName').value.trim(),
            client: document.getElementById('newProjectClient').value.trim(),
            address: document.getElementById('newProjectAddress').value.trim()
        };
        
        // Collect trades
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
                            notes: notes || undefined
                        });
                    }
                });
                
                if (lineItems.length > 0) {
                    this.newBudgetData.trades[tradeKey] = {
                        name: tradeName,
                        line_items: lineItems
                    };
                }
            }
        });
    }
}

// Initialize the budget viewer when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BudgetViewer();
});
