# MOJAR — BTC Goods-Receipt Tool

A tool for logging gold goods-receipt notes from the supplier **BTC (Bullion Trading Center)** for the **MOJAR Gold & Jewelry** shop.
It calculates the making charge (مصنعية) automatically from the wholesale table, converts 24K weight into its 21K equivalent, sums the total and cash, and saves every receipt inside the browser with search, PDF/Excel export, and backups.

---

## Versions in the repo

The repo contains the **same app** packaged three different ways depending on how you want to use it:

| Folder / File | For whom | How to use it |
|---|---|---|
| **`MOJAR.html`** (in the root) | Simplest use, single file | Double-click to open in the browser. Works fully offline (local Excel/PDF export). |
| **`web/`** | Multi-file PWA version | Install it as an app on Windows/Android, or deploy it to GitHub Pages or a server. |
| **`windows/`** | Run as a Windows app | The `.bat` opens the HTML in an Edge/Chrome window with no browser bar. Comes with a `.ico` icon. |

All three versions share identical data (`prices / making charges / item weights`). To edit a price:

- In `MOJAR.html` and `windows/MOJAR.html`: search for `cataloge` inside the `<script>` and edit it.
- In `web/`: edit `web/data.js` (easiest), or `web/btc-prices.csv` / `web/btc-prices.json` (for reference).

---

## Quick start

### Simplest way — single file
```
Double-click MOJAR.html
```

### On Windows, as an app with an icon
```
1. Put the windows/ folder in a fixed location (e.g. C:\MOJAR).
2. Double-click تشغيل-MOJAR.bat.
3. (Optional) Right-click the .bat → Create shortcut → Change Icon → MOJAR.ico → Pin to taskbar.
```
More details in `windows/اقرأني-Windows.md`.

### PWA / web hosting
```
1. Serve web/ from any server (local, GitHub Pages, or Cloudflare Pages).
2. Open it in Chrome/Edge — you'll see an "Install app" button.
```
More details in `web/README.md`.

---

## Tech

- Plain HTML/CSS/JavaScript, no build step.
- [SheetJS](https://sheetjs.com) (bundled locally) for Excel export.
- PDF printing via the browser's Print-to-PDF.
- Storage: `localStorage` inside the browser. Backups in JSON format.
- PWA: a simple Service Worker (`web/sw.js`) for offline operation after the first load.

---

## Notes on the price data

- The prices in this repo are for **season 2025 / 2026** from the BTC wholesale table.
- BTC's making charge changes every season — check `data.js` (or `btc-prices.csv`) when updates come in.
- **Pendant (تعليقة) rule**: any item whose name contains "تعليقة" has weight = original coin weight + 0.35 g (the weight of the pendant ring).
  Example: a plain pound (جنيه) = 8 g, a pendant pound = 8.35 g.

---

## License
MIT — see `LICENSE`.
