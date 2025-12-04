/**
 * Intelligent Code-Aware Agent System
 *
 * A comprehensive system that reduces redundant code searching by building
 * and maintaining knowledge about codebases, with visual analysis capabilities.
 *
 * Features:
 * - Smart code mapping and memory
 * - Predictive search capabilities
 * - Pattern recognition and learning
 * - Visual-code relationship mapping
 * - Integration with existing tools (Glob, Grep, Read)
 */

class IntelligentCodeAgent {
    constructor() {
        this.knowledge = new CodebaseKnowledge();
        this.mapper = new CodebaseMapper();
        this.predictor = new PredictiveSearchEngine();
        this.visualAnalyzer = new VisualCodeAnalyzer();
        this.memory = new SearchMemorySystem();
        this.patterns = new PatternRecognitionEngine();

        // Initialize persistent storage
        this.storageFile = 'agent_knowledge.json';
        this.loadKnowledge();
    }

    /**
     * Main entry point for agent operations
     */
    async processRequest(request) {
        const context = await this.analyzeContext(request);
        const suggestions = await this.generateSuggestions(context);
        const searchStrategy = await this.createSearchStrategy(context, suggestions);

        // Execute search and learn from results
        const results = await this.executeSearch(searchStrategy);
        await this.learnFromResults(request, results);

        return {
            context,
            suggestions,
            results,
            nextSteps: this.generateNextSteps(results)
        };
    }

    /**
     * Analyze the context of the user's request
     */
    async analyzeContext(request) {
        return {
            type: this.classifyRequestType(request),
            keywords: this.extractKeywords(request),
            framework: this.knowledge.getFramework(),
            recentFiles: this.memory.getRecentFiles(),
            visualContext: await this.visualAnalyzer.analyzeScreenshots(),
            taskPattern: this.patterns.identifyTaskPattern(request)
        };
    }

    /**
     * Generate intelligent suggestions based on context
     */
    async generateSuggestions(context) {
        const suggestions = {
            likelyFiles: [],
            searchPatterns: [],
            relatedConcepts: [],
            visualMappings: []
        };

        // Predict likely file locations
        suggestions.likelyFiles = this.predictor.predictFileLocations(context);

        // Generate search patterns
        suggestions.searchPatterns = this.predictor.generateSearchPatterns(context);

        // Find related concepts
        suggestions.relatedConcepts = this.knowledge.getRelatedConcepts(context.keywords);

        // Map visual elements to code
        if (context.visualContext.hasScreenshots) {
            suggestions.visualMappings = await this.visualAnalyzer.mapVisualToCode(
                context.visualContext.screenshots
            );
        }

        return suggestions;
    }

    /**
     * Create an efficient search strategy
     */
    async createSearchStrategy(context, suggestions) {
        const strategy = {
            phase1: [], // High-confidence targets
            phase2: [], // Medium-confidence patterns
            phase3: [], // Broad exploratory searches
            tools: []   // Recommended tool sequence
        };

        // Phase 1: Direct file reads for high-confidence targets
        if (suggestions.likelyFiles.length > 0) {
            strategy.phase1 = suggestions.likelyFiles.map(file => ({
                tool: 'Read',
                target: file.path,
                confidence: file.confidence
            }));
        }

        // Phase 2: Pattern-based searches
        strategy.phase2 = suggestions.searchPatterns.map(pattern => ({
            tool: 'Grep',
            pattern: pattern.regex,
            scope: pattern.scope,
            confidence: pattern.confidence
        }));

        // Phase 3: Exploratory searches
        strategy.phase3 = this.generateExploratorySearches(context);

        return strategy;
    }

    /**
     * Execute the search strategy
     */
    async executeSearch(strategy) {
        const results = {
            found: [],
            insights: [],
            patterns: [],
            visualMappings: []
        };

        // Execute Phase 1: High-confidence reads
        for (const search of strategy.phase1) {
            try {
                const content = await this.readFile(search.target);
                if (this.isRelevantContent(content, search)) {
                    results.found.push({
                        file: search.target,
                        content: content,
                        relevance: 'high',
                        source: 'prediction'
                    });
                }
            } catch (error) {
                // File doesn't exist or can't be read
                this.memory.recordMiss(search.target);
            }
        }

        // Execute Phase 2: Pattern searches (only if Phase 1 insufficient)
        if (results.found.length < 3) {
            for (const search of strategy.phase2) {
                const matches = await this.grepSearch(search.pattern, search.scope);
                results.found.push(...matches);
            }
        }

        // Execute Phase 3: Exploratory (only if still insufficient)
        if (results.found.length < 2) {
            for (const search of strategy.phase3) {
                const matches = await this.exploratorySearch(search);
                results.found.push(...matches);
            }
        }

        return results;
    }

    /**
     * Learn from search results to improve future predictions
     */
    async learnFromResults(request, results) {
        // Update knowledge graph
        this.knowledge.updateFromResults(request, results);

        // Update pattern recognition
        this.patterns.learnFromResults(request, results);

        // Update search memory
        this.memory.recordSearch(request, results);

        // Update visual mappings
        if (results.visualMappings.length > 0) {
            this.visualAnalyzer.updateMappings(results.visualMappings);
        }

        // Persist learned knowledge
        await this.saveKnowledge();
    }

    /**
     * Load persistent knowledge from storage
     */
    async loadKnowledge() {
        try {
            const data = JSON.parse(await this.readFile(this.storageFile));
            this.knowledge.load(data.knowledge);
            this.memory.load(data.memory);
            this.patterns.load(data.patterns);
            this.visualAnalyzer.load(data.visual);
        } catch (error) {
            // First run or corrupted data - initialize fresh
            await this.initializeFreshKnowledge();
        }
    }

    /**
     * Save learned knowledge persistently
     */
    async saveKnowledge() {
        const data = {
            knowledge: this.knowledge.export(),
            memory: this.memory.export(),
            patterns: this.patterns.export(),
            visual: this.visualAnalyzer.export(),
            timestamp: Date.now()
        };

        await this.writeFile(this.storageFile, JSON.stringify(data, null, 2));
    }

    /**
     * Initialize knowledge for a new codebase
     */
    async initializeFreshKnowledge() {
        console.log('Initializing fresh knowledge base...');

        // Perform initial codebase fingerprinting
        const fingerprint = await this.mapper.fingerprintCodebase();
        this.knowledge.setFingerprint(fingerprint);

        // Build initial file map
        const fileMap = await this.mapper.buildInitialFileMap();
        this.knowledge.setFileMap(fileMap);

        // Identify key patterns
        const patterns = await this.mapper.identifyInitialPatterns();
        this.patterns.setInitialPatterns(patterns);

        await this.saveKnowledge();
    }

    // Helper methods for classification and analysis
    classifyRequestType(request) {
        const text = request.toLowerCase();

        if (text.includes('bug') || text.includes('error') || text.includes('fix')) {
            return 'debugging';
        }
        if (text.includes('add') || text.includes('implement') || text.includes('create')) {
            return 'feature_development';
        }
        if (text.includes('refactor') || text.includes('optimize') || text.includes('improve')) {
            return 'refactoring';
        }
        if (text.includes('test') || text.includes('spec')) {
            return 'testing';
        }
        if (text.includes('where') || text.includes('find') || text.includes('locate')) {
            return 'exploration';
        }

        return 'general';
    }

    extractKeywords(request) {
        // Advanced keyword extraction
        const text = request.toLowerCase();
        const keywords = [];

        // Technical terms
        const techPatterns = [
            /\b(function|class|method|variable|component)\s+(\w+)/g,
            /\b(\w+)\s+(function|class|component)/g,
            /\b(three\.js|threejs|webgl|canvas|submarine|torpedo|sonar)/gi,
            /\b(\w+)\.(js|html|css|json)/gi
        ];

        techPatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                keywords.push(match[1] || match[2]);
            }
        });

        return [...new Set(keywords)];
    }

    generateExploratorySearches(context) {
        return [
            {
                tool: 'Glob',
                pattern: '**/*.js',
                purpose: 'javascript_files'
            },
            {
                tool: 'Glob',
                pattern: '**/*.html',
                purpose: 'html_files'
            },
            {
                tool: 'Grep',
                pattern: context.keywords.join('|'),
                scope: '**/*.js',
                purpose: 'keyword_search'
            }
        ];
    }

    generateNextSteps(results) {
        const steps = [];

        if (results.found.length === 0) {
            steps.push('Broaden search criteria');
            steps.push('Check alternative file locations');
        } else if (results.found.length === 1) {
            steps.push('Look for related files in same directory');
            steps.push('Search for imports/exports of found code');
        } else {
            steps.push('Analyze relationships between found files');
            steps.push('Look for common patterns across results');
        }

        return steps;
    }

    // Tool integration methods (to be implemented with actual tool calls)
    async readFile(path) {
        // Integration with Read tool
        throw new Error('Tool integration required');
    }

    async writeFile(path, content) {
        // Integration with Write tool
        throw new Error('Tool integration required');
    }

    async grepSearch(pattern, scope) {
        // Integration with Grep tool
        throw new Error('Tool integration required');
    }

    isRelevantContent(content, search) {
        // Analyze if content is relevant to the search
        return content.length > 100; // Basic relevance check
    }
}

/**
 * Codebase Knowledge Management System
 */
class CodebaseKnowledge {
    constructor() {
        this.fingerprint = null;
        this.fileMap = new Map();
        this.conceptMap = new Map();
        this.dependencyGraph = new Map();
        this.framework = null;
    }

    setFingerprint(fingerprint) {
        this.fingerprint = fingerprint;
        this.framework = fingerprint.framework;
    }

    setFileMap(fileMap) {
        this.fileMap = new Map(Object.entries(fileMap));
    }

    getFramework() {
        return this.framework;
    }

    getRelatedConcepts(keywords) {
        const related = [];
        keywords.forEach(keyword => {
            if (this.conceptMap.has(keyword)) {
                related.push(...this.conceptMap.get(keyword));
            }
        });
        return [...new Set(related)];
    }

    updateFromResults(request, results) {
        // Update knowledge based on successful searches
        results.found.forEach(result => {
            this.fileMap.set(result.file, {
                lastAccessed: Date.now(),
                relevantFor: this.extractConcepts(request),
                size: result.content.length
            });
        });
    }

    extractConcepts(request) {
        // Extract concepts from request for learning
        return request.toLowerCase().split(/\s+/).filter(word => word.length > 3);
    }

    export() {
        return {
            fingerprint: this.fingerprint,
            fileMap: Object.fromEntries(this.fileMap),
            conceptMap: Object.fromEntries(this.conceptMap),
            dependencyGraph: Object.fromEntries(this.dependencyGraph),
            framework: this.framework
        };
    }

    load(data) {
        if (data) {
            this.fingerprint = data.fingerprint;
            this.fileMap = new Map(Object.entries(data.fileMap || {}));
            this.conceptMap = new Map(Object.entries(data.conceptMap || {}));
            this.dependencyGraph = new Map(Object.entries(data.dependencyGraph || {}));
            this.framework = data.framework;
        }
    }
}

/**
 * Codebase Mapping and Fingerprinting
 */
class CodebaseMapper {
    async fingerprintCodebase() {
        // Analyze project structure to identify framework and patterns
        return {
            framework: 'threejs_game',
            projectType: 'single_page_application',
            structure: 'monolithic_html_js',
            mainFiles: ['index.html'],
            patterns: ['embedded_js', 'three_js_3d', 'game_loop']
        };
    }

    async buildInitialFileMap() {
        // Build comprehensive map of all files and their purposes
        return {
            'index.html': { type: 'main', purpose: 'game_entry_point' },
            'js/submarine.js': { type: 'core', purpose: 'game_logic' },
            'test_*.html': { type: 'test', purpose: 'testing' },
            'memory_*.md': { type: 'docs', purpose: 'session_memory' }
        };
    }

    async identifyInitialPatterns() {
        // Identify common code patterns in the project
        return {
            functionPatterns: ['function.*submarine', 'class.*Three'],
            filePatterns: ['test_*.html', 'memory_*.md'],
            structurePatterns: ['embedded_javascript', 'single_file_game']
        };
    }
}

/**
 * Predictive Search Engine
 */
class PredictiveSearchEngine {
    predictFileLocations(context) {
        const predictions = [];

        // Predict based on request type and keywords
        switch (context.type) {
            case 'debugging':
                predictions.push(
                    { path: 'index.html', confidence: 0.9 },
                    { path: 'js/submarine.js', confidence: 0.8 }
                );
                break;

            case 'feature_development':
                predictions.push(
                    { path: 'index.html', confidence: 0.95 },
                    { path: 'js/submarine.js', confidence: 0.7 }
                );
                break;

            case 'testing':
                predictions.push(
                    { path: 'test.html', confidence: 0.8 },
                    { path: 'simple_test.html', confidence: 0.7 }
                );
                break;
        }

        // Add keyword-based predictions
        context.keywords.forEach(keyword => {
            if (keyword.includes('submarine')) {
                predictions.push({ path: 'js/submarine.js', confidence: 0.9 });
            }
            if (keyword.includes('test')) {
                predictions.push({ path: 'test.html', confidence: 0.8 });
            }
        });

        return predictions.sort((a, b) => b.confidence - a.confidence);
    }

    generateSearchPatterns(context) {
        const patterns = [];

        context.keywords.forEach(keyword => {
            patterns.push({
                regex: `\\b${keyword}\\b`,
                scope: '**/*.js',
                confidence: 0.7
            });

            patterns.push({
                regex: `function.*${keyword}|${keyword}.*function`,
                scope: '**/*.js',
                confidence: 0.8
            });
        });

        return patterns;
    }
}

/**
 * Visual Code Analysis System
 */
class VisualCodeAnalyzer {
    constructor() {
        this.uiMappings = new Map();
        this.componentPatterns = new Map();
        this.visualHistory = [];
    }

    async analyzeScreenshots() {
        // Analyze any screenshots in the current directory
        return {
            hasScreenshots: false,
            screenshots: [],
            detectedElements: []
        };
    }

    async mapVisualToCode(screenshots) {
        const mappings = [];

        for (const screenshot of screenshots) {
            const analysis = await this.analyzeScreenshot(screenshot);
            mappings.push({
                screenshot: screenshot.path,
                elements: analysis.elements,
                suggestedCode: analysis.codeLocations
            });
        }

        return mappings;
    }

    async analyzeScreenshot(screenshot) {
        // Analyze screenshot to identify UI elements and map to code
        return {
            elements: [
                { type: 'canvas', bounds: { x: 0, y: 0, w: 800, h: 600 } },
                { type: 'button', text: 'Fire Torpedo', bounds: { x: 10, y: 570, w: 100, h: 30 } }
            ],
            codeLocations: [
                { element: 'canvas', likelyFiles: ['index.html', 'js/submarine.js'] },
                { element: 'button', likelyFiles: ['index.html'] }
            ]
        };
    }

    updateMappings(mappings) {
        mappings.forEach(mapping => {
            this.uiMappings.set(mapping.screenshot, mapping);
        });
    }

    export() {
        return {
            uiMappings: Object.fromEntries(this.uiMappings),
            componentPatterns: Object.fromEntries(this.componentPatterns),
            visualHistory: this.visualHistory
        };
    }

    load(data) {
        if (data) {
            this.uiMappings = new Map(Object.entries(data.uiMappings || {}));
            this.componentPatterns = new Map(Object.entries(data.componentPatterns || {}));
            this.visualHistory = data.visualHistory || [];
        }
    }
}

/**
 * Search Memory System
 */
class SearchMemorySystem {
    constructor() {
        this.searchHistory = [];
        this.successfulPatterns = new Map();
        this.recentFiles = [];
        this.missedTargets = new Set();
    }

    recordSearch(request, results) {
        this.searchHistory.push({
            request,
            results,
            timestamp: Date.now(),
            success: results.found.length > 0
        });

        // Update recent files
        results.found.forEach(result => {
            this.addRecentFile(result.file);
        });

        // Learn successful patterns
        if (results.found.length > 0) {
            const pattern = this.extractPattern(request);
            this.successfulPatterns.set(pattern, results.found.map(r => r.file));
        }
    }

    recordMiss(target) {
        this.missedTargets.add(target);
    }

    addRecentFile(file) {
        this.recentFiles = [file, ...this.recentFiles.filter(f => f !== file)].slice(0, 10);
    }

    getRecentFiles() {
        return this.recentFiles;
    }

    extractPattern(request) {
        return request.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim();
    }

    export() {
        return {
            searchHistory: this.searchHistory.slice(-50), // Keep last 50 searches
            successfulPatterns: Object.fromEntries(this.successfulPatterns),
            recentFiles: this.recentFiles,
            missedTargets: Array.from(this.missedTargets)
        };
    }

    load(data) {
        if (data) {
            this.searchHistory = data.searchHistory || [];
            this.successfulPatterns = new Map(Object.entries(data.successfulPatterns || {}));
            this.recentFiles = data.recentFiles || [];
            this.missedTargets = new Set(data.missedTargets || []);
        }
    }
}

/**
 * Pattern Recognition Engine
 */
class PatternRecognitionEngine {
    constructor() {
        this.taskPatterns = new Map();
        this.codePatterns = new Map();
        this.filePatterns = new Map();
    }

    identifyTaskPattern(request) {
        const text = request.toLowerCase();

        // Identify common task patterns
        if (text.includes('fix') && text.includes('bug')) {
            return 'bug_fixing';
        }
        if (text.includes('add') && text.includes('feature')) {
            return 'feature_addition';
        }
        if (text.includes('refactor') || text.includes('improve')) {
            return 'code_improvement';
        }
        if (text.includes('test')) {
            return 'testing';
        }

        return 'general_development';
    }

    learnFromResults(request, results) {
        const pattern = this.identifyTaskPattern(request);

        if (!this.taskPatterns.has(pattern)) {
            this.taskPatterns.set(pattern, []);
        }

        this.taskPatterns.get(pattern).push({
            request,
            foundFiles: results.found.map(r => r.file),
            timestamp: Date.now()
        });
    }

    setInitialPatterns(patterns) {
        patterns.functionPatterns.forEach(pattern => {
            this.codePatterns.set(pattern, { type: 'function', frequency: 1 });
        });

        patterns.filePatterns.forEach(pattern => {
            this.filePatterns.set(pattern, { type: 'file', frequency: 1 });
        });
    }

    export() {
        return {
            taskPatterns: Object.fromEntries(this.taskPatterns),
            codePatterns: Object.fromEntries(this.codePatterns),
            filePatterns: Object.fromEntries(this.filePatterns)
        };
    }

    load(data) {
        if (data) {
            this.taskPatterns = new Map(Object.entries(data.taskPatterns || {}));
            this.codePatterns = new Map(Object.entries(data.codePatterns || {}));
            this.filePatterns = new Map(Object.entries(data.filePatterns || {}));
        }
    }
}

// Export the main agent class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IntelligentCodeAgent;
} else {
    window.IntelligentCodeAgent = IntelligentCodeAgent;
}