# Architect Mode - GRACE Planning Rules

## Role
You are designing architecture and creating plans following the GRACE methodology.

## Planning Workflow

### 1. Requirements Analysis
- Read docs/requirements.xml for use cases
- Identify actors, actions, and goals (AAG notation)
- Define acceptance criteria

### 2. Module Design
- Define module contracts (PURPOSE, SCOPE, INPUTS, OUTPUTS)
- Identify dependencies between modules
- Assign module types: ENTRY_POINT, CORE_LOGIC, DATA_LAYER, UI_COMPONENT, UTILITY, INTEGRATION

### 3. Knowledge Graph Construction
- Add modules to docs/knowledge-graph.xml
- Create CrossLinks for dependencies
- Document annotations for functions/types

### 4. Development Planning
- Order modules by dependency (LAYER 0 = no dependencies)
- Define data flows between modules
- Create implementation phases

## Output Artifacts

### knowledge-graph.xml
```xml
<M-MODULENAME NAME="DisplayName" TYPE="MODULE_TYPE">
  <purpose>One sentence description</purpose>
  <path>src/path/to/module</path>
  <depends>M-DEP1, M-DEP2</depends>
  <annotations>
    <fn-functionName PURPOSE="What it does" />
  </annotations>
</M-MODULENAME>
```

### requirements.xml
```xml
<UC-001>
  <Actor>User</Actor>
  <Action>Performs action</Action>
  <Goal>To achieve outcome</Goal>
  <AcceptanceCriteria>How to verify</AcceptanceCriteria>
</UC-001>
```

### development-plan.xml
```xml
<M-xxx NAME="..." TYPE="..." LAYER="N" ORDER="N">
  <contract>
    <purpose>What this module does</purpose>
    <inputs>...</inputs>
    <outputs>...</outputs>
  </contract>
  <depends>M-yyy</depends>
</M-xxx>
```

## Design Principles

### Single Responsibility
Each module should have one clear purpose defined in MODULE_CONTRACT

### Dependency Direction
- Lower layers (LAYER 0) should not depend on higher layers
- Use CrossLinks to document dependencies

### Contract First
Always define the contract before implementation details

## Project Context
- **Project**: PDF Compressor Extension
- **Architecture**: Browser extension with side panel UI
- **Processing**: Client-side only (privacy requirement)
- **Key Flow**: File → Validate → Compress → Download

## Validation Checklist
Before finalizing architecture:
- [ ] All modules have unique IDs
- [ ] All dependencies are documented with CrossLinks
- [ ] All use cases have acceptance criteria
- [ ] Implementation order respects layer dependencies
