---
description: Execute comprehensive testing suite with automated reporting and analysis
argument-hint: [test-type: unit|integration|visual|performance|all]
allowed-tools: Bash, Read, Write, Grep, Glob
---

# Comprehensive Test Runner and Analysis Framework

Execute automated testing suites with intelligent analysis, reporting, and issue detection across multiple testing dimensions.

## Test Execution Scope
Test type: $ARGUMENTS (default: all)

### Available Test Types:

#### UNIT - Unit Testing
- Execute unit test suites using configured test runners
- Analyze test coverage and identify gaps
- Generate detailed pass/fail reports
- Identify flaky or problematic tests

#### INTEGRATION - Integration Testing
- Run end-to-end integration tests
- Validate API endpoints and data flows
- Test component interaction patterns
- Verify system boundary behaviors

#### VISUAL - Visual Regression Testing
- Capture and compare visual outputs
- Detect UI/UX regressions and changes
- Validate rendering consistency
- Generate visual diff reports

#### PERFORMANCE - Performance Testing
- Execute performance benchmarks
- Analyze memory usage and CPU utilization
- Detect performance regressions
- Generate optimization recommendations

#### ALL - Comprehensive Testing
- Execute all test types in sequence
- Generate unified test report
- Cross-reference results across test dimensions
- Provide comprehensive quality assessment

### Testing Features:

#### Automated Test Discovery
- Scan codebase for test files and patterns
- Identify test frameworks and configurations
- Detect testing dependencies and requirements
- Validate test environment setup

#### Intelligent Analysis
- Correlate test results with code changes
- Identify patterns in test failures
- Suggest fixes for common test issues
- Generate actionable improvement recommendations

#### Reporting and Documentation
- Generate detailed HTML test reports
- Create test coverage visualizations
- Document test patterns and best practices
- Track testing metrics over time

#### Integration with Project Systems
- Update bugs.md with test-discovered issues
- Enhance auditor.md with test-based patterns
- Sync results with project memory systems
- Trigger appropriate follow-up actions

This command provides a unified testing interface that adapts to project requirements and maintains comprehensive quality assurance across the development lifecycle.