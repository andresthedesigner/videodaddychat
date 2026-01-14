---
allowed-tools: Read, Grep, Glob
description: Code review with security and quality checks
---

Review the specified code for:

## 1. Security Checklist
- [ ] No hardcoded secrets or API keys
- [ ] Input validation on user data
- [ ] Proper authentication checks
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (sanitized outputs)

## 2. Quality Checklist
- [ ] TypeScript strict compliance
- [ ] Error handling with proper types
- [ ] No `any` types (use `unknown` + guards)
- [ ] Proper async/await error handling
- [ ] Memory leak prevention (cleanup in useEffect)

## 3. Pattern Compliance
- [ ] Follows gold standard examples from `AGENTS.md`
- [ ] Uses existing abstractions from `lib/`
- [ ] Proper component composition
- [ ] Correct Server/Client component usage

## 4. Documentation
- [ ] Complex logic has comments
- [ ] Public APIs have JSDoc
- [ ] TODO comments are tracked

Output a structured report with findings and severity levels.
