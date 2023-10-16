/*************************
Handcrafted by Aydar N.
2023

me@aydar.media
*************************/

import './style.css'
import $ from 'jquery';

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
let headings = []

let $container, $frame

const createCell = (size, color) => {
	const $cell = $('<picture></picture>')
	$cell.css('width', size + 'px');
	$cell.css('height', size + 'px');
	$cell.css('backgroundColor', color);
	$cell.addClass('cell')
	return $cell;
}

const createRandomColor = (colorDict, index) => {
	return (colorDict['makeCheckers'] && index % 2 === 0) ? '#FFFFFF' : colorDict['array'].random()
}

const createFlock = (id, cellSize, rows, columns, color) => {
	const [width, height] = [(cellSize * columns) + 'px', (cellSize * rows) + 'px']

	const $container = $('#canvas');
	const $frame = $('#id')

	const $flock = $('<div></div>');
	$flock.addClass(flocks.length === 0 ? 'flock primary' : 'flock')
	$flock.id = id
	$flock.css('width', width); $frame.css('width', width)
	$flock.css('height', height); $frame.css('height', height);

	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < columns; x++) {
			const $cell = createCell(cellSize, Array.isArray(color) ? color[(y + 1) * x] : createRandomColor(color, x + y));
			$cell.css('left', x * cellSize + 'px');
			$cell.css('top', y * cellSize + 'px');
			$flock.append($cell);
		}
	}

	flocks.push($flock)
	$container.append($flock)
}

const calc = (percent, px) => {
	const tail = px >= 0 ? `+ ${px}` : `- ${Math.abs(px)}`
	return `calc(${percent}% ${tail}px)`
}

const createHeading = (text, x, y, additionalStyles = null) => {
	const $heading = $('<h1></h1>')
	$heading.html(text)
	$heading.css('top', calc(50, y))
	$heading.css('left', calc(50, x))
	console.log(calc(50, x))
	for (let i in additionalStyles) $heading.css(i, additionalStyles[i]);

	$container.append($heading)

	const $stroke = $heading.clone(true)
	$stroke.addClass('stroke')
	$container.append($stroke)

	headings.push($heading)
}

Array.prototype.random = function () {
	return this[Math.floor((Math.random() * this.length))];
}

window.addEventListener('load', () => {
	$container = $('#canvas');
	$frame = $('#frame');

	createFlock('s', 80, 8, 16, { array: CMYK, makeCheckers: true })
	createHeading('общее и частное<br>московских таксистов', -590, -260)
	createHeading('сквозь оформление<br>машин такси', -110, 150, { textAlign: 'right' })
});
