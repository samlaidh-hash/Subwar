// Sub War 2060 - Comprehensive Testing Agent
// Uses Playwright to test all game systems and generate detailed feedback

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

class SubWarTestingAgent {
    constructor(page) {
        this.page = page;
        this.testResults = {
            timestamp: new Date().toISOString(),
            gameVersion: 'Sub War 2060 v1.0',
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
            criticalIssues: [],
            warnings: [],
            recommendations: [],
            systemTests: {},
            performanceMetrics: {}
        };
        this.startTime = Date.now();
    }

    async runComprehensiveTest() {
        console.log('🤖 Sub War 2060 Testing Agent Starting...');

        try {
            // Test Suite 1: Game Initialization
            await this.testGameInitialization();

            // Test Suite 2: UI Elements
            await this.testUIElements();

            // Test Suite 3: Terrain and Navigation
            await this.testTerrainNavigation();

            // Test Suite 4: Weapons Systems
            await this.testWeaponsSystems();

            // Test Suite 5: Skill and Reputation Systems
            await this.testRPGSystems();

            // Test Suite 6: Performance and Memory
            await this.testPerformance();

            // Generate comprehensive report
            await this.generateTestReport();

        } catch (error) {
            this.addCriticalIssue('TESTING_FRAMEWORK_ERROR', `Testing framework failed: ${error.message}`);
        }

        console.log('🎯 Testing Complete! Check test_report.html for details.');
        return this.testResults;
    }

    async testGameInitialization() {
        console.log('🚀 Testing Game Initialization...');

        try {
            // Load the game
            await this.page.goto('file://' + path.resolve('./index.html'), {
                waitUntil: 'networkidle',
                timeout: 30000
            });

            // Check for console errors during load
            const consoleErrors = [];
            this.page.on('console', msg => {
                if (msg.type() === 'error') {
                    consoleErrors.push(msg.text());
                }
            });

            // Wait for scenario selection screen
            await this.page.waitForSelector('#scenarioOverlay', { timeout: 10000 });
            this.recordTest('GAME_LOAD', true, 'Game loads and shows scenario selection');

            // Test scenario selection
            await this.page.click('[data-scenario="PATROL_MISSION"]');
            await this.page.waitForTimeout(2000);

            // Check if game world loads
            const canvas = await this.page.$('canvas');
            this.recordTest('CANVAS_PRESENT', !!canvas, 'Three.js canvas is present');

            // Check for critical scripts
            const scriptsLoaded = await this.page.evaluate(() => {
                return {
                    submarine: !!window.playerSubmarineInstance,
                    weapons: !!window.WEAPON_TYPES,
                    skills: !!window.playerSkills,
                    reputation: !!window.reputationSystem,
                    terrain: !!window.simpleTerrain
                };
            });

            Object.entries(scriptsLoaded).forEach(([system, loaded]) => {
                this.recordTest(`SYSTEM_${system.toUpperCase()}_LOADED`, loaded,
                    `${system} system initialized`);
            });

            // Check for console errors
            if (consoleErrors.length > 0) {
                this.addWarning('CONSOLE_ERRORS',
                    `${consoleErrors.length} console errors during initialization`,
                    consoleErrors);
            }

            this.systemTests.initialization = {
                passed: true,
                loadTime: Date.now() - this.startTime,
                consoleErrors: consoleErrors.length
            };

        } catch (error) {
            this.addCriticalIssue('INITIALIZATION_FAILURE',
                `Game failed to initialize: ${error.message}`);
            this.systemTests.initialization = { passed: false, error: error.message };
        }
    }

    async testUIElements() {
        console.log('🎨 Testing UI Elements...');

        try {
            // Test compass visibility and functionality
            const compass = await this.page.$('#compass');
            this.recordTest('COMPASS_PRESENT', !!compass, 'Compass element exists');

            if (compass) {
                const compassVisible = await compass.isVisible();
                this.recordTest('COMPASS_VISIBLE', compassVisible, 'Compass is visible');

                // Test compass needle rotation
                const needleTransform = await this.page.$eval('.compass-needle',
                    el => el.style.transform);
                this.recordTest('COMPASS_NEEDLE_TRANSFORM',
                    needleTransform.includes('rotate'), 'Compass needle has rotation transform');
            }

            // Test HUD elements
            const hudElements = [
                '#reticleHUD',
                '#reticleSpeedBar',
                '#reticleDepthBar',
                '#reticleNoiseIndicator'
            ];

            for (const selector of hudElements) {
                const element = await this.page.$(selector);
                this.recordTest(`HUD_${selector.replace('#', '').toUpperCase()}`,
                    !!element, `HUD element ${selector} exists`);
            }

            // Test SCAV pipper system
            const pipper = await this.page.$('#scavPipper');
            this.recordTest('SCAV_PIPPER_PRESENT', !!pipper, 'SCAV pipper element exists');

            this.systemTests.ui = { passed: true, elementsFound: hudElements.length };

        } catch (error) {
            this.addCriticalIssue('UI_TEST_FAILURE', `UI testing failed: ${error.message}`);
            this.systemTests.ui = { passed: false, error: error.message };
        }
    }

    async testTerrainNavigation() {
        console.log('🗺️ Testing Terrain and Navigation...');

        try {
            // Test submarine positioning
            const submarinePos = await this.page.evaluate(() => {
                if (window.playerSubmarineInstance && window.playerSubmarineInstance.mesh) {
                    const pos = window.playerSubmarineInstance.mesh.position;
                    return { x: pos.x, y: pos.y, z: pos.z };
                }
                return null;
            });

            this.recordTest('SUBMARINE_POSITIONED', !!submarinePos,
                'Submarine has valid position');

            if (submarinePos) {
                // Test if submarine is above terrain (not underground)
                const terrainHeight = await this.page.evaluate((pos) => {
                    if (window.oceanInstance && window.oceanInstance.getSeabedHeight) {
                        return window.oceanInstance.getSeabedHeight(pos.x, pos.z);
                    }
                    return null;
                }, submarinePos);

                if (terrainHeight !== null) {
                    const aboveTerrain = submarinePos.y > terrainHeight;
                    this.recordTest('SUBMARINE_ABOVE_TERRAIN', aboveTerrain,
                        `Submarine (Y:${submarinePos.y.toFixed(1)}) above terrain (Y:${terrainHeight.toFixed(1)})`);
                }
            }

            // Test settlement positioning
            const settlements = await this.page.evaluate(() => {
                if (window.reputationSystem && window.reputationSystem.settlements) {
                    return Object.entries(window.reputationSystem.settlements).map(([name, data]) => ({
                        name,
                        position: data.position,
                        services: data.services
                    }));
                }
                return [];
            });

            this.recordTest('SETTLEMENTS_CONFIGURED', settlements.length > 0,
                `${settlements.length} settlements configured`);

            // Test terrain features
            const terrainFeatures = await this.page.evaluate(() => {
                const features = [];
                if (window.simpleTerrain) {
                    // Test trench shelves
                    const trenchDepth = window.simpleTerrain.getGrandCanyonTrenchDepth ?
                        window.simpleTerrain.getGrandCanyonTrenchDepth(0, 18000) : null;
                    if (trenchDepth) features.push('trench_shelves');

                    // Test seamounts
                    const seamountHeight = window.simpleTerrain.getSeamountHeight ?
                        window.simpleTerrain.getSeamountHeight(4000, 21500) : null;
                    if (seamountHeight) features.push('seamounts');

                    // Test dogfighting terrain
                    const dogfightTerrain = window.simpleTerrain.getDogfightingTerrainHeight ?
                        window.simpleTerrain.getDogfightingTerrainHeight(8000, -5000) : null;
                    if (dogfightTerrain) features.push('dogfighting_terrain');
                }
                return features;
            });

            this.recordTest('TERRAIN_FEATURES', terrainFeatures.length >= 3,
                `Terrain features detected: ${terrainFeatures.join(', ')}`);

            this.systemTests.terrain = {
                passed: true,
                submarinePosition: submarinePos,
                settlements: settlements.length,
                terrainFeatures: terrainFeatures.length
            };

        } catch (error) {
            this.addCriticalIssue('TERRAIN_TEST_FAILURE',
                `Terrain testing failed: ${error.message}`);
            this.systemTests.terrain = { passed: false, error: error.message };
        }
    }

    async testWeaponsSystems() {
        console.log('⚔️ Testing Weapons Systems...');

        try {
            // Test weapon types availability
            const weaponTypes = await this.page.evaluate(() => {
                if (window.WEAPON_TYPES) {
                    return Object.keys(window.WEAPON_TYPES);
                }
                return [];
            });

            const expectedWeapons = [
                'SCAV_ROCKETS', 'SCAV_AUTOCANNON', 'SCAV_GATLING',
                'SCAV_FIELD_GUN', 'SCAV_POINT_DEFENSE', 'WISKR_DRONES'
            ];

            expectedWeapons.forEach(weapon => {
                this.recordTest(`WEAPON_${weapon}`, weaponTypes.includes(weapon),
                    `${weapon} weapon type defined`);
            });

            // Test weapon system initialization
            const weaponSystem = await this.page.evaluate(() => {
                return {
                    hasSystem: !!window.weaponSystem,
                    hasProjectiles: !!window.weaponSystem?.projectiles,
                    submarineWeapons: !!window.playerSubmarineInstance?.weaponSystem
                };
            });

            Object.entries(weaponSystem).forEach(([test, result]) => {
                this.recordTest(`WEAPON_SYS_${test.toUpperCase()}`, result,
                    `Weapon system ${test}`);
            });

            // Test SCAV weapon properties
            const scavWeaponTests = await this.page.evaluate(() => {
                const tests = {};
                if (window.WEAPON_TYPES) {
                    tests.autocannon_convergence = window.WEAPON_TYPES.SCAV_AUTOCANNON?.convergenceDistance === 200;
                    tests.gatling_high_rof = window.WEAPON_TYPES.SCAV_GATLING?.fireRate === 3000;
                    tests.field_gun_range = window.WEAPON_TYPES.SCAV_FIELD_GUN?.range === 500;
                    tests.point_defense_auto = window.WEAPON_TYPES.SCAV_POINT_DEFENSE?.autoTarget === true;
                }
                return tests;
            });

            Object.entries(scavWeaponTests).forEach(([test, result]) => {
                this.recordTest(`SCAV_${test.toUpperCase()}`, result,
                    `SCAV weapon property: ${test}`);
            });

            // Test WISKR drone configuration
            const wiskrTests = await this.page.evaluate(() => {
                const wiskr = window.WEAPON_TYPES?.WISKR_DRONES;
                if (!wiskr) return {};

                return {
                    activation_range: wiskr.activationRange === 300,
                    sonar_range: wiskr.sonarRange === 1000,
                    max_range: wiskr.range === 20000,
                    exclusion_angle: wiskr.sonarExclusionAngle === 90
                };
            });

            Object.entries(wiskrTests).forEach(([test, result]) => {
                this.recordTest(`WISKR_${test.toUpperCase()}`, result,
                    `WISKR drone property: ${test}`);
            });

            this.systemTests.weapons = {
                passed: true,
                weaponTypesFound: weaponTypes.length,
                scavWeaponsConfigured: Object.values(scavWeaponTests).filter(Boolean).length,
                wiskrConfigured: Object.values(wiskrTests).filter(Boolean).length
            };

        } catch (error) {
            this.addCriticalIssue('WEAPONS_TEST_FAILURE',
                `Weapons testing failed: ${error.message}`);
            this.systemTests.weapons = { passed: false, error: error.message };
        }
    }

    async testRPGSystems() {
        console.log('📊 Testing RPG Systems...');

        try {
            // Test pilot skills system
            const skillsSystem = await this.page.evaluate(() => {
                if (!window.playerSkills) return null;

                return {
                    hasSkills: !!window.playerSkills.skills,
                    skillCount: Object.keys(window.playerSkills.skills || {}).length,
                    hasExperience: !!window.playerSkills.experience,
                    expectedSkills: ['piloting', 'gunnery', 'sensors', 'engineering']
                        .every(skill => skill in (window.playerSkills.skills || {}))
                };
            });

            if (skillsSystem) {
                this.recordTest('SKILLS_SYSTEM_INIT', !!skillsSystem.hasSkills,
                    'Pilot skills system initialized');
                this.recordTest('SKILLS_ALL_PRESENT', skillsSystem.expectedSkills,
                    'All four pilot skills present');
                this.recordTest('SKILLS_EXPERIENCE_TRACKING', skillsSystem.hasExperience,
                    'Experience tracking system present');
            }

            // Test reputation system
            const reputationSystem = await this.page.evaluate(() => {
                if (!window.reputationSystem) return null;

                return {
                    hasSettlements: !!window.reputationSystem.settlements,
                    settlementCount: Object.keys(window.reputationSystem.settlements || {}).length,
                    hasFactions: !!window.reputationSystem.factions,
                    factionCount: Object.keys(window.reputationSystem.factions || {}).length,
                    hasCompanies: !!window.reputationSystem.companies,
                    hasUnlocks: !!window.reputationSystem.unlocks
                };
            });

            if (reputationSystem) {
                this.recordTest('REPUTATION_SETTLEMENTS', reputationSystem.settlementCount >= 7,
                    `${reputationSystem.settlementCount} settlements configured`);
                this.recordTest('REPUTATION_FACTIONS', reputationSystem.factionCount >= 5,
                    `${reputationSystem.factionCount} factions configured`);
                this.recordTest('REPUTATION_UNLOCKS', reputationSystem.hasUnlocks,
                    'Technology unlocks system configured');
            }

            // Test campaign system
            const campaignSystem = await this.page.evaluate(() => {
                if (!window.campaignSystem) return null;

                return {
                    hasMissions: !!window.campaignSystem.missions,
                    missionCount: window.campaignSystem.missions?.length || 0,
                    hasNPCs: !!window.campaignSystem.npcs,
                    npcCount: Object.keys(window.campaignSystem.npcs || {}).length,
                    currentMission: window.campaignSystem.currentMission || 0
                };
            });

            if (campaignSystem) {
                this.recordTest('CAMPAIGN_MISSIONS', campaignSystem.missionCount >= 20,
                    `${campaignSystem.missionCount} campaign missions defined`);
                this.recordTest('CAMPAIGN_NPCS', campaignSystem.npcCount >= 4,
                    `${campaignSystem.npcCount} NPCs configured`);
            }

            // Test repair system
            const repairSystem = await this.page.evaluate(() => {
                if (!window.repairSystem) return null;

                return {
                    hasRepairCosts: !!window.repairSystem.repairCosts,
                    hasDamageTracking: typeof window.repairSystem.persistentDamage === 'number',
                    hasUpdateMethod: typeof window.repairSystem.update === 'function'
                };
            });

            if (repairSystem) {
                this.recordTest('REPAIR_SYSTEM_INIT', repairSystem.hasDamageTracking,
                    'Repair system damage tracking initialized');
                this.recordTest('REPAIR_COSTS_CONFIG', repairSystem.hasRepairCosts,
                    'Settlement repair costs configured');
            }

            this.systemTests.rpg = {
                passed: true,
                skillsConfigured: !!skillsSystem?.hasSkills,
                reputationConfigured: !!reputationSystem?.hasSettlements,
                campaignConfigured: !!campaignSystem?.hasMissions,
                repairConfigured: !!repairSystem?.hasDamageTracking
            };

        } catch (error) {
            this.addCriticalIssue('RPG_SYSTEMS_TEST_FAILURE',
                `RPG systems testing failed: ${error.message}`);
            this.systemTests.rpg = { passed: false, error: error.message };
        }
    }

    async testPerformance() {
        console.log('⚡ Testing Performance...');

        try {
            // Measure JavaScript execution time
            const jsMetrics = await this.page.evaluate(() => {
                const start = performance.now();

                // Test performance-intensive operations
                const results = {};

                // Test terrain height calculation performance
                if (window.oceanInstance?.getSeabedHeight) {
                    const terrainStart = performance.now();
                    for (let i = 0; i < 100; i++) {
                        window.oceanInstance.getSeabedHeight(
                            Math.random() * 20000 - 10000,
                            Math.random() * 20000 - 10000
                        );
                    }
                    results.terrainCalcTime = performance.now() - terrainStart;
                }

                // Test weapon system performance
                if (window.WEAPON_TYPES) {
                    const weaponStart = performance.now();
                    for (let i = 0; i < 1000; i++) {
                        Object.keys(window.WEAPON_TYPES);
                    }
                    results.weaponAccessTime = performance.now() - weaponStart;
                }

                results.totalTestTime = performance.now() - start;
                return results;
            });

            // Memory usage estimation
            const memoryInfo = await this.page.evaluate(() => {
                if (performance.memory) {
                    return {
                        usedJSHeapSize: performance.memory.usedJSHeapSize,
                        totalJSHeapSize: performance.memory.totalJSHeapSize,
                        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
                    };
                }
                return null;
            });

            // Frame rate test (approximate)
            const frameRateTest = await this.page.evaluate(() => {
                return new Promise((resolve) => {
                    let frames = 0;
                    const startTime = performance.now();

                    function countFrame() {
                        frames++;
                        if (performance.now() - startTime < 1000) {
                            requestAnimationFrame(countFrame);
                        } else {
                            resolve(frames);
                        }
                    }

                    requestAnimationFrame(countFrame);
                });
            });

            this.performanceMetrics = {
                jsExecution: jsMetrics,
                memoryUsage: memoryInfo,
                approximateFPS: frameRateTest,
                totalTestDuration: Date.now() - this.startTime
            };

            // Performance thresholds
            this.recordTest('PERF_TERRAIN_CALC',
                jsMetrics.terrainCalcTime < 50,
                `Terrain calculations efficient (${jsMetrics.terrainCalcTime?.toFixed(2)}ms for 100 calls)`);

            this.recordTest('PERF_FRAME_RATE',
                frameRateTest > 30,
                `Frame rate acceptable (${frameRateTest} FPS)`);

            if (memoryInfo) {
                const memoryUsageMB = memoryInfo.usedJSHeapSize / (1024 * 1024);
                this.recordTest('PERF_MEMORY_USAGE',
                    memoryUsageMB < 100,
                    `Memory usage reasonable (${memoryUsageMB.toFixed(1)}MB)`);
            }

            this.systemTests.performance = { passed: true, metrics: this.performanceMetrics };

        } catch (error) {
            this.addWarning('PERFORMANCE_TEST_LIMITED',
                `Performance testing limited: ${error.message}`);
            this.systemTests.performance = { passed: false, error: error.message };
        }
    }

    recordTest(testName, passed, description) {
        this.testResults.totalTests++;
        if (passed) {
            this.testResults.passedTests++;
        } else {
            this.testResults.failedTests++;
        }

        console.log(`${passed ? '✅' : '❌'} ${testName}: ${description}`);
    }

    addCriticalIssue(code, description, details = null) {
        this.testResults.criticalIssues.push({
            code,
            description,
            details,
            timestamp: new Date().toISOString()
        });
        console.log(`🚨 CRITICAL: ${code} - ${description}`);
    }

    addWarning(code, description, details = null) {
        this.testResults.warnings.push({
            code,
            description,
            details,
            timestamp: new Date().toISOString()
        });
        console.log(`⚠️ WARNING: ${code} - ${description}`);
    }

    addRecommendation(category, description, priority = 'medium') {
        this.testResults.recommendations.push({
            category,
            description,
            priority,
            timestamp: new Date().toISOString()
        });
    }

    async generateTestReport() {
        const reportHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Sub War 2060 - Test Report</title>
    <style>
        body { font-family: 'Courier New', monospace; margin: 20px; background: #001122; color: #00ffff; }
        .header { border-bottom: 2px solid #00ffff; padding-bottom: 10px; margin-bottom: 20px; }
        .section { margin: 20px 0; padding: 15px; border: 1px solid #004466; background: #001a33; }
        .pass { color: #00ff00; }
        .fail { color: #ff4444; }
        .warning { color: #ffaa00; }
        .metric { margin: 5px 0; }
        .critical { background: #330000; border: 1px solid #ff0000; padding: 10px; margin: 10px 0; }
        .summary { font-size: 18px; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { border: 1px solid #004466; padding: 8px; text-align: left; }
        th { background: #003355; }
        .progress-bar { width: 100%; height: 20px; background: #003355; border: 1px solid #00ffff; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #ff4444, #ffaa00, #00ff00); }
    </style>
</head>
<body>
    <div class="header">
        <h1>🤖 Sub War 2060 Testing Agent Report</h1>
        <p>Generated: ${this.testResults.timestamp}</p>
        <p>Test Duration: ${((Date.now() - this.startTime) / 1000).toFixed(2)} seconds</p>
    </div>

    <div class="section">
        <h2>📊 Test Summary</h2>
        <div class="summary">
            <div class="metric">Total Tests: ${this.testResults.totalTests}</div>
            <div class="metric pass">Passed: ${this.testResults.passedTests}</div>
            <div class="metric fail">Failed: ${this.testResults.failedTests}</div>
            <div class="metric">Success Rate: ${((this.testResults.passedTests / this.testResults.totalTests) * 100).toFixed(1)}%</div>
        </div>
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${(this.testResults.passedTests / this.testResults.totalTests) * 100}%"></div>
        </div>
    </div>

    ${this.testResults.criticalIssues.length > 0 ? `
    <div class="section">
        <h2>🚨 Critical Issues</h2>
        ${this.testResults.criticalIssues.map(issue => `
            <div class="critical">
                <strong>${issue.code}</strong><br>
                ${issue.description}
                ${issue.details ? `<br><pre>${JSON.stringify(issue.details, null, 2)}</pre>` : ''}
            </div>
        `).join('')}
    </div>
    ` : ''}

    ${this.testResults.warnings.length > 0 ? `
    <div class="section">
        <h2>⚠️ Warnings</h2>
        ${this.testResults.warnings.map(warning => `
            <div class="warning">
                <strong>${warning.code}</strong>: ${warning.description}
                ${warning.details ? `<br><pre>${JSON.stringify(warning.details, null, 2)}</pre>` : ''}
            </div>
        `).join('')}
    </div>
    ` : ''}

    <div class="section">
        <h2>🎯 System Test Results</h2>
        <table>
            <tr><th>System</th><th>Status</th><th>Details</th></tr>
            ${Object.entries(this.systemTests).map(([system, results]) => `
                <tr>
                    <td>${system.toUpperCase()}</td>
                    <td class="${results.passed ? 'pass' : 'fail'}">${results.passed ? '✅ PASS' : '❌ FAIL'}</td>
                    <td>${JSON.stringify(results, null, 2)}</td>
                </tr>
            `).join('')}
        </table>
    </div>

    ${this.performanceMetrics ? `
    <div class="section">
        <h2>⚡ Performance Metrics</h2>
        <pre>${JSON.stringify(this.performanceMetrics, null, 2)}</pre>
    </div>
    ` : ''}

    <div class="section">
        <h2>💡 Recommendations</h2>
        ${this.generateRecommendations()}
    </div>
</body>
</html>`;

        fs.writeFileSync(path.resolve('./test_report.html'), reportHTML);
        console.log('📋 Test report generated: test_report.html');
    }

    generateRecommendations() {
        const recommendations = [];

        // Generate automatic recommendations based on test results
        if (this.testResults.criticalIssues.length > 0) {
            recommendations.push({
                priority: 'high',
                category: 'Critical Fixes',
                description: `Address ${this.testResults.criticalIssues.length} critical issues preventing proper game functionality`
            });
        }

        if (this.testResults.failedTests > 0) {
            recommendations.push({
                priority: 'medium',
                category: 'Failed Tests',
                description: `Investigate and fix ${this.testResults.failedTests} failed tests`
            });
        }

        if (this.systemTests.performance && this.performanceMetrics.approximateFPS < 60) {
            recommendations.push({
                priority: 'medium',
                category: 'Performance',
                description: 'Consider optimizing rendering performance for smoother gameplay'
            });
        }

        if (this.testResults.warnings.length > 0) {
            recommendations.push({
                priority: 'low',
                category: 'Warnings',
                description: `Review ${this.testResults.warnings.length} warnings for potential improvements`
            });
        }

        // Add recommendations to results
        this.testResults.recommendations = recommendations;

        return recommendations.map(rec => `
            <div class="metric">
                <strong>${rec.priority.toUpperCase()} - ${rec.category}:</strong> ${rec.description}
            </div>
        `).join('');
    }
}

// Playwright Test Runner
test.describe('Sub War 2060 Comprehensive Testing', () => {
    test('Full System Test', async ({ page }) => {
        const agent = new SubWarTestingAgent(page);
        await agent.runComprehensiveTest();
    });
});

module.exports = { SubWarTestingAgent };