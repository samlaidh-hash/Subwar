---
description: Synchronize project memory, analyze session patterns, and update documentation
argument-hint: [action: read|create|analyze|sync]
allowed-tools: Read, Glob, Write, MultiEdit
---

# Project Memory Management and Synchronization

Comprehensive memory management system for tracking project evolution, session analysis, and knowledge preservation.

## Memory Operation
Action: $ARGUMENTS (default: sync)

### Available Operations:

#### READ - Memory Context Analysis
- Find and read the most recent memory file
- Extract current project state and context
- Identify active work streams and decisions
- Summarize recent progress and challenges

#### CREATE - New Session Memory
- Create new session memory file with timestamp
- Initialize with current project context
- Set up tracking for new work session
- Establish baseline for progress measurement

#### ANALYZE - Session Pattern Analysis
- Analyze patterns across multiple memory files
- Identify recurring issues and successful strategies
- Extract lessons learned and best practices
- Generate insights for future development

#### SYNC - Complete Memory Synchronization
- Read latest memory for context
- Create new session memory file
- Update project documentation with insights
- Synchronize CLAUDE.md with current state

### Memory File Management
- Automatic timestamp-based naming: `memory_YYYYMMDD_HHMMSS.md`
- Structured content with consistent formatting
- Cross-referencing with bugs.md and auditor.md
- Integration with project decision tracking

This command ensures continuity across development sessions and preserves institutional knowledge for efficient project progression.