class BudgetViewer {
    constructor() {
        this.budgetData = null;
        this.grandTotal = 0;
        this.isNewBudgetMode = false;
        this.isEditMode = false;
        this.currentBudgetId = null;
        this.budgetsList = [];
        this.filteredBudgets = [];
        this.currentView = 'dashboard'; // 'dashboard', 'budget', 'new', 'edit'
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
                { name: 'SURVEYS', code: '1101' },
                { name: 'BUILDING PERMITS', code: '1102' },
                { name: 'PLAN COPIES', code: '1103' },
                { name: 'PERMIT PROCESSING', code: '1104' },
                { name: 'SOIL TESTING', code: '1105' },
                { name: 'ASBESTOS & LEAD TESTING', code: '1106' },
                { name: 'MOLD TESTING', code: '1107' },
                { name: 'MISCELLANEOUS CONSTRUCTION EXPENSE', code: '1108' },
                { name: 'PROTECTIVE MATERIALS', code: '1109' },
                { name: 'CONSTRUCTION PREPARATION/DEMO', code: '1110' },
                { name: 'CONSTRUCTION CLEANING', code: '1111' },
                { name: 'PUNCH OUT', code: '1112' },
                { name: 'COURIER SERVICES', code: '1113' },
                { name: 'GENERAL BUILDING MATERIALS', code: '1114' },
                { name: 'WEEKLY ALLOWANCE FOR JOB/SITE CLEAN UP', code: '1115' }
            ],
            'Temporary Conditions': [
                { name: 'CONSTRUCTION TRAILER', code: '1201' },
                { name: 'CONSTRUCTION FENCES', code: '1202' },
                { name: 'ON SITE WIFI', code: '1203' },
                { name: 'PSEG ELECTRIC TIE-IN PRIMARY FEEDERS', code: '1204' },
                { name: 'TEMPORARY ELECTRIC', code: '1205' },
                { name: 'TEMPORARY AC', code: '1206' },
                { name: 'TEMPORARY WATER', code: '1207' },
                { name: 'TEMPORARY TOILETS', code: '1208' },
                { name: 'TEMPORARY STORAGE', code: '1209' },
                { name: 'LP DELIVERIES', code: '1210' },
                { name: 'TEMPORARY LP TANKS', code: '1211' },
                { name: 'TEMPORARY HEAT W/ RENTAL', code: '1212' },
                { name: 'TEMPORARY TENTING', code: '1213' },
                { name: 'DUMPSTER/TRASH HAULING', code: '1214' },
                { name: 'SCAFFOLDING SETUP/BREAK DOWN', code: '1215' },
                { name: 'SCAFFOLDING MONTHLY RENTAL', code: '1216' },
                { name: 'FURNITURE PACKUP/PACK OUT/STORAGE', code: '1217' }
            ],
            'Shell': [
                { name: 'CONCRETE PILING', code: '1301' },
                { name: 'CONCRETE PILING ENGINEERING & INSPECTIONS', code: '1302' },
                { name: 'PILING SPOILS CLEAN UP', code: '1303' },
                { name: 'REVISION FRAMING', code: '1304' },
                { name: 'SHELL / ROOF FRAMING L&M', code: '1305' },
                { name: 'TRUSSES & FLOOR JOISTS', code: '1306' },
                { name: 'FLOOR SYSTEM', code: '1307' },
                { name: 'CORE DRILL FOR ALL TRADES', code: '1308' },
                { name: 'SITE WALLS', code: '1309' },
                { name: 'SHEATHING L & M', code: '1310' },
                { name: 'ROT REPAIR', code: '1311' },
                { name: 'ACCESSORY STRUCTURES', code: '1312' },
                { name: 'CONCRETE SAW CUTTING', code: '1313' }
            ],
            'Masonry': [
                { name: 'STUCCO', code: '1401' },
                { name: 'STONE VENEER MATERIAL', code: '1402' },
                { name: 'VENEER INSTALLATION / LABOR', code: '1403' },
                { name: 'PRECAST STONE / CORAL', code: '1404' },
                { name: 'PATIO MATERIAL', code: '1405' },
                { name: 'PATIO LABOR', code: '1406' }
            ],
            'Decking': [
                { name: 'DECKING FOOTINGS', code: '1501' },
                { name: 'DECKING FRAMING L & M', code: '1502' },
                { name: 'DECKING MATERIAL', code: '1503' },
                { name: 'EXTERIOR RAILS', code: '1504' },
                { name: 'DECKING LABOR', code: '1505' }
            ],
            'Waterproofing': [
                { name: 'WATERPROOFING BELOW GRADE', code: '1601' },
                { name: 'WATERPROOFING WALLS PRIOR TO STUCCO', code: '1602' },
                { name: 'BALCONY WATERPROOFING', code: '1603' },
                { name: 'SITE WALL WATERPROOFING', code: '1604' }
            ],
            'Roofing / Siding': [
                { name: 'DEMO/LOAD DEBRIS/CLEAN WORK AREA', code: '1701' },
                { name: 'ROOFING LABOR AND MATERIALS', code: '1702' },
                { name: 'CHIMNEY CAPS/LOUVERS & VENTS', code: '1703' },
                { name: 'DOOR PANS', code: '1704' },
                { name: 'WINDOW DRIP CAPS', code: '1705' },
                { name: 'FLASHINGS', code: '1706' },
                { name: 'SIDING MATERIAL', code: '1707' },
                { name: 'SIDING LABOR', code: '1708' },
                { name: 'PARAPET CAPPING', code: '1709' },
                { name: 'KNUCKLE/INTERSECTING FLASHING', code: '1710' },
                { name: 'WRP (HOUSE WRAP)', code: '1711' },
                { name: 'CROSS LATHE', code: '1712' },
                { name: 'ATTACHMENTS', code: '1713' },
                { name: 'BREAK FLASHING/EXPOSED METAL DETAILING', code: '1714' },
                { name: 'SPEACIALTY MATERIALS', code: '1715' }
            ],
            'Exterior Windows & Doors': [
                { name: 'GLASS WINDOWS AND DOORS', code: '1801' },
                { name: 'WINDOW AND DOOR INSTALLATION', code: '1802' },
                { name: 'BUCKS/ WATERPROOFING', code: '1803' },
                { name: 'FRONT ENTRY DOOR', code: '1804' },
                { name: 'EXTERIOR DOOR HARDWARE', code: '1805' },
                { name: 'EXTERIOR DOOR HARDWARE INSTALLATION', code: '1806' },
                { name: 'OVERHEAD GARAGE DOORS', code: '1807' },
                { name: 'SPECIALTY DOOR SYSTEMS', code: '1808' }
            ],
            'Framing & Drywall': [
                { name: 'DRYWALL L & M', code: '1901' },
                { name: 'INTERIOR FRAMING', code: '1902' },
                { name: 'INSULATION', code: '1903' },
                { name: 'WINE ROOM INSULATION', code: '1904' }
            ],
            'Plumbing': [
                { name: 'PLUMBING LABOR', code: '2001' },
                { name: 'PLUMBING FIXTURES', code: '2002' },
                { name: 'SEPTIC', code: '2003' },
                { name: 'BACKFLOW', code: '2004' },
                { name: 'DOCK PLUMBING', code: '2005' },
                { name: 'FIRE SPRINKLERS', code: '2006' },
                { name: 'SEWER TIE-IN', code: '2007' },
                { name: 'WELL WATER', code: '2008' }
            ],
            'Electrical & Low Voltage': [
                { name: 'ELECTRICAL LABOR', code: '2101' },
                { name: 'ELECTRICAL FIXTURES', code: '2102' },
                { name: 'LIGHTING SYSTEM', code: '2103' },
                { name: 'AUDIO / VISUAL & NETWORK PREWIRE', code: '2104' },
                { name: 'AUDIO / VISUAL & NETWORK EQUIPMENT', code: '2105' },
                { name: 'MOTORIZED SHADES / DRAPERIES', code: '2106' },
                { name: 'SECURITY SYSTEM', code: '2107' },
                { name: 'CAMERAS', code: '2108' },
                { name: 'CENTRAL VACUUM', code: '2109' },
                { name: 'LIGHTNING PROTECTION', code: '2110' },
                { name: 'GENERATOR', code: '2111' },
                { name: 'LANDSCAPE LIGHTING', code: '2112' },
                { name: 'BOAT LIFT / DOCK ELECTRIC', code: '2113' },
                { name: 'SOLAR', code: '2114' }
            ],
            'Heating & Cooling': [
                { name: 'AIR CONDITIONING & DUCT WORK', code: '2201' },
                { name: 'WINE ROOM', code: '2202' }
            ],
            'Natural Gas & Propane': [
                { name: 'NATURAL GAS OR PROPANE TANK', code: '2301' },
                { name: 'NATIONAL GRID / OTHER GAS METER', code: '2302' },
                { name: 'EXTERIOR GAS FIXTURES - LANTERNS/OTHER', code: '2303' }
            ],
            'Flooring': [
                { name: 'SUBFLOOR UNDERLAYMENT', code: '2401' },
                { name: 'SOUND PROOFING / CRACK SUPPRESSION', code: '2402' },
                { name: 'INTERIOR TILE / MARBLE FLOOR MATERIAL', code: '2403' },
                { name: 'INTERIOR TILE / MARBLE FLOOR LABOR', code: '2404' },
                { name: 'EXTERIOR TILE / MARBLE MATERIAL', code: '2405' },
                { name: 'EXTERIOR TILE / MARBLE LABOR', code: '2406' },
                { name: 'WOOD FLOOR MATERIAL & LABOR', code: '2407' },
                { name: 'CARPET MATERIAL', code: '2409' },
                { name: 'CARPET LABOR', code: '2410' },
                { name: 'FLOOR DEMOLITION', code: '2411' },
                { name: 'GARAGE FLOORS (EPOXY COATING)', code: '2412' },
                { name: 'FLOORING PROTECTION', code: '2413' },
                { name: 'OTHER FLOORING L & M', code: '2414' },
                { name: 'FLOOR REFINISHING', code: '2415' }
            ],
            'Interior Trim Package': [
                { name: 'TRIM MATERIAL', code: '2501' },
                { name: 'TRIM LABOR', code: '2502' },
                { name: 'INTERIOR DOORS MATERIAL', code: '2503' },
                { name: 'INTERIOR DOORS HARDWARE', code: '2504' },
                { name: 'STAIRS & HANDRAILS', code: '2505' },
                { name: 'ATTIC HATCHES / PULL DOWN LADDERS', code: '2506' },
                { name: 'SPECIALTY DETAILS', code: '2507' }
            ],
            'Exterior Trim Package': [
                { name: 'TRIM MATERIAL', code: '2601' },
                { name: 'TRIM LABOR', code: '2602' }
            ],
            'Paint': [
                { name: 'PAINTING INTERIOR', code: '2701' },
                { name: 'PAINTING EXTERIOR', code: '2702' },
                { name: 'PAINTING EXTERIOR WINDOWS/DOORS', code: '2703' },
                { name: 'CUSTOM FINISHES', code: '2704' },
                { name: 'PRESSURE WASH', code: '2705' },
                { name: 'WALLPAPER MATERIAL', code: '2706' },
                { name: 'WALLPAPER LABOR', code: '2707' }
            ],
            'Tile / Marble / Tops': [
                { name: 'COUNTER TOP MATERIAL', code: '2801' },
                { name: 'COUNTER TOP LABOR', code: '2802' },
                { name: 'BACKSPLASH MATERIAL', code: '2803' },
                { name: 'BACKSPLASH LABOR', code: '2804' },
                { name: 'WATERPROOFING', code: '2805' },
                { name: 'BATHROOM SHOWER FLOOR / WALLS MATERIAL', code: '2806' },
                { name: 'BATHROOM SHOWER FLOOR / WALLS LABOR', code: '2807' },
                { name: 'EXTERIOR TILE & MARBLE MATERIAL', code: '2808' },
                { name: 'EXTERIOR TILE & MARBLE LABOR', code: '2809' },
                { name: 'ACCENT WALL / SPECIALTY MATERIAL', code: '2810' },
                { name: 'ACCENT WALL / SPECIALTY LABOR', code: '2811' },
                { name: 'FIRE PLACE SURROUNDS', code: '2812' }
            ],
            'Cabinetry and Built-ins': [
                { name: 'KITCHEN CABINETS', code: '2901' },
                { name: 'INSTALL OF OTHERS CABINETS', code: '2902' },
                { name: 'VANITY AND MED. CAB INSTALL', code: '2903' },
                { name: 'BATH VANITIES', code: '2904' },
                { name: 'CLOSETS', code: '2905' },
                { name: 'WINE ROOM', code: '2906' },
                { name: 'CUSTOM BUILT INS', code: '2907' },
                { name: 'CABINETRY HARDWARE', code: '2908' },
                { name: 'PRE FAB CAB. ASSEMBLY', code: '2909' }
            ],
            'Appliances': [
                { name: 'APPLIANCES', code: '3001' }
            ],
            'Bathroom Accessories': [
                { name: 'SHOWER ENCLOSURES AND MIRRORS', code: '3101' },
                { name: 'TOWEL BARS / ROBE HOOKS / TP HOLDERS', code: '3102' },
                { name: 'ACCESSORIES INSTALLATION', code: '3103' }
            ],
            'Other Amenities': [
                { name: 'ELEVATOR', code: '3201' },
                { name: 'SAFE', code: '3202' },
                { name: 'CAR LIFT', code: '3203' },
                { name: 'CUSTOM METAL DOORS', code: '3204' },
                { name: 'FIREPLACES', code: '3205' },
                { name: 'FIREPLACE DECORATIVE MANTELS', code: '3206' },
                { name: 'GAS LOG SET', code: '3207' }
            ],
            'Exterior Accessories': [
                { name: 'SIDE GATES', code: '3301' },
                { name: 'FENCES', code: '3302' },
                { name: 'CHILD SAFETY FENCES', code: '3303' },
                { name: 'ENTRANCE GATES', code: '3304' },
                { name: 'ENTRANCE GATE MOTORS, KEY PADS AND LOOPS', code: '3305' },
                { name: 'DECORATIVE SHUTTERS', code: '3306' },
                { name: 'ARMOR SCREENS', code: '3307' },
                { name: 'GUTTERS', code: '3308' },
                { name: 'MAILBOX', code: '3309' },
                { name: 'FLAG POLE', code: '3310' },
                { name: 'TRELLIS', code: '3311' },
                { name: 'BEACH STAIRS', code: '3312' },
                { name: 'BEACH STAIRS DAVIT AND WIRING', code: '3313' },
                { name: 'BREEZE SOLIEL', code: '3314' },
                { name: 'ALUMINUM GRATE/LENTIL', code: '3315' },
                { name: 'EGREES LADDERS/STAIRS', code: '3316' }
            ],
            'Driveway': [
                { name: 'DRIVEWAY MATERIAL', code: '3401' },
                { name: 'DRIVEWAY LABOR', code: '3402' },
                { name: 'SLEEVES LABOR AND MATERIAL', code: '3403' },
                { name: 'PAVEMENT APRON', code: '3404' },
                { name: 'SHELL ROCK', code: '3405' },
                { name: 'APRON', code: '3406' }
            ],
            'Pool': [
                { name: 'POOL DEMOLITION', code: '3501' },
                { name: 'POOL AND SPA', code: '3502' },
                { name: 'POOL DECK MATERIAL', code: '3503' },
                { name: 'POOL DECK LABOR', code: '3504' },
                { name: 'POOL FENCE AND ALARMS', code: '3505' },
                { name: 'POOL SAFETY FENCE', code: '3506' },
                { name: 'POOL AUTOMATION', code: '3507' }
            ],
            'Seawall and Dock': [
                { name: 'SEAWALL', code: '3601' },
                { name: 'SEAWALL CAP', code: '3602' },
                { name: 'DOCK', code: '3603' },
                { name: 'BOAT LIFT', code: '3604' }
            ],
            'Landscaping / Irrigation': [
                { name: 'LANDSCAPING LABOR AND MATERIALS', code: '3701' },
                { name: 'IRRIGATION', code: '3702' },
                { name: 'TREE REMOVAL / TRIMMING / RELOCATION', code: '3703' },
                { name: 'FOUNTAIN', code: '3704' },
                { name: 'SCREENING FOR NEIGHBORS', code: '3705' }
            ],
            'Site Work': [
                { name: 'FOUNDATION AND SITE EQUIPMENT', code: '3801' },
                { name: 'EXCAVATION / GRADING', code: '3802' },
                { name: 'FILL (REMOVAL OR DELIVER)', code: '3803' },
                { name: 'STABILIZER / SHELL ROCK', code: '3804' },
                { name: 'DRAINAGE LABOR AND MATERIAL', code: '3805' },
                { name: 'SILT FENCE', code: '3806' }
            ],
            'Pest Control': [
                { name: 'TERMITE TREATMENT', code: '3901' },
                { name: 'LAWN / SHRUB TREATMENT', code: '3902' },
                { name: 'HOUSE TREATMENT', code: '3903' }
            ],
            'SMS Direct Services': [
                { name: 'FIELD SUPERVISION/PROJECT MANAGEMENT', code: '5001' },
                { name: 'PROJECT ADMINISTRATION', code: '5002' },
                { name: 'GENERAL LABOR', code: '5003' }
            ]
        };
        
        this.init();
    }
    
    async init() {
        try {
            await this.loadBudgetsList();
            this.renderDashboard();
            this.setupEventListeners();
            this.hideLoading();
        } catch (error) {
            console.error('Failed to initialize budget viewer:', error);
            this.showError('Failed to load dashboard data. Please refresh the page and try again.');
            this.hideLoading();
        }
    }
    
    async loadBudgetsList() {
        try {
            const response = await fetch('/api/budgets');
            if (response.status === 401) {
                window.location.href = '/login';
                return;
            }
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.budgetsList = data.budgets || [];
            this.filteredBudgets = [...this.budgetsList];
        } catch (error) {
            console.error('Error loading budgets list:', error);
            this.budgetsList = [];
            this.filteredBudgets = [];
        }
    }

    async loadBudgetData(filename = 'budget.json') {
        try {
            const response = await fetch(`/static/${filename}`);
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
            this.showError(`Failed to load budget: ${filename}`);
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
        
        // Navigation buttons
        document.getElementById('backToDashboard').addEventListener('click', () => {
            this.showDashboard();
        });
        
        document.getElementById('editBudgetBtn').addEventListener('click', () => {
            this.editCurrentBudget();
        });
        
        document.getElementById('newBudgetBtn').addEventListener('click', () => {
            this.showNewBudgetForm();
        });
        
        document.getElementById('exportPdfBtn').addEventListener('click', () => {
            this.exportToPDF();
        });
        
        // New budget form
        document.getElementById('cancelNewBudget').addEventListener('click', () => {
            this.showDashboard();
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
        
        // Dashboard search and filters
        document.getElementById('searchBudgets').addEventListener('input', (e) => {
            this.filterBudgets();
        });
        
        document.getElementById('filterStatus').addEventListener('change', () => {
            this.filterBudgets();
        });
        
        document.getElementById('sortBudgets').addEventListener('change', () => {
            this.sortAndRenderBudgets();
        });
        
        // Test budget generation
        document.getElementById('createBlankBudget').addEventListener('click', (e) => {
            e.preventDefault();
            this.showNewBudgetForm();
        });
        
        document.getElementById('generateStepByStepBudget').addEventListener('click', (e) => {
            e.preventDefault();
            this.showStepByStepGenerator();
        });
        
        document.getElementById('generateTestBudget').addEventListener('click', (e) => {
            e.preventDefault();
            this.generateTestBudget();
        });
        
        // Step-by-step modal controls
        document.getElementById('nextStep').addEventListener('click', () => {
            this.nextStep();
        });
        
        document.getElementById('prevStep').addEventListener('click', () => {
            this.prevStep();
        });
        
        document.getElementById('createBudgetStep').addEventListener('click', () => {
            this.createBudgetFromStep();
        });
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
        if (this.currentView === 'dashboard') {
            document.getElementById('dashboard').classList.remove('d-none');
        } else {
            document.getElementById('budgetContent').classList.remove('d-none');
        }
    }
    
    showDashboard() {
        this.currentView = 'dashboard';
        this.currentBudgetId = null;
        this.isEditMode = false;
        document.getElementById('pageTitle').textContent = 'Construction Budget Dashboard';
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
            this.showError('Failed to load budget data');
        }
    }
    
    showNewBudgetForm() {
        this.currentView = 'new';
        document.getElementById('pageTitle').textContent = 'Create New Budget';
        document.getElementById('dashboard').classList.add('d-none');
        document.getElementById('budgetContent').classList.add('d-none');
        document.getElementById('newBudgetForm').classList.remove('d-none');
        document.getElementById('loadingIndicator').classList.add('d-none');
        document.getElementById('backToDashboard').classList.remove('d-none');
        document.getElementById('editBudgetBtn').classList.add('d-none');
        document.getElementById('exportPdfBtn').classList.add('d-none');
        this.isNewBudgetMode = true;
        this.isEditMode = false;
        this.resetNewBudgetForm();
    }
    
    editCurrentBudget() {
        if (!this.budgetData) return;
        
        this.currentView = 'edit';
        this.isEditMode = true;
        this.isNewBudgetMode = false;
        document.getElementById('pageTitle').textContent = `Edit Budget: ${this.budgetData.project.name}`;
        document.getElementById('budgetContent').classList.add('d-none');
        document.getElementById('newBudgetForm').classList.remove('d-none');
        document.getElementById('editBudgetBtn').classList.add('d-none');
        this.populateEditForm();
    }
    
    hideNewBudgetForm() {
        if (this.currentView === 'edit') {
            this.showBudgetViewer(this.currentBudgetId);
        } else {
            this.showDashboard();
        }
        this.isNewBudgetMode = false;
        this.isEditMode = false;
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
        
        // Reset button text
        const saveButton = document.getElementById('saveNewBudget');
        saveButton.innerHTML = '<i class="fas fa-save me-2"></i>Save Budget';
    }
    
    generateTestBudget() {
        // Project templates with realistic data
        const projectTemplates = [
            {
                type: 'residential',
                names: [
                    'Luxury Waterfront Estate',
                    'Modern Family Residence',
                    'Historic Home Renovation',
                    'Coastal Villa Project',
                    'Mountain Lodge Construction',
                    'Urban Townhouse Development',
                    'Eco-Friendly Smart Home',
                    'Classic Colonial Revival'
                ],
                clients: [
                    'The Johnson Family Trust',
                    'Miller Property Holdings',
                    'Heritage Home Investors',
                    'Coastal Living LLC',
                    'Mountain View Estates',
                    'Urban Development Group',
                    'Green Building Solutions',
                    'Classic Homes Partnership'
                ],
                addresses: [
                    '15 Oceanview Drive, Malibu, CA 90265',
                    '892 Maple Street, Aspen, CO 81611',
                    '1734 Historic Lane, Savannah, GA 31401',
                    '456 Waterfront Blvd, Miami, FL 33139',
                    '2018 Mountain Ridge Road, Park City, UT 84060',
                    '3421 Urban Plaza, Seattle, WA 98101',
                    '567 Sustainable Way, Portland, OR 97201',
                    '1289 Heritage Court, Charleston, SC 29401'
                ]
            },
            {
                type: 'commercial',
                names: [
                    'Corporate Headquarters Expansion',
                    'Medical Center Complex',
                    'Retail Shopping Plaza',
                    'Modern Office Tower',
                    'Restaurant & Entertainment District',
                    'Technology Innovation Hub',
                    'Mixed-Use Development',
                    'Healthcare Facility Upgrade'
                ],
                clients: [
                    'Apex Corporation',
                    'Regional Medical Group',
                    'Retail Development Partners',
                    'Downtown Properties LLC',
                    'Entertainment Ventures Inc',
                    'Tech Innovation Group',
                    'Urban Mixed-Use Partners',
                    'Healthcare Solutions Corp'
                ],
                addresses: [
                    '5000 Corporate Center Drive, Austin, TX 78759',
                    '1250 Medical Plaza, Denver, CO 80202',
                    '3400 Shopping District Blvd, Orlando, FL 32801',
                    '750 Business Tower Way, Charlotte, NC 28202',
                    '2100 Entertainment Row, Nashville, TN 37203',
                    '4800 Innovation Parkway, San Jose, CA 95110',
                    '1875 Urban Square, Boston, MA 02101',
                    '3200 Healthcare Drive, Phoenix, AZ 85001'
                ]
            }
        ];
        
        // Realistic vendor names
        const vendors = {
            excavation: ['Premier Excavation', 'Earthworks Contractors', 'Site Development Pros', 'Foundation Specialists'],
            concrete: ['Concrete Solutions Inc', 'Premier Concrete Works', 'Structural Concrete Specialists', 'Foundation Masters'],
            electrical: ['Advanced Electrical Systems', 'Power Solutions Inc', 'Elite Electrical Contractors', 'Modern Electric Co'],
            plumbing: ['Professional Plumbing Services', 'Hydro Systems Inc', 'Master Plumbers Guild', 'Flow-Tech Solutions'],
            roofing: ['Superior Roofing Solutions', 'Peak Performance Roofing', 'Weatherguard Contractors', 'Roofline Specialists'],
            flooring: ['Premium Floor Covering', 'Elegant Flooring Solutions', 'Floor Masters Inc', 'Decorative Surfaces Co'],
            painting: ['Professional Painting Services', 'Color Masters Inc', 'Premium Paint Solutions', 'Artistic Finishes'],
            hvac: ['Climate Control Experts', 'Advanced HVAC Systems', 'Comfort Solutions Inc', 'Air Quality Specialists']
        };
        
        // Select random template
        const templateType = Math.random() > 0.6 ? 'commercial' : 'residential';
        const template = projectTemplates.find(t => t.type === templateType);
        const randomIndex = Math.floor(Math.random() * template.names.length);
        
        // Generate project data
        const testBudgetData = {
            project: {
                name: template.names[randomIndex],
                client: template.clients[randomIndex],
                address: template.addresses[randomIndex]
            },
            trades: {}
        };
        
        // Generate realistic trade sections based on project type
        const tradeConfigs = this.getTradeConfigsForType(templateType, vendors);
        
        tradeConfigs.forEach(config => {
            const tradeKey = `trade_${config.name.toLowerCase().replace(/\s+/g, '_')}`;
            testBudgetData.trades[tradeKey] = {
                name: config.name,
                line_items: config.items.map(item => ({
                    category: item.category,
                    categoryCode: item.code,
                    vendor: this.getRandomVendor(vendors, item.vendorType),
                    budget: this.generateRealisticBudget(item.baseAmount, templateType),
                    notes: item.notes || undefined
                }))
            };
        });
        
        // Set the generated data and show form
        this.newBudgetData = testBudgetData;
        this.showNewBudgetForm();
        this.populateGeneratedBudget();
        
        // Show success message
        this.showSuccessMessage(`Generated ${templateType} test budget: "${testBudgetData.project.name}"`);
    }
    
    getTradeConfigsForType(projectType, vendors) {
        const baseConfig = [
            {
                name: 'Site Work',
                items: [
                    { category: 'EXCAVATION / GRADING', code: '3802', vendorType: 'excavation', baseAmount: 45000, notes: 'Site preparation and rough grading' },
                    { category: 'DRAINAGE LABOR AND MATERIAL', code: '3805', vendorType: 'excavation', baseAmount: 25000, notes: 'Storm water management system' }
                ]
            },
            {
                name: 'Shell',
                items: [
                    { category: 'CONCRETE PILING', code: '1301', vendorType: 'concrete', baseAmount: 85000, notes: 'Foundation piling system' },
                    { category: 'SHELL / ROOF FRAMING L&M', code: '1305', vendorType: 'concrete', baseAmount: 120000, notes: 'Structural framing package' }
                ]
            },
            {
                name: 'Electrical & Low Voltage',
                items: [
                    { category: 'ELECTRICAL LABOR', code: '2101', vendorType: 'electrical', baseAmount: 75000, notes: 'Complete electrical installation' },
                    { category: 'LIGHTING SYSTEM', code: '2103', vendorType: 'electrical', baseAmount: 35000, notes: 'LED lighting package' }
                ]
            },
            {
                name: 'Plumbing',
                items: [
                    { category: 'PLUMBING LABOR', code: '2001', vendorType: 'plumbing', baseAmount: 65000, notes: 'Complete plumbing system' },
                    { category: 'PLUMBING FIXTURES', code: '2002', vendorType: 'plumbing', baseAmount: 45000, notes: 'High-end fixture package' }
                ]
            }
        ];
        
        if (projectType === 'commercial') {
            baseConfig.push(
                {
                    name: 'Heating & Cooling',
                    items: [
                        { category: 'AIR CONDITIONING & DUCT WORK', code: '2201', vendorType: 'hvac', baseAmount: 185000, notes: 'Commercial HVAC system' }
                    ]
                },
                {
                    name: 'Professional Services',
                    items: [
                        { category: 'STRUCTURAL ENGINEERING', code: '1002', vendorType: 'concrete', baseAmount: 25000, notes: 'Structural design and analysis' },
                        { category: 'MEP ENGINEERING', code: '1004', vendorType: 'electrical', baseAmount: 35000, notes: 'Mechanical, electrical, plumbing design' }
                    ]
                }
            );
        } else {
            baseConfig.push(
                {
                    name: 'Flooring',
                    items: [
                        { category: 'WOOD FLOOR MATERIAL & LABOR', code: '2407', vendorType: 'flooring', baseAmount: 45000, notes: 'Hardwood flooring throughout' },
                        { category: 'INTERIOR TILE / MARBLE FLOOR MATERIAL', code: '2403', vendorType: 'flooring', baseAmount: 25000, notes: 'Tile for bathrooms and kitchen' }
                    ]
                },
                {
                    name: 'Paint',
                    items: [
                        { category: 'PAINTING INTERIOR', code: '2701', vendorType: 'painting', baseAmount: 35000, notes: 'Interior paint and finishes' },
                        { category: 'PAINTING EXTERIOR', code: '2702', vendorType: 'painting', baseAmount: 25000, notes: 'Exterior paint system' }
                    ]
                }
            );
        }
        
        return baseConfig;
    }
    
    getRandomVendor(vendors, vendorType) {
        const vendorList = vendors[vendorType] || vendors.excavation;
        return vendorList[Math.floor(Math.random() * vendorList.length)];
    }
    
    generateRealisticBudget(baseAmount, projectType) {
        // Add realistic variation to base amounts
        const multiplier = projectType === 'commercial' ? 1.5 : 1.0;
        const variation = 0.7 + (Math.random() * 0.6); // 70% to 130% of base
        return Math.round(baseAmount * multiplier * variation);
    }
    
    populateGeneratedBudget() {
        if (!this.newBudgetData) return;
        
        // Populate project information
        document.getElementById('newProjectName').value = this.newBudgetData.project.name;
        document.getElementById('newProjectClient').value = this.newBudgetData.project.client;
        document.getElementById('newProjectAddress').value = this.newBudgetData.project.address;
        
        // Clear existing trades
        document.getElementById('newTradesContainer').innerHTML = '';
        this.tradeCounter = 0;
        
        // Populate trades
        Object.entries(this.newBudgetData.trades).forEach(([tradeKey, trade]) => {
            this.addNewTrade();
            const tradeDiv = document.querySelector('[data-trade-key]:last-child');
            const tradeNameSelect = tradeDiv.querySelector('.trade-name');
            
            // Set trade name
            tradeNameSelect.value = trade.name;
            tradeNameSelect.dispatchEvent(new Event('change'));
            
            // Clear default line item
            const lineItemsContainer = tradeDiv.querySelector('.line-items-container');
            lineItemsContainer.innerHTML = '';
            
            // Add line items
            trade.line_items.forEach(item => {
                const lineItem = this.addLineItem(lineItemsContainer, trade.name);
                
                // Populate line item data
                const categorySelect = lineItem.querySelector('.item-category');
                categorySelect.value = item.category;
                lineItem.querySelector('.item-vendor').value = item.vendor;
                lineItem.querySelector('.item-budget').value = item.budget;
                lineItem.querySelector('.item-notes').value = item.notes || '';
            });
        });
    }
    
    async showStepByStepGenerator() {
        // Hide new budget form and show enhanced step modal
        this.hideNewBudgetForm();
        
        // Initialize enhanced step-by-step state
        this.currentStep = 1;
        this.maxSteps = 4;
        this.stepData = {
            projectInfo: {},
            selectedScenario: null,
            trades: [],
            currentTradeIndex: 0,
            currentLineItemIndex: 0,
            isAddingLineItems: false,
            summary: {}
        };
        
        // Load common trade configurations for auto-fill
        this.loadTradeConfigurations();
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('stepModal'));
        modal.show();
        
        this.updateStepModal();
    }
    
    renderScenarioCards() {
        const container = document.getElementById('scenarioCards');
        container.innerHTML = this.budgetScenarios.map(scenario => `
            <div class="col-md-6 mb-4">
                <div class="card scenario-card h-100 border-2" data-scenario-id="${scenario.id}" style="cursor: pointer; transition: all 0.2s ease;">
                    <div class="card-header d-flex justify-content-between align-items-center py-3" style="background: linear-gradient(135deg, ${scenario.type === 'residential' ? '#6f42c1' : '#0dcaf0'}, ${scenario.type === 'residential' ? '#9a6fc1' : '#0fb3d3'});">
                        <span class="badge bg-light text-dark fs-7 px-3 py-2">${scenario.type}</span>
                        <span class="fw-semibold text-white" style="font-size: 1.1rem;">${this.formatCurrency(scenario.totalBudget)}</span>
                    </div>
                    <div class="card-body p-4">
                        <h5 class="card-title mb-3 fw-bold">${scenario.project.name}</h5>
                        <p class="card-text text-muted mb-3" style="font-size: 0.95rem; line-height: 1.4;">${scenario.description}</p>
                        <div class="mb-2">
                            <strong class="text-dark">Client:</strong>
                            <div class="text-muted">${scenario.project.client}</div>
                        </div>
                        <div class="text-muted small" style="font-size: 0.85rem;">
                            <i class="fas fa-map-marker-alt me-1"></i>${scenario.project.address}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add click handlers
        container.querySelectorAll('.scenario-card').forEach(card => {
            card.addEventListener('click', () => {
                // Remove previous selection
                container.querySelectorAll('.scenario-card').forEach(c => {
                    c.classList.remove('border-success');
                    c.style.borderWidth = '';
                    c.style.boxShadow = '';
                });
                
                // Add selection to clicked card
                card.classList.add('border-success');
                card.style.borderWidth = '3px';
                card.style.boxShadow = '0 0.5rem 1rem rgba(25, 135, 84, 0.3)';
                
                // Store selected scenario
                const scenarioId = parseInt(card.dataset.scenarioId);
                this.selectedScenario = this.budgetScenarios.find(s => s.id === scenarioId);
                
                // Enable next button
                document.getElementById('nextStep').disabled = false;
            });
        });
    }
    
    updateStepModal() {
        // Hide all steps
        document.querySelectorAll('.step-content').forEach(step => {
            step.classList.add('d-none');
        });
        
        // Show current step
        document.getElementById(`step${this.currentStep}`).classList.remove('d-none');
        
        // Update navigation buttons
        const prevBtn = document.getElementById('prevStep');
        const nextBtn = document.getElementById('nextStep');
        const createBtn = document.getElementById('createBudgetStep');
        
        prevBtn.disabled = this.currentStep === 1;
        
        if (this.currentStep === 4) {
            nextBtn.classList.add('d-none');
            createBtn.classList.remove('d-none');
        } else {
            nextBtn.classList.remove('d-none');
            createBtn.classList.add('d-none');
            nextBtn.disabled = this.currentStep === 1 && !this.selectedScenario;
        }
    }
    
    nextStep() {
        // Save current step data before proceeding
        if (this.currentStep === 1) {
            // Save project info
            this.saveCurrentProjectInfo();
        } else if (this.currentStep === 2) {
            // Save scenario selection  
            this.saveCurrentScenario();
        } else if (this.currentStep === 3) {
            // Save current line item if in line item mode
            if (this.stepData.isAddingLineItems) {
                this.saveCurrentLineItem();
                return; // Stay on step 3 for next line item
            }
        }
        
        if (this.currentStep < this.maxSteps) {
            this.currentStep++;
            this.updateStepModal();
        }
    }
    
    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepModal();
        }
    }
    
    renderProjectInfoStep() {
        const projectInfo = this.stepData.projectInfo;
        return `
            <div class="step-content">
                <h4 class="mb-4">Project Information</h4>
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label">Project Name *</label>
                        <input type="text" id="stepProjectName" class="form-control" 
                               value="${projectInfo.name || ''}"
                               placeholder="Enter project name" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Client Name *</label>
                        <input type="text" id="stepClient" class="form-control" 
                               value="${projectInfo.client || ''}"
                               placeholder="Enter client name" required>
                    </div>
                    <div class="col-12">
                        <label class="form-label">Project Address</label>
                        <textarea id="stepAddress" class="form-control" rows="2" 
                                  placeholder="Enter project address">${projectInfo.address || ''}</textarea>
                    </div>
                </div>
                ${projectInfo.name ? '<div class="alert alert-success mt-3"><i class="fas fa-check-circle me-2"></i>Project information saved</div>' : ''}
            </div>
        `;
    }
    
    renderTradesOverviewStep() {
        if (!this.stepData.isAddingLineItems) {
            // Show trade overview first
            return `
                <div class="step-content">
                    <h4 class="mb-4">Build Your Budget Line by Line</h4>
                    <p class="text-muted mb-4">We'll guide you through adding each budget item step by step. You can review, edit, and save each entry individually.</p>
                    
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle me-2"></i>
                        We'll start with the most common trade categories and auto-fill realistic values that you can customize.
                    </div>
                    
                    <div class="text-center">
                        <button class="btn btn-primary btn-lg" onclick="budgetViewer.startLineItemMode()">
                            <i class="fas fa-play me-2"></i>Start Building Budget
                        </button>
                    </div>
                </div>
            `;
        } else {
            // Show current line item being added
            return this.renderCurrentLineItem();
        }
    }
    
    renderBudgetSummaryStep() {
        const container = document.getElementById('budgetSummary');
        const trades = Object.entries(this.selectedScenario.trades);
        const totalItems = trades.reduce((sum, [key, trade]) => sum + trade.line_items.length, 0);
        
        container.innerHTML = `
            <li class="mb-2"><strong class="text-dark">Project:</strong> <span class="text-muted fs-6">${this.selectedScenario.project.name}</span></li>
            <li class="mb-2"><strong class="text-dark">Type:</strong> <span class="badge ${this.selectedScenario.type === 'residential' ? 'bg-primary' : 'bg-info'} ms-2">${this.selectedScenario.type} construction</span></li>
            <li class="mb-2"><strong class="text-dark">Trade Sections:</strong> <span class="text-muted fs-6">${trades.length} sections</span></li>
            <li class="mb-2"><strong class="text-dark">Line Items:</strong> <span class="text-muted fs-6">${totalItems} items</span></li>
            <li class="mb-0"><strong class="text-dark">Total Budget:</strong> <span class="text-success fw-bold fs-5 ms-2">${this.formatCurrency(this.selectedScenario.totalBudget)}</span></li>
        `;
    }
    
    createBudgetFromStep() {
        // Collect all step data and create the budget
        const budgetData = {
            project: this.stepData.projectInfo,
            trades: {}
        };
        
        // Add collected trades with line items
        this.stepData.trades.forEach(trade => {
            budgetData.trades[trade.name] = {
                name: trade.name,
                lineItems: trade.lineItems
            };
        });
        
        // Close modal and save the budget
        const modal = bootstrap.Modal.getInstance(document.getElementById('stepModal'));
        modal.hide();
        
        // Create budget entry
        const budgetEntry = {
            id: this.generateBudgetId(this.stepData.projectInfo.name),
            projectName: this.stepData.projectInfo.name,
            client: this.stepData.projectInfo.client,
            address: this.stepData.projectInfo.address || '',
            totalBudget: this.calculateTotalFromTrades(budgetData.trades),
            status: 'planning',
            filename: `budget_${Date.now()}.json`,
            dateCreated: new Date().toISOString().split('T')[0],
            lastModified: new Date().toISOString().split('T')[0]
        };
        
        // Save the budget
        this.saveNewBudgetToList(budgetEntry, budgetData);
        this.populateGeneratedBudget();
        
        // Show success message
        this.showSuccessMessage(`Created ${this.selectedScenario.type} budget: "${this.selectedScenario.project.name}"`);
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
            const tradeNameSelect = tradeDiv.querySelector('.trade-name');
            const tradeName = tradeNameSelect.value;
            this.addLineItem(tradeDiv.querySelector('.line-items-container'), tradeName);
        });
        
        // Add trade name change listener to update categories
        tradeDiv.querySelector('.trade-name').addEventListener('change', (e) => {
            const tradeName = e.target.value;
            const lineItemsContainer = tradeDiv.querySelector('.line-items-container');
            
            // Update existing line items with new categories
            const existingItems = lineItemsContainer.querySelectorAll('.line-item');
            existingItems.forEach(item => {
                this.updateLineItemCategories(item, tradeName);
            });
        });
        
        // Add one line item by default (disabled until trade is selected)
        this.addLineItem(tradeDiv.querySelector('.line-items-container'));
    }
    
    addLineItem(container, tradeName = null) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'row mb-2 line-item';
        
        // Generate category dropdown options based on selected trade
        let categoryOptions = '<option value="">Select Category</option>';
        if (tradeName && this.tradeCategoryMapping[tradeName]) {
            categoryOptions += this.tradeCategoryMapping[tradeName].map(category => 
                `<option value="${category.name}" data-code="${category.code}">${category.name} (${category.code})</option>`
            ).join('');
        }
        
        itemDiv.innerHTML = `
            <div class="col-12 col-sm-6 col-md-3 mb-2">
                <select class="form-select form-select-sm item-category" required ${!tradeName ? 'disabled' : ''}>
                    ${categoryOptions}
                </select>
                ${!tradeName ? '<small class="text-muted">Select Trade Name first</small>' : ''}
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
        
        return itemDiv;
    }
    
    async saveNewBudget() {
        if (!this.validateNewBudget()) {
            return;
        }
        
        this.collectNewBudgetData();
        this.budgetData = { ...this.newBudgetData };
        
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
            this.showSuccessMessage('Budget created successfully! (Note: In production, this would be saved to the server)');
        }
    }
    
    async saveNewBudgetToList() {
        // Generate unique ID for new budget
        const newBudgetId = this.generateBudgetId(this.newBudgetData.project.name);
        const currentDate = new Date().toISOString().split('T')[0];
        
        // Calculate total budget
        const totalBudget = this.calculateTotalBudgetAmount();
        
        // Create new budget entry for the list
        const newBudgetEntry = {
            id: newBudgetId,
            projectName: this.newBudgetData.project.name,
            client: this.newBudgetData.project.client,
            address: this.newBudgetData.project.address,
            dateCreated: currentDate,
            lastModified: currentDate,
            status: 'planning', // Default status for new budgets
            totalBudget: totalBudget,
            filename: `${newBudgetId}.json`
        };
        
        try {
            // Save to server
            const response = await fetch('/api/budgets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    budgetEntry: newBudgetEntry,
                    budgetData: this.newBudgetData
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('Budget saved successfully:', result);
                
                // Update local lists
                this.budgetsList.unshift(newBudgetEntry);
                this.filteredBudgets = [...this.budgetsList];
                this.currentBudgetId = newBudgetId;
                
                this.showSuccessMessage('Budget saved successfully to JSON files!');
            } else {
                throw new Error('Failed to save budget to server');
            }
        } catch (error) {
            console.error('Error saving budget:', error);
            
            // Fallback to local update only
            this.budgetsList.unshift(newBudgetEntry);
            this.filteredBudgets = [...this.budgetsList];
            this.currentBudgetId = newBudgetId;
            
            this.showBudgetSaveInfo(newBudgetEntry, this.newBudgetData);
        }
    }
    
    async updateExistingBudget() {
        if (!this.currentBudgetId) return;
        
        // Find and update the budget in the list
        const budgetIndex = this.budgetsList.findIndex(b => b.id === this.currentBudgetId);
        if (budgetIndex !== -1) {
            const currentDate = new Date().toISOString().split('T')[0];
            const totalBudget = this.calculateTotalBudgetAmount();
            
            // Update budget entry
            const updatedBudgetEntry = {
                ...this.budgetsList[budgetIndex],
                projectName: this.newBudgetData.project.name,
                client: this.newBudgetData.project.client,
                address: this.newBudgetData.project.address,
                lastModified: currentDate,
                totalBudget: totalBudget
            };
            
            try {
                // Save to server
                const response = await fetch('/api/budgets', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        budgetEntry: updatedBudgetEntry,
                        budgetData: this.newBudgetData
                    })
                });
                
                if (response.ok) {
                    const result = await response.json();
                    console.log('Budget updated successfully:', result);
                    
                    // Update local list
                    this.budgetsList[budgetIndex] = updatedBudgetEntry;
                    this.filteredBudgets = [...this.budgetsList];
                    
                    this.showSuccessMessage('Budget updated successfully in JSON files!');
                } else {
                    throw new Error('Failed to update budget on server');
                }
            } catch (error) {
                console.error('Error updating budget:', error);
                
                // Fallback to local update only
                this.budgetsList[budgetIndex] = updatedBudgetEntry;
                this.filteredBudgets = [...this.budgetsList];
                
                this.showSuccessMessage('Budget updated locally (server save failed)');
            }
        }
    }
    
    generateBudgetId(projectName) {
        const cleanName = projectName.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 30);
        const year = new Date().getFullYear();
        const timestamp = Date.now().toString().slice(-4);
        return `${cleanName}-${year}-${timestamp}`;
    }
    
    calculateTotalBudgetAmount() {
        let total = 0;
        Object.values(this.newBudgetData.trades).forEach(trade => {
            if (trade.line_items) {
                trade.line_items.forEach(item => {
                    total += item.budget || 0;
                });
            }
        });
        return total;
    }
    
    async saveNewBudgetToList(budgetEntry, budgetData) {
        try {
            const response = await fetch('/api/budgets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    budgetEntry: budgetEntry,
                    budgetData: budgetData
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                this.showSuccessMessage('Budget created successfully!');
                
                // Refresh the budgets list
                await this.loadBudgetsList();
                this.renderDashboard();
                
                // Show the newly created budget
                setTimeout(() => {
                    this.showBudgetViewer(budgetEntry.id);
                }, 1500);
            } else {
                throw new Error(result.error || 'Failed to save budget');
            }
            
        } catch (error) {
            console.error('Error saving budget:', error);
            this.showError('Failed to save budget: ' + error.message);
        }
    }
    
    showBudgetSaveInfo(budgetEntry, budgetData) {
        // Create a detailed info modal/alert showing what would be saved
        const alert = document.createElement('div');
        alert.className = 'alert alert-info alert-dismissible fade show mt-3';
        alert.innerHTML = `
            <h6><i class="fas fa-info-circle me-2"></i>Budget Save Information</h6>
            <p class="mb-2">In a production environment, this would save:</p>
            <ul class="mb-2">
                <li><strong>Budget ID:</strong> ${budgetEntry.id}</li>
                <li><strong>File:</strong> ${budgetEntry.filename}</li>
                <li><strong>Total Budget:</strong> ${this.formatCurrency(budgetEntry.totalBudget)}</li>
                <li><strong>Trade Sections:</strong> ${Object.keys(budgetData.trades).length}</li>
            </ul>
            <details class="mb-2">
                <summary>View JSON Structure</summary>
                <pre class="mt-2 p-2 bg-dark text-light rounded small" style="max-height: 200px; overflow-y: auto;">Budget Entry: ${JSON.stringify(budgetEntry, null, 2)}

Budget Data: ${JSON.stringify(budgetData, null, 2)}</pre>
            </details>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.querySelector('.container').insertBefore(alert, document.querySelector('.container').firstChild);
        
        // Auto-dismiss after 10 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 10000);
    }
    
    showSuccessMessage(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-success alert-dismissible fade show';
        alert.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            ${message}
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
        
        this.currentView = 'preview';
        document.getElementById('pageTitle').textContent = `Preview: ${this.newBudgetData.project.name}`;
        document.getElementById('newBudgetForm').classList.add('d-none');
        document.getElementById('budgetContent').classList.remove('d-none');
        document.getElementById('editBudgetBtn').classList.add('d-none');
        document.getElementById('exportPdfBtn').classList.remove('d-none');
        this.renderBudget();
        
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
                        const categoryOption = categorySelect.options[categorySelect.selectedIndex];
                        const categoryCode = categoryOption ? categoryOption.getAttribute('data-code') : '';
                        
                        lineItems.push({
                            category,
                            categoryCode,
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
    
    updateLineItemCategories(lineItem, tradeName) {
        const categorySelect = lineItem.querySelector('.item-category');
        const currentValue = categorySelect.value;
        
        // Clear and rebuild options
        categorySelect.innerHTML = '<option value="">Select Category</option>';
        
        if (tradeName && this.tradeCategoryMapping[tradeName]) {
            this.tradeCategoryMapping[tradeName].forEach(category => {
                const option = document.createElement('option');
                option.value = category.name;
                option.setAttribute('data-code', category.code);
                option.textContent = `${category.name} (${category.code})`;
                if (category.name === currentValue) {
                    option.selected = true;
                }
                categorySelect.appendChild(option);
            });
            categorySelect.disabled = false;
            
            // Remove helper text
            const helpText = lineItem.querySelector('small');
            if (helpText) {
                helpText.remove();
            }
        } else {
            categorySelect.disabled = true;
            // Add helper text if not present
            if (!lineItem.querySelector('small')) {
                const helpText = document.createElement('small');
                helpText.className = 'text-muted';
                helpText.textContent = 'Select Trade Name first';
                categorySelect.parentNode.appendChild(helpText);
            }
        }
    }
    
    renderDashboard() {
        this.sortAndRenderBudgets();
    }
    
    filterBudgets() {
        const searchTerm = document.getElementById('searchBudgets').value.toLowerCase();
        const statusFilter = document.getElementById('filterStatus').value;
        
        this.filteredBudgets = this.budgetsList.filter(budget => {
            const matchesSearch = budget.projectName.toLowerCase().includes(searchTerm) ||
                                budget.client.toLowerCase().includes(searchTerm);
            const matchesStatus = !statusFilter || budget.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
        
        this.sortAndRenderBudgets();
    }
    
    sortAndRenderBudgets() {
        const sortBy = document.getElementById('sortBudgets').value;
        
        this.filteredBudgets.sort((a, b) => {
            switch (sortBy) {
                case 'projectName':
                    return a.projectName.localeCompare(b.projectName);
                case 'totalBudget':
                    return b.totalBudget - a.totalBudget;
                case 'dateCreated':
                    return new Date(b.dateCreated) - new Date(a.dateCreated);
                case 'lastModified':
                default:
                    return new Date(b.lastModified) - new Date(a.lastModified);
            }
        });
        
        this.renderBudgetCards();
    }
    
    renderBudgetCards() {
        const container = document.getElementById('budgetsList');
        const noResults = document.getElementById('noBudgetsMessage');
        
        if (this.filteredBudgets.length === 0) {
            container.innerHTML = '';
            noResults.classList.remove('d-none');
            return;
        }
        
        noResults.classList.add('d-none');
        
        container.innerHTML = this.filteredBudgets.map((budget, index) => {
            const statusBadge = this.getStatusBadge(budget.status);
            const formattedDate = new Date(budget.lastModified).toLocaleDateString();
            
            const cardColors = [
                'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                'linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(245, 87, 108, 0.1) 100%)',
                'linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%)',
                'linear-gradient(135deg, rgba(67, 233, 123, 0.1) 0%, rgba(56, 249, 215, 0.1) 100%)',
                'linear-gradient(135deg, rgba(250, 112, 154, 0.1) 0%, rgba(254, 225, 64, 0.1) 100%)',
                'linear-gradient(135deg, rgba(168, 237, 234, 0.1) 0%, rgba(254, 214, 227, 0.1) 100%)',
                'linear-gradient(135deg, rgba(255, 154, 158, 0.1) 0%, rgba(254, 207, 239, 0.1) 100%)',
                'linear-gradient(135deg, rgba(255, 236, 210, 0.1) 0%, rgba(252, 182, 159, 0.1) 100%)'
            ];
            const cardColor = cardColors[index % cardColors.length];
            
            return `
                <div class="col-12 col-md-6 col-lg-4 mb-3">
                    <div class="card h-100 budget-card border-0 shadow-sm" data-budget-id="${budget.id}" style="cursor: pointer; background: ${cardColor};">
                        <div class="card-header border-0 d-flex justify-content-between align-items-center" style="background: rgba(0, 0, 0, 0.05);">
                            <h6 class="mb-0 text-truncate me-2 fw-bold">${this.escapeHtml(budget.projectName)}</h6>
                            ${statusBadge}
                        </div>
                        <div class="card-body">
                            <p class="card-text mb-2">
                                <strong>Client:</strong><br>
                                <small class="text-muted">${this.escapeHtml(budget.client)}</small>
                            </p>
                            <p class="card-text mb-2">
                                <strong>Address:</strong><br>
                                <small class="text-muted">${this.escapeHtml(budget.address)}</small>
                            </p>
                            <p class="card-text mb-2">
                                <strong>Total Budget:</strong><br>
                                <span class="currency fw-bold text-success">${this.formatCurrency(budget.totalBudget)}</span>
                            </p>
                        </div>
                        <div class="card-footer border-0" style="background: rgba(0, 0, 0, 0.02);">
                            <small class="text-muted">
                                <i class="fas fa-clock me-1"></i>
                                Last modified: ${formattedDate}
                            </small>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        // Add click handlers to budget cards
        container.querySelectorAll('.budget-card').forEach(card => {
            card.addEventListener('click', () => {
                const budgetId = card.dataset.budgetId;
                this.showBudgetViewer(budgetId);
            });
        });
    }
    
    getStatusBadge(status) {
        const badges = {
            'active': '<span class="badge bg-success">Active</span>',
            'planning': '<span class="badge bg-warning">Planning</span>',
            'completed': '<span class="badge bg-primary">Completed</span>'
        };
        return badges[status] || '<span class="badge bg-secondary">Unknown</span>';
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
            
            // Set trade name
            tradeNameSelect.value = trade.name;
            tradeNameSelect.dispatchEvent(new Event('change'));
            
            // Clear default line item
            const lineItemsContainer = tradeDiv.querySelector('.line-items-container');
            lineItemsContainer.innerHTML = '';
            
            // Add line items
            trade.line_items.forEach(item => {
                const lineItem = this.addLineItem(lineItemsContainer, trade.name);
                
                // Populate line item data
                const categorySelect = lineItem.querySelector('.item-category');
                categorySelect.value = item.category;
                lineItem.querySelector('.item-vendor').value = item.vendor;
                lineItem.querySelector('.item-budget').value = item.budget;
                lineItem.querySelector('.item-notes').value = item.notes || '';
            });
        });
        
        // Update button text for edit mode
        const saveButton = document.getElementById('saveNewBudget');
        saveButton.innerHTML = '<i class="fas fa-save me-2"></i>Update Budget';
    }
}

// Initialize the budget viewer when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BudgetViewer();
});
