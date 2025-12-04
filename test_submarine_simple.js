const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false, slowMo: 500 });
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log('=== SUBMARINE MOVEMENT TEST ===');

    // Navigate to game
    await page.goto('http://localhost:8000');
    await page.waitForTimeout(3000);

    // Get initial submarine status
    const initialStatus = await page.evaluate(() => {
        const submarine = window.playerSubmarine ? window.playerSubmarine() : null;
        if (!submarine) return { error: 'No submarine found' };

        return {
            rotation: {
                x: (submarine.mesh.rotation.x * 180 / Math.PI).toFixed(1),
                y: (submarine.mesh.rotation.y * 180 / Math.PI).toFixed(1),
                z: (submarine.mesh.rotation.z * 180 / Math.PI).toFixed(1)
            }
        };
    });

    console.log('Initial submarine rotation (degrees):', initialStatus.rotation);

    // Test mouse right (should turn submarine right - positive Y rotation)
    console.log('\nTesting mouse RIGHT (should turn submarine RIGHT):');
    await page.mouse.move(600, 300);
    await page.waitForTimeout(2000);

    const afterRight = await page.evaluate(() => {
        const submarine = window.playerSubmarine();
        return {
            y_rotation: (submarine.mesh.rotation.y * 180 / Math.PI).toFixed(1)
        };
    });
    console.log('Y rotation after mouse right:', afterRight.y_rotation);

    // Return to center
    await page.mouse.move(400, 300);
    await page.waitForTimeout(1000);

    // Test mouse left (should turn submarine left - negative Y rotation)
    console.log('\nTesting mouse LEFT (should turn submarine LEFT):');
    await page.mouse.move(200, 300);
    await page.waitForTimeout(2000);

    const afterLeft = await page.evaluate(() => {
        const submarine = window.playerSubmarine();
        return {
            y_rotation: (submarine.mesh.rotation.y * 180 / Math.PI).toFixed(1)
        };
    });
    console.log('Y rotation after mouse left:', afterLeft.y_rotation);

    // Return to center
    await page.mouse.move(400, 300);
    await page.waitForTimeout(1000);

    // Test mouse down (should pitch submarine down - positive X rotation)
    console.log('\nTesting mouse DOWN (should pitch submarine DOWN):');
    await page.mouse.move(400, 450);
    await page.waitForTimeout(2000);

    const afterDown = await page.evaluate(() => {
        const submarine = window.playerSubmarine();
        return {
            x_rotation: (submarine.mesh.rotation.x * 180 / Math.PI).toFixed(1)
        };
    });
    console.log('X rotation after mouse down:', afterDown.x_rotation);

    // Return to center
    await page.mouse.move(400, 300);
    await page.waitForTimeout(1000);

    // Test mouse up (should pitch submarine up - negative X rotation)
    console.log('\nTesting mouse UP (should pitch submarine UP):');
    await page.mouse.move(400, 200);
    await page.waitForTimeout(2000);

    const afterUp = await page.evaluate(() => {
        const submarine = window.playerSubmarine();
        return {
            x_rotation: (submarine.mesh.rotation.x * 180 / Math.PI).toFixed(1)
        };
    });
    console.log('X rotation after mouse up:', afterUp.x_rotation);

    console.log('\n=== TEST COMPLETE ===');
    console.log('Expected results:');
    console.log('- Mouse RIGHT should increase Y rotation (positive)');
    console.log('- Mouse LEFT should decrease Y rotation (negative)');
    console.log('- Mouse DOWN should increase X rotation (positive)');
    console.log('- Mouse UP should decrease X rotation (negative)');

    await page.waitForTimeout(5000);
    await browser.close();
})();
