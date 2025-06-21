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
            
            console.log('Budget data loaded successfully:', this.budgetData);
        } catch (error) {
            console.error('Error loading budget data:', error);
            this.showError(`Failed to load budget: ${filename}`);
            throw error;
        }
    }
    
    renderBudget() {
        if (!this.budgetData || !this.budgetData.project) {
            console.error('No budget data available:', this.budgetData);
            this.showError('No budget data available');
            return;
        }

        console.log('Rendering budget with data:', this.budgetData);
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
        if (!tradeSectionsContainer) {
            console.error('Trade sections container not found');
            return;
        }
        
        tradeSectionsContainer.innerHTML = '';
        
        const trades = this.budgetData.trades;
        if (!trades || Object.keys(trades).length === 0) {
            tradeSectionsContainer.innerHTML = '<div class="alert alert-info">No trade sections found.</div>';
            return;
        }

        console.log('Rendering trades:', trades);
        
        Object.entries(trades).forEach(([tradeKey, trade]) => {
            const lineItems = trade.lineItems || trade.line_items || [];
            if (lineItems.length === 0) {
                return; // Skip trades with no line items
            }
            
            const tradeSection = this.createTradeSection(tradeKey, trade);
            tradeSectionsContainer.appendChild(tradeSection);
        });
    }
    
    createTradeSection(tradeKey, trade) {
        const lineItems = trade.lineItems || trade.line_items || [];
        const subtotal = this.calculateTradeSubtotal(lineItems);
        
        console.log('Creating trade section for:', tradeKey, trade, lineItems);
        
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'trade-section card mb-3';
        sectionDiv.innerHTML = `
            <div class="card-header">
                <div class="d-flex justify-content-between align-items-center">
                    <h4 class="mb-0">
                        <button class="btn btn-link text-decoration-none p-0 text-start trade-toggle" 
                                type="button" data-trade="${tradeKey}">
                            <i class="fas fa-chevron-down me-2 trade-icon"></i>
                            ${this.escapeHtml(trade.name || tradeKey)}
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
                ${lineItems.map(item => this.createLineItemHTML(item)).join('')}
                <hr class="my-3">
                <div class="row">
                    <div class="col">
                        <strong>Subtotal: ${this.escapeHtml(trade.name || tradeKey)}</strong>
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
        
        // Removed step-by-step and test data functionality
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
            // Handle different filename formats
            let filename = budget.filename;
            if (filename.startsWith('static/')) {
                filename = filename.substring(7); // Remove 'static/' prefix
            }
            
            await this.loadBudgetData(filename);
            document.getElementById('pageTitle').textContent = `Budget: ${budget.projectName}`;
            document.getElementById('dashboard').classList.add('d-none');
            document.getElementById('newBudgetForm').classList.add('d-none');
            document.getElementById('budgetContent').classList.remove('d-none');
            document.getElementById('backToDashboard').classList.remove('d-none');
            document.getElementById('editBudgetBtn').classList.remove('d-none');
            document.getElementById('exportPdfBtn').classList.remove('d-none');
            this.renderBudget();
        } catch (error) {
            console.error('Error loading budget:', error);
            this.showError('Failed to load budget: ' + error.message);
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
    
        // Project templates with realistic data
        
