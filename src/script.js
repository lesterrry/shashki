/*************************
Handcrafted by Aydar N.
2023

me@aydar.media
*************************/

import './style.css'
import $ from 'jquery';

import TAXI_1 from "../static/img/taxi-1.jpg"
import TAXI_2 from "../static/img/taxi-2.jpg"
import TAXI_3 from "../static/img/taxi-3.png"
import TAXI_4 from "../static/img/taxi-4.jpg"
import TAXI_5 from "../static/img/taxi-5.jpg"
import TAXI_6 from "../static/img/taxi-6.jpg"

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

const SCROLL_REGIONS = [
	[1, 1000],
	[1000, 2000],
	[2000, 1000]
]

const SCROLL_SUBREGIONS = [
	4,
	3,
	2
]

let lastTime = 0

let currentScrollRegion = -1
let regionApplied = false
let subRegion = 0
let subRegionApplied = false
let modifications = []

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
	$flock.addClass('flock')
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

	$container.append($flock)
}

const repaintFlock = (id, color) => {
	const $flock = $(`.flock#${id}`)
	const $children = $(`.flock#${id} > *`)

	const columns = $flock.data('columns')

	$children.each(function (i) {
		const [row, column] = [Math.floor(i / columns), i % columns]
		$(this).css({'background-color': resolveColor(color, 0, row + column), 'filter': ''})
	})
}

const normalizeFlock = (id, cellSize) => {
	const $children = $(`.flock#${id} > *`)

	$children.each(function (i) {
		$(this).css({'width': cellSize, 'height': cellSize, 'z-index': 10})  // TODO: доставать из data
		$(this).children().removeAttr('style')
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

const getCell = (flockId, row, column) => {
	const $flock = $(`.flock#${flockId}`)
	const columns = $flock.data('columns')

	const index = (row * columns) + column;
	return $flock.children()[index];
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

const createParagraphInCell = (id, flockId, row, column, text) => {
	const cell = $(getCell(flockId, row, column))
	cell.attr('id', id)
	cell.append($(`<p>${text}</p>`))
}

const animate = (currentTime) => {
	const deltaTime = (currentTime - lastTime) / 1000;  // in seconds

	if (deltaTime >= 1) {
		if (currentScrollRegion === -1) repaintFlock('s', { array: CMYK, makeCheckers: true })
		lastTime = currentTime
	}

	window.requestAnimationFrame(animate)
}

const modify = (selector, css) => {
	let node = selector
	if (typeof selector === 'string') node = $(selector)

	const prior = node.attr('style')?.toString() || ''
	if (prior.includes(css)) return

	$(node).attr('style', `${prior} ${css};`)
	modifications.push({ region: currentScrollRegion, subRegion: subRegion, selector: selector, priorCss: prior })
}

const rollback = (affected) => {
	for (const i of affected) {
		let node = i.selector
		if (typeof i.selector === 'string') node = $(i.selector);
		// console.warn(typeof node)
		node.attr('style', i.priorCss)
		// console.log('a', selector, i.priorCss)
		modifications = modifications.filter(j => j.region !== i.region || (j.region === i.region && j.subRegion !== i.subRegion) )
	}
}

const rollbackByRegion = (priorRegion) => {
	const affected = modifications.filter(i => i.region === priorRegion)
	rollback(affected)
}

const rollbackBySubRegion = (priorSubRegion, priorRegion) => {
	const affected = modifications.filter(i => i.subRegion === priorSubRegion && i.region === priorRegion)
	console.error(affected)
	rollback(affected)
}

const handleScroll = (pxValue, region, progress) => {
	switch (region) {
		case -1:
			// if (!regionApplied) {
			// 	$('h1').css('display', '')
			// 	regionApplied = true
			// }
			break
		case 0:
			// if (!regionApplied) {
			// 	normalizeFlock('s', 80)
			// 	regionApplied = true
			// }

			const slice = sliceFlock('s')
			const mapped = Math.round(mapValue(progress, 0, 1, 0, slice.length))
			console.log(mapped)

			for (let i = 0; i < slice.length; i++) {
				const multiplier = mapped - i
				$(slice[i]).css('filter', `grayscale(${progress * slice.length * (multiplier) * 100}%)`)
			}

			// slice.forEach((i) => {
			// 	$(i.slice(0, mapped)).css('filter', `grayscale(${(progress * slice.length) * 100}%)`)
			// 	$(i.slice(mapped, )).css('filter', `grayscale(${(progress * slice.length) * 100}%)`)
			// })

			// newSubRegion = Math.round(mapValue(progress, 0, 1, 0, 4))
			// if (newSubRegion !== subRegion) {
			// 	subRegion = newSubRegion;
			// 	subRegionApplied = false
			// }

			if (!subRegionApplied) {
				switch (subRegion) {
					case 0:
						// $(`h1#1`).css('display', ''); $(`h1#1.stroke`).css('display', ''); $(`h1#2`).css('display', ''); $(`h1#2.stroke`).css('display', '')
						break
					case 1:
						// $(`h1#1`).css('display', 'none')
						modify('h1#1', 'display: none')
						break
					case 2:
						modify('h1#1.stroke', 'display: none')
						break
					case 3:
						modify('h1#2', 'display: none')
						break
					case 4:
						modify('h1#2.stroke', 'display: none')
						break
				}
				subRegionApplied = true
			}

			break
		case 1:
			// if (!regionApplied) {
			// 	$('h1').css('display', 'none')
			// 	regionApplied = true
			// }

			const $cell_a = $(getCell('s', 1, 3))
			const $cell_b = $(getCell('s', 5, 9))

			if (!subRegionApplied) {
				switch (subRegion) {
					case 0:
						// $cell_a.css({ 'width': '400px', 'height': '160px', 'z-index': '40', 'background-color': '#EEEEEE' })
						modify($cell_a, "width: 400px; height: 160px; z-index: 40; background-color: #EEEEEE")
						modify($cell_a.children().first(), "display: initial")
						// $cell_a.children().css('display', 'initial')
						break
					case 1:
						// $cell_b.css({ 'width': '400px', 'height': '160px', 'z-index': '40', 'background-color': '#EEEEEE' })
						// $cell_b.children().css('display', 'initial')
						modify($cell_b, "width: 400px; height: 160px; z-index: 40; background-color: #EEEEEE")
						modify($cell_b.children().first(), "display: initial")

						modify($(getCell('s', 7, 9)), `background-image: url(${TAXI_1}); filter: initial`)
						modify($(getCell('s', 4, 7)), `background-image: url(${TAXI_2}); filter: initial`)
						modify($(getCell('s', 3, 4)), `background-image: url(${TAXI_3}); filter: initial`)
						modify($(getCell('s', 0, 1)), `background-image: url(${TAXI_4}); filter: initial`)
						modify($(getCell('s', 7, 2)), `background-image: url(${TAXI_5}); filter: initial`)
						modify($(getCell('s', 1, 12)), `background-image: url(${TAXI_6}); filter: initial`)
						break
					case 2:
						modify($cell_a, "left: 560px")

						modify($cell_a.children().first(), "display: none")
						modify($cell_a.children().last(), "display: initial")

						modify($(getCell('s', 7, 9)), `background-image: none; background-color: #FFF34A`)
						modify($(getCell('s', 4, 7)), `background-image: none; background-color: #FFF34A`)
						modify($(getCell('s', 3, 4)), `background-image: none; background-color: #FFF34A`)
						modify($(getCell('s', 0, 1)), `background-image: none; background-color: #FFF34A`)
						modify($(getCell('s', 7, 2)), `background-image: none; background-color: #FFF34A`)
						modify($(getCell('s', 1, 12)), `background-image: none; background-color: #FFF34A`)
						break
					case 3:
						modify($cell_b, "left: 160px")

						modify($cell_b.children().first(), "display: none")
						modify($cell_b.children().last(), "display: initial")

						modify($(getCell('s', 5, 6)), `filter: initial; background-color: #FFF34A`)
						modify($(getCell('s', 6, 10)), `filter: initial; background-color: #FFF34A`)
						modify($(getCell('s', 1, 1)), `filter: initial; background-color: #FFF34A`)
						modify($(getCell('s', 2, 3)), `filter: initial; background-color: #FFF34A`)
						modify($(getCell('s', 5, 4)), `filter: initial; background-color: #FFF34A`)
						modify($(getCell('s', 3, 10)), `filter: initial; background-color: #FFF34A`)
						break
				}
				subRegionApplied = true
			}
			break
		case 2:

			break
	}
}

Array.prototype.random = function () {
	return this[Math.floor((Math.random() * this.length))];
}

$(document).on("scroll", function() {
	const getRegion = (value) => {
		if (value < SCROLL_REGIONS[0][0]) return -1
		for (let i = 0; i < SCROLL_REGIONS.length; i++) {
			if (value >= SCROLL_REGIONS[i][0] && value <= SCROLL_REGIONS[i][1]) return i;
		}
		return 1000
	}

	let currentScrollRegionProgress = () => { if (currentScrollRegion === -1) return 0; if (currentScrollRegion === 1000) return 1; return mapValue(currentScrollPx, SCROLL_REGIONS[currentScrollRegion][0], SCROLL_REGIONS[currentScrollRegion][1], 0,1) }

	const currentScrollPx = $(window).scrollTop();
	let priorRegion = currentScrollRegion
	let regionBumped = false

	const newScrollRegion = getRegion(currentScrollPx)
	if (newScrollRegion !== currentScrollRegion) {
		if (newScrollRegion < currentScrollRegion) {
			rollbackByRegion(currentScrollRegion)
		} else {
			regionApplied = false
			regionBumped = true
			priorRegion = currentScrollRegion
		}
		currentScrollRegion = newScrollRegion;
	}

	const newSubRegion = Math.round(mapValue(currentScrollRegionProgress(), 0, 1, 0, SCROLL_SUBREGIONS[currentScrollRegion]))
	if (newSubRegion !== subRegion) {
		if (newSubRegion < subRegion && !regionBumped) {
			rollbackBySubRegion(subRegion, priorRegion)
		} else {
			subRegionApplied = false
		}
		subRegion = newSubRegion;
	}
	// console.log(subRegion, newSubRegion)
	// console.log(SCROLL_SUBREGIONS[currentScrollRegion])

	handleScroll(currentScrollPx, currentScrollRegion, currentScrollRegionProgress())
});


window.addEventListener('load', () => {
	$container = $('#canvas');
	$frame = $('#frame');

	createFlock('s', 80, 8, 16, { array: CMYK, makeCheckers: true })
	createParagraphInCell('a', 's', 1, 3, 'Миллионы заказов ежедневно, десятки тысяч машин и невырезаемый желто-черный фон, навсегда сросшийся с москвой — такси везде и повсюду, в каждом дворе и на каждом перекрестке.')
	createParagraphInCell('a', 's', 5, 9, 'Эта тихая экспансия приучила людей не замечать ни водителей такси, ни их автомобили. Тем временем для самих таксистов машина — и верный друг, и бессменный попутчик, и надежный кормилец, и — временами — уютный дом.')

	createParagraphInCell('b', 's', 1, 3, 'Разумеется, как любой дом, автомобиль постепенно обрастает чертами своего хозяина, и начинает походить на него')
	createParagraphInCell('b', 's', 5, 9, 'Я решил исследовать эту тему и месяц ездил по москве в надежде отыскать среди таксистов отголосок коллективного разума — нечто всевоплощающее и единое, душу безустанных московских извозчиков.')

	setTimeout(() => {
		window.scrollTo(0, 0);
		window.requestAnimationFrame(animate)
	}, 500)
});
