---
name: agent-browser
description: Use this skill for browser automation tasks — navigating websites, filling forms, clicking elements, extracting data, taking screenshots, and web scraping. Use when the user needs to interact with a website programmatically, scrape content, test web flows, or automate repetitive web tasks.
license: Source — github.com/vercel-labs/agent-browser (MIT)
---

# Browser Automation with agent-browser

## Security Rules (ALWAYS follow)

- NEVER use `--profile Default` or `--auto-connect` — this connects to the user's real Chrome with all their sessions
- NEVER use `agent-browser chat` — sends page content to Vercel's AI Gateway (ai-gateway.vercel.sh)
- NEVER use cloud providers (browserbase, browserless, agentcore) without explicit user confirmation
- NEVER run `agent-browser eval` with fetch/XMLHttpRequest to external URLs
- ALWAYS use isolated sessions (not the user's real Chrome profile)

## Installation

```bash
npm i -g agent-browser
agent-browser install  # Downloads isolated Chrome
```

## Core Workflow

Standard pattern: navigate → snapshot → interact → snapshot again.

```bash
# 1. Open a page
agent-browser open https://example.com

# 2. Snapshot to get element references
agent-browser snapshot -i

# 3. Interact using refs from snapshot (e.g. @e1, @e2)
agent-browser click @e1
agent-browser fill @e2 "search text"

# 4. Re-snapshot after DOM changes
agent-browser snapshot -i
```

## Key Commands

### Navigation & Capture

```bash
agent-browser open <url>          # Navigate to URL
agent-browser snapshot -i         # Get interactive element refs
agent-browser screenshot          # Capture screenshot
agent-browser get url             # Get current URL
agent-browser get title           # Get page title
agent-browser close               # End session
```

### Interaction

```bash
agent-browser click @e1           # Click element
agent-browser fill @e2 "text"     # Type into input
agent-browser select @e3 "option" # Choose from dropdown
agent-browser check @e1           # Toggle checkbox
agent-browser hover @e1           # Hover over element
agent-browser scroll @e1 down     # Scroll element
agent-browser press Enter         # Press keyboard key
```

### Data Extraction

```bash
agent-browser get text @e1        # Get text of element
agent-browser get attr @e1 href   # Get attribute value
```

### Batch Execution (efficient — use for 2+ sequential commands)

```bash
agent-browser batch \
  "open https://example.com" \
  "snapshot -i" \
  "click @e1"
```

## Authentication (safe patterns only)

```bash
# Save session after manual login (isolated session only)
agent-browser state save ./session.json

# Reuse saved session
agent-browser --state ./session.json open https://example.com

# HTTP Basic Auth
agent-browser set credentials username password
```

## PDF Export

```bash
agent-browser pdf output.pdf      # Save current page as PDF
```

## Screenshots

```bash
agent-browser screenshot                        # Full page
agent-browser screenshot --selector "#content"  # Specific element
agent-browser screenshot --full-page            # Full scrollable page
```

## Efficiency Patterns

- **Snapshot once, act many** — extract all needed refs from one snapshot before acting
- **Batch sequential commands** — reduces tool calls significantly
- **Collect URLs upfront** — use `--urls` flag instead of click-navigate-click chains

```bash
# Collect multiple URLs without navigating back and forth
agent-browser snapshot --urls
```

## Common Use Cases for Autonova

### Scrape competitor pricing page
```bash
agent-browser open https://competitor.com/pricing
agent-browser snapshot -i
agent-browser get text @e5  # pricing table element
agent-browser screenshot
```

### Pre-sales client research
```bash
agent-browser open https://client-site.com
agent-browser snapshot -i
agent-browser screenshot --full-page
agent-browser get text @e1  # hero/about section
```

### Export page as PDF report
```bash
agent-browser open https://target.com
agent-browser pdf ./reports/client-site.pdf
```
