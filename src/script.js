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
let lastTime = 0

let currentScrollPx = 0
let currentScrollRegion = -1

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

const resolveColor = (color, arrayIndex = 0, randomIndex = 0) => {
	return Array.isArray(color) ? color[arrayIndex] : createRandomColor(color, randomIndex)
}

const createFlock = (id, cellSize, rows, columns, color) => {
	const [width, height] = [(cellSize * columns) + 'px', (cellSize * rows) + 'px']

	const $flock = $('<div></div>');
	$flock.addClass(flocks.length === 0 ? 'flock primary' : 'flock')
	$flock.attr('id', id)
	$flock.data('rows', rows)
	$flock.data('columns', columns)
	$flock.css('width', width); $frame.css('width', width)
	$flock.css('height', height); $frame.css('height', height);

	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < columns; x++) {
			const $cell = createCell(cellSize, resolveColor(color, (y + 1) * x, x + y));
			$cell.css('left', x * cellSize + 'px');
			$cell.css('top', y * cellSize + 'px');
			$flock.append($cell);
		}
	}

	flocks.push($flock)
	$container.append($flock)
}

const repaintFlock = (id, color) => {
	const $flock = $(`.flock#${id}`)
	const $children = $(`.flock#${id} > *`)

	const columns = $flock.data('columns')

	$children.each(function (i) {
		const [row, column] = [Math.floor(i / columns), i % columns]
		$(this).css({'background-color': resolveColor({ array: CMYK, makeCheckers: true }, 0, row + column), 'filter': ''})
	})
}

const sliceFlock = (id) => {
	const $flock = $(`.flock#${id}`)
	const columns = $flock.data('columns')
	const rows = $flock.data('rows')

	const result = [];

	for (let sum = 0; sum <= rows + columns - 2; sum++) {
		result[sum] = [];

		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < columns; c++) {
				if (r + c === sum) {
					result[sum].push($flock.children()[r * columns + c]);
				}
			}
		}
	}

	return result;
}


const calc = (percent, px) => {
	const tail = px >= 0 ? `+ ${px}` : `- ${Math.abs(px)}`
	return `calc(${percent}% ${tail}px)`
}

const mapValue = (value, l ,r, min, max) => {
	const normalizedValue = (value - l) / (r - l);
	const mappedValue = min + (max - min) * normalizedValue;
	// console.log(mappedValue)
	return mappedValue;
}

const createHeading = (text, x, y, additionalStyles = null) => {
	const $heading = $('<h1></h1>')
	$heading.html(text)
	$heading.css('top', calc(50, y))
	$heading.css('left', calc(50, x))

	for (let i in additionalStyles) $heading.css(i, additionalStyles[i]);

	$container.append($heading)

	const $stroke = $heading.clone(true)
	$stroke.addClass('stroke')
	$container.append($stroke)

	headings.push($heading)
}

const animate = (currentTime) => {
	const deltaTime = (currentTime - lastTime) / 1000;  // in seconds

	if (deltaTime >= 1) {
		if (currentScrollRegion === -1) repaintFlock('s', { array: CMYK, makeCheckers: true })
		lastTime = currentTime
	}

	window.requestAnimationFrame(animate)
}

const handleScroll = (pxValue, region, progress) => {
	switch (region) {
		case 0:
			const slice = sliceFlock('s')
			const mapped = Math.round(mapValue(progress, 0, 1, 0, slice.length))
			console.log(mapped)
			slice.forEach((i) => {
				$([].concat(...i.slice(0, mapped))).css('filter', `grayscale(${(progress * slice.length) * 100}%)`)
			})

			// $('.flock#s > *').css('filter', `grayscale(${currentScrollRegionProgress * 100}%)`)
			break
	}
}

Array.prototype.random = function () {
	return this[Math.floor((Math.random() * this.length))];
}

$(document).on("scroll", function() {
	const getRegion = (value) => {
		if (value < scrollRegions[0][0]) return -1
		for (let i = 0; i < scrollRegions.length; i++) {
			if (value >= scrollRegions[i][0] && value <= scrollRegions[i][1]) return i;
		}
		return 1000
	}

	const scrollRegions = [
		[1, 1000]
	]

	const currentScrollPx = $(window).scrollTop();
	currentScrollRegion = getRegion(currentScrollPx)
	let currentScrollRegionProgress = () => { if (currentScrollRegion === -1) return 0; if (currentScrollRegion === 1000) return 1; return mapValue(currentScrollPx, scrollRegions[currentScrollRegion][0], scrollRegions[currentScrollRegion][1], 0,1) }

	handleScroll(currentScrollPx, currentScrollRegion, currentScrollRegionProgress())
});


window.addEventListener('load', () => {
	window.scrollTo(0, 0);

	$container = $('#canvas');
	$frame = $('#frame');



	createFlock('s', 80, 8, 16, { array: CMYK, makeCheckers: true })

	createHeading('общее и частное<br>московских таксистов', -590, -260)
	createHeading('сквозь оформление<br>машин такси', -110, 150, { textAlign: 'right' })

	window.requestAnimationFrame(animate)
});


