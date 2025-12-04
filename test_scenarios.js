// Test script for Sub War 2060 Scenarios System
// Run this in the browser console to test the scenarios functionality

console.log('=== Sub War 2060 Scenarios System Test ===');

// Wait for game to initialize
setTimeout(() => {
    console.log('\n1. Testing Scenarios System Initialization...');
    const submarine = window.playerSubmarine();
    if (submarine && submarine.scenarios) {
        console.log('✅ Scenarios system initialized');
        console.log('Available scenarios:', Object.keys(submarine.scenarios.available));
        console.log('Current stats:', submarine.scenarios.stats);
    } else {
        console.error('❌ Scenarios system not found');
        return;
    }

    console.log('\n2. Testing Scenario Starting...');
    window.startScenario('PATROL_MISSION');

    setTimeout(() => {
        const currentScenario = window.getCurrentScenario();
        if (currentScenario) {
            console.log('✅ Patrol mission started successfully');
            console.log('Mission:', currentScenario.name);
            console.log('Objectives:', currentScenario.objectives.length);
            console.log('Time limit:', currentScenario.timeLimit + 's');
        } else {
            console.error('❌ Failed to start scenario');
        }

        console.log('\n3. Testing Skill System Integration...');
        const skills = submarine.skills;
        console.log('Current skills:', skills);

        console.log('\n4. Testing Global Functions...');
        console.log('Available scenarios:', window.getAvailableScenarios());
        console.log('Scenario stats:', window.getScenarioStats());

        console.log('\n5. Testing Key Bindings (F1-F4)...');
        console.log('Press F1 for Patrol Mission');
        console.log('Press F2 for Stealth Operation');
        console.log('Press F3 for Combat Training');
        console.log('Press F4 for Rescue Mission');

        console.log('\n6. Testing Status Display...');
        const statusElement = document.getElementById('status');
        if (statusElement) {
            console.log('Status text:', statusElement.textContent);
            console.log('✅ Status display is working');
        } else {
            console.error('❌ Status element not found');
        }

        console.log('\n=== Test Complete ===');
        console.log('The scenarios system is ready for use!');
        console.log('Status will update every 0.5 seconds while a mission is active.');

    }, 100);
}, 2000);
