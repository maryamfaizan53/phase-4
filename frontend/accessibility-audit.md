# Accessibility Audit Guide

## Running Lighthouse Accessibility Audit

### Prerequisites
- Chrome or Edge browser
- Development server running (`npm run dev`)
- Navigate to http://localhost:3001/dashboard

### Steps to Run Audit

1. **Open Chrome DevTools**
   - Press `F12` or `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (Mac)

2. **Navigate to Lighthouse Tab**
   - Click on the "Lighthouse" tab in DevTools
   - If not visible, click the `>>` icon and select "Lighthouse"

3. **Configure Audit**
   - Select "Desktop" or "Mobile" mode
   - Check "Accessibility" category
   - Optionally check "Performance", "Best Practices", and "SEO"
   - Click "Analyze page load"

4. **Review Results**
   - Target score: **90+** for Accessibility
   - Review any warnings or errors
   - Focus on critical issues first

### Key Accessibility Features Implemented

#### ARIA Labels
- All interactive elements have descriptive `aria-label` attributes
- Form inputs have proper labels
- Status messages use `aria-live` regions
- Alert dialogs use `role="alert"`

#### Keyboard Navigation
- All interactive elements are keyboard accessible
- Tab order follows logical flow
- Escape key closes modals/dialogs
- Focus indicators visible on all focusable elements

#### Semantic HTML
- Proper heading hierarchy (h1, h2, h3)
- `<nav>`, `<main>`, `<section>` landmarks
- `<table>` with proper `<thead>`, `<tbody>`, `role="table"`, `role="row"`
- Buttons vs links used appropriately

#### Color Contrast
- Minimum contrast ratio: 4.5:1 for normal text
- Minimum contrast ratio: 3:1 for large text
- Glass morphism design uses sufficient contrast

#### Responsive Design
- Mobile-first approach with Tailwind breakpoints
- Touch targets minimum 44x44px
- Text remains readable at 200% zoom
- No horizontal scrolling on mobile

### Common Issues to Check

1. **Color Contrast**
   - White text on glass panels: Check against background gradient
   - Brand colors on backgrounds
   - Disabled state visibility

2. **Focus Indicators**
   - Ensure visible focus rings on all interactive elements
   - Custom focus styles meet 3:1 contrast ratio

3. **Form Labels**
   - All inputs have associated labels or aria-label
   - Error messages are announced to screen readers

4. **Images and Icons**
   - SVG icons have `aria-label` or are marked `aria-hidden="true"`
   - Decorative images excluded from accessibility tree

### Automated Testing Tools

```bash
# Install axe-core for automated testing
npm install --save-dev @axe-core/react

# Run accessibility linter
npm install --save-dev eslint-plugin-jsx-a11y
```

### Manual Testing Checklist

- [ ] Navigate entire app using only keyboard (Tab, Shift+Tab, Enter, Escape)
- [ ] Test with screen reader (NVDA on Windows, VoiceOver on Mac)
- [ ] Verify all interactive elements have visible focus
- [ ] Check color contrast with browser extensions
- [ ] Test responsive layout on mobile devices
- [ ] Zoom to 200% and verify no content is cut off
- [ ] Test with high contrast mode enabled

### Expected Lighthouse Scores

| Category | Target | Current |
|----------|--------|---------|
| Accessibility | 90+ | TBD |
| Performance | 85+ | TBD |
| Best Practices | 90+ | TBD |
| SEO | 85+ | TBD |

### Remediation Priority

**Critical (Fix Immediately)**
- Missing ARIA labels on critical actions
- Insufficient color contrast (< 3:1)
- Broken keyboard navigation
- Missing form labels

**High (Fix Soon)**
- Suboptimal focus indicators
- Missing skip links
- Insufficient heading hierarchy

**Medium (Plan to Fix)**
- Minor contrast issues (3:1 to 4.5:1)
- Redundant ARIA labels
- Missing landmark regions

**Low (Nice to Have)**
- Enhanced keyboard shortcuts
- Additional ARIA descriptions
- Improved screen reader announcements

### Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe DevTools Extension](https://www.deque.com/axe/devtools/)
