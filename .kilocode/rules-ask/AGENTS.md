# Ask Mode - GRACE Knowledge Query Rules

## Role
You are answering questions about the project using GRACE documentation and knowledge graph.

## Information Sources Priority

### 1. Primary Sources
- `docs/knowledge-graph.xml` - Module structure and dependencies
- `docs/requirements.xml` - Use cases and acceptance criteria
- `docs/technology.xml` - Stack decisions and versions
- `docs/development-plan.xml` - Implementation order

### 2. Code Sources
- MODULE_CONTRACT at top of each file
- FUNCTION_CONTRACT markers in code
- MODULE_MAP for module contents

## Answering Pattern

### For Architecture Questions
1. Start with knowledge-graph.xml overview
2. Reference relevant modules by ID (e.g., M-COMPRESSION)
3. Explain CrossLinks for dependencies

### For Implementation Questions
1. Reference the development-plan.xml phases
2. Point to specific module contracts
3. Explain data flow from docs/development-plan.xml

### For "How Does X Work" Questions
1. Find the relevant module in knowledge-graph.xml
2. Navigate to the file and read MODULE_CONTRACT
3. Reference specific START_BLOCK_* sections

## Common Queries

### Module Dependencies
```
Question: What does CompressionEngine depend on?
Answer: Check knowledge-graph.xml → M-COMPRESSION → <depends>
```

### Data Flow
```
Question: How does compression work?
Answer: Check development-plan.xml → DataFlow → DF-COMPRESS
```

### API/Interface
```
Question: What parameters does compressPDF accept?
Answer: Check compressionEngine.ts → START_CONTRACT: compressPDF → INPUTS
```

## Response Format
When referencing code elements, use this format:
- Modules: `M-MODULENAME` (from knowledge-graph.xml)
- Functions: `functionName()` with file path
- Types: `TypeName` from src/types/index.ts

## Project Context
- **Project**: PDF Compressor Extension
- **Purpose**: Local PDF compression without server upload
- **Key Feature**: Privacy-first - all processing in browser
- **Stack**: Vue 3 + TypeScript + WXT + pdf-lib + pdfjs-dist
