# Sub War 2060 - Error Prevention Auditor

## Active Prevention Rules

### Three.js Integration
- **Rule**: Always check if Three.js scene, camera, and renderer are properly initialized before use
- **Pattern**: Verify `scene`, `camera`, `renderer` exist and are valid objects
- **Prevention**: Add null checks before calling Three.js methods

### Game Loop Management  
- **Rule**: Ensure requestAnimationFrame is properly managed to prevent memory leaks
- **Pattern**: Store animation frame ID and provide cleanup mechanism
- **Prevention**: Always call cancelAnimationFrame when stopping game

### Modular Architecture
- **Rule**: Each JS module should have clear separation of concerns
- **Pattern**: HTML calls JS functions, JS doesn't manipulate DOM directly except through defined interfaces
- **Prevention**: Establish clear API boundaries between modules

### Resource Management
- **Rule**: Dispose of Three.js objects when no longer needed
- **Pattern**: Call dispose() on geometries, materials, textures
- **Prevention**: Implement cleanup functions for each game object type

## Error Detection Patterns

### Common Three.js Errors
- Undefined scene/camera/renderer objects
- Missing texture/geometry disposal
- Incorrect camera positioning causing blank screen
- WebGL context loss handling

### Game Logic Errors  
- Division by zero in physics calculations
- Null reference errors in game object interactions
- Incorrect state management between game modes
- Input handling race conditions

### Performance Issues
- Excessive object creation in animation loops
- Missing frame rate limiting
- Memory leaks from undisposed resources
- Inefficient collision detection algorithms

## Audit Checklist
Before implementing new features:
- [ ] Check bugs.md for similar past issues
- [ ] Verify Three.js object lifecycle management
- [ ] Test null/undefined edge cases
- [ ] Confirm proper resource cleanup
- [ ] Validate input handling robustness
- [ ] Review performance implications