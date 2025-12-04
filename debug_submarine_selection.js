// Debug script to check submarine selection options
const { chromium } = require('playwright');

async function debugSubmarineSelection() {
    console.log('🔍 Debugging submarine selection options...');

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        // Navigate to the game
        await page.goto('http://localhost:8000');
        await page.waitForTimeout(3000);

        // Wait for scenario overlay
        await page.waitForSelector('#scenarioOverlay', { timeout: 5000 });

        // Check what scenarios are available
        const scenarios = await page.evaluate(() => {
            const cards = document.querySelectorAll('.scenario-card');
            return Array.from(cards).map(card => ({
                scenario: card.getAttribute('data-scenario'),
                title: card.querySelector('h3')?.textContent,
                classes: card.className
            }));
        });

        console.log('📋 Available scenarios:', scenarios);

        // Click on Combat Training
        await page.click('.scenario-card[data-scenario="COMBAT_TRAINING"]');
        await page.waitForTimeout(1000);

        // Check submarine options after scenario selection
        const submarines = await page.evaluate(() => {
            const cards = document.querySelectorAll('.submarine-card');
            return Array.from(cards).map(card => ({
                submarine: card.getAttribute('data-submarine'),
                maxDepth: card.getAttribute('data-max-depth'),
                name: card.querySelector('.submarine-name')?.textContent,
                disabled: card.classList.contains('disabled'),
                classes: card.className,
                visible: card.style.display !== 'none'
            }));
        });

        console.log('🚢 Available submarines after scenario selection:', submarines);

        // Check if Start Mission button exists
        const startButton = await page.evaluate(() => {
            const btn = document.getElementById('startMissionBtn');
            return {
                exists: !!btn,
                visible: btn ? btn.style.display !== 'none' : false,
                enabled: btn ? !btn.disabled : false,
                text: btn ? btn.textContent : null
            };
        });

        console.log('🚀 Start Mission button:', startButton);

        // Try to find any non-disabled submarine and click it
        const enabledSubmarine = submarines.find(sub => !sub.disabled && sub.visible);
        if (enabledSubmarine) {
            console.log(`🖱️ Clicking enabled submarine: ${enabledSubmarine.name}`);
            await page.click(`.submarine-card[data-submarine="${enabledSubmarine.submarine}"]`);
            await page.waitForTimeout(1000);

            // Check if Start button becomes available
            const updatedStartButton = await page.evaluate(() => {
                const btn = document.getElementById('startMissionBtn');
                return {
                    exists: !!btn,
                    visible: btn ? btn.style.display !== 'none' : false,
                    enabled: btn ? !btn.disabled : false,
                    text: btn ? btn.textContent : null
                };
            });

            console.log('🚀 Start Mission button after submarine selection:', updatedStartButton);

            if (updatedStartButton.exists && updatedStartButton.enabled) {
                console.log('🖱️ Clicking Start Mission button...');
                await page.click('#startMissionBtn');
                await page.waitForTimeout(3000);

                // Check game state after starting
                const gameState = await page.evaluate(() => {
                    return {
                        overlayVisible: document.getElementById('scenarioOverlay').style.display !== 'none',
                        scene: !!(window.gameState && window.gameState.scene),
                        submarine: !!(window.gameState && window.gameState.submarine),
                        terrain: !!window.simpleTerrain,
                        gameStarted: !!window.gameState?.gameStarted
                    };
                });

                console.log('🎮 Game state after mission start:', gameState);
            }
        } else {
            console.log('❌ No enabled submarines found');
        }

        // Keep browser open for manual inspection
        console.log('🔍 Browser kept open for manual inspection. Close manually when done.');
        await page.waitForTimeout(30000); // Wait 30 seconds

    } catch (error) {
        console.error('❌ Debug error:', error);
    } finally {
        await browser.close();
    }
}

debugSubmarineSelection().catch(console.error);