<div align="center">

<img src="public/icons/icon.svg" width="72" height="72" alt="Minimal Chrome Tab logo" />

# Minimal Chrome Tab

*For when the default new tab has already annoyed you.*

**A calm, resource-friendly replacement for your browser's new tab page.**

Shows the current time and how far you are through the day, week, month, year – and your year of life. Nothing else. No feeds, no widgets, no spyware.

[![Demo](https://img.shields.io/badge/demo-live-2ea44f?logo=google-chrome&logoColor=white)](https://khmm12.github.io/minimal-chrome-tab/)
[![Latest release](https://img.shields.io/github/v/release/khmm12/minimal-chrome-tab?include_prereleases&label=release)](https://github.com/khmm12/minimal-chrome-tab/releases)
[![Tests](https://github.com/khmm12/minimal-chrome-tab/actions/workflows/test.yml/badge.svg)](https://github.com/khmm12/minimal-chrome-tab/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](#license)

[**Live demo**](https://khmm12.github.io/minimal-chrome-tab/) · [Install](#-install) · [Features](#-features) · [Development](#-development)

</div>

<br />

<table align="center">
  <tr>
    <td align="center"><img src="https://github.com/user-attachments/assets/2eecfe89-ae18-49d5-a307-05e9ae3ea833" alt="Light mode" width="420" /><br /><sub><b>Light mode</b></sub></td>
    <td align="center"><img src="https://github.com/user-attachments/assets/845e5fba-97bb-49ca-884e-9278416a5263" alt="Dark mode" width="420" /><br /><sub><b>Dark mode</b></sub></td>
  </tr>
</table>

## Why

One day I realized the default new tab keeps running – eating memory and CPU – even when I'm not looking at it. For a page that mostly shows a search box I rarely touch, that felt ridiculous.

So I replaced it with a single, quiet screen that **suspends itself the moment the tab loses focus**, and wakes up instantly when you come back. It's the new tab page as it should be: there when you need it, invisible when you don't.

## ✨ Features

- 🪶 **Lightweight, all the way down** – easy on resources, minimal permissions, zero clutter.
- 💅 **Easy on the eyes** – clean typography and thoughtful spacing, and it never tries to sell you anything.
- ⚡️ **Blazing fast** – tiny bundle, instant first paint.
- 🕵️ **Private by design** – no analytics, no tracking, no network calls.
- 🕒 **Time at a glance** – current date and clock, updated to the second.
- 📊 **Life in progress** – how much of the day, week, month, and year has elapsed – and your year of life.
- 📐 **Pick a layout** – compact bars, detailed bars, or a single horizontal sweep.
- 🌓 **Light & dark** – follows your OS theme automatically, or lock it to one.
- 🔋 **Suspends when idle** – pauses all work when the tab isn't focused, so it costs nothing in the background.

## 📦 Install

The extension is distributed straight from [GitHub Releases](https://github.com/khmm12/minimal-chrome-tab/releases) – no store account required. You load it unpacked; it takes about a minute.

### Chrome, Edge & other Chromium browsers

1. Grab a build:
   - **Stable** – download `minimal-chrome-tab.zip` from the [latest release](https://github.com/khmm12/minimal-chrome-tab/releases/latest).
   - **Bleeding edge** – the auto-published [`nightly` build](https://github.com/khmm12/minimal-chrome-tab/releases/download/nightly/minimal-chrome-tab.zip), rebuilt from `main`.
2. Unzip it somewhere permanent (deleting the folder uninstalls the extension).
3. Open `chrome://extensions` (or `edge://extensions`).
4. Turn on **Developer mode** (top-right).
5. Click **Load unpacked** and select the unzipped folder.
6. Open a new tab. 🎉

> [!TIP]
> Prefer to build it yourself? See [Building from source](#-building-from-source), then run **Load unpacked** on the generated `dist/` folder.

### Firefox

Firefox only runs signed extensions permanently, so an unpacked install is **temporary** – it's cleared on restart. To try it out:

1. Build the extension (see [Building from source](#-building-from-source)).
2. Open `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on** and pick the `manifest.json` inside the `dist/` folder.

## 🧰 Development

Prerequisites: [Node.js](https://nodejs.org) 22 or newer (an active LTS is recommended) and [pnpm](https://pnpm.io).

```bash
pnpm i        # install dependencies
pnpm dev      # start the Vite dev server with hot reload
```

Useful scripts:

| Command          | What it does                                |
| ---------------- | ------------------------------------------- |
| `pnpm dev`       | Dev server with hot reload                  |
| `pnpm build`     | Production build into `dist/`               |
| `pnpm test`      | Lint + typecheck + unit tests (everything)  |
| `pnpm test:unit` | Unit tests only (Vitest)                    |
| `pnpm lint`      | ESLint                                       |
| `pnpm typecheck` | TypeScript checks                           |

## 📦 Building from source

```bash
pnpm i
pnpm build
```

The bundled extension lands in `dist/`, ready to be loaded unpacked (see [Install](#-install)).

## 🧱 Tech stack

[SolidJS](https://www.solidjs.com/) · [TypeScript](https://www.typescriptlang.org/) · [Vite](https://vitejs.dev/) · [Panda CSS](https://panda-css.com/) · [Valibot](https://valibot.dev/) · Chrome Extension Manifest V3.

## 🤝 Contributing

Contributions are welcome. Please keep changes small and focused, follow [Conventional Commits](https://www.conventionalcommits.org/), and run `pnpm test` before opening a pull request. UI changes should include a screenshot.

## License

[MIT](LICENSE) © [Maxim Khvatalin](https://github.com/khmm12)
