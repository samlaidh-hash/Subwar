---
description: Execute game-specific debugging using the Game Perception Agent
argument-hint: [debug-target: rendering|controls|physics|ai|performance|all]
allowed-tools: Read, Bash, Write, Glob
---

# Game-Specific Debugging and Analysis Framework

Leverage the Game Perception Agent for comprehensive game state analysis, visual debugging, and runtime issue detection.

## Debug Target
Focus area: $ARGUMENTS (default: all)

### Game Debugging Capabilities:

#### RENDERING - Visual Rendering Analysis
- Capture game screenshots and analyze visual output
- Detect rendering issues and visual anomalies
- Validate terrain, submarine, and UI rendering
- Identify missing or corrupted visual elements

#### CONTROLS - Input and Control System Analysis
- Test keyboard and mouse input responsiveness
- Validate submarine control sensitivity and calibration
- Analyze movement physics and behavior patterns
- Detect control mapping and dead zone issues

#### PHYSICS - Game Physics Validation
- Monitor submarine movement and positioning
- Validate collision detection and response
- Analyze depth, pressure, and environmental effects
- Test torpedo physics and ballistics

#### AI - AI System Analysis
- Evaluate enemy AI behavior patterns
- Test pathfinding and decision-making systems
- Analyze AI response to player actions
- Validate AI difficulty scaling and balance

#### PERFORMANCE - Runtime Performance Analysis
- Monitor frame rate and rendering performance
- Analyze memory usage and potential leaks
- Identify performance bottlenecks and optimization opportunities
- Test performance under various game conditions

#### ALL - Comprehensive Game Analysis
- Execute all debugging categories systematically
- Generate unified game health report
- Cross-reference issues across game systems
- Provide holistic game quality assessment

### Game Perception Integration:

#### Visual Analysis Engine
- Leverage game_perception_agent.js for screenshot analysis
- Automated color analysis and element detection
- Terrain and submarine presence validation
- UI element visibility and positioning checks

#### Real-time State Monitoring
- Capture live game state data
- Monitor camera positioning and orientation
- Track scene object hierarchy and visibility
- Analyze rendering pipeline health

#### Issue Detection and Reporting
- Automated detection of common game issues
- Pattern recognition for recurring problems
- Predictive modeling for potential failures
- Integration with project bug tracking systems

#### Game-Specific Test Automation
- Execute predefined game scenarios
- Validate core gameplay mechanics
- Test edge cases and boundary conditions
- Generate reproducible test cases for issues

This command bridges traditional debugging with advanced game perception capabilities, providing deep insights into game behavior and enabling rapid issue resolution.