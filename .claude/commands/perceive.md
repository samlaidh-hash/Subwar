---
description: Run comprehensive codebase analysis using the Perception Agent framework
argument-hint: [optional focus area]
allowed-tools: Read, Grep, Glob, Bash, WebFetch
model: claude-3-5-sonnet-20241022
---

# Comprehensive Codebase Perception Analysis

Execute a deep, systematic analysis of the entire codebase using advanced perception methodologies. This command implements a multi-layered analysis framework that examines code structure, patterns, dependencies, and potential issues.

## Analysis Target
Focus area (if specified): $ARGUMENTS
If no arguments provided, perform complete codebase analysis.

## Perception Analysis Framework

### 1. CODEBASE STRUCTURE MAPPING
- Map all source files, dependencies, and relationships
- Identify architectural patterns and design decisions
- Analyze module interconnections and data flow
- Document build system and configuration files

### 2. CODE QUALITY ASSESSMENT
- Static code analysis for patterns and anti-patterns
- Identify potential bugs, security vulnerabilities, and performance issues
- Assess code maintainability and technical debt
- Evaluate testing coverage and quality

### 3. DEPENDENCY ANALYSIS
- Map external dependencies and their health
- Identify version conflicts and security vulnerabilities
- Analyze bundle size and performance implications
- Assess dependency freshness and maintenance status

### 4. RUNTIME BEHAVIOR ANALYSIS
- Examine error handling patterns and robustness
- Identify performance bottlenecks and optimization opportunities
- Analyze memory usage patterns and potential leaks
- Assess user experience and interaction patterns

### 5. DOCUMENTATION AND CONSISTENCY
- Evaluate documentation completeness and accuracy
- Check coding standards and style consistency
- Identify missing or outdated documentation
- Assess onboarding and development workflow efficiency

### 6. PREDICTIVE ISSUE MODELING
- Predict likely failure points based on code patterns
- Identify areas prone to bugs or maintenance issues
- Suggest preventive measures and code improvements
- Model potential scalability and performance concerns

## Output Format

Provide a comprehensive report with:
- Executive summary of findings
- Detailed analysis by category
- Prioritized recommendations
- Action items with implementation guidance
- Risk assessment and mitigation strategies

## Implementation Notes

This command leverages:
- File system analysis using Glob and Read tools
- Pattern matching using Grep for code analysis
- External resource validation using WebFetch
- Shell commands for build and test execution
- Integration with existing project memory and audit systems

The analysis adapts to the specific technology stack and project requirements, providing contextually relevant insights for the current codebase.