import {ColorOKLCH} from "./colors.js";

export function getAllColorPalettes(tune, numPalettes = 5) {
	const colorPalettes = [numPalettes];
	for (let i = 0; i < numPalettes; i++) {
		let colorPalette = [];
		for (let j = 0; j < 8; j++) {
			colorPalette[j] = getRandomColorOKLCH(tune).toHexString();
		}
		colorPalettes[i] = colorPalette;
	}
	return colorPalettes;
}

function getRandomColorOKLCH(tune) {
	// Clamp tune to 1‑5 just in case.
	const t = Math.max(0, Math.min(5, parseInt(tune, 10)));

	// Define ranges per tune
	let luminanceMin, luminanceMax, chromaMin, chromaMax;
	switch (t) {
		case 1: // darker
			luminanceMin = 0.20;
			luminanceMax = 0.35;
			chromaMin = 0.10;
			chromaMax = 0.30;
			break;
		case 2: // dark
			luminanceMin = 0.35;
			luminanceMax = 0.45;
			chromaMin = 0.15;
			chromaMax = 0.35;
			break;
		case 3: // medium
			luminanceMin = 0.45;
			luminanceMax = 0.55;
			chromaMin = 0.20;
			chromaMax = 0.40;
			break;
		case 4: // light
			luminanceMin = 0.55;
			luminanceMax = 0.65;
			chromaMin = 0.25;
			chromaMax = 0.45;
			break;
		case 5: // lighter
			luminanceMin = 0.65;
			luminanceMax = 0.80;
			chromaMin = 0.30;
			chromaMax = 0.50;
			break;
		default: // unrestricted for value 0 or any other unexpected value
			luminanceMin = 0.20;
			luminanceMax = 0.80;
			chromaMin = 0.10;
			chromaMax = 0.50;
	}

	const luminance = getRandomNumber(luminanceMin, luminanceMax);
	const chroma = getRandomNumber(chromaMin, chromaMax);
	const hue = getRandomIntInclusive(0, 359);

	return new ColorOKLCH(luminance, chroma, hue);
}

function getRandomNumber(min, max) {
	return Math.random() * (max - min) + min;
}

function getRandomIntInclusive(min, max) {
	const minCeiled = Math.ceil(min);
	const maxFloored = Math.floor(max);
	return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}
