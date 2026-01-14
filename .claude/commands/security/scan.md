---
allowed-tools: Read, Grep, Glob
description: Run security vulnerability scan on codebase
model: claude-sonnet-4-5-20250929
---

Analyze the codebase for security vulnerabilities including:

## Scan Areas

### 1. Secrets Exposure
- Hardcoded API keys, tokens, credentials
- Environment variables logged or exposed
- Secrets in git history
- Unsafe .env file handling

### 2. Authentication & Authorization
- Missing auth checks on protected routes
- Insecure session handling
- Weak password policies
- OAuth token handling vulnerabilities

### 3. Injection Vulnerabilities
- SQL injection risks
- Command injection
- XSS vulnerabilities
- Template injection

### 4. Data Handling
- Sensitive data in logs
- Unencrypted data at rest
- Improper data sanitization
- PII exposure risks

### 5. Dependencies
- Known vulnerable packages
- Outdated dependencies
- Unused dependencies with vulnerabilities

## Output Format

```markdown
## Security Scan Report

### Critical (Fix Immediately)
- [Issue]: [Location] - [Recommendation]

### High (Fix Soon)
- [Issue]: [Location] - [Recommendation]

### Medium (Plan to Fix)
- [Issue]: [Location] - [Recommendation]

### Low (Consider Fixing)
- [Issue]: [Location] - [Recommendation]

### Summary
- Total issues found: X
- Critical: X | High: X | Medium: X | Low: X
```

**Note:** This scan is advisory. Always validate findings and follow up with proper security testing.
