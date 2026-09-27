/**
 * OKLCH → RGB conversion
 *
 * The code follows the same logic:
 * 1. Convert hue from degrees to radians.
 * 2. Iteratively reduce chroma until the resulting linear‑RGB values are in gamut.
 * 3. Convert linear RGB to sRGB (8‑bit).
 */
class ColorOKLCH {
	constructor(luminance, chroma, hue) {
		this.luminance = luminance; // f64
		this.chroma = chroma;       // f64
		this.hue = hue;             // degrees
	}

	/**
	 * OKLab → linear‑sRGB conversion.
	 */
	static oklabToLinearRGB(l, a, b) {
		// OKLab -> LMS
		const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
		const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
		const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

		// Cube
		const lCube = l_ * l_ * l_;
		const mCube = m_ * m_ * m_;
		const sCube = s_ * s_ * s_;

		// LMS -> linear sRGB
		const r =
			4.0767416621 * lCube -
			3.3077115913 * mCube +
			0.2309699292 * sCube;
		const g =
			-0.7537829609 * lCube +
			1.7030021000 * mCube +
			0.0503321882 * sCube;
		const b_ =
			-0.0069823900 * lCube -
			0.0778265950 * mCube +
			0.9569529682 * sCube;

		return [r, g, b_];
	}

	/**
	 * Linear sRGB (0‑1) → 8‑bit sRGB.
	 */
	static linearToSRGB(value) {
		const clamped = Math.min(1.0, Math.max(0.0, value));
		const srgb =
			clamped <= 0.0031308
				? 12.92 * clamped
				: 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
		return Math.round(srgb * 255);
	}

	/**
	 * Convert the OKLCH color to an RGB object.
	 */
	toRGB() {
		const hueRad = (this.hue * Math.PI) / 180; // to radians

		let chroma = this.chroma;
		for (let i = 0; i < 20; i++) {
			const a = chroma * Math.cos(hueRad);
			const b = chroma * Math.sin(hueRad);

			const [red, green, blue] = ColorOKLCH.oklabToLinearRGB(this.luminance, a, b);

			if (red >= 0.0 && red <= 1.0 && green >= 0.0 && green <= 1.0 && blue >= 0.0 && blue <= 1.0) {
				return new ColorRGB(ColorOKLCH.linearToSRGB(red), ColorOKLCH.linearToSRGB(green), ColorOKLCH.linearToSRGB(blue));
			}

			// Reduce chroma and try again.
			chroma *= 0.9;
		}

		// Final fallback – clamp instead of discarding.
		const a = chroma * Math.cos(hueRad);
		const b = chroma * Math.sin(hueRad);

		const [red, green, blue] = ColorOKLCH.oklabToLinearRGB(this.luminance, a, b);

		return new ColorRGB(ColorOKLCH.linearToSRGB(red), ColorOKLCH.linearToSRGB(green), ColorOKLCH.linearToSRGB(blue));
	}

	/**
	 * Return a hex string like `#FF00AA`.
	 */
	toHexString() {
		const rgb = this.toRGB();
		const pad = (c) => c.toString(16).padStart(2, '0').toUpperCase();
		return `#${pad(rgb.red)}${pad(rgb.green)}${pad(rgb.blue)}`;
	}

	/**
	 * Return a terminal swatch string.
	 */
	toTerminalSwatch() {
		const rgb = this.toRGB();
		return `\x1b[48;2;${rgb.red};${rgb.green};${rgb.blue}m  \x1b[0m`;
	}
}

/**
 * Simple RGB container – same shape as the Rust struct.
 */
class ColorRGB {
	constructor(red, green, blue) {
		this.red = red;
		this.green = green;
		this.blue = blue;
	}
}

export {ColorOKLCH, ColorRGB};
