const { chromium } = require('playwright');

async function testDepthSpeedBug() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        console.log('🧪 TESTING SUBMARINE SPEED BUG AT CRUSH DEPTH');
        
        // Open game
        await page.goto('file://' + __dirname + '/index.html');
        await page.waitForTimeout(2000);
        
        // Select patrol mission
        await page.click('[data-scenario="PATROL_MISSION"]');
        console.log('✅ Patrol mission selected');
        
        // Wait for game initialization
        await page.waitForTimeout(8000);
        console.log('✅ Game initialized - waiting for submarine to be fully loaded');
        
        // Take initial screenshot
        await page.screenshot({ path: 'speed_bug_test_1_initial.png', fullPage: true });
        
        // Go to full speed
        console.log('🚀 Setting submarine to full speed...');
        for (let i = 0; i < 10; i++) {
            await page.keyboard.press('ArrowUp');
            await page.waitForTimeout(100);
        }
        
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'speed_bug_test_2_full_speed.png', fullPage: true });
        
        // Check current speed and dive deep to trigger crush depth
        const subState1 = await page.evaluate(() => {
            const sub = window.playerSubmarine;
            if (!sub) return { error: 'No submarine found' };
            if (!sub.mesh) return { error: 'Submarine mesh not loaded' };
            
            return {
                currentSpeed: sub.speed || 0,
                maxSpeed: sub.maxSpeed || 'N/A',
                depth: Math.abs(sub.mesh.position.y) || 0,
                crushDepth: sub.maxDepth || 'N/A',
                engineHP: sub.systems?.engines?.hp || 'N/A',
                engineMaxHP: sub.systems?.engines?.maxHP || 'N/A',
                effectiveMaxSpeed: sub.effectiveMaxSpeed || 'N/A'
            };
        });
        
        console.log('Initial submarine state:', subState1);
        
        // Dive deep to trigger crush depth
        console.log('🌊 Diving to crush depth...');
        for (let i = 0; i < 20; i++) {
            await page.keyboard.press('s');
            await page.waitForTimeout(100);
        }
        
        // Wait for crush depth effects
        await page.waitForTimeout(5000);
        await page.screenshot({ path: 'speed_bug_test_3_at_crush_depth.png', fullPage: true });
        
        // Check submarine state at crush depth
        const subState2 = await page.evaluate(() => {
            const sub = window.playerSubmarine;
            return {
                currentSpeed: sub ? sub.speed : 'N/A',
                maxSpeed: sub ? sub.maxSpeed : 'N/A',
                depth: sub ? Math.abs(sub.mesh.position.y) : 'N/A',
                crushDepth: sub ? sub.maxDepth : 'N/A',
                engineHP: sub ? sub.systems.engines.hp : 'N/A',
                engineMaxHP: sub ? sub.systems.engines.maxHP : 'N/A',
                effectiveMaxSpeed: sub ? sub.effectiveMaxSpeed : 'N/A',
                depthGaugeColor: document.querySelector('.depth-current') ? 
                    window.getComputedStyle(document.querySelector('.depth-current')).color : 'N/A'
            };
        });
        
        console.log('Submarine state at crush depth:', subState2);
        
        // Try to slow down
        console.log('🛑 Attempting to slow down...');
        for (let i = 0; i < 15; i++) {
            await page.keyboard.press('ArrowDown');
            await page.waitForTimeout(100);
        }
        
        await page.waitForTimeout(3000);
        await page.screenshot({ path: 'speed_bug_test_4_trying_to_slow.png', fullPage: true });
        
        // Check final state
        const subState3 = await page.evaluate(() => {
            const sub = window.playerSubmarine;
            return {
                currentSpeed: sub ? sub.speed : 'N/A',
                targetSpeed: sub ? sub.targetSpeed : 'N/A',
                currentThrust: sub ? sub.currentThrust : 'N/A',
                maxSpeed: sub ? sub.maxSpeed : 'N/A',
                effectiveMaxSpeed: sub ? sub.effectiveMaxSpeed : 'N/A',
                engineEfficiency: sub ? 
                    (sub.systems.engines.hp / sub.systems.engines.maxHP) : 'N/A',
                isSpeedStuck: sub ? 
                    (Math.abs(sub.speed) > 50 && sub.targetSpeed < 10) : false
            };
        });
        
        console.log('Final submarine state after trying to slow down:', subState3);
        
        // Test result
        if (subState3.isSpeedStuck) {
            console.log('🐛 BUG CONFIRMED: Submarine is stuck at high speed despite low target speed');
            console.log(`   Current Speed: ${subState3.currentSpeed}`);
            console.log(`   Target Speed: ${subState3.targetSpeed}`);
            console.log(`   Engine Efficiency: ${(subState3.engineEfficiency * 100).toFixed(1)}%`);
        } else {
            console.log('✅ No speed bug detected');
        }
        
        console.log('🎯 Speed bug test complete - check screenshots for visual confirmation');
        
    } catch (error) {
        console.error('Test error:', error);
        await page.screenshot({ path: 'speed_bug_test_error.png', fullPage: true });
    } finally {
        await browser.close();
    }
}

testDepthSpeedBug();