/*************************
Handcrafted by Aydar N.
2023

me@aydar.media
*************************/

import './style.css'

const CMYK = [
	'#00AAE9',
	'#D92D8A',
	'#FFF34A',
	'#000000'
]
const MIX = [
	'#2F308C',
	'#DA3832',
	'#00A359',
	'#363639'
]

let flocks = []

const createCell = (size, color) => {
	const cell = document.createElement('picture');
	cell.style.width = size + 'px';
	cell.style.height = size + 'px';
	cell.style.backgroundColor = color
	cell.className = 'cell';
	return cell;
}

const createRandomColor = (colorDict, index) => {
	return (colorDict['makeCheckers'] && index % 2 === 0) ? '#FFFFFF' : colorDict['array'].random()
}

const createFlock = (id, cellSize, rows, columns, color) => {
	const [width, height] = [(cellSize * columns) + 'px', (cellSize * rows) + 'px']

	const container = document.getElementById('canvas');
	const frame = document.getElementById('frame');

	const flock = document.createElement('div')
	flock.className = flocks.length === 0 ? 'flock primary' : 'flock'
	flock.id = id
	flock.style.width = width; frame.style.width = width
	flock.style.height = height; frame.style.height = height

	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < columns; x++) {
			const square = createCell(cellSize, Array.isArray(color) ? color[(y + 1) * x] : createRandomColor(color, x + y));
			square.style.left = x * cellSize + 'px';
			square.style.top = y * cellSize + 'px';
			flock.appendChild(square);
		}
	}

	flocks.push(flock)
	container.appendChild(flock)
}

Array.prototype.random = function () {
	return this[Math.floor((Math.random() * this.length))];
}

window.addEventListener('load', () => {
	createFlock('s', 60, 10, 20, { array: CMYK, makeCheckers: true })
});
