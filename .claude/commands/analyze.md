---
allowed-tools: Read, Grep, Glob, WebSearch
description: Analyze YouTube content for optimization insights
model: claude-sonnet-4-5-20250929
---

Analyze the provided YouTube content (transcript, title, thumbnail description, or analytics) and provide actionable insights.

## Analysis Types

### Transcript Analysis
- Extract key hooks and retention points
- Identify strong/weak segments
- Suggest script improvements
- Find quotable moments for clips

### Title/SEO Analysis
- Evaluate click-through potential
- Check keyword optimization
- Suggest A/B test variants
- Compare to successful patterns

### Thumbnail Analysis (if image URL provided)
- Evaluate visual hierarchy
- Check text readability
- Suggest improvements
- Recommend color/contrast adjustments

### Analytics Interpretation
- Identify performance trends
- Benchmark against niche averages
- Prioritize improvement areas
- Provide actionable recommendations

## Output Format

```markdown
## Summary
[1-2 sentence overview]

## Key Insights
1. [Insight with specific recommendation]
2. [Insight with specific recommendation]
3. [Insight with specific recommendation]

## Action Items
- [ ] [Specific, actionable task]
- [ ] [Specific, actionable task]

## Additional Notes
[Any context-specific observations]
```
