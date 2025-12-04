# Custom Slash Commands for Enhanced Development Workflow

This directory contains custom slash commands that integrate advanced analysis and debugging capabilities into Claude Code, making powerful development tools easily accessible across all projects.

## Available Commands

### 🔍 `/perceive` - Comprehensive Codebase Analysis
**Usage:** `/perceive [optional focus area]`

Executes deep, systematic analysis of the entire codebase using advanced perception methodologies. Provides multi-layered analysis including:
- Codebase structure mapping and architectural patterns
- Code quality assessment and technical debt analysis
- Dependency analysis and security vulnerability detection
- Runtime behavior analysis and performance optimization
- Documentation completeness and consistency evaluation
- Predictive issue modeling and prevention strategies

**Example:**
```
/perceive security
/perceive performance
/perceive
```

### 🐛 `/audit-bugs` - Bug Pattern Analysis
**Usage:** `/audit-bugs [basic|detailed|predictive]`

Analyzes bugs.md and auditor.md to identify patterns and enhance error prevention capabilities:
- Extracts recurring error patterns and root causes
- Reviews and enhances auditor detection rules
- Creates predictive models for potential issues
- Updates prevention strategies and documentation

**Example:**
```
/audit-bugs detailed
/audit-bugs predictive
```

### 📝 `/memory-sync` - Project Memory Management
**Usage:** `/memory-sync [read|create|analyze|sync]`

Comprehensive memory management for tracking project evolution and preserving knowledge:
- Analyzes session patterns across memory files
- Creates new session memory with proper context
- Synchronizes project documentation and insights
- Maintains continuity across development sessions

**Example:**
```
/memory-sync create
/memory-sync analyze
/memory-sync
```

### 🏗️ `/architecture-map` - Architecture Documentation
**Usage:** `/architecture-map [visual|textual|interactive]`

Generates comprehensive architecture documentation with dependency mapping:
- Creates visual dependency diagrams and flow charts
- Documents system boundaries and integration points
- Analyzes scalability and performance characteristics
- Produces living documentation that evolves with code

**Example:**
```
/architecture-map visual
/architecture-map interactive
```

### 🧪 `/test-runner` - Comprehensive Testing
**Usage:** `/test-runner [unit|integration|visual|performance|all]`

Executes automated testing suites with intelligent analysis and reporting:
- Runs unit, integration, visual, and performance tests
- Generates detailed reports with coverage analysis
- Identifies flaky tests and performance regressions
- Integrates results with project quality systems

**Example:**
```
/test-runner performance
/test-runner all
```

### 🎮 `/game-debug` - Game-Specific Debugging
**Usage:** `/game-debug [rendering|controls|physics|ai|performance|all]`

Leverages the Game Perception Agent for comprehensive game analysis:
- Captures and analyzes game screenshots and visual output
- Tests input responsiveness and control calibration
- Validates physics, AI, and performance systems
- Provides game-specific issue detection and reporting

**Example:**
```
/game-debug rendering
/game-debug controls
/game-debug
```

## Command Structure and Implementation

### File Organization
```
.claude/
└── commands/
    ├── README.md                 # This documentation
    ├── perceive.md              # Comprehensive analysis
    ├── audit-bugs.md            # Bug pattern analysis
    ├── memory-sync.md           # Memory management
    ├── architecture-map.md      # Architecture documentation
    ├── test-runner.md           # Testing framework
    └── game-debug.md            # Game debugging
```

### Command Frontmatter Configuration
Each command includes YAML frontmatter with:
- `description`: Brief command explanation shown in `/help`
- `argument-hint`: Parameter guidance for users
- `allowed-tools`: Specific tools the command can access
- `model`: Preferred Claude model for execution

### Integration with Project Systems
Commands integrate with existing project infrastructure:
- **Memory System**: Links with `memory_*.md` files for session tracking
- **Bug Tracking**: Integrates with `bugs.md` for issue management
- **Auditor System**: Enhances `auditor.md` with learned patterns
- **Game Perception**: Leverages `game_perception_agent.js` for game analysis

## Usage Patterns

### Development Workflow Integration
1. **Session Start**: Use `/memory-sync read` to understand current context
2. **Analysis**: Run `/perceive` for comprehensive codebase understanding
3. **Debugging**: Use `/game-debug` for game-specific issues
4. **Testing**: Execute `/test-runner` for quality assurance
5. **Documentation**: Generate `/architecture-map` for documentation updates
6. **Session End**: Use `/memory-sync create` to preserve session insights

### Problem-Solving Workflow
1. **Issue Identification**: Use `/perceive` to understand the problem scope
2. **Pattern Analysis**: Run `/audit-bugs` to check for known patterns
3. **Targeted Debugging**: Use specific commands based on issue type
4. **Validation**: Run `/test-runner` to confirm fixes
5. **Prevention**: Update auditor rules with learned patterns

## Benefits

### Enhanced Productivity
- **Instant Access**: Complex analysis workflows accessible via simple commands
- **Consistent Quality**: Standardized analysis across all development sessions
- **Knowledge Preservation**: Automatic documentation and pattern learning
- **Rapid Debugging**: Game-specific tools for faster issue resolution

### Improved Code Quality
- **Proactive Analysis**: Predictive modeling prevents issues before they occur
- **Comprehensive Coverage**: Multi-dimensional analysis catches subtle problems
- **Continuous Learning**: System improves based on discovered patterns
- **Documentation Sync**: Living documentation stays current with code

### Team Collaboration
- **Shared Tools**: Commands available to all team members
- **Consistent Workflows**: Standardized analysis and debugging procedures
- **Knowledge Sharing**: Captured insights benefit entire team
- **Scalable Quality**: Quality practices scale across projects

## Future Enhancements

### Planned Features
- **Command Chaining**: Ability to chain commands for complex workflows
- **Custom Namespaces**: Project-specific command namespaces
- **Integration APIs**: Hooks for external tool integration
- **Analytics Dashboard**: Visual tracking of command usage and insights

### Extension Points
- **Custom Analyzers**: Add domain-specific analysis capabilities
- **Tool Integrations**: Connect with external development tools
- **Reporting Formats**: Multiple output formats for different audiences
- **Automation Triggers**: Event-driven command execution

This slash command system transforms Claude Code into a comprehensive development environment with advanced analysis capabilities, making complex development tasks accessible through simple, intuitive commands.