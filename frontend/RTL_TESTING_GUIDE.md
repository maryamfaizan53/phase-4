# RTL Testing Guide - Urdu Language Support

## Overview
This document outlines RTL (Right-to-Left) testing requirements and edge cases for the bilingual dashboard (English/Urdu).

## Testing Checklist

### ✅ Implemented RTL Features

#### 1. **Language Toggle**
- [x] Toggle button displays correctly in both languages
- [x] Button shows "اردو" in English mode
- [x] Button shows "English" in Urdu mode
- [x] Click toggles between en ↔ ur
- [x] Preference saved to localStorage
- [x] Page reloads with new language

#### 2. **HTML Directionality**
- [x] `<html dir="rtl">` set when locale is 'ur'
- [x] `<html dir="ltr">` set when locale is 'en'
- [x] `<html lang="ur">` set when locale is 'ur'
- [x] `<html lang="en">` set when locale is 'en'

#### 3. **Dashboard Components**

**TopNavBar:**
- [x] App name translated
- [x] App subtitle translated
- [x] User menu translated
- [x] Logout button translated

**DashboardKPIs:**
- [x] KPI titles translated (Total, Completed, Pending, Overdue)
- [x] Trend text translated
- [x] Numbers display correctly in both languages

**Charts:**
- [x] Chart titles translated
- [x] Axis labels use translated text
- [x] Legend labels translated
- [x] Empty state messages translated

**TaskTable:**
- [x] Table headers translated
- [x] Search placeholder translated
- [x] Filter options translated
- [x] Pagination buttons translated
- [x] Empty states translated
- [x] Actions column uses `rtl:space-x-reverse`
- [x] Delete confirmation translated

**ChatWidget:**
- [x] Widget title translated
- [x] Input placeholder translated
- [x] Greeting message translated
- [x] Error messages translated
- [x] User messages: right-aligned in LTR, left-aligned in RTL
- [x] AI messages: left-aligned in LTR, right-aligned in RTL
- [x] Message bubble corners flip correctly
- [x] Language preference sent to backend API

#### 4. **Translation System**
- [x] 88 translation keys in en.json
- [x] 88 matching keys in ur.json
- [x] Validation script passes
- [x] IntlProvider functional
- [x] useTranslations hook working
- [x] useIntl hook provides locale

---

## Manual Testing Requirements (US4-T045)

### Test Case 1: Long Task Titles
**Scenario:** Task title exceeds table column width

**English:**
```
Title: "This is an extremely long task title that should truncate with ellipsis and show tooltip on hover"
Expected: Text truncates, ellipsis appears, no layout break
```

**Urdu:**
```
Title: "یہ ایک بہت لمبا کام کا عنوان ہے جو بیضوی کے ساتھ کٹ جانا چاہیے اور ہوور پر ٹول ٹپ دکھانا چاہیے"
Expected: Text truncates, ellipsis appears, no layout break, RTL text direction maintained
```

**Verification:**
- [ ] Text truncates correctly in both languages
- [ ] Ellipsis appears at end (LTR) or start (RTL)
- [ ] Tooltip shows full text on hover
- [ ] No horizontal scrolling occurs

---

### Test Case 2: Mixed English + Urdu Text
**Scenario:** Task contains both English and Urdu characters

**Mixed Content:**
```
Title: "Update API endpoint for /api/tasks کو اپ ڈیٹ کریں"
Description: "This task requires updating the backend API ایپی آئی کو تبدیل کرنا ہے"
```

**Verification:**
- [ ] Bidirectional text displays correctly
- [ ] English text flows LTR within Urdu context
- [ ] No character rendering issues
- [ ] Line breaks work correctly

---

### Test Case 3: Numbers and Dates
**Scenario:** Verify number and date formatting in both languages

**English:**
```
- KPI Value: 42 tasks
- Date: "Dec 28, 2025"
- Percentage: "65% complete"
```

**Urdu:**
```
- KPI Value: ۴۲ کام (or 42 کام - using Western numerals)
- Date: "۲۸ دسمبر، ۲۰۲۵"
- Percentage: "۶۵٪ مکمل"
```

**Verification:**
- [ ] Numbers display consistently
- [ ] Dates formatted appropriately
- [ ] Percentages aligned correctly
- [ ] No layout shifts

---

### Test Case 4: Chat Message Alignment
**Scenario:** Multiple messages in both modes

**LTR (English):**
```
┌─────────────────┐
│ User: Hello     │──────────▶ (right-aligned)
│   AI: Hi there! │◀────────── (left-aligned)
└─────────────────┘
```

**RTL (Urdu):**
```
┌─────────────────┐
◀───────── User: سلام │ (left-aligned)
    AI: ہیلو! ──────────▶│ (right-aligned)
└─────────────────┘
```

**Verification:**
- [ ] User messages align correctly in both modes
- [ ] AI messages align correctly in both modes
- [ ] Bubble tail points correct direction
- [ ] Text reads naturally in each direction

---

### Test Case 5: Component Overflow
**Scenario:** Test all components with edge case content lengths

**Dashboard Page:**
- [ ] Very long page title doesn't break layout
- [ ] Subtitle wraps correctly if needed
- [ ] No horizontal scrolling on narrow screens

**KPI Cards:**
- [ ] Large numbers (e.g., 999,999) fit in card
- [ ] Long trend text wraps appropriately
- [ ] Icons remain visible

**Charts:**
- [ ] Long axis labels don't overlap
- [ ] Legend items wrap if needed
- [ ] Tooltips position correctly

**Task Table:**
- [ ] Wide tables scroll horizontally (mobile)
- [ ] Filters don't break on small screens
- [ ] Pagination works on all screen sizes

---

### Test Case 6: Responsive RTL Behavior
**Scenario:** Test RTL at different breakpoints

**Mobile (< 768px):**
- [ ] Chat FAB appears in correct corner
- [ ] Language toggle accessible
- [ ] Table scrolls horizontally if needed
- [ ] Cards stack vertically

**Tablet (768px - 1024px):**
- [ ] Layout adapts correctly
- [ ] Spacing maintained in RTL
- [ ] Charts resize appropriately

**Desktop (> 1024px):**
- [ ] Chat sidebar appears on correct side
- [ ] Grid layouts maintain RTL flow
- [ ] Full features accessible

---

### Test Case 7: Icons and Symbols
**Scenario:** Verify direction-agnostic icons

**Icons to Check:**
- [ ] Chevrons/arrows: Should NOT flip (use semantic icons)
- [ ] Checkmarks: Display consistently
- [ ] Plus/minus: Direction-agnostic
- [ ] Delete/edit: No directional bias
- [ ] Voice button: Microphone icon OK

**Current Implementation:**
All icons are SVG-based and direction-agnostic ✓

---

### Test Case 8: Form Inputs
**Scenario:** Input fields in RTL mode

**Search Input:**
- [ ] Placeholder text aligns right in RTL
- [ ] Cursor starts from right in RTL
- [ ] Search icon positioned correctly
- [ ] Clear button (if any) positioned correctly

**Chat Input:**
- [ ] Placeholder aligns right in RTL
- [ ] Text flows right-to-left in RTL
- [ ] Send button positioned correctly
- [ ] Voice button accessible

---

### Test Case 9: Language Switching Mid-Session
**Scenario:** Switch language while using the app

**Steps:**
1. Load dashboard in English
2. Create a task with English title
3. Switch to Urdu
4. Verify:
   - [ ] UI updates to Urdu
   - [ ] Existing task title remains English (data unchanged)
   - [ ] New tasks can be created in Urdu
   - [ ] Chat greeting updates to Urdu
   - [ ] Chat history persists

---

### Test Case 10: Backend Integration
**Scenario:** Verify language preference sent to API

**Chat API:**
- [ ] English message sends `language: "en"`
- [ ] Urdu message sends `language: "ur"`
- [ ] Backend logs show language parameter
- [ ] AI responds in appropriate language

**To Verify:**
```javascript
// Check browser DevTools Network tab
POST /api/{user_id}/chat
Body: { message: "...", language: "ur" }
```

---

## Known Limitations

1. **Number Formatting:** Using Western numerals (1, 2, 3) instead of Eastern Arabic (۱, ۲, ۳) for consistency
2. **Date Formatting:** Using `formatDate` helper which may need localization
3. **Backend Responses:** AI must be configured to respond in Urdu when `language: "ur"` is sent
4. **Recharts RTL:** Library has limited RTL support - using layout tweaks instead

---

## Bug Reporting Template

When reporting RTL issues, include:

```markdown
### RTL Bug Report

**Language:** [ ] English [ ] Urdu

**Component:** [e.g., TaskTable, ChatWidget, KPI Cards]

**Screen Size:** [Mobile/Tablet/Desktop]

**Description:**
[What went wrong?]

**Steps to Reproduce:**
1. Switch to Urdu
2. Navigate to...
3. ...

**Expected Behavior:**
[What should happen?]

**Actual Behavior:**
[What actually happened?]

**Screenshot:**
[If applicable]

**Browser:** [Chrome/Firefox/Safari/Edge]
```

---

## Validation Checklist Summary

Run through this before marking Phase 5 complete:

- [ ] All 88 translation keys verified
- [ ] Language toggle functional
- [ ] HTML dir/lang attributes set correctly
- [ ] Dashboard fully translated
- [ ] Charts use translated labels
- [ ] Task table RTL-compatible
- [ ] Chat messages align correctly
- [ ] Language preference sent to API
- [ ] Long text truncates properly
- [ ] Mixed content displays correctly
- [ ] No horizontal overflow
- [ ] Responsive behavior works
- [ ] Icons don't flip incorrectly

---

## Next Steps

After completing manual testing:

1. **Phase 6:** Accessibility & UX Polish
   - Add keyboard navigation
   - Improve focus states
   - Add ARIA labels
   - Test with screen readers in both languages

2. **Phase 7:** Real-Time Sync & Final Integration
   - Implement task sync
   - Add optimistic updates
   - Final end-to-end testing

---

**Generated:** 2025-12-28
**Version:** 1.0.0
**Phase:** 5 - Urdu Language & RTL Support
