/**
 * Intelligent Agent Integration Layer
 *
 * This module provides the integration between the Intelligent Code Agent
 * and the Claude Code tools (Glob, Grep, Read, etc.)
 */

class AgentToolIntegration {
    constructor() {
        this.agent = new IntelligentCodeAgent();
        this.toolResults = new Map();
        this.activeSearches = new Set();
    }

    /**
     * Main entry point for intelligent code assistance
     */
    async intelligentAssist(userRequest, options = {}) {
        console.log(`🤖 Intelligent Agent Processing: "${userRequest}"`);

        try {
            // Process request through agent
            const result = await this.agent.processRequest(userRequest);

            // Execute recommended searches
            const executionResults = await this.executeRecommendations(result);

            // Combine and format results
            return this.formatResults(result, executionResults);

        } catch (error) {
            console.error('Agent processing error:', error);
            return this.fallbackSearch(userRequest);
        }
    }

    /**
     * Execute the agent's recommendations using actual tools
     */
    async executeRecommendations(agentResult) {
        const results = {
            files: [],
            patterns: [],
            insights: [],
            visualAnalysis: []
        };

        // Execute Phase 1: High-confidence file reads
        if (agentResult.suggestions.likelyFiles.length > 0) {
            console.log('📁 Reading predicted files...');

            for (const file of agentResult.suggestions.likelyFiles.slice(0, 3)) {
                try {
                    const content = await this.readFileWithTool(file.path);
                    results.files.push({
                        path: file.path,
                        content: content,
                        confidence: file.confidence,
                        source: 'prediction'
                    });
                } catch (error) {
                    console.log(`❌ File not found: ${file.path}`);
                }
            }
        }

        // Execute Phase 2: Pattern searches (if needed)
        if (results.files.length < 2 && agentResult.suggestions.searchPatterns.length > 0) {
            console.log('🔍 Executing pattern searches...');

            for (const pattern of agentResult.suggestions.searchPatterns.slice(0, 2)) {
                try {
                    const matches = await this.grepWithTool(pattern.regex, pattern.scope);
                    results.patterns.push({
                        pattern: pattern.regex,
                        matches: matches,
                        confidence: pattern.confidence
                    });
                } catch (error) {
                    console.log(`❌ Pattern search failed: ${pattern.regex}`);
                }
            }
        }

        // Execute Phase 3: Exploratory searches (if still needed)
        if (results.files.length === 0 && results.patterns.length === 0) {
            console.log('🌐 Performing exploratory search...');
            const exploratoryResults = await this.exploratorySearch(agentResult.context);
            results.files.push(...exploratoryResults);
        }

        return results;
    }

    /**
     * Format and present results to user
     */
    formatResults(agentResult, executionResults) {
        const formatted = {
            summary: this.generateSummary(agentResult, executionResults),
            recommendations: this.generateRecommendations(agentResult),
            files: executionResults.files,
            patterns: executionResults.patterns,
            nextSteps: agentResult.nextSteps,
            visualMappings: agentResult.suggestions.visualMappings
        };

        return formatted;
    }

    /**
     * Generate summary of findings
     */
    generateSummary(agentResult, executionResults) {
        const filesFound = executionResults.files.length;
        const patternsFound = executionResults.patterns.reduce((sum, p) => sum + p.matches.length, 0);

        return {
            requestType: agentResult.context.type,
            filesAnalyzed: filesFound,
            patternsMatched: patternsFound,
            confidence: this.calculateOverallConfidence(executionResults),
            framework: agentResult.context.framework
        };
    }

    /**
     * Generate actionable recommendations
     */
    generateRecommendations(agentResult) {
        const recommendations = [];

        // File-based recommendations
        agentResult.suggestions.likelyFiles.forEach(file => {
            if (file.confidence > 0.7) {
                recommendations.push({
                    type: 'file_read',
                    action: `Read ${file.path}`,
                    confidence: file.confidence,
                    reason: 'High-confidence prediction based on request pattern'
                });
            }
        });

        // Pattern-based recommendations
        agentResult.suggestions.searchPatterns.forEach(pattern => {
            if (pattern.confidence > 0.6) {
                recommendations.push({
                    type: 'pattern_search',
                    action: `Search for pattern: ${pattern.regex}`,
                    confidence: pattern.confidence,
                    reason: 'Relevant pattern identified from context'
                });
            }
        });

        // Visual analysis recommendations
        if (agentResult.suggestions.visualMappings.length > 0) {
            recommendations.push({
                type: 'visual_analysis',
                action: 'Analyze screenshot-to-code mappings',
                confidence: 0.8,
                reason: 'Visual elements detected that map to code components'
            });
        }

        return recommendations;
    }

    /**
     * Calculate overall confidence in results
     */
    calculateOverallConfidence(results) {
        if (results.files.length === 0 && results.patterns.length === 0) {
            return 0.1;
        }

        let totalConfidence = 0;
        let totalItems = 0;

        results.files.forEach(file => {
            totalConfidence += file.confidence || 0.5;
            totalItems++;
        });

        results.patterns.forEach(pattern => {
            totalConfidence += pattern.confidence || 0.5;
            totalItems++;
        });

        return totalItems > 0 ? totalConfidence / totalItems : 0.3;
    }

    /**
     * Fallback search when agent fails
     */
    async fallbackSearch(userRequest) {
        console.log('🔄 Falling back to basic search...');

        const keywords = this.extractBasicKeywords(userRequest);
        const results = {
            summary: { requestType: 'fallback', filesAnalyzed: 0, confidence: 0.3 },
            files: [],
            patterns: [],
            recommendations: [],
            nextSteps: ['Try more specific search terms', 'Check file locations manually']
        };

        // Basic keyword search
        for (const keyword of keywords.slice(0, 2)) {
            try {
                const matches = await this.grepWithTool(keyword, '**/*.js');
                if (matches.length > 0) {
                    results.patterns.push({
                        pattern: keyword,
                        matches: matches,
                        confidence: 0.4
                    });
                }
            } catch (error) {
                console.log(`❌ Basic search failed for: ${keyword}`);
            }
        }

        return results;
    }

    /**
     * Exploratory search when predictions fail
     */
    async exploratorySearch(context) {
        const results = [];

        try {
            // Search main game files
            const mainFiles = ['index.html', 'js/submarine.js', 'test.html'];

            for (const file of mainFiles) {
                try {
                    const content = await this.readFileWithTool(file);
                    results.push({
                        path: file,
                        content: content,
                        confidence: 0.6,
                        source: 'exploratory'
                    });
                } catch (error) {
                    // File doesn't exist, continue
                }
            }

            // If still no results, try broader search
            if (results.length === 0) {
                const htmlFiles = await this.globWithTool('**/*.html');
                for (const file of htmlFiles.slice(0, 3)) {
                    try {
                        const content = await this.readFileWithTool(file);
                        results.push({
                            path: file,
                            content: content,
                            confidence: 0.4,
                            source: 'broad_search'
                        });
                    } catch (error) {
                        // Continue to next file
                    }
                }
            }

        } catch (error) {
            console.log('❌ Exploratory search failed:', error);
        }

        return results;
    }

    /**
     * Extract basic keywords from user request
     */
    extractBasicKeywords(request) {
        const text = request.toLowerCase();
        const keywords = [];

        // Common code-related terms
        const codeTerms = text.match(/\b(function|class|method|variable|component|submarine|torpedo|three\.js|canvas|test)\b/g);
        if (codeTerms) keywords.push(...codeTerms);

        // File extensions
        const fileTerms = text.match(/\b\w+\.(js|html|css|json)\b/g);
        if (fileTerms) keywords.push(...fileTerms);

        // Camel case or underscore terms
        const complexTerms = text.match(/\b[a-z][a-zA-Z]*[A-Z][a-zA-Z]*\b|\b\w+_\w+\b/g);
        if (complexTerms) keywords.push(...complexTerms);

        return [...new Set(keywords)];
    }

    // Tool integration methods - these need to be connected to actual tools

    /**
     * Integration with Read tool
     */
    async readFileWithTool(filePath) {
        // This should call the actual Read tool
        // For now, return a placeholder
        throw new Error(`Tool integration needed: Read ${filePath}`);
    }

    /**
     * Integration with Grep tool
     */
    async grepWithTool(pattern, scope = '**/*') {
        // This should call the actual Grep tool
        // For now, return a placeholder
        throw new Error(`Tool integration needed: Grep "${pattern}" in ${scope}`);
    }

    /**
     * Integration with Glob tool
     */
    async globWithTool(pattern) {
        // This should call the actual Glob tool
        // For now, return a placeholder
        throw new Error(`Tool integration needed: Glob "${pattern}"`);
    }

    /**
     * Smart screenshot analysis
     */
    async analyzeScreenshots() {
        try {
            // Look for screenshot files in current directory
            const screenshots = await this.globWithTool('*.png');

            const analysis = {
                found: screenshots.length,
                files: screenshots,
                mappings: []
            };

            // Analyze each screenshot
            for (const screenshot of screenshots.slice(0, 3)) {
                const mapping = await this.analyzeScreenshotFile(screenshot);
                analysis.mappings.push(mapping);
            }

            return analysis;

        } catch (error) {
            console.log('Screenshot analysis failed:', error);
            return { found: 0, files: [], mappings: [] };
        }
    }

    /**
     * Analyze individual screenshot file
     */
    async analyzeScreenshotFile(screenshotPath) {
        // This would integrate with actual image analysis
        // For now, return pattern-based guesses

        const filename = screenshotPath.toLowerCase();
        const mapping = {
            file: screenshotPath,
            detectedElements: [],
            suggestedFiles: []
        };

        // Pattern-based analysis from filename
        if (filename.includes('submarine')) {
            mapping.suggestedFiles.push('js/submarine.js', 'index.html');
            mapping.detectedElements.push('submarine_model', 'submarine_controls');
        }

        if (filename.includes('minimap') || filename.includes('map')) {
            mapping.suggestedFiles.push('js/submarine.js');
            mapping.detectedElements.push('minimap_canvas', 'navigation_ui');
        }

        if (filename.includes('terrain') || filename.includes('seafloor')) {
            mapping.suggestedFiles.push('js/submarine.js', 'index.html');
            mapping.detectedElements.push('terrain_generation', 'seafloor_rendering');
        }

        if (filename.includes('debug')) {
            mapping.suggestedFiles.push('debug_*.js', 'test_*.html');
            mapping.detectedElements.push('debug_interface', 'development_tools');
        }

        return mapping;
    }
}

// Usage example and API
class SmartCodeAssistant {
    constructor() {
        this.integration = new AgentToolIntegration();
    }

    /**
     * Main API for intelligent code assistance
     */
    async assist(request, options = {}) {
        return await this.integration.intelligentAssist(request, options);
    }

    /**
     * Quick file prediction
     */
    async predictFiles(request) {
        const result = await this.integration.agent.analyzeContext(request);
        const suggestions = await this.integration.agent.generateSuggestions(result);
        return suggestions.likelyFiles;
    }

    /**
     * Visual code mapping
     */
    async mapVisualToCode() {
        return await this.integration.analyzeScreenshots();
    }

    /**
     * Get agent knowledge summary
     */
    getKnowledgeSummary() {
        return {
            framework: this.integration.agent.knowledge.getFramework(),
            recentFiles: this.integration.agent.memory.getRecentFiles(),
            knowledgeSize: this.integration.agent.knowledge.fileMap.size
        };
    }
}

// Export classes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AgentToolIntegration,
        SmartCodeAssistant
    };
} else {
    window.AgentToolIntegration = AgentToolIntegration;
    window.SmartCodeAssistant = SmartCodeAssistant;
}