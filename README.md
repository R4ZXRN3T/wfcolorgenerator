# Warframe Color Generator

A lightweight web‑app that produces random or tone‑specific color palettes for the game **Warframe**.
The generated palettes can be opened directly in [warframecolorpicker.app](https://www.warframecolorpicker.app) to
preview them in the game’s UI.

> **Author:** R4ZXRN3T
> **License:** GPL v3.0 (see [LICENSE](LICENSE))

[![Ko-Fi](https://img.shields.io/badge/Ko--fi-%23F16061.svg?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/r4zxrn3t)

---

## Table of Contents

- [Features](#features)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
	- [Prerequisites](#prerequisites)
	- [Running Locally](#running-locally)
	- [Deploying to a Web Server](#deploying-to-a-web-server)
- [Using the App](#using-the-app)
- [Palette Encoding Format](#palette-encoding-format)
- [Contributing](#contributing)
- [License](#license)

---

## Features

| Feature               | Description                                                                                                  |
|-----------------------|--------------------------------------------------------------------------------------------------------------|
| **Tone Selection**    | Pick one of five tones (darker, dark, medium, light, lighter) or let the generator choose randomly.          |
| **Multiple Palettes** | Generate up to 10 palettes in a single click.                                                                |
| **Live Preview**      | Each palette row includes an “Open” button that launches `warframecolorpicker.app` with the encoded palette. |
| **Dark‑mode UI**      | Built‑in dark theme using CSS custom properties.                                                             |
| **Zero Dependencies** | Uses vanilla JavaScript (ES6 modules) and a small OKLCH → RGB conversion library.                            |

---

## How It Works

1. `generateColors.js` creates an **OKLCH** central color for the chosen tone.
2. Eight palette roles are derived by adjusting luminance and chroma (`tweak()`).
3. Each role is converted to hex via a custom OKLCH → RGB implementation (`colors.js`).
4. The resulting palettes are rendered in `main.js`.

The algorithm guarantees colors stay within sRGB gamut while maintaining the requested tonal balance.

---

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Edge, Safari)
- A local HTTP server to avoid CORS issues when opening the file directly
	- Running from file is not supported due to CORS restrictions in all modern browsers.

### Running Locally

```bash
# Clone the repo
git clone https://github.com/R4ZXRN3T/wfcolorgenerator.git
cd wfcolorgenerator

# Run a simple HTTP server. This example uses Node.js http-server, but you can use any server of your choice.
npx http-server . -p 8000
```

Open `http://localhost:8000` (or whatever port is set) in your browser.

### Deploying to a Web Server

The project contains only static assets.
Upload the following files and directories:

- `index.html`
- `style.css`
- `site.webmanifest`
- `js/` (contains `main.js`, `generateColors.js`, `colors.js`)
- `images/` (logo, favicons)
- `.gitattributes`, `.editorconfig`

No server‑side code is required.

---

## Using the App

1. **Tone**
	- Check *Use tone* to enable the slider.
	- Move the slider or select a value from the dropdown to pick a specific tone.
2. **Palettes**
	- Enter how many palettes you want (max 10).
	- Click **Generate** – the table will populate below.
3. **Open in Warframe Color Picker**
	- Each row has an *Open* button that opens `warframecolorpicker.app` with your palette pre‑loaded.

---

## Contributing

Feel free to open issues or submit pull requests.
When contributing:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feat/your-feature`).
3. Commit with clear messages.
4. Submit a pull request with a brief description of your changes.

---

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

---

*Happy coloring!*
