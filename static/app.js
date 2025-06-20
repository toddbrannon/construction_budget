class BudgetViewer {
    constructor() {
        this.budgetData = null;
        this.grandTotal = 0;
        
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
            <div class="row mb-2 py-2 border-bottom border-secondary">
                <div class="col-md-3 mb-1 mb-md-0">
                    <strong class="d-md-none">Category: </strong>
                    ${this.escapeHtml(item.category)}
                </div>
                <div class="col-md-3 mb-1 mb-md-0">
                    <strong class="d-md-none">Vendor: </strong>
                    ${this.escapeHtml(item.vendor)}
                </div>
                <div class="col-md-2 mb-1 mb-md-0">
                    <strong class="d-md-none">Budget: </strong>
                    <span class="currency">${this.formatCurrency(item.budget)}</span>
                </div>
                <div class="col-md-4">
                    ${item.notes ? `<strong class="d-md-none">Notes: </strong><small class="text-muted">${this.escapeHtml(item.notes)}</small>` : ''}
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
        
        // Add trades
        for (const [tradeKey, trade] of Object.entries(this.budgetData.trades)) {
            if (!trade.line_items || trade.line_items.length === 0) continue;
            
            // Check if we need a new page
            if (yPosition > pageHeight - 60) {
                pdf.addPage();
                yPosition = margin;
            }
            
            // Trade section header
            pdf.setFontSize(14);
            pdf.setFont(undefined, 'bold');
            const subtotal = this.calculateTradeSubtotal(trade.line_items);
            pdf.text(trade.name, margin, yPosition);
            pdf.text(this.formatCurrency(subtotal), pageWidth - margin - 30, yPosition);
            yPosition += 10;
            
            // Line items
            pdf.setFontSize(10);
            pdf.setFont(undefined, 'normal');
            
            trade.line_items.forEach(item => {
                if (yPosition > pageHeight - 30) {
                    pdf.addPage();
                    yPosition = margin;
                }
                
                // Item details
                pdf.text(`• ${item.category}`, margin + 5, yPosition);
                pdf.text(item.vendor, margin + 80, yPosition);
                pdf.text(this.formatCurrency(item.budget), pageWidth - margin - 30, yPosition);
                yPosition += 5;
                
                if (item.notes) {
                    pdf.setFont(undefined, 'italic');
                    const notes = pdf.splitTextToSize(`  ${item.notes}`, pageWidth - margin - 40);
                    pdf.text(notes, margin + 10, yPosition);
                    yPosition += notes.length * 4;
                    pdf.setFont(undefined, 'normal');
                }
                
                yPosition += 2;
            });
            
            yPosition += 5;
        }
        
        // Grand total
        if (yPosition > pageHeight - 40) {
            pdf.addPage();
            yPosition = margin;
        }
        
        pdf.setFontSize(16);
        pdf.setFont(undefined, 'bold');
        pdf.text('Grand Total:', margin, yPosition);
        pdf.text(this.formatCurrency(this.grandTotal), pageWidth - margin - 40, yPosition);
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
}

// Initialize the budget viewer when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BudgetViewer();
});
