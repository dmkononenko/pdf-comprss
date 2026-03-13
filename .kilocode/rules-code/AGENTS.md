# Code Mode - GRACE Implementation Rules

## Role
You are implementing code changes following the GRACE framework contracts and development plan.

## Pre-Implementation Checklist
Before writing any code:
1. ✅ Read the MODULE_CONTRACT at the top of the file
2. ✅ Check docs/knowledge-graph.xml for module dependencies
3. ✅ Verify the development plan in docs/development-plan.xml
4. ✅ Understand the function/component contracts

## Implementation Rules

### Semantic Markup Requirements
- Every file MUST have MODULE_CONTRACT and MODULE_MAP at the top
- Every function/component MUST have START_CONTRACT/END_CONTRACT markers
- Code blocks inside functions use START_BLOCK_<NAME>/END_BLOCK_<NAME>
- Block names must be unique and descriptive (never generic)

### Code Generation Pattern
```
// FILE: path/to/file.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: [One sentence description]
//   SCOPE: [What operations are included]
//   DEPENDS: [List of dependencies]
//   LINKS: [Knowledge graph node references]
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   functionName — [one-line description]
// END_MODULE_MAP

// START_CONTRACT: functionName
//   PURPOSE: [What it does]
//   INPUTS: { paramName: Type — description }
//   OUTPUTS: { ReturnType — description }
//   SIDE_EFFECTS: [External state modifications]
//   LINKS: [Related modules/functions]
// END_CONTRACT: functionName
export function functionName() {
  // START_BLOCK_VALIDATE_INPUT
  // ... validation code ...
  // END_BLOCK_VALIDATE_INPUT
  
  // START_BLOCK_PROCESS_DATA
  // ... processing code ...
  // END_BLOCK_PROCESS_DATA
}
```

### After Implementation
1. Update MODULE_MAP if signatures changed
2. Update docs/knowledge-graph.xml if new modules added
3. Add CHANGE_SUMMARY entry for bug fixes

## Project Context
- **Project**: PDF Compressor Extension
- **Stack**: Vue 3 + TypeScript + WXT + Tailwind CSS
- **Key Libraries**: pdf-lib (PDF creation), pdfjs-dist (PDF rendering)

## Logging Convention
All logs must reference semantic blocks:
```typescript
console.log(`[ModuleName][functionName][BLOCK_NAME] message`);
```
