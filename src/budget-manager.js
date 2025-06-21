import jsPDF from 'jspdf'
import 'jspdf-autotable'

export class BudgetManager {
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

        this.tradeCategoryMapping = {
            'Professional Services': [
                { name: 'ARCHITECT', code: '1001' },
                { name: 'STRUCTURAL ENGINEERING', code: '1002' },
                { name: 'CIVIL ENGINEERING', code: '1003' },
                { name: 'MEP ENGINEERING', code: '1004' },
                { name: 'FIRE SPRINKLER', code: '1005' },
                { name: 'LANDSCAPE ARCHITECT', code: '1006' },
                { name: 'INTERIOR DESIGN', code: '1007' },
                { name: 'BUILDER\'S RISK INSURANCE', code: '1008' },
                { name: 'WIND INSURANCE', code: '1009' },
                { name: 'PROJECT INSURANCE', code: '1010' },
                { name: 'PROFESSIONAL SERVICES', code: '1011' },
                { name: 'THRESHOLD INSPECTIONS', code: '1012' },
                { name: 'LEGAL SERVICES', code: '1013' }
            ],
            'General Conditions': [
                { name: 'GENERAL CONDITIONS', code: '2001' },
                { name: 'BUILDING PERMITS', code: '2002' },
                { name: 'IMPACT FEES', code: '2003' },
                { name: 'CONSTRUCTION CLEANING', code: '2004' },
                { name: 'FINAL CLEAN', code: '2005' },
                { name: 'PUNCH LIST', code: '2006' },
                { name: 'PROJECT MANAGEMENT', code: '2007' },
                { name: 'SUPERVISION', code: '2008' },
                { name: 'SAFETY PROGRAM', code: '2009' },
                { name: 'TESTING & INSPECTION', code: '2010' }
            ],
            'Temporary Conditions': [
                { name: 'TEMPORARY CONDITIONS', code: '3001' },
                { name: 'TEMPORARY POWER', code: '3002' },
                { name: 'TEMPORARY UTILITIES', code: '3003' },
                { name: 'PORTABLE TOILETS', code: '3004' },
                { name: 'DUMPSTER', code: '3005' },
                { name: 'STORAGE CONTAINERS', code: '3006' },
                { name: 'FENCING', code: '3007' },
                { name: 'SIGNAGE', code: '3008' }
            ],
            'Shell': [
                { name: 'CONCRETE PILING', code: '4001' },
                { name: 'CONCRETE FOOTINGS', code: '4002' },
                { name: 'CONCRETE SLAB', code: '4003' },
                { name: 'SHELL / ROOF FRAMING L&M', code: '4004' },
                { name: 'STRUCTURAL STEEL', code: '4005' },
                { name: 'PRECAST CONCRETE', code: '4006' },
                { name: 'SHEATHING L & M', code: '4007' },
                { name: 'HOUSE WRAP', code: '4008' }
            ],
            'Masonry': [
                { name: 'MASONRY', code: '5001' },
                { name: 'BRICK VENEER', code: '5002' },
                { name: 'STONE VENEER MATERIAL', code: '5003' },
                { name: 'VENEER INSTALLATION / LABOR', code: '5004' },
                { name: 'BLOCK WORK', code: '5005' },
                { name: 'MORTAR & GROUT', code: '5006' },
                { name: 'MASONRY REINFORCEMENT', code: '5007' }
            ],
            'Decking': [
                { name: 'DECKING', code: '6001' },
                { name: 'DECK FRAMING', code: '6002' },
                { name: 'DECK BOARDS', code: '6003' },
                { name: 'DECK RAILINGS', code: '6004' },
                { name: 'STAIRS', code: '6005' },
                { name: 'DECK HARDWARE', code: '6006' }
            ],
            'Waterproofing': [
                { name: 'WATERPROOFING', code: '7001' },
                { name: 'MEMBRANE WATERPROOFING', code: '7002' },
                { name: 'SEALANTS', code: '7003' },
                { name: 'FLASHING', code: '7004' },
                { name: 'VAPOR BARRIERS', code: '7005' }
            ],
            'Roofing / Siding': [
                { name: 'ROOFING LABOR AND MATERIALS', code: '8001' },
                { name: 'ROOF UNDERLAYMENT', code: '8002' },
                { name: 'ROOF SHINGLES', code: '8003' },
                { name: 'ROOF TILES', code: '8004' },
                { name: 'METAL ROOFING', code: '8005' },
                { name: 'GUTTERS', code: '8006' },
                { name: 'SIDING MATERIAL', code: '8007' },
                { name: 'SIDING LABOR', code: '8008' }
            ],
            'Exterior Windows & Doors': [
                { name: 'GLASS WINDOWS AND DOORS', code: '9001' },
                { name: 'WINDOW INSTALLATION', code: '9002' },
                { name: 'DOOR INSTALLATION', code: '9003' },
                { name: 'WINDOW TRIM', code: '9004' },
                { name: 'HARDWARE', code: '9005' },
                { name: 'SCREENS', code: '9006' }
            ],
            'Framing & Drywall': [
                { name: 'INTERIOR FRAMING', code: '10001' },
                { name: 'DRYWALL L & M', code: '10002' },
                { name: 'INSULATION', code: '10003' },
                { name: 'METAL FRAMING', code: '10004' },
                { name: 'DRYWALL FINISHING', code: '10005' },
                { name: 'ACOUSTIC INSULATION', code: '10006' }
            ],
            'Plumbing': [
                { name: 'PLUMBING LABOR', code: '11001' },
                { name: 'PLUMBING FIXTURES', code: '11002' },
                { name: 'WATER HEATER', code: '11003' },
                { name: 'PLUMBING ROUGH-IN', code: '11004' },
                { name: 'PLUMBING FINISH', code: '11005' },
                { name: 'SEPTIC SYSTEM', code: '11006' },
                { name: 'WATER WELL', code: '11007' }
            ],
            'Electrical & Low Voltage': [
                { name: 'ELECTRICAL LABOR', code: '12001' },
                { name: 'ELECTRICAL FIXTURES', code: '12002' },
                { name: 'LIGHTING SYSTEM', code: '12003' },
                { name: 'AUDIO / VISUAL & NETWORK PREWIRE', code: '12004' },
                { name: 'AUDIO / VISUAL & NETWORK EQUIPMENT', code: '12005' },
                { name: 'SECURITY SYSTEM', code: '12006' },
                { name: 'FIRE ALARM SYSTEM', code: '12007' },
                { name: 'ELECTRICAL PANEL', code: '12008' }
            ],
            'Heating & Cooling': [
                { name: 'AIR CONDITIONING & DUCT WORK', code: '13001' },
                { name: 'HVAC EQUIPMENT', code: '13002' },
                { name: 'DUCTWORK', code: '13003' },
                { name: 'VENTILATION', code: '13004' },
                { name: 'THERMOSTATS', code: '13005' }
            ],
            'Natural Gas & Propane': [
                { name: 'NATURAL GAS & PROPANE', code: '14001' },
                { name: 'GAS LINES', code: '14002' },
                { name: 'GAS APPLIANCES', code: '14003' },
                { name: 'PROPANE TANK', code: '14004' }
            ],
            'Flooring': [
                { name: 'WOOD FLOOR MATERIAL & LABOR', code: '15001' },
                { name: 'INTERIOR TILE / MARBLE FLOOR MATERIAL', code: '15002' },
                { name: 'TILE LABOR', code: '15003' },
                { name: 'CARPET MATERIAL', code: '15004' },
                { name: 'CARPET LABOR', code: '15005' },
                { name: 'VINYL FLOORING', code: '15006' },
                { name: 'LAMINATE FLOORING', code: '15007' }
            ],
            'Interior Trim Package': [
                { name: 'TRIM MATERIAL', code: '16001' },
                { name: 'TRIM LABOR', code: '16002' },
                { name: 'INTERIOR DOORS MATERIAL', code: '16003' },
                { name: 'INTERIOR DOORS LABOR', code: '16004' },
                { name: 'CLOSET SYSTEMS', code: '16005' },
                { name: 'CROWN MOLDING', code: '16006' },
                { name: 'BASEBOARDS', code: '16007' }
            ],
            'Exterior Trim Package': [
                { name: 'EXTERIOR TRIM MATERIAL', code: '17001' },
                { name: 'EXTERIOR TRIM LABOR', code: '17002' },
                { name: 'SHUTTERS', code: '17003' },
                { name: 'EXTERIOR COLUMNS', code: '17004' }
            ],
            'Paint': [
                { name: 'PAINTING INTERIOR', code: '18001' },
                { name: 'PAINTING EXTERIOR', code: '18002' },
                { name: 'STAIN', code: '18003' },
                { name: 'PRIMER', code: '18004' },
                { name: 'SPECIALTY FINISHES', code: '18005' }
            ],
            'Tile / Marble / Tops': [
                { name: 'KITCHEN COUNTER TOPS', code: '19001' },
                { name: 'BATHROOM VANITY TOPS', code: '19002' },
                { name: 'TILE BACKSPLASH', code: '19003' },
                { name: 'MARBLE INSTALLATION', code: '19004' },
                { name: 'GRANITE TOPS', code: '19005' },
                { name: 'QUARTZ TOPS', code: '19006' }
            ],
            'Cabinetry and Built-ins': [
                { name: 'KITCHEN CABINETS', code: '20001' },
                { name: 'BATHROOM VANITIES', code: '20002' },
                { name: 'CUSTOM BUILT INS', code: '20003' },
                { name: 'CABINET HARDWARE', code: '20004' },
                { name: 'PANTRY CABINETS', code: '20005' },
                { name: 'ENTERTAINMENT CENTERS', code: '20006' }
            ],
            'Appliances': [
                { name: 'KITCHEN APPLIANCES', code: '21001' },
                { name: 'LAUNDRY APPLIANCES', code: '21002' },
                { name: 'GARBAGE DISPOSAL', code: '21003' },
                { name: 'DISHWASHER', code: '21004' },
                { name: 'RANGE HOOD', code: '21005' }
            ],
            'Bathroom Accessories': [
                { name: 'SHOWER DOORS', code: '22001' },
                { name: 'MIRRORS', code: '22002' },
                { name: 'TOWEL BARS', code: '22003' },
                { name: 'TOILET PAPER HOLDERS', code: '22004' },
                { name: 'MEDICINE CABINETS', code: '22005' }
            ],
            'Other Amenities': [
                { name: 'FIREPLACE', code: '23001' },
                { name: 'HOT TUB', code: '23002' },
                { name: 'WINE CELLAR', code: '23003' },
                { name: 'HOME THEATER', code: '23004' },
                { name: 'ELEVATOR', code: '23005' }
            ],
            'Exterior Accessories': [
                { name: 'MAILBOX', code: '24001' },
                { name: 'EXTERIOR LIGHTING', code: '24002' },
                { name: 'OUTDOOR KITCHEN', code: '24003' },
                { name: 'PERGOLA', code: '24004' },
                { name: 'GAZEBO', code: '24005' }
            ],
            'Driveway': [
                { name: 'DRIVEWAY MATERIAL', code: '25001' },
                { name: 'DRIVEWAY LABOR', code: '25002' },
                { name: 'DRIVEWAY SEALING', code: '25003' },
                { name: 'GARAGE DOORS', code: '25004' },
                { name: 'GARAGE DOOR OPENERS', code: '25005' }
            ],
            'Pool': [
                { name: 'POOL AND SPA', code: '26001' },
                { name: 'POOL EQUIPMENT', code: '26002' },
                { name: 'POOL DECKING', code: '26003' },
                { name: 'POOL FENCING', code: '26004' },
                { name: 'POOL LIGHTING', code: '26005' }
            ],
            'Seawall and Dock': [
                { name: 'SEAWALL', code: '27001' },
                { name: 'DOCK', code: '27002' },
                { name: 'BOAT LIFT', code: '27003' },
                { name: 'MARINE PILINGS', code: '27004' }
            ],
            'Landscaping / Irrigation': [
                { name: 'LANDSCAPING LABOR AND MATERIALS', code: '28001' },
                { name: 'IRRIGATION', code: '28002' },
                { name: 'SOD', code: '28003' },
                { name: 'TREES', code: '28004' },
                { name: 'SHRUBS', code: '28005' },
                { name: 'MULCH', code: '28006' }
            ],
            'Site Work': [
                { name: 'EXCAVATION / GRADING', code: '29001' },
                { name: 'DRAINAGE LABOR AND MATERIAL', code: '29002' },
                { name: 'RETAINING WALLS', code: '29003' },
                { name: 'SITE UTILITIES', code: '29004' },
                { name: 'EROSION CONTROL', code: '29005' }
            ],
            'Pest Control': [
                { name: 'TERMITE TREATMENT', code: '30001' },
                { name: 'PEST CONTROL', code: '30002' },
                { name: 'FUMIGATION', code: '30003' }
            ],
            'SMS Direct Services': [
                { name: 'SMS DIRECT SERVICES', code: '31001' },
                { name: 'DIRECT LABOR', code: '31002' },
                { name: 'DIRECT MATERIALS', code: '31003' }
            ]
        };
    }

    async init() {
        try {
            await this.loadBudgetsList();
            this.setupEventListeners();
            this.renderDashboard();
        } catch (error) {
            console.error('Failed to initialize budget manager:', error);
            // Check if error message element exists before showing error
            const errorDiv = document.getElementById('errorMessage');
            if (errorDiv) {
                this.showError('Failed to load budget data');
            }
        }
    }

    async loadBudgetsList() {
        try {
            // Load from localStorage first for any saved budgets
            const savedBudgets = JSON.parse(localStorage.getItem('constructionBudgetsList') || '[]');
            
            // Load initial budgets from public file
            const response = await fetch('/budgets.json');
            if (response.ok) {
                const data = await response.json();
                const publicBudgets = data.budgets || [];
                
                // Merge public budgets with saved budgets (avoid duplicates)
                const allBudgets = [...publicBudgets];
                savedBudgets.forEach(savedBudget => {
                    if (!allBudgets.find(b => b.id === savedBudget.id)) {
                        allBudgets.push(savedBudget);
                    }
                });
                
                this.budgetsList = allBudgets;
            } else {
                this.budgetsList = savedBudgets;
            }
            
            this.filteredBudgets = [...this.budgetsList];
        } catch (error) {
            console.error('Error loading budgets list:', error);
            this.budgetsList = JSON.parse(localStorage.getItem('constructionBudgetsList') || '[]');
            this.filteredBudgets = [...this.budgetsList];
        }
    }

    async loadBudgetData(filename = 'budget.json') {
        try {
            // First try to load from storage
            if (this.currentBudgetId) {
                const storedData = await this.loadBudgetFromStorage(this.currentBudgetId);
                if (storedData) {
                    this.budgetData = storedData;
                    this.normalizeTradesData();
                    return;
                }
            }
            
            // Fallback to public files
            const response = await fetch(`/${filename}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.budgetData = await response.json();
            
            // Validate required data structure
            if (!this.budgetData.project || !this.budgetData.trades) {
                throw new Error('Invalid budget data structure');
            }
            
            // Normalize data structure for consistent handling
            this.normalizeTradesData();
        } catch (error) {
            console.error('Error loading budget data:', error);
            throw error;
        }
    }
    
    normalizeTradesData() {
        // Convert old format to new format if needed
        const normalizedTrades = {};
        
        Object.entries(this.budgetData.trades).forEach(([key, trade]) => {
            if (trade.line_items && Array.isArray(trade.line_items)) {
                // Already in correct format
                normalizedTrades[trade.name || key] = trade;
            } else {
                // Convert old format
                normalizedTrades[trade.name || key] = trade;
            }
        });
        
        this.budgetData.trades = normalizedTrades;
    }

    renderBudget() {
        this.renderProjectInfo();
        this.renderTradeSections();
        this.calculateGrandTotal();
        this.showCollapseExpandHint();
    }

    renderProjectInfo() {
        const projectInfoContainer = document.getElementById('projectInfo');
        if (!this.budgetData || !this.budgetData.project) {
            projectInfoContainer.innerHTML = '<p class="text-muted">No project information available</p>';
            return;
        }

        const project = this.budgetData.project;
        projectInfoContainer.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${this.escapeHtml(project.name)}</h5>
                    <p class="card-text">
                        <strong>Client:</strong> ${this.escapeHtml(project.client)}<br>
                        <strong>Address:</strong> ${this.escapeHtml(project.address)}
                    </p>
                </div>
            </div>
        `;
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
    
    showCollapseExpandHint() {
        const tradeSectionsContainer = document.getElementById('tradeSections');
        if (tradeSectionsContainer.children.length > 0) {
            const hintDiv = document.createElement('div');
            hintDiv.className = 'alert alert-info mb-3';
            hintDiv.innerHTML = `
                <i class="fas fa-info-circle me-2"></i>
                <strong>Tip:</strong> Click on any trade section header to expand and view line items.
            `;
            tradeSectionsContainer.insertBefore(hintDiv, tradeSectionsContainer.firstChild);
        }
    }

    createTradeSection(tradeKey, trade) {
        const section = document.createElement('div');
        section.className = 'trade-section fade-in';
        
        const subtotal = this.calculateTradeSubtotal(trade.line_items);
        const itemCount = trade.line_items.length;
        const itemText = itemCount === 1 ? 'item' : 'items';
        
        section.innerHTML = `
            <div class="trade-header" onclick="budgetManager.toggleTradeSection(this)">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="mb-0">
                            <i class="fas fa-chevron-right me-2 trade-toggle"></i>
                            ${this.escapeHtml(trade.name)}
                        </h5>
                        <small class="text-muted">${itemCount} ${itemText}</small>
                    </div>
                    <span class="currency">${this.formatCurrency(subtotal)}</span>
                </div>
            </div>
            <div class="trade-content">
                ${trade.line_items.map(item => this.createLineItemHTML(item)).join('')}
            </div>
        `;
        
        return section;
    }

    createLineItemHTML(item) {
        return `
            <div class="line-item">
                <div class="row align-items-center">
                    <div class="col-md-3">
                        <strong>${this.escapeHtml(item.category)}</strong>
                    </div>
                    <div class="col-md-3">
                        ${this.escapeHtml(item.vendor)}
                    </div>
                    <div class="col-md-2 text-end">
                        <span class="currency">${this.formatCurrency(item.budget)}</span>
                    </div>
                    <div class="col-md-4">
                        ${item.notes ? `<small class="text-muted">${this.escapeHtml(item.notes)}</small>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    calculateTradeSubtotal(lineItems) {
        return lineItems.reduce((sum, item) => sum + (parseFloat(item.budget) || 0), 0);
    }

    calculateGrandTotal() {
        this.grandTotal = 0;
        if (this.budgetData && this.budgetData.trades) {
            Object.values(this.budgetData.trades).forEach(trade => {
                if (trade.line_items && Array.isArray(trade.line_items)) {
                    this.grandTotal += this.calculateTradeSubtotal(trade.line_items);
                }
            });
        }
        
        const grandTotalElement = document.getElementById('grandTotal');
        if (grandTotalElement) {
            grandTotalElement.textContent = this.formatCurrency(this.grandTotal);
        }
    }

    setupEventListeners() {
        // Navigation
        document.getElementById('backToDashboard').addEventListener('click', () => this.showDashboard());
        document.getElementById('newBudgetBtn').addEventListener('click', () => this.showNewBudgetForm());
        document.getElementById('cancelNewBudget').addEventListener('click', () => this.hideNewBudgetForm());
        
        // Budget actions
        document.getElementById('editBudgetBtn').addEventListener('click', () => this.editCurrentBudget());
        document.getElementById('exportPdfBtn').addEventListener('click', () => this.exportToPDF());
        
        // New budget form
        document.getElementById('addTradeBtn').addEventListener('click', () => this.addNewTrade());
        document.getElementById('saveNewBudget').addEventListener('click', () => this.saveNewBudget());
        document.getElementById('previewBudgetBtn').addEventListener('click', () => this.previewNewBudget());
        
        // Search and filter
        document.getElementById('searchInput').addEventListener('input', () => this.filterBudgets());
        document.getElementById('statusFilter').addEventListener('change', () => this.filterBudgets());
        
        // Form validation - clear errors on input
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('is-invalid')) {
                e.target.classList.remove('is-invalid');
                const feedback = e.target.parentNode.querySelector('.invalid-feedback');
                if (feedback) {
                    feedback.remove();
                }
            }
        });
        
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('is-invalid')) {
                e.target.classList.remove('is-invalid');
                const feedback = e.target.parentNode.querySelector('.invalid-feedback');
                if (feedback) {
                    feedback.remove();
                }
            }
        });
    }

    toggleTradeSection(toggleBtn) {
        const tradeContent = toggleBtn.nextElementSibling;
        const toggleIcon = toggleBtn.querySelector('.trade-toggle');
        
        if (tradeContent.classList.contains('show')) {
            tradeContent.classList.remove('show');
            toggleIcon.style.transform = 'rotate(0deg)';
        } else {
            tradeContent.classList.add('show');
            toggleIcon.style.transform = 'rotate(90deg)';
        }
    }

    async exportToPDF() {
        if (!this.budgetData) return;
        
        const pdf = new jsPDF();
        await this.generatePDFContent(pdf);
        pdf.save(`${this.budgetData.project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_budget.pdf`);
    }

    async generatePDFContent(pdf) {
        const project = this.budgetData.project;
        
        // Title
        pdf.setFontSize(20);
        pdf.text('Construction Budget Report', 20, 30);
        
        // Project info
        pdf.setFontSize(12);
        pdf.text(`Project: ${project.name}`, 20, 50);
        pdf.text(`Client: ${project.client}`, 20, 60);
        pdf.text(`Address: ${project.address}`, 20, 70);
        pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 80);
        
        let yPosition = 100;
        
        // Trade sections
        Object.entries(this.budgetData.trades).forEach(([tradeKey, trade]) => {
            if (!trade.line_items || trade.line_items.length === 0) return;
            
            // Trade header
            pdf.setFontSize(14);
            pdf.setFont(undefined, 'bold');
            pdf.text(trade.name, 20, yPosition);
            
            const subtotal = this.calculateTradeSubtotal(trade.line_items);
            pdf.text(this.formatCurrency(subtotal), 170, yPosition);
            
            yPosition += 10;
            
            // Line items table
            const tableData = trade.line_items.map(item => [
                item.category,
                item.vendor,
                this.formatCurrency(item.budget),
                item.notes || ''
            ]);
            
            pdf.autoTable({
                startY: yPosition,
                head: [['Category', 'Vendor', 'Budget', 'Notes']],
                body: tableData,
                theme: 'grid',
                styles: { fontSize: 9 },
                columnStyles: {
                    2: { halign: 'right' }
                }
            });
            
            yPosition = pdf.lastAutoTable.finalY + 15;
            
            // Check if we need a new page
            if (yPosition > 250) {
                pdf.addPage();
                yPosition = 30;
            }
        });
        
        // Grand total
        pdf.setFontSize(16);
        pdf.setFont(undefined, 'bold');
        pdf.text('Grand Total:', 120, yPosition);
        pdf.text(this.formatCurrency(this.grandTotal), 170, yPosition);
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        
        if (errorDiv && errorText) {
            errorText.textContent = message;
            errorDiv.classList.remove('d-none');
        }
    }
    
    hideError() {
        const errorDiv = document.getElementById('errorMessage');
        if (errorDiv) {
            errorDiv.classList.add('d-none');
        }
    }

    showSuccessMessage(message) {
        const successDiv = document.getElementById('successMessage');
        const successText = document.getElementById('successText');
        
        if (successDiv && successText) {
            successText.textContent = message;
            successDiv.classList.remove('d-none');
            
            // Auto-hide after 3 seconds
            setTimeout(() => {
                successDiv.classList.add('d-none');
            }, 3000);
        }
    }

    showDashboard() {
        this.currentView = 'dashboard';
        document.getElementById('pageTitle').textContent = 'Construction Budget Manager';
        document.getElementById('dashboard').classList.remove('d-none');
        document.getElementById('budgetContent').classList.add('d-none');
        document.getElementById('newBudgetForm').classList.add('d-none');
        document.getElementById('backToDashboard').classList.add('d-none');
        document.getElementById('editBudgetBtn').classList.add('d-none');
        document.getElementById('exportPdfBtn').classList.add('d-none');
        this.renderDashboard();
    }

    async showBudgetViewer(budgetId) {
        this.currentView = 'budget';
        this.currentBudgetId = budgetId;
        const budget = this.budgetsList.find(b => b.id === budgetId);
        
        if (!budget) {
            this.showError('Budget not found');
            return;
        }
        
        // Clear any existing error messages
        this.hideError();
        
        try {
            await this.loadBudgetData(budget.filename);
            document.getElementById('pageTitle').textContent = `Budget: ${budget.projectName}`;
            document.getElementById('dashboard').classList.add('d-none');
            document.getElementById('newBudgetForm').classList.add('d-none');
            document.getElementById('budgetContent').classList.remove('d-none');
            document.getElementById('backToDashboard').classList.remove('d-none');
            document.getElementById('editBudgetBtn').classList.remove('d-none');
            document.getElementById('exportPdfBtn').classList.remove('d-none');
            this.renderBudget();
        } catch (error) {
            console.error('Budget loading error:', error);
            this.showError(`Failed to load budget: ${budget.filename}. The file may not exist.`);
        }
    }

    showNewBudgetForm() {
        this.currentView = 'new';
        this.isEditMode = false;
        document.getElementById('pageTitle').textContent = 'Create New Budget';
        document.getElementById('dashboard').classList.add('d-none');
        document.getElementById('budgetContent').classList.add('d-none');
        document.getElementById('newBudgetForm').classList.remove('d-none');
        document.getElementById('backToDashboard').classList.remove('d-none');
        document.getElementById('editBudgetBtn').classList.add('d-none');
        document.getElementById('exportPdfBtn').classList.add('d-none');
        
        // Reset form
        this.resetNewBudgetForm();
        
        // Update form title and button
        document.getElementById('formTitle').textContent = 'Create New Budget';
        document.getElementById('saveNewBudget').innerHTML = '<i class="fas fa-save me-2"></i>Save Budget';
    }

    editCurrentBudget() {
        if (!this.budgetData) return;
        
        this.isEditMode = true;
        this.showNewBudgetForm();
        
        // Update form title and button
        document.getElementById('formTitle').textContent = 'Edit Budget';
        document.getElementById('saveNewBudget').innerHTML = '<i class="fas fa-save me-2"></i>Update Budget';
        
        // Populate form with current data
        this.populateEditForm();
    }

    hideNewBudgetForm() {
        if (this.currentBudgetId) {
            this.showBudgetViewer(this.currentBudgetId);
        } else {
            this.showDashboard();
        }
    }

    resetNewBudgetForm() {
        document.getElementById('newProjectName').value = '';
        document.getElementById('newProjectClient').value = '';
        document.getElementById('newProjectAddress').value = '';
        document.getElementById('newTradesContainer').innerHTML = '';
        this.tradeCounter = 0;
        this.newBudgetData = {
            project: { name: '', client: '', address: '' },
            trades: {}
        };
        this.clearValidationErrors();
    }

    addNewTrade() {
        this.tradeCounter++;
        const container = document.getElementById('newTradesContainer');
        
        const tradeDiv = document.createElement('div');
        tradeDiv.className = 'trade-form mb-4 p-3 border rounded';
        tradeDiv.setAttribute('data-trade-key', this.tradeCounter);
        
        tradeDiv.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="mb-0">Trade ${this.tradeCounter}</h6>
                <button type="button" class="btn btn-sm btn-outline-danger remove-btn" onclick="budgetManager.removeTrade(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            
            <div class="row mb-3">
                <div class="col-12">
                    <select class="form-select trade-name" required>
                        <option value="">Select Trade Category</option>
                        ${this.tradeNames.map(name => `<option value="${name}">${name}</option>`).join('')}
                    </select>
                </div>
            </div>
            
            <div class="line-items-container">
                <!-- Line items will be added here -->
            </div>
            
            <button type="button" class="btn btn-sm btn-outline-secondary add-line-item" onclick="budgetManager.addLineItem(this.previousElementSibling)">
                <i class="fas fa-plus me-1"></i>Add Line Item
            </button>
        `;
        
        container.appendChild(tradeDiv);
        
        // Add event listener for trade selection
        const tradeSelect = tradeDiv.querySelector('.trade-name');
        tradeSelect.addEventListener('change', (e) => {
            const lineItemsContainer = tradeDiv.querySelector('.line-items-container');
            lineItemsContainer.innerHTML = ''; // Clear existing line items
            if (e.target.value) {
                this.addLineItem(lineItemsContainer, e.target.value);
            }
        });
        
        return tradeDiv;
    }

    removeTrade(button) {
        button.closest('.trade-form').remove();
    }

    addLineItem(container, tradeName = null) {
        if (!container) return;
        
        // If tradeName is not provided, get it from the trade select
        if (!tradeName) {
            const tradeForm = container.closest('.trade-form');
            const tradeSelect = tradeForm.querySelector('.trade-name');
            tradeName = tradeSelect.value;
        }
        
        if (!tradeName) {
            alert('Please select a trade category first');
            return;
        }
        
        const lineItemDiv = document.createElement('div');
        lineItemDiv.className = 'line-item-form row mb-2 p-2 border rounded';
        
        const categories = this.tradeCategoryMapping[tradeName] || [];
        
        lineItemDiv.innerHTML = `
            <div class="col-md-3 mb-2">
                <select class="form-control form-control-sm item-category" required>
                    <option value="">Select Category</option>
                    ${categories.map(cat => `<option value="${cat.name}" data-code="${cat.code}">${cat.name}</option>`).join('')}
                </select>
            </div>
            <div class="col-md-3 mb-2">
                <input type="text" class="form-control form-control-sm item-vendor" placeholder="Vendor" required>
            </div>
            <div class="col-md-2 mb-2">
                <input type="number" class="form-control form-control-sm item-budget" placeholder="Budget" step="0.01" min="0" required>
            </div>
            <div class="col-md-3 mb-2">
                <input type="text" class="form-control form-control-sm item-notes" placeholder="Notes (optional)">
            </div>
            <div class="col-md-1 mb-2">
                <button type="button" class="btn btn-sm btn-outline-danger remove-btn w-100" onclick="budgetManager.removeLineItem(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        container.appendChild(lineItemDiv);
        return lineItemDiv;
    }

    removeLineItem(button) {
        button.closest('.line-item-form').remove();
    }

    async saveNewBudget() {
        if (!this.validateNewBudget()) {
            return;
        }
        
        const budgetData = this.collectNewBudgetData();
        
        if (this.isEditMode) {
            // Update existing budget
            await this.updateExistingBudget();
            this.renderBudget();
            this.showBudgetViewer(this.currentBudgetId);
            this.showSuccessMessage('Budget updated successfully!');
        } else {
            // Create new budget
            await this.saveNewBudgetToList();
            this.renderBudget();
            this.hideNewBudgetForm();
        }
    }

    async saveNewBudgetToList() {
        try {
            const budgetData = this.collectNewBudgetData();
            const newBudgetId = this.generateBudgetId(budgetData.project.name);
            const filename = `${newBudgetId}.json`;
            
            // Calculate total budget
            const totalBudget = this.calculateTotalBudgetAmount();
            
            const newBudgetEntry = {
                id: newBudgetId,
                projectName: budgetData.project.name,
                client: budgetData.project.client,
                address: budgetData.project.address,
                dateCreated: new Date().toISOString().split('T')[0],
                lastModified: new Date().toISOString().split('T')[0],
                status: 'planning',
                totalBudget: totalBudget,
                filename: filename
            };
            
            // Save to browser storage (since we can't modify files in Vite)
            this.saveBudgetToStorage(newBudgetId, budgetData);
            
            // Add to local list
            this.budgetsList.unshift(newBudgetEntry);
            this.filteredBudgets = [...this.budgetsList];
            this.currentBudgetId = newBudgetId;
            
            // Save updated list
            this.saveBudgetsList();
            
            // Update current budget data
            this.budgetData = budgetData;
            
            this.showSuccessMessage('New budget saved locally! (Note: In production, this would save to the server)');
        } catch (error) {
            console.error('Error saving new budget:', error);
            this.showError('Failed to save budget');
        }
    }

    saveBudgetToStorage(budgetId, budgetData) {
        // Save to localStorage for demo purposes
        const savedBudgets = JSON.parse(localStorage.getItem('constructionBudgets') || '{}');
        savedBudgets[budgetId] = budgetData;
        localStorage.setItem('constructionBudgets', JSON.stringify(savedBudgets));
    }
    
    saveBudgetsList() {
        // Save the budgets list to localStorage
        localStorage.setItem('constructionBudgetsList', JSON.stringify(this.budgetsList));
    }

    async loadBudgetFromStorage(budgetId) {
        const savedBudgets = JSON.parse(localStorage.getItem('constructionBudgets') || '{}');
        return savedBudgets[budgetId] || null;
    }

    async updateExistingBudget() {
        try {
            const budgetData = this.collectNewBudgetData();
            const totalBudget = this.calculateTotalBudgetAmount();
            
            // Update budget data
            this.budgetData = budgetData;
            
            // Update in storage
            this.saveBudgetToStorage(this.currentBudgetId, budgetData);
            
            // Update in budgets list
            const budgetIndex = this.budgetsList.findIndex(b => b.id === this.currentBudgetId);
            if (budgetIndex !== -1) {
                this.budgetsList[budgetIndex] = {
                    ...this.budgetsList[budgetIndex],
                    projectName: budgetData.project.name,
                    client: budgetData.project.client,
                    address: budgetData.project.address,
                    lastModified: new Date().toISOString().split('T')[0],
                    totalBudget: totalBudget
                };
                this.filteredBudgets = [...this.budgetsList];
                
                // Save updated list
                this.saveBudgetsList();
            }
            
            this.showSuccessMessage('Budget updated and saved locally!');
        } catch (error) {
            console.error('Error updating budget:', error);
            this.showError('Failed to update budget');
        }
    }

    generateBudgetId(projectName) {
        const sanitized = projectName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const year = new Date().getFullYear();
        return `${sanitized}-${year}`;
    }

    calculateTotalBudgetAmount() {
        let total = 0;
        const tradeForms = document.querySelectorAll('#newTradesContainer .trade-form');
        
        tradeForms.forEach(tradeForm => {
            const lineItems = tradeForm.querySelectorAll('.line-item-form');
            lineItems.forEach(item => {
                const budget = parseFloat(item.querySelector('.item-budget').value) || 0;
                total += budget;
            });
        });
        
        return total;
    }

    previewNewBudget() {
        if (!this.validateNewBudget()) {
            return;
        }
        
        const budgetData = this.collectNewBudgetData();
        this.budgetData = budgetData;
        
        // Temporarily show budget content
        document.getElementById('newBudgetForm').classList.add('d-none');
        document.getElementById('budgetContent').classList.remove('d-none');
        
        this.renderBudget();
        
        // Add a back to form button
        const backBtn = document.createElement('button');
        backBtn.className = 'btn btn-outline-secondary me-2';
        backBtn.innerHTML = '<i class="fas fa-arrow-left me-2"></i>Back to Form';
        backBtn.onclick = () => {
            document.getElementById('budgetContent').classList.add('d-none');
            document.getElementById('newBudgetForm').classList.remove('d-none');
            backBtn.remove();
        };
        
        const actionsContainer = document.querySelector('#budgetContent .row:first-child .col-md-4');
        actionsContainer.insertBefore(backBtn, actionsContainer.firstChild);
    }

    validateNewBudget() {
        // Clear previous validation states
        this.clearValidationErrors();
        
        let isValid = true;
        let errorMessages = [];
        
        // Validate project information
        const projectName = document.getElementById('newProjectName');
        const projectClient = document.getElementById('newProjectClient');
        const projectAddress = document.getElementById('newProjectAddress');
        
        if (!projectName.value.trim()) {
            this.addValidationError(projectName, 'Project name is required');
            errorMessages.push('Project name is required');
            isValid = false;
        }
        
        if (!projectClient.value.trim()) {
            this.addValidationError(projectClient, 'Client name is required');
            errorMessages.push('Client name is required');
            isValid = false;
        }
        
        if (!projectAddress.value.trim()) {
            this.addValidationError(projectAddress, 'Project address is required');
            errorMessages.push('Project address is required');
            isValid = false;
        }
        
        // Validate trades
        const tradeForms = document.querySelectorAll('#newTradesContainer .trade-form');
        if (tradeForms.length === 0) {
            errorMessages.push('Please add at least one trade');
            isValid = false;
        } else {
            let hasValidTrade = false;
            let tradeIndex = 0;
            
            for (const tradeForm of tradeForms) {
                tradeIndex++;
                const tradeName = tradeForm.querySelector('.trade-name');
                const lineItems = tradeForm.querySelectorAll('.line-item-form');
                
                if (!tradeName.value) {
                    this.addValidationError(tradeName, 'Trade category is required');
                    errorMessages.push(`Trade ${tradeIndex}: Please select a trade category`);
                    isValid = false;
                    continue;
                }
                
                if (lineItems.length === 0) {
                    errorMessages.push(`Trade ${tradeIndex}: Please add at least one line item`);
                    isValid = false;
                    continue;
                }
                
                let hasValidLineItem = false;
                let lineItemIndex = 0;
                
                for (const item of lineItems) {
                    lineItemIndex++;
                    const category = item.querySelector('.item-category');
                    const vendor = item.querySelector('.item-vendor');
                    const budget = item.querySelector('.item-budget');
                    
                    let lineItemValid = true;
                    
                    if (!category.value) {
                        this.addValidationError(category, 'Category is required');
                        errorMessages.push(`Trade ${tradeIndex}, Line ${lineItemIndex}: Category is required`);
                        lineItemValid = false;
                        isValid = false;
                    }
                    
                    if (!vendor.value.trim()) {
                        this.addValidationError(vendor, 'Vendor is required');
                        errorMessages.push(`Trade ${tradeIndex}, Line ${lineItemIndex}: Vendor is required`);
                        lineItemValid = false;
                        isValid = false;
                    }
                    
                    const budgetValue = parseFloat(budget.value) || 0;
                    if (budgetValue <= 0) {
                        this.addValidationError(budget, 'Budget must be greater than 0');
                        errorMessages.push(`Trade ${tradeIndex}, Line ${lineItemIndex}: Budget must be greater than 0`);
                        lineItemValid = false;
                        isValid = false;
                    }
                    
                    if (lineItemValid) {
                        hasValidLineItem = true;
                    }
                }
                
                if (hasValidLineItem) {
                    hasValidTrade = true;
                }
            }
            
            if (!hasValidTrade && isValid) {
                errorMessages.push('Please add at least one complete line item with category, vendor, and budget');
                isValid = false;
            }
        }
        
        if (!isValid) {
            this.showValidationErrors(errorMessages);
        }
        
        return isValid;
    }
    
    addValidationError(element, message) {
        element.classList.add('is-invalid');
        
        // Remove existing feedback
        const existingFeedback = element.parentNode.querySelector('.invalid-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }
        
        // Add new feedback
        const feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        feedback.textContent = message;
        element.parentNode.appendChild(feedback);
    }
    
    clearValidationErrors() {
        // Remove all validation error classes and feedback
        const invalidElements = document.querySelectorAll('.is-invalid');
        invalidElements.forEach(element => {
            element.classList.remove('is-invalid');
        });
        
        const feedbackElements = document.querySelectorAll('.invalid-feedback');
        feedbackElements.forEach(element => {
            element.remove();
        });
        
        this.hideError();
    }
    
    showValidationErrors(errorMessages) {
        const errorText = errorMessages.length > 1 
            ? `Please fix the following errors:\n• ${errorMessages.join('\n• ')}`
            : errorMessages[0];
        
        this.showError(errorText);
        
        // Scroll to first invalid element
        const firstInvalidElement = document.querySelector('.is-invalid');
        if (firstInvalidElement) {
            firstInvalidElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            firstInvalidElement.focus();
        }
    }

    collectNewBudgetData() {
        const budgetData = {
            project: {
                name: document.getElementById('newProjectName').value.trim(),
                client: document.getElementById('newProjectClient').value.trim(),
                address: document.getElementById('newProjectAddress').value.trim()
            },
            trades: {}
        };
        
        const tradeForms = document.querySelectorAll('#newTradesContainer .trade-form');
        
        tradeForms.forEach(tradeForm => {
            const tradeName = tradeForm.querySelector('.trade-name').value;
            if (!tradeName) return;
            
            const lineItems = [];
            const lineItemForms = tradeForm.querySelectorAll('.line-item-form');
            
            lineItemForms.forEach(item => {
                const category = item.querySelector('.item-category').value;
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
                budgetData.trades[tradeName] = {
                    name: tradeName,
                    line_items: lineItems
                };
            }
        });
        
        return budgetData;
    }

    populateEditForm() {
        if (!this.budgetData) return;
        
        // Populate project information
        document.getElementById('newProjectName').value = this.budgetData.project.name || '';
        document.getElementById('newProjectClient').value = this.budgetData.project.client || '';
        document.getElementById('newProjectAddress').value = this.budgetData.project.address || '';
        
        // Clear existing trades
        document.getElementById('newTradesContainer').innerHTML = '';
        this.tradeCounter = 0;
        
        // Populate trades
        Object.entries(this.budgetData.trades).forEach(([tradeKey, trade]) => {
            if (!trade.line_items || trade.line_items.length === 0) return;
            
            this.addNewTrade();
            const tradeDiv = document.querySelector('[data-trade-key]:last-child');
            const tradeNameSelect = tradeDiv.querySelector('.trade-name');
            
            // Find matching trade name from our predefined list
            const matchingTradeName = this.findMatchingTradeName(trade.name);
            
            // Set trade name
            tradeNameSelect.value = matchingTradeName;
            tradeNameSelect.dispatchEvent(new Event('change'));
            
            // Clear default line item
            const lineItemsContainer = tradeDiv.querySelector('.line-items-container');
            lineItemsContainer.innerHTML = '';
            
            // Add line items
            trade.line_items.forEach(item => {
                const lineItem = this.addLineItem(lineItemsContainer, matchingTradeName);
                
                // Populate line item data
                const categorySelect = lineItem.querySelector('.item-category');
                
                // Try to find matching category
                const matchingCategory = this.findMatchingCategory(item.category, matchingTradeName);
                if (matchingCategory) {
                    categorySelect.value = matchingCategory;
                } else {
                    // If no exact match, add a custom option
                    const customOption = document.createElement('option');
                    customOption.value = item.category;
                    customOption.textContent = item.category;
                    categorySelect.appendChild(customOption);
                    categorySelect.value = item.category;
                }
                
                lineItem.querySelector('.item-vendor').value = item.vendor || '';
                lineItem.querySelector('.item-budget').value = item.budget || 0;
                lineItem.querySelector('.item-notes').value = item.notes || '';
            });
        });
        
        // Update button text for edit mode
        const saveButton = document.getElementById('saveNewBudget');
        saveButton.innerHTML = '<i class="fas fa-save me-2"></i>Update Budget';
    }
    
    findMatchingTradeName(tradeName) {
        // Try to find exact match first
        if (this.tradeNames.includes(tradeName)) {
            return tradeName;
        }
        
        // Try to find partial match
        const lowerTradeName = tradeName.toLowerCase();
        const match = this.tradeNames.find(name => 
            name.toLowerCase().includes(lowerTradeName) || 
            lowerTradeName.includes(name.toLowerCase())
        );
        
        return match || this.tradeNames[0]; // Default to first trade if no match
    }
    
    findMatchingCategory(categoryName, tradeName) {
        if (!tradeName || !this.tradeCategoryMapping[tradeName]) {
            return null;
        }
        
        const categories = this.tradeCategoryMapping[tradeName];
        
        // Try exact match first
        const exactMatch = categories.find(cat => cat.name === categoryName);
        if (exactMatch) return exactMatch.name;
        
        // Try partial match
        const lowerCategoryName = categoryName.toLowerCase();
        const partialMatch = categories.find(cat => 
            cat.name.toLowerCase().includes(lowerCategoryName) ||
            lowerCategoryName.includes(cat.name.toLowerCase())
        );
        
        return partialMatch ? partialMatch.name : null;
    }

    renderDashboard() {
        this.filterBudgets();
    }

    filterBudgets() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const statusFilter = document.getElementById('statusFilter').value;
        
        this.filteredBudgets = this.budgetsList.filter(budget => {
            const matchesSearch = !searchTerm || 
                budget.projectName.toLowerCase().includes(searchTerm) ||
                budget.client.toLowerCase().includes(searchTerm) ||
                budget.address.toLowerCase().includes(searchTerm);
            
            const matchesStatus = !statusFilter || budget.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        });
        
        this.renderBudgetCards();
    }

    renderBudgetCards() {
        const container = document.getElementById('budgetCardsContainer');
        
        if (this.filteredBudgets.length === 0) {
            container.innerHTML = `
                <div class="col-12">
                    <div class="card">
                        <div class="card-body text-center py-5">
                            <i class="fas fa-calculator fa-3x text-muted mb-3"></i>
                            <h5>No budgets found</h5>
                            <p class="text-muted">Try adjusting your search or create a new budget.</p>
                        </div>
                    </div>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.filteredBudgets.map(budget => `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card budget-card h-100" onclick="budgetManager.showBudgetViewer('${budget.id}')">
                    <div class="card-body">
                        <h5 class="card-title">${this.escapeHtml(budget.projectName)}</h5>
                        <span class="badge ${this.getStatusBadgeClass(budget.status)} mb-2">${this.getStatusText(budget.status)}</span>
                        <p class="card-text">
                            <strong>Client:</strong> ${this.escapeHtml(budget.client)}<br>
                            <small class="text-muted">${this.escapeHtml(budget.address)}</small>
                        </p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="currency">${this.formatCurrency(budget.totalBudget)}</span>
                        </div>
                        <small class="text-muted d-block mt-2">
                            Modified: ${new Date(budget.lastModified).toLocaleDateString()}
                        </small>
                    </div>
                </div>
            </div>
        `).join('');
    }

    getStatusBadgeClass(status) {
        const classes = {
            'active': 'bg-success',
            'planning': 'bg-warning',
            'completed': 'bg-info'
        };
        return classes[status] || 'bg-secondary';
    }

    getStatusText(status) {
        const texts = {
            'active': 'Active',
            'planning': 'Planning',
            'completed': 'Completed'
        };
        return texts[status] || 'Unknown';
    }


}

// Export the class for ES6 modules
export { BudgetManager };