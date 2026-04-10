---
name: accessibility-audit
description: 'Use when auditing Angular UI for accessibility, AXE issues, keyboard flow, focus handling, labels, ARIA, contrast, or dark-mode accessibility. Triggers: accessibility audit, axe, wcag, aria, keyboard navigation, focus management, color contrast, screen reader.'
---

# Accessibility Audit

Use this skill to review or improve Angular interfaces for accessibility and inclusive interaction quality.

## Goals

- Meet WCAG AA requirements
- Catch structural, semantic, and interaction problems early
- Keep light and dark themes accessible under the same component API

## Instructions

1. Start with semantics first. Prefer native elements and correct landmark structure before adding ARIA.
2. Ensure every interactive control has an accessible name, visible purpose, and keyboard support.
3. Verify logical tab order, focus visibility, focus trapping where required, and safe focus return after overlays close.
4. Use ARIA only to fill gaps that native HTML cannot express. Avoid redundant or conflicting roles and properties.
5. Check validation, errors, helper text, loading states, and empty states for screen reader clarity.
6. Review hover, focus, disabled, selected, pressed, and error states in both light and dark themes.
7. Confirm text contrast, icon contrast, focus indicators, and state differentiation meet WCAG AA.
8. Respect reduced-motion preferences for animations that affect comprehension or comfort.
9. When reviewing a feature, identify issues by severity and provide concrete fixes instead of generic advice.
10. If tooling is available, run automated checks such as AXE, then follow up with manual keyboard and screen-reader oriented review.
