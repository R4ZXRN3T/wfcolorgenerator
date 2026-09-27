import {ColorOKLCH} from "./colors.js";

/* ---------- Tone → Luminance & Chroma multipliers ---------- */
const TONE_SETTINGS = {
	// tone: [minLum, maxLum], chromaMultiplier
	1: {lum: [0.20, 0.35], chromaMul: 0.5},   // dark
	2: {lum: [0.30, 0.45], chromaMul: 0.6},
	3: {lum: [0.40, 0.55], chromaMul: 1.0},   // medium
	4: {lum: [0.55, 0.70], chromaMul: 1.2},
	5: {lum: [0.65, 0.80], chromaMul: 1.3}    // lighter
};

/* ---------- Helpers ---------- */
function randInRange(min, max) {
	return Math.random() * (max - min) + min;
}

/* ---------- Central color ---------- */
function centralColor(tone = 0) {
	const hue = randInRange(0, 360);          // free hue
	let lumMin, lumMax, chromaMul;

	if (tone === 0 || !TONE_SETTINGS[tone]) {    // unrestricted
		lumMin = 0.30;
		lumMax = 0.70;
		chromaMul = 1.0;
	} else {
		({lum: [lumMin, lumMax], chromaMul} = TONE_SETTINGS[tone]);
	}

	const luminance = randInRange(lumMin, lumMax);
	const baseChroma = randInRange(0.15, 0.45) * chromaMul;

	return new ColorOKLCH(luminance, baseChroma, hue);
}

/* ---------- Role tweak ---------- */
function tweak(base, {lumOff, chromaFac}) {
	let l = Math.min(1.0, Math.max(0.0, base.luminance + lumOff));
	const c = Math.max(0.0, base.chroma * chromaFac);
	return new ColorOKLCH(l, c, base.hue);
}

/* ---------- Build one palette (central first) ---------- */
export function buildPalette(tone = 0) {
	const central = centralColor(tone);

	// role order: primary, secondary, tertiary, accent,
	// emissive 1, emissive 2, energy 1, energy 2
	const roles = [
		{lumOff: -0.25, chromaFac: 0.1},  // primary – almost gray
		{lumOff: -0.20, chromaFac: 0.12}, // secondary – slightly more saturated
		{lumOff: 0.05, chromaFac: 0.3},   // tertiary – transition
		{lumOff: 0.15, chromaFac: 0.7},   // accent – high saturation
		{lumOff: 0.35, chromaFac: 0.8},   // emissive 1 – very bright
		{lumOff: 0.40, chromaFac: 0.85},  // emissive 2 – slightly brighter
		{lumOff: 0.25, chromaFac: 0.75},  // energy 1 – bright & saturated
		{lumOff: 0.30, chromaFac: 0.80}   // energy 2 – even more saturated
	];

	const palette = roles.map(r => tweak(central, r).toHexString());
	return [...palette];   // now 1 + 8 = 9 hex strings
}

/* ---------- Public API (keeps existing signature) ---------- */
export function getAllColorPalettes(tone = 0, numPalettes = 5) {
	const palettes = [];
	for (let i = 0; i < numPalettes; ++i) {
		// if tone==0 → unrestricted: pick a random tone
		const t = tone === 0 ? Math.floor(Math.random() * 5) + 1 : tone;
		palettes.push(buildPalette(t));
	}
	return palettes;
}
