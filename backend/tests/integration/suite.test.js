/**
 * Single entry so Node runs one process (avoids subprocess hang from mongodb-memory-server).
 * Individual *.api.test.js files contain only `test(...)` cases.
 *
 * Do not run: node --test tests/integration/   (Node treats the path as a module; use below.)
 * Run:       npm run test:integration
 * Or:        node --test --test-force-exit --test-timeout=180000 tests/integration/suite.test.js
 */
process.env.JWT_SECRET = process.env.JWT_SECRET || "integration-test-jwt-secret";

import { before, after, afterEach } from "node:test";
import {
  connectMemoryDb,
  clearAllCollections,
  disconnectMemoryDb,
} from "./memory-db.js";

before(async () => {
  await connectMemoryDb();
});

afterEach(async () => {
  await clearAllCollections();
});

after(async () => {
  await disconnectMemoryDb();
});

await import("./training.api.test.js");
await import("./event-campaign.api.test.js");
await import("./quiz.api.test.js");
await import("./report-support.api.test.js");
