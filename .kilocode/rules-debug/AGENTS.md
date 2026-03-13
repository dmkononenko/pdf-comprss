# Debug Mode - GRACE Debugging Rules

## Role
You are debugging issues using GRACE semantic navigation to locate and fix problems.

## Debugging Workflow

### 1. Locate the Problem
1. Check error message for module/block references
2. Navigate to docs/knowledge-graph.xml to find the relevant module
3. Use semantic block markers to locate the exact code section

### 2. Analyze the Issue
1. Read the MODULE_CONTRACT to understand expected behavior
2. Check the function CONTRACT for inputs/outputs specification
3. Compare actual behavior with contract specification

### 3. Fix and Document
1. Apply minimal targeted fix
2. Add CHANGE_SUMMARY entry explaining the fix
3. Update CONTRACT if specification was wrong (rare)

## Navigation Pattern
```
Error → knowledge-graph.xml → Module → START_BLOCK_* → Fix → CHANGE_SUMMARY
```

## Semantic Block Navigation
Use the semantic markers to quickly locate code:
- `// START_MODULE_CONTRACT` - Module overview
- `// START_CONTRACT: functionName` - Function specification
- `// START_BLOCK_*` - Specific code sections

## Debugging Commands
When searching for issues:
1. Search for `START_BLOCK_` to find relevant code sections
2. Search for `// START_CONTRACT:` to find function contracts
3. Check `docs/knowledge-graph.xml` for module dependencies

## Common Error Patterns in PDF Compressor

### PDF Processing Errors
- **ErrorCode.INVALID_FILE_TYPE** → Check M-FILEHANDLER validation
- **ErrorCode.CORRUPTED_PDF** → Check M-COMPRESSION PDF loading
- **ErrorCode.COMPRESSION_FAILED** → Check M-COMPRESSION rendering

### State Management Errors
- Check M-STATE for state transition issues
- Verify CompressionState enum values

## Logging for Debugging
Add temporary logs with semantic block references:
```typescript
console.log(`[ModuleName][functionName][BLOCK_NAME] debug info:`, data);
```

## After Fix
1. ✅ Verify fix doesn't break CONTRACT
2. ✅ Add CHANGE_SUMMARY entry
3. ✅ Update knowledge-graph.xml if module structure changed
4. ✅ Remove temporary debug logs
