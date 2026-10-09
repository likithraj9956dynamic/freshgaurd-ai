# FreshGuard AI — Backend Architecture State

## Current Phase: Phase 6 — Audio Executive Briefing and AI Operations Assistant
**Status**: Completed ✅

---

## 1. System Overview & Tech Stack
- **Runtime**: Node.js (v25+)
- **Language**: TypeScript (v5+)
- **Framework**: Express.js
- **ORM / Database Tool**: Prisma ORM (PostgreSQL)
- **Validation**: Zod (Complete schema suites across operational, analytics, decision, approval, briefing, and assistant layers)
- **AI Intelligence & Audio**:
  - Grounded Causal Reasoning Engine (100% claim grounding, strict hallucination prevention)
  - Natural Language Operations Assistant (Protected from arbitrary SQL execution, cites telemetry sources)
  - Executive Audio Briefing Generator with SHA-256 script hashing and server-side MP3 caching
- **Architecture Pattern**: Layered Route-Controller-Service-Repository architecture with BigInt serialization, State Machine Boundaries, and Sandbox Simulation

---

## 2. Prisma Models (Database Schema)

### Master & Operational Models
- **`Store`** (`stores`): id, name, location, state, country, storeFormat, status, createdAt
- **`Product`** (`products`): id, name, category, subcategory, brand, barcode, unitPrice, unitCost, perishable, shelfLifeDays, dataSource, externalProductId, createdAt
- **`DailySale`** (`daily_sales`): id, storeId, productId, saleDate, unitsSold, unitPrice, revenue, dataSource, createdAt (Unique: `[storeId, productId, saleDate]`)
- **`Inventory`** (`inventory`): id, storeId, productId, currentStock, reorderLevel, updatedAt, dataSource (Unique: `[storeId, productId]`)
- **`PurchaseOrder`** (`purchase_orders`): id, storeId, supplierName, orderDate, expectedDelivery, actualDelivery, status, dataSource, createdAt
- **`PurchaseOrderItem`** (`purchase_order_items`): id, purchaseOrderId, productId, quantityOrdered, quantityReceived
- **`WastageRecord`** (`wastage_records`): id, storeId, productId, quantity, reason, recordedAt, dataSource
- **`DataImportRun`** (`data_import_runs`): id, datasetName, source, startedAt, completedAt, status, recordsRead, recordsInserted, recordsUpdated, recordsRejected, errorSummary

### Intelligence, Analytics & Investigation Models
- **`AnalysisRun`** (`analysis_runs`): id, runType, status, startedAt, completedAt, parameters, summary, triggeredBy
- **`StoreHealthSnapshot`** (`store_health_snapshots`): id, storeId, analysisRunId, snapshotDate, revenueChangePct, footfallChangePct, wastageRatePct, stockoutRatePct, customerComplaintScore, urgencyScore, healthStatus, isCriticalOverride, riskDrivers, metrics, createdAt
- **`DetectedIssue`** (`detected_issues`): id, storeId, analysisRunId, issueType, severity, title, description, evidence, confidence, status, createdAt, updatedAt
- **`Investigation`** (`investigations`): id, storeId, issueId, title, status, hypothesis, findings, confidence, aiExplanation, createdAt, updatedAt
- **`InvestigationNode`** (`investigation_nodes`): id, investigationId, entityType, entityId, label, nodeType, data, createdAt
- **`InvestigationEdge`** (`investigation_edges`): id, investigationId, sourceNodeId, targetNodeId, relationshipType, confidence, evidence, createdAt
- **`EvidenceRecord`** (`evidence_records`): id, investigationId, source, evidenceType, data, confidence, verified, createdAt

### Decision & Simulation Models
- **`Decision`** (`decisions`): id, storeId, issueId, title, problemSummary, status, primaryRecommendationId, createdAt, updatedAt
- **`DecisionOption`** (`decision_options`): id, decisionId, actionType, title, description, parameters, estimatedCost, estimatedBenefit, roi, riskLevel, feasibilityScore, isRecommended, createdAt
- **`DecisionSimulation`** (`decision_simulations`): id, decisionId, optionId, simulationName, inputParameters, projectedOutcomes, revenueImpact, wastageReductionPct, stockoutRecoveryHours, netFinancialImpact, simulationLog, isReadOnly, createdAt

### Action Execution, Approvals & Tasks
- **`Action`** (`actions`): id, storeId, issueId, actionType (`markdown`, `urgent_replenishment`, `inter_store_transfer`, `store_task`), title, proposal, estimatedImpact, status (`proposed`, `pending_approval`, `approved`, `rejected`, `executing`, `completed`, `failed`), createdBy, createdAt, executedAt
- **`ActionApproval`** (`action_approvals`): id, actionId, decision (`approved`, `rejected`), approver, reason, decidedAt
- **`ActionExecutionResult`** (`action_execution_results`): id, actionId, executionType (`simulated_execution`), executionStatus (`success`), executedBy, executedAt, executionDetails, generatedTasks, auditSummary
- **`StoreTask`** (`store_tasks`): id, storeId, actionId, title, instructions, priority (`low`, `medium`, `high`, `urgent`), status (`pending`, `in_progress`, `completed`), assignedTo, dueDate, createdAt, completedAt
- **`AuditLog`** (`audit_logs`): id, actionId, actor, eventType (`action_proposed`, `action_approved`, `action_rejected`, `action_executed`), details, createdAt

### Audio Briefings, AI Assistant & Jobs (Phase 6)
- **`Briefing`** (`briefings`): id, storeId, scope (`network_overview`, `store_specific`), scriptText, audioUrl, audioHash, durationSeconds, generatedAt, expiresAt, metadata
- **`AssistantConversation`** (`assistant_conversations`): id, userId, storeId, sessionTitle, messages (JSONB array), createdAt, updatedAt
- **`AiGenerationJob`** (`ai_generation_jobs`): id, jobType (`briefing_script`, `tts_audio`, `grounded_query`), status, inputPayload, outputResult, error, createdAt, completedAt

### Access Control
- **`User`** (`users`): id, email, passwordHash, fullName, role, createdAt, updatedAt
- **`StoreAssignment`** (`store_assignments`): id, userId, storeId, role, createdAt

---

## 3. Registered API Endpoints

### System & Health
- `GET /api/v1/health` — System health check & db connectivity

### Operational Master & Data Engine (Phase 1)
- `GET /api/v1/stores` — List all active stores
- `GET /api/v1/stores/:storeId/sales` — Store daily sales with filtering & pagination
- `GET /api/v1/stores/:storeId/inventory` — Stock levels with `lowStockOnly` filter
- `GET /api/v1/stores/:storeId/wastage` — Wastage events & financial loss
- `GET /api/v1/stores/:storeId/purchase-orders` — Purchase orders & PO line items
- `POST /api/v1/imports` — Universal CSV / JSON dataset ingestion with validation
- `POST /api/v1/imports/seed-demo` — Realistic operational demo data seeder

### Store Health Intelligence & Urgency Ranking (Phase 2)
- `GET /api/v1/analytics/overview` — Network-wide KPIs, health distribution & top at-risk stores
- `GET /api/v1/analytics/stores` — Store health snapshots with urgency ranking and risk drivers ($R, W, S, C$)
- `POST /api/v1/analytics/run` — Run deterministic analysis engine with critical-risk overrides

### Causal Signal Graph & AI Investigation Room (Phase 3)
- `GET /api/v1/stores/:storeId/investigation` — Fetch causal DAG graph with observed/derived relationship edges and grounded AI narrative
- `GET /api/v1/issues/:issueId/evidence` — Fetch structured evidence bundle slice for a specific issue
- `POST /api/v1/investigations/:id/refresh` — Re-evaluate causal signals on latest telemetry

### Decision Engine & What-If Simulator (Phase 4)
- `POST /api/v1/decisions/generate` — Generate decision package with feasible options (urgent replenishment, inter-store transfer, markdown)
- `GET /api/v1/decisions/:id` — Retrieve decision package with options, cost/benefit estimates, and simulation history
- `POST /api/v1/decisions/:id/simulate` — Execute parameterized, read-only counterfactual simulation

### Human-in-the-Loop Approvals & Action Execution (Phase 5)
- `GET /api/v1/actions` — List operational actions with status and store filters
- `POST /api/v1/actions` — Propose a new action and queue for human sign-off
- `POST /api/v1/actions/:id/approve` — Record human approval with approver metadata & reasoning
- `POST /api/v1/actions/:id/reject` — Record human rejection decision with justification
- `POST /api/v1/actions/:id/execute` — Execute approved action in sandbox environment (strictly blocks unapproved actions, dispatches associate tasks, logs audit trail)

### Audio Briefings & AI Operations Assistant (Phase 6)
- `GET /api/v1/briefings/latest` — Fetch latest executive audio briefing, script text, audio URL, and metadata
- `POST /api/v1/briefings/generate` — Generate new executive audio briefing with SHA-256 script hashing and disk caching
- `GET /api/v1/audio/cache/:filename` — Stream / serve cached briefing audio files
- `POST /api/v1/assistant/query` — Evidence-grounded natural language query engine (strictly protected against arbitrary SQL execution, cites telemetry sources)
- `GET /api/v1/assistant/conversations/:conversationId` — Retrieve conversation history

---

## 4. Phase Completion Log
- [x] **Phase 0 — Project Foundation**: Initialized backend, TypeScript, Express, Prisma, Error handling, Health Check.
- [x] **Phase 1 — Operational Data Engine**: Models for products, sales, inventory, wastage, POs, and imports; CSV validation engine; operational endpoints; and realistic demo seeder.
- [x] **Phase 2 — Store Health Intelligence & Urgency Ranking**: Analysis runs, health snapshots, deterministic comparisons, normalized urgency formula ($U = 0.35R + 0.25W + 0.25S + 0.15C$), critical-risk bypass rules, overview KPIs, and stores analytics endpoints.
- [x] **Phase 3 — Causal Signal Graph & AI Investigation Room**: Models for investigations, nodes, edges, evidence records; Causal Graph Engine linking PO delays $\to$ inventory shortages $\to$ lost sales with `observed`/`derived`/`unknown` edge typing; provider-independent grounded AI explanation adapter.
- [x] **Phase 4 — Decision Engine & What-If Simulator**: Models for decisions, options, and simulations; Decision Engine generating feasible options (urgent replenishment, markdown, inter-store transfer); read-only What-If simulator.
- [x] **Phase 5 — Human-in-the-Loop Approval & Action Execution**: Models for actions, approvals, execution results, store tasks, audit logs; strict human approval enforcement before execution; transaction boundaries preventing duplicate execution; store task dispatch; complete state machine lifecycle.
- [x] **Phase 6 — Audio Executive Briefing & AI Operations Assistant**: Models for briefings, assistant conversations, and AI generation jobs; executive briefing script generator with latest urgency rankings; server-side TTS integration with SHA-256 hash caching; evidence-grounded natural language query endpoint with SQL injection prevention and deterministic telemetry citations.
