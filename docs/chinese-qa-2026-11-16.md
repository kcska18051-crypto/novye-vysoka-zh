# Chinese copy QA — 2026-11-16

Source: novye-vysoka-design @ c2516d796b47fd7a633923592bf299eef906f7ab. Original Russian publishing ref: 729847d0ba627d3d57ccbc39a635258334049104.

- Independent clone; russian-source remote push URL disabled. New GitHub repository novye-vysoka-zh.
- HTML and runtime copy translated directly, stable IDs and original route lookup queries preserved. Price amounts, currency, dates, areas and payment terms verified against source.
- All 45 node tests pass. Ten inherited stale content tests failed identically on original Russian baseline; expectations refreshed to current approved behavior, no features removed to satisfy tests.
- Every runtime JS file passes node --check. git diff --check passes.
- Chromium zh-CN, reduced motion, widths 320 / 390 / 768 / 1440: no horizontal page overflow, no Cyrillic rendered text or accessible copy, no page errors, no local HTTP errors, no outgoing form requests.
- At each width: all 9 gallery scenes; all 12 city/transport combinations; all 4 named plans with zoom; location dialog; mobile menu; surroundings tabs; FAQ; all form intents; native Chinese validation; demo fill and backend-gated success event; local muted video; manual forest audio start/stop.
- Artwork: original brand icon retained, Chinese wordmark; map and plan legends localized as SVG. Plot geometry and numbers retained. Regional diagram localized to Chinese with original destinations and distances.
- All 5 PDF files localized. Brochure has 3 pages, each plan has 1 page. PDFs rendered with PyMuPDF; brochure pages and plan labels visually inspected. Original Russian documents archived in source-assets, not site paths.
- Photos, footage, contacts and external references preserved. Real photographed signage and third-party website/player language remain controlled by their original sources.

Browser results: chinese-browser-checks.json. Browser automation: tools/verify-chinese-browser.cjs.
