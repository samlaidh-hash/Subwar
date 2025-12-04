---
description: Generate comprehensive architecture documentation and dependency mapping
argument-hint: [format: visual|textual|interactive]
allowed-tools: Read, Grep, Glob, WebFetch, Write
---

# Architecture Mapping and Documentation Generator

Create comprehensive architecture documentation with visual dependency mapping, code flow analysis, and system interaction diagrams.

## Output Format
Format type: $ARGUMENTS (default: textual)

### Architecture Analysis Components:

#### 1. System Overview
- High-level architecture patterns and design principles
- Technology stack analysis and justification
- Core system boundaries and interfaces
- Key architectural decisions and trade-offs

#### 2. Module Dependency Mapping
- File-to-file dependency analysis
- Import/export relationship mapping
- Circular dependency detection
- Critical path identification

#### 3. Data Flow Analysis
- Information flow between components
- State management patterns
- Event-driven interactions
- Data transformation pipelines

#### 4. Integration Points
- External API integrations
- Third-party library usage
- Configuration and environment dependencies
- Build and deployment pipeline mapping

#### 5. Scalability and Performance Analysis
- Performance bottleneck identification
- Scalability constraint analysis
- Resource utilization patterns
- Optimization opportunity mapping

### Output Formats:

#### VISUAL
- ASCII art dependency diagrams
- Flow charts and component relationships
- Hierarchical system structure
- Network topology representations

#### TEXTUAL
- Structured markdown documentation
- Detailed component descriptions
- API and interface specifications
- Configuration and setup guides

#### INTERACTIVE
- Clickable documentation links
- Cross-referenced component mapping
- Searchable architecture index
- Dynamic dependency exploration

This command creates living documentation that evolves with the codebase and serves as both reference material and onboarding resource.