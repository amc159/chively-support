# Chively Help Center - Writer Briefs (Priority Queue)

Use this document to draft new help articles in a consistent voice and structure.

## Writing Standards

- Product tone: clear, practical, action-oriented.
- Stay hardware/POS-platform agnostic unless the article is explicitly hardware-model specific.
- Use plain language for frontline restaurant operators.
- Keep sections consistent:
  - `Overview`
  - `Before you begin`
  - `Steps`
  - `Verification`
  - `Need help?`
- Avoid vendor claims you cannot verify from source docs.
- Use screenshot placeholders and replace later with actual captures.

## Article Template (Copy/Paste)

```md
---
title: "ARTICLE TITLE"
description: "One-sentence summary of the task outcome."
category: "CATEGORY NAME"
categorySlug: "CATEGORY SLUG"
tags: ["tag1", "tag2", "tag3"]
publishedAt: "2026-03-24T00:00:00Z"
updatedAt: "2026-03-24T00:00:00Z"
---

## Overview

Explain when to use this guide and what success looks like.

## Before you begin

- Prerequisite 1
- Prerequisite 2
- Prerequisite 3

## Steps

1. Step with action + expected result.
2. Step with action + expected result.
3. Step with action + expected result.

<div className="screenshot-placeholder">
  <p className="screenshot-placeholder__title">Screenshot Placeholder</p>
  <p className="screenshot-placeholder__note">Describe exact screenshot needed for this step.</p>
</div>

## Verification

- Validation point 1
- Validation point 2
- Validation point 3

## Need help?

Contact Chively Support at **+1 (800) 439-8229** or **support@chively.com**.
```

---

## Priority 1 Briefs

### 1) Connect Third-Party Delivery Platforms
- **Category:** Online Ordering & Delivery (`online-ordering`)
- **Audience:** Admin/manager
- **Goal:** Connect delivery platforms and confirm orders flow into operations.
- **Must include:**
  - Required accounts/permissions
  - Connection checklist per platform
  - Sync validation and test order workflow
- **Screenshots needed:**
  - Integrations page
  - Connected status indicators
  - Test order confirmation
- **Acceptance criteria:**
  - Reader can connect at least one platform and run a successful test order.

### 2) Set Up Online Ordering Storefront
- **Category:** Online Ordering & Delivery (`online-ordering`)
- **Audience:** Admin/manager
- **Goal:** Publish an online ordering page customers can use.
- **Must include:**
  - Store profile basics (hours, address, contact)
  - Menu visibility rules
  - Publish/check link process
- **Screenshots needed:**
  - Storefront settings
  - Menu publish controls
  - Live storefront preview
- **Acceptance criteria:**
  - Reader can publish storefront and place one test order.

### 3) Open API Integration Setup (Restaurant Website/App)
- **Category:** Online Ordering & Delivery (`online-ordering`)
- **Audience:** Technical admin / implementation partner
- **Goal:** Enable API-driven order intake from external web/app.
- **Must include:**
  - Prerequisite credentials
  - Endpoint/auth summary
  - Test payload and response checks
- **Screenshots needed:**
  - API credentials area
  - Integration settings
  - Successful request/response example
- **Acceptance criteria:**
  - Reader can authenticate and post a test order successfully.

### 4) Troubleshoot Delivery Order Sync Failures
- **Category:** Troubleshooting (`troubleshooting`)
- **Audience:** Support/admin
- **Goal:** Diagnose and resolve missing/late third-party delivery orders.
- **Must include:**
  - Connection status checks
  - Timezone/menu mismatch checks
  - Retry/reconnect sequence
- **Screenshots needed:**
  - Error state examples
  - Sync status panel
  - Reconnect controls
- **Acceptance criteria:**
  - Reader can identify failure point and restore order flow.

### 5) Publish and Sync Online Menus
- **Category:** Online Ordering & Delivery (`online-ordering`)
- **Audience:** Admin/manager
- **Goal:** Keep online menus accurate across channels.
- **Must include:**
  - Item availability rules
  - Modifier/add-on consistency
  - Republish and propagation timing
- **Screenshots needed:**
  - Menu edit view
  - Channel mapping/sync controls
  - Post-publish verification
- **Acceptance criteria:**
  - Reader can update an item and confirm it appears correctly online.

### 6) Configure Delivery Hours, Prep Time, and Pause Controls
- **Category:** Online Ordering & Delivery (`online-ordering`)
- **Audience:** Admin/manager
- **Goal:** Prevent orders outside operational capacity.
- **Must include:**
  - Service windows by channel
  - Prep-time buffers and cutoff behavior
  - Temporary pause/unpause workflow
- **Screenshots needed:**
  - Hours settings
  - Prep-time settings
  - Pause controls
- **Acceptance criteria:**
  - Reader can set realistic order windows and pause service safely.

### 7) Daily/Weekly/Monthly Sales Summary Report
- **Category:** Reports & Analytics (`reports`)
- **Audience:** Owner/manager
- **Goal:** Pull high-level sales performance over selected period.
- **Must include:**
  - Date range and timezone notes
  - Gross/net sales explanation
  - Basic interpretation tips
- **Screenshots needed:**
  - Report filters
  - Sales summary output
  - Export action
- **Acceptance criteria:**
  - Reader can generate and export summary for any time range.

### 8) Product and Item Sales Performance Report
- **Category:** Reports & Analytics (`reports`)
- **Audience:** Manager/operator
- **Goal:** Identify top and low-performing items.
- **Must include:**
  - Sort/filter by quantity/revenue
  - Category-level drilldown
  - Action ideas from findings
- **Screenshots needed:**
  - Item performance table
  - Filter controls
  - Export view
- **Acceptance criteria:**
  - Reader can isolate best/worst performers for a period.

### 9) Category Mix and Contribution Report
- **Category:** Reports & Analytics (`reports`)
- **Audience:** Manager/operator
- **Goal:** Understand category contribution to total sales.
- **Must include:**
  - Category mix percentage
  - Time range comparison
  - Margin/profit caveats (if unavailable, say so clearly)
- **Screenshots needed:**
  - Category report summary
  - Comparison controls
  - Export action
- **Acceptance criteria:**
  - Reader can quantify category share and identify shifts.

### 10) Payment Method Breakdown Report
- **Category:** Reports & Analytics (`reports`)
- **Audience:** Manager/accounting support
- **Goal:** Reconcile card/cash/other payment mix.
- **Must include:**
  - Payment type definitions
  - Void/refund impact notes
  - Reconciliation handoff tips
- **Screenshots needed:**
  - Payment breakdown report
  - Filter panel
  - Export results
- **Acceptance criteria:**
  - Reader can produce reliable payment totals for reconciliation.

### 11) End-of-Day Close and Financial Reconciliation
- **Category:** Reports & Analytics (`reports`)
- **Audience:** Shift lead/manager
- **Goal:** Close day accurately with report-backed totals.
- **Must include:**
  - Required checks before close
  - Over/short handling
  - Escalation conditions
- **Screenshots needed:**
  - EOD/close view
  - Reconciliation panel
  - Completion confirmation
- **Acceptance criteria:**
  - Reader can complete close with documented totals and exceptions.

### 12) Export Reports (CSV/XLS) and Filter Best Practices
- **Category:** Reports & Analytics (`reports`)
- **Audience:** Manager/ops analyst
- **Goal:** Export clean data for finance and performance review.
- **Must include:**
  - Filter hygiene checklist
  - Common export mistakes
  - File naming/versioning convention
- **Screenshots needed:**
  - Export modal
  - Filter setup example
  - Final file output
- **Acceptance criteria:**
  - Reader can export accurate, analysis-ready files on first attempt.

---

## Editorial QA Checklist (Use Before Publishing)

- Title starts with a strong verb and matches user intent.
- Description states practical outcome, not marketing language.
- Steps are numbered, unique, and non-redundant.
- Screenshot placeholders clearly state what to capture.
- Verification section is concrete and testable.
- Category and `categorySlug` are correct.
- Terminology is consistent (`Management Page`, `POS`, `KDS`, etc.).
