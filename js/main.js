import {getAllColorPalettes} from "./generateColors.js";

/**
 * Render one palette row in the table.
 *
 * @param {string[]} colors   Array of 8 hex strings (Primary, Secondary … Energy 2)
 * @param {number}    rowIdx  Zero‑based index of this row
 */
function renderPaletteRow(colors, rowIdx) {
	const table = document.getElementById('color-palette-table');

	// Create a new row for this palette
	const tr = document.createElement('tr');

	// ---- first cell: the row number (1‑based) ----
	const numTd = document.createElement('td');
	numTd.textContent = String(rowIdx + 1);
	numTd.className = 'color-cell';
	tr.appendChild(numTd);

	colors.forEach((hex, idx) => {
		const td = document.createElement('td');
		td.className = 'color-cell';

		// colored swatch
		const swatch = document.createElement('div');
		swatch.className = 'color-swatch';
		swatch.style.backgroundColor = hex;

		// hex label
		const label = document.createElement('span');
		label.className = 'color-hex-label';
		label.textContent = hex;

		td.appendChild(swatch);
		td.appendChild(label);
		tr.appendChild(td);
	});

	// Build the paletteEncoded string
	// Remove '#' and append the 1‑based position
	const encodedPalette = colors
		.map((c, i) => c.slice(1).toUpperCase() + String(i + 1))
		.join('-');
	const url = `https://www.warframecolorpicker.app/?paletteEncoded=v1___0-${encodedPalette}`;

	// ---- new cell: button to open palette in warframecolorpicker.app ----
	const btnTd = document.createElement('td');
	btnTd.className = 'color-cell';
	const openLink = document.createElement('a');
	openLink.textContent = 'Open';
	openLink.className = 'open-palette-button';   // keeps the same styling
	openLink.href = url;                           // <-- important
	openLink.target = '_blank';

	openLink.addEventListener('click', () => {
		window.open(url, '_blank');
	});

	btnTd.appendChild(openLink);
	tr.appendChild(btnTd);

	table.appendChild(tr);
}

/**
 * Remove all rows that are not part of the header.
 */
function clearPaletteRows() {
	const table = document.getElementById('color-palette-table');
	while (table.children.length > 1) {   // keep only <thead>
		table.removeChild(table.lastChild);
	}
}

document.addEventListener('DOMContentLoaded', function () {
	const toneCheckbox = document.getElementById('tone-checkbox');
	const toneSlider = document.getElementById('tone-slider');
	const toneSliderLabel = document.getElementById('tone-slider-label');
	const toneValue = document.getElementById('tone-value');
	const generateButton = document.getElementById('generate-button');
	const paletteCountInput = document.getElementById('palette-count');

	// Helper to update slider state based on checkbox
	function toggleSlider() {
		toneSlider.disabled = !toneCheckbox.checked;
		toneSliderLabel.disabled = !toneCheckbox.checked;
		toneValue.textContent = getToneDescription(toneSlider.value);
	}

	function getToneDescription(value) {
		switch (value) {
			case '1':
				return 'darker';
			case '2':
				return 'dark';
			case '3':
				return 'medium';
			case '4':
				return 'light';
			case '5':
				return 'lighter';
			default:
				return '';
		}
	}

	// Update the tone value when the slider changes
	toneSlider.addEventListener('input', toggleSlider);

	// Initial state
	toggleSlider();

	// Update when the checkbox changes
	toneCheckbox.addEventListener('change', toggleSlider);

	generateButton.addEventListener('click', function () {
		const palettes = getAllColorPalettes(toneCheckbox.checked ? toneSlider.value : 0, parseInt(paletteCountInput.value, 10) || 5);

		if (palettes.length > 0) {
			clearPaletteRows();
			// Render each palette with its row number
			palettes.forEach((p, i) => renderPaletteRow(p, i));


			/* ---- show the panel now that it has content ---- */
			const panel = document.getElementById('color-palette-panel');
			panel.style.display = 'block';
		}
	});
});
