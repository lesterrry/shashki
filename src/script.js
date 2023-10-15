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

let flocks = {}

function createCell(size) {
	const cell = document.createElement('picture');
	cell.style.width = size + 'px';
	cell.style.height = size + 'px';
	cell.style.backgroundColor = CMYK.random()
	cell.className = 'cell';
	return cell;
}

function createFlock(id, squareSize, rows, columns) {
	const container = document.getElementById('canvas');

	const flock = document.createElement('div')
	flock.className = 'flock'
	flock.id = id
	flock.style.width = (squareSize * columns) + 'px';
	flock.style.height = (squareSize * rows) + 'px';

	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < columns; x++) {
			const square = createCell(squareSize);
			square.style.left = x * squareSize + 'px';
			square.style.top = y * squareSize + 'px';
			flock.appendChild(square);
		}
	}

	container.appendChild(flock)
}

Array.prototype.random = function () {
	console.log(this[Math.floor((Math.random() * this.length))])
	return this[Math.floor((Math.random() * this.length))];
}

window.addEventListener('load', () => {
	createFlock('s', 60, 10, 20)
});
