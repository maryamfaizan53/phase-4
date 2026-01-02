# MSW Test Configuration - Fix Options

## Current Issue

MSW v2.0.11 requires extensive polyfills in Jest environment:
- ✅ TextEncoder/TextDecoder
- ✅ fetch, Headers, Request, Response (undici)
- ✅ ReadableStream, WritableStream, TransformStream (web-streams-polyfill)
- ❌ MessagePort (worker_threads - next requirement)
- ❌ Potentially more Node.js globals...

This is a known compatibility challenge with MSW v2 in Jest/jsdom environments.

---

## Option 1: Downgrade to MSW v1 (RECOMMENDED)

**Time**: 5 minutes
**Reliability**: High - MSW v1 is battle-tested with Jest

### Steps:

1. **Uninstall MSW v2 and polyfills**:
```bash
cd frontend
npm uninstall msw web-streams-polyfill undici
```

2. **Install MSW v1**:
```bash
npm install --save-dev msw@^1.3.2
```

3. **Update `frontend/__tests__/mocks/handlers.js`**:
```javascript
// Change from:
import { http, HttpResponse } from 'msw'

// To:
import { rest } from 'msw'

// Update each handler from:
http.get('http://localhost:8000/api/:userId/tasks', () => {
  return HttpResponse.json(mockTasks)
})

// To:
rest.get('http://localhost:8000/api/:userId/tasks', (req, res, ctx) => {
  return res(ctx.json(mockTasks))
})
```

4. **Simplify `frontend/jest.polyfills.js`**:
```javascript
// Remove all polyfills - MSW v1 doesn't need them
// File can be empty or deleted
```

5. **Update `frontend/jest.config.js`**:
```javascript
// Remove setupFiles line:
// setupFiles: ['<rootDir>/jest.polyfills.js'],
```

6. **Run tests**:
```bash
npm test
```

---

## Option 2: Add More Polyfills for MSW v2

**Time**: Unknown (could be 30 minutes to 2 hours of trial and error)
**Reliability**: Medium - may hit more missing globals

### Next Steps:

1. Add MessagePort polyfill
2. Likely hit more missing globals (structuredClone, BroadcastChannel, etc.)
3. Keep adding polyfills until tests run
4. Higher maintenance burden

**Not recommended** unless you specifically need MSW v2 features.

---

## Option 3: Skip MSW Tests, Focus on E2E

**Time**: Immediate
**Reliability**: Medium

### Rationale:

- Integration tests with MSW are nice-to-have
- Manual QA + E2E tests (Playwright/Cypress) provide better coverage
- Can revisit MSW tests later after MSW v2 matures in Jest ecosystem

### Steps:

1. Document MSW issue in README
2. Proceed with manual QA (24-item checklist)
3. Consider adding E2E tests with Playwright later

---

## Recommendation

**Use Option 1: Downgrade to MSW v1**

Reasons:
- Proven compatibility with Jest
- Minimal code changes (just update handler syntax)
- Tests will run immediately
- Can upgrade to MSW v2 later when ecosystem matures

Would you like me to execute Option 1 now?
