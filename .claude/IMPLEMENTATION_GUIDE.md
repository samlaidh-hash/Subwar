# Claude Code Custom Slash Commands - Implementation Guide

## Overview

This guide provides complete instructions for implementing custom slash commands in Claude Code that can be used across projects. The implementation creates a reusable `/perceive` command and supporting utilities that integrate with the Perception Agent framework.

## Part 1: Initial Question Deconstruction

### UNDERSTAND: What is the core question being asked?
The user wants to create a custom slash command system in Claude Code that:
1. Makes the Perception Agent framework easily accessible via `/perceive` command
2. Can be used across all projects (reusable)
3. Follows proper Claude Code slash command structure and syntax
4. Provides comprehensive codebase analysis capabilities

### ANALYZE: Key factors, concepts, and components involved
- **Claude Code Slash Command System**: Built-in extensibility through markdown files
- **Perception Agent Framework**: Existing comprehensive codebase analysis tool
- **Command Structure**: YAML frontmatter + markdown content for command definition
- **File Organization**: `.claude/commands/` directory structure for project/user commands
- **Integration Points**: Memory system, bug tracking, auditor framework
- **Tool Access**: Controlled tool access through allowed-tools configuration

### REASON: Logical connections and causal chains
- Slash commands in Claude Code are stored as markdown files with frontmatter
- Project commands (`.claude/commands/`) are shared with team, user commands (`~/.claude/commands/`) are personal
- Commands can specify allowed tools, argument hints, and preferred models
- The Perception Agent provides game-specific analysis capabilities that complement general codebase analysis
- Integration with existing project systems (memory, bugs, auditor) creates a unified development workflow

### SYNTHESIZE: Optimal strategy for comprehensive answer
1. Provide technical implementation details with file structure
2. Create working examples of the slash command system
3. Document integration with existing Perception Agent framework
4. Include usage patterns and workflow integration
5. Provide troubleshooting and verification steps

### CONCLUDE: Most accurate and helpful format
A comprehensive implementation guide with:
- Step-by-step implementation instructions
- Complete working code examples
- Usage documentation and best practices
- Integration patterns and workflow examples
- Troubleshooting and verification procedures

## Part 2: Implementation Structure (Bloom's Cognitive Taxonomy)

### Level 1: Remember (Knowledge)
**Define the cognitive task:** Recall the basic structure and requirements for Claude Code slash commands.

**Practical application:** Understanding that slash commands are markdown files stored in `.claude/commands/` directory with YAML frontmatter containing configuration metadata.

**Specific example:**
```yaml
---
description: Run comprehensive codebase analysis
argument-hint: [optional focus area]
allowed-tools: Read, Grep, Glob, Bash
---
```

### Level 2: Understand (Comprehension)
**Define the cognitive task:** Comprehend how slash commands integrate with Claude Code's tool system and project structure.

**Practical application:** Recognizing that commands can control tool access, specify parameters, and integrate with existing project systems through allowed-tools configuration.

**Specific example:**
The `/perceive` command leverages multiple tools (Read, Grep, Glob) to perform systematic codebase analysis, while integrating with project memory files and the existing Game Perception Agent framework.

### Level 3: Apply (Application)
**Define the cognitive task:** Apply the slash command structure to create functional commands that solve real development problems.

**Practical application:** Creating working slash commands that implement the Perception Agent framework and provide reusable analysis capabilities.

**Specific example:**
```markdown
# Comprehensive Codebase Perception Analysis
Execute a deep, systematic analysis of the entire codebase using advanced perception methodologies.

## Analysis Target
Focus area (if specified): $ARGUMENTS

## Perception Analysis Framework
[Detailed framework implementation]
```

### Level 4: Analyze
**Define the cognitive task:** Analyze the relationships between different commands and how they form a cohesive development workflow.

**Practical application:** Understanding how `/perceive`, `/audit-bugs`, `/memory-sync`, and other commands work together to create a comprehensive development environment.

**Specific example:**
The command ecosystem creates a workflow where `/memory-sync read` provides context, `/perceive` performs analysis, `/game-debug` handles game-specific issues, and `/audit-bugs` learns from discovered patterns.

### Level 5: Synthesize
**Define the cognitive task:** Synthesize multiple commands into a unified development workflow that enhances productivity and code quality.

**Practical application:** Creating command sequences and integration patterns that transform isolated tools into a comprehensive development environment.

**Specific example:**
A typical development session might use: `/memory-sync read` → `/perceive security` → `/game-debug rendering` → `/test-runner performance` → `/memory-sync create`, creating a complete analysis and documentation cycle.

### Level 6: Evaluate
**Define the cognitive task:** Evaluate the effectiveness of the slash command system in improving development workflows and code quality.

**Practical application:** Assessing how well the commands integrate with existing tools, provide actionable insights, and scale across different project types.

**Specific example:**
The `/perceive` command effectiveness can be measured by:
- Time reduction in codebase analysis tasks
- Quality of generated insights and recommendations
- Integration success with existing project systems
- Adoption and usage patterns across team members

### Level 7: Create
**Define the cognitive task:** Create new commands and extend the system to meet evolving project needs.

**Practical application:** Developing additional specialized commands, creating command namespaces, and building integrations with external tools.

**Specific example:**
Creating domain-specific commands like `/security-scan`, `/performance-profile`, or `/deploy-check` that leverage the same framework but focus on specific aspects of development.

## Technical Implementation

### Directory Structure
```
.claude/
├── commands/
│   ├── README.md                 # Documentation
│   ├── perceive.md              # Main analysis command
│   ├── audit-bugs.md            # Bug pattern analysis
│   ├── memory-sync.md           # Memory management
│   ├── architecture-map.md      # Architecture documentation
│   ├── test-runner.md           # Testing framework
│   └── game-debug.md            # Game-specific debugging
└── settings.local.json          # Local Claude settings
```

### Command Implementation
Each command follows this structure:
1. **YAML Frontmatter**: Configuration metadata
2. **Markdown Content**: Command description and instructions
3. **Parameter Handling**: `$ARGUMENTS` for dynamic values
4. **Tool Integration**: Specified allowed-tools for execution

### Integration Points
- **Memory System**: Links with `memory_*.md` files
- **Bug Tracking**: Integrates with `bugs.md`
- **Auditor Framework**: Enhances `auditor.md`
- **Game Perception**: Leverages `game_perception_agent.js`

## Usage and Verification

### Command Availability
Commands become available after:
1. Files are created in `.claude/commands/`
2. Claude Code recognizes the new commands
3. Commands appear in `/help` output (with "(project)" designation)

### Testing Commands
```bash
# Verify command files exist
ls -la .claude/commands/

# Test command structure
cat .claude/commands/perceive.md

# Use commands in Claude Code
/perceive security
/memory-sync create
/game-debug rendering
```

### Troubleshooting
- **Commands not appearing**: Ensure files are in correct directory with proper frontmatter
- **Tool access errors**: Verify allowed-tools configuration matches required tools
- **Parameter issues**: Check `$ARGUMENTS` usage and argument-hint configuration

## Benefits and Impact

### Enhanced Development Workflow
- **Instant Access**: Complex analysis workflows available via simple commands
- **Consistent Quality**: Standardized analysis across development sessions
- **Knowledge Preservation**: Automatic documentation and learning
- **Team Collaboration**: Shared commands create consistent team workflows

### Code Quality Improvements
- **Proactive Analysis**: Predictive modeling prevents issues
- **Comprehensive Coverage**: Multi-dimensional analysis catches subtle problems
- **Continuous Learning**: System improves based on discovered patterns
- **Living Documentation**: Documentation evolves with codebase

## Conclusion

This implementation creates a powerful, extensible system for custom slash commands in Claude Code that:

1. **Successfully integrates** the Perception Agent framework into an easily accessible command
2. **Provides reusable tools** that work across different projects
3. **Follows proper structure** and syntax for Claude Code slash commands
4. **Creates comprehensive workflows** that enhance development productivity
5. **Establishes patterns** for future command development and extension

The system transforms Claude Code from a capable AI assistant into a comprehensive development environment with specialized tools for analysis, debugging, testing, and documentation, all accessible through intuitive slash commands.

**Files Created:**
- `D:\Dropbox\Free Games\2025 RPG\CLAUDE GAMES\SW\.claude\commands\perceive.md`
- `D:\Dropbox\Free Games\2025 RPG\CLAUDE GAMES\SW\.claude\commands\audit-bugs.md`
- `D:\Dropbox\Free Games\2025 RPG\CLAUDE GAMES\SW\.claude\commands\memory-sync.md`
- `D:\Dropbox\Free Games\2025 RPG\CLAUDE GAMES\SW\.claude\commands\architecture-map.md`
- `D:\Dropbox\Free Games\2025 RPG\CLAUDE GAMES\SW\.claude\commands\test-runner.md`
- `D:\Dropbox\Free Games\2025 RPG\CLAUDE GAMES\SW\.claude\commands\game-debug.md`
- `D:\Dropbox\Free Games\2025 RPG\CLAUDE GAMES\SW\.claude\commands\README.md`
- `D:\Dropbox\Free Games\2025 RPG\CLAUDE GAMES\SW\.claude\IMPLEMENTATION_GUIDE.md`

The custom slash command system is now ready for use and can be replicated across other projects by copying the `.claude/commands/` directory.