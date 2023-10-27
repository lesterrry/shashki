/*************************
Handcrafted by Aydar N.
2023

me@aydar.media
*************************/

// TODO: нужен реалити чек

import './style.css'
import $ from 'jquery';

import HAHA from "../static/img/hahaha.png"

import TAXI_1 from "../static/img/taxi-1.jpg"
import TAXI_2 from "../static/img/taxi-2.jpg"
import TAXI_3 from "../static/img/taxi-3.png"
import TAXI_4 from "../static/img/taxi-4.jpg"
import TAXI_5 from "../static/img/taxi-5.jpg"
import TAXI_6 from "../static/img/taxi-6.jpg"

import TAXI_7 from "../static/img/taxi-7.png"
import TAXI_8 from "../static/img/taxi-8.png"
import TAXI_9 from "../static/img/taxi-9.png"
import TAXI_10 from "../static/img/taxi-10.png"
import TAXI_11 from "../static/img/taxi-11.png"
import TAXI_12 from "../static/img/taxi-12.png"
import TAXI_13 from "../static/img/taxi-13.png"
import TAXI_14 from "../static/img/taxi-14.png"
import TAXI_15 from "../static/img/taxi-15.png"
import TAXI_16 from "../static/img/taxi-16.png"
import TAXI_17 from "../static/img/taxi-17.png"
import TAXI_18 from "../static/img/taxi-18.png"
import TAXI_19 from "../static/img/taxi-19.png"
import TAXI_20 from "../static/img/taxi-20.jpg"
import TAXI_21 from "../static/img/taxi-21.png"
import TAXI_22 from "../static/img/taxi-22.jpg"
import TAXI_23 from "../static/img/taxi-23.png"
import TAXI_24 from "../static/img/taxi-24.png"
import TAXI_25 from "../static/img/taxi-25.jpg"
import TAXI_26 from "../static/img/taxi-26.jpg"

import INT_1 from "../static/img/int-1.jpg"
import INT_2 from "../static/img/int-2.jpg"
import INT_3 from "../static/img/int-3.jpg"
import INT_4 from "../static/img/int-4.jpg"
import INT_5 from "../static/img/int-5.jpg"

import ROOM_1 from "../static/img/room-1.jpg"
import ROOM_2 from "../static/img/room-2.jpg"
import ROOM_3 from "../static/img/room-3.jpg"
import ROOM_4 from "../static/img/room-4.jpg"
import ROOM_5 from "../static/img/room-5.jpg"

const IMAGES = [
	TAXI_1,
	TAXI_2,
	TAXI_3,
	TAXI_4,
	TAXI_5,
	TAXI_6,
	TAXI_7,
	TAXI_8,
	TAXI_9,
	TAXI_10,
	TAXI_11,
	TAXI_12,
	TAXI_13,
	TAXI_14,
	TAXI_15,
	TAXI_16,
	TAXI_17,
	TAXI_18,
	TAXI_19,
	TAXI_20,
	TAXI_21,
	TAXI_22,
	TAXI_23,
	TAXI_24,
	TAXI_25,
	TAXI_26,
	INT_1,
	INT_2,
	INT_3,
	INT_4,
	INT_5,
	ROOM_1,
	ROOM_2,
	ROOM_3,
	ROOM_4,
	ROOM_5
];


const C_M_Y_K = [
	'#00AAE9',
	'#D92D8A',
	'#FFF34A',
	'#000000'
]
const CM_M_CY_CMY = [
	'#2F308C',
	'#D92D8A',
	'#00A359',
	'#363639'
]
const C_MY_CY_CMY = [
	'#00AAE9',
	'#DA3832',
	'#00A359',
	'#363639'
]
const CM_MY_Y_CMY = [
	'#2F308C',
	'#DA3832',
	'#FFF34A',
	'#363639'
]

const SCROLL_REGIONS = [  // todo длины вместо диапазонов
	[1, 1000],  // цмик в начале пока исчезают слова
	[1000, 3000],  // рассказ четыре абзаца
	[3000, 6000],  // скейлдаун
	[6000, 8000],  // микс цмика
	[8000, 12000],  // микс растворяется
	[12000, 15000],  // фотки машин внизу
	[15000, 23000],  // много фоток машин
	[23000, 24000],  // машины исчезают
	[24000, 26000],  // микс цмика 2
	[26000, 30000],  // микс цмика 2 растворяется
	[30000, 35000],
	[35000, 38000],
	[38000, 42000],
	[42000, 52000],
	[52000, 54000],
	[54000, 60000]
]

const SCROLL_SUBREGIONS = [
	4,
	3,
	2,
	0,
	3,
	14,
	12,
	0,
	0,
	0,
	4,
	0,
	0,
	11,
	5,
	0
]

let lastTime = 0

let scrollEnabled = false;
let currentScrollRegion = -1
let regionApplied = false
let subRegion = 0
let subRegionApplied = false
let modifications = []

let $body, $container, $frame, $overlay, $footer

const slices = {}

const preload = () => {
	IMAGES.forEach((imagePath) => {
		const img = new Image();
		img.src = imagePath;
	});
}


const createCell = (size, color) => {
	const $cell = $('<picture></picture>')
	$cell.css('width', size + 'px');
	$cell.css('height', size + 'px');
	$cell.css('backgroundColor', color);
	$cell.addClass('cell')
	return $cell;
}

const createRandomColor = (colorDict, index) => {
	return (colorDict['makeCheckers'] && index % 2 === 0) ? 'rgba(255,255,255,0)' : colorDict['array'].random()
}

const resolveColor = (color, arrayIndex = 0, randomIndex = 0) => {
	if (typeof color === 'string') return color
	return Array.isArray(color) ? color[arrayIndex] : createRandomColor(color, randomIndex)
}

const createFlock = (id, cellSize, rows, columns, color, hidden, suitFrame, position = null) => {
	const [width, height] = [(cellSize * columns) + 'px', (cellSize * rows) + 'px']

	const $flock = $('<div></div>');
	$flock.addClass('flock')
	$flock.attr('id', id)
	$flock.data('rows', rows)
	$flock.data('columns', columns)
	$flock.css('width', width);
	$flock.css('height', height);
	if (hidden) $flock.css('display', 'none');
	if (position) $flock.css({ 'top': calc(50, position[0]), 'left': calc(50, position[1]) })

	if (suitFrame) { $frame.css('width', width); $frame.css('height', height) }

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

const makeHeadingStrokes = () => {
	const headings = $('.make-stroke')
	headings.each(function() {
		const element = $(this)
		const cloned = element.clone(true)
		cloned.attr('class', 'stroke')
		element.after(cloned)
	})
}

const animate = (currentTime) => {
	const deltaTime = (currentTime - lastTime) / 1000;  // in seconds

	if (deltaTime >= 1) {
		if (currentScrollRegion === -1) repaintFlock('s', { array: C_M_Y_K, makeCheckers: true })
		if (currentScrollRegion === 3 && subRegion === 0) repaintFlock('m', { array: CM_M_CY_CMY, makeCheckers: true })
		if (currentScrollRegion === 8 && subRegion === 0) repaintFlock('m2', { array: C_MY_CY_CMY, makeCheckers: true })
		if (currentScrollRegion === 15 && subRegion === 0) repaintFlock('s2', { array: CM_MY_Y_CMY, makeCheckers: true })
		lastTime = currentTime
	}

	window.requestAnimationFrame(animate)
}

const modify = (selector, css) => {
	let node = selector
	if (typeof selector === 'string') node = $(selector)

	const prior = node.attr('style')?.toString() || ''
	if (prior.endsWith(`${css};`)) return

	const semicolon = prior.endsWith(';') ? '' : '; '

	$(node).attr('style', `${prior}${semicolon} ${css};`)
	modifications.push({ region: currentScrollRegion, subRegion: subRegion, selector: selector, priorCss: prior })
}

const rollback = (affected) => {
	for (const i of affected) {
		let node = i.selector
		if (typeof i.selector === 'string') node = $(i.selector);
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
	rollback(affected)
}

const handleScroll = (pxValue, region, progress) => {
	const slice_s = slices['s']
	const slice_m = slices['m']
	const slice_o = slices['o']
	const mapped_s = Math.round(mapValue(progress, 0, 1, 0, slice_s.length))
	const mapped_m = Math.round(mapValue(progress, 0, 1, 0, slice_m.length + 10))
	const mapped_o = Math.round(mapValue(progress, 0, 1, 0, slice_o.length + 10))

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

			for (let i = 0; i < slice_s.length; i++) {
				const multiplier = mapped_s - i
				$(slice_s[i]).css('filter', `grayscale(${slice_s.length * (multiplier) * 100}%)`)
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

						modify($cell_b.children().first(), "opacity: 10%")

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
			for (let i = 0; i < slice_s.length; i++) {
				let $filteredElements = $(slice_s[i]).filter(function() { return !$(this).is('.cell#b') });
				$($filteredElements).css('scale', `${1 - progress}`)
			}
			break
		case 3:
			modify('.flock#s', 'display: none')
			modify('.flock#m', 'display: initial')

			modify($frame, `width: 1320px; height: 660px`)

			modify('h1#3', 'display: initial')
			modify('h1#3.stroke', 'display: initial')
			modify('h1#4', 'display: initial')
			modify('h1#4.stroke', 'display: initial')

			break
		case 4:
			for (let i = 0; i < slice_m.length; i++) {
				const multiplier = mapped_m - i
				$(slice_m[i]).css('opacity', `${(slice_m.length * (multiplier)) * -10}%`)
			}
			if (!subRegionApplied) {
				switch (subRegion) {
					case 1:
						modify('h1#3', 'display: none')
						modify('h1#3.stroke', 'display: none')
						modify('p#5', 'display: initial')
						break
					case 2:
						modify('h1#4', 'display: none')
						modify('h1#4.stroke', 'display: none')
						modify('p#6', 'display: initial')
						break
					case 3:
						modify('p#7', 'display: initial')
						modify('.flock#xs', 'display: initial')
						modify($frame, `width: 1340px; height: 700px; opacity: 0%`)
						break
				}
				subRegionApplied = true
			}
			break
		case 5:
			modify('.flock#m', 'display: none')

			if (!subRegionApplied) {
				switch (subRegion) {
					case 0:
						modify($(getCell('xs', 0, 1)), `background-image: url(${TAXI_7}); filter: initial`)
						break
					case 1:
						modify($(getCell('xs', 1, 2)), `background-image: url(${TAXI_8}); filter: initial`)
						break
					case 2:
						modify($(getCell('xs', 0, 3)), `background-image: url(${TAXI_9}); filter: initial`)
						break
					case 3:
						modify($(getCell('xs', 1, 4)), `background-image: url(${TAXI_10}); filter: initial`)
						break
					case 4:
						modify($(getCell('xs', 0, 5)), `background-image: url(${TAXI_11}); filter: initial`)
						break
					case 5:
						modify($(getCell('xs', 1, 6)), `background-image: url(${TAXI_12}); filter: initial`)
						break
					case 6:
						modify($(getCell('xs', 0, 7)), `background-image: url(${TAXI_13}); filter: initial`)  // 13
						break
					case 7:
						modify($(getCell('xs', 1, 8)), `background-image: url(${TAXI_14}); filter: initial`)
						break
					case 8:
						modify($(getCell('xs', 0, 9)), `background-image: url(${TAXI_15}); filter: initial`)
						break
					case 9:
						modify($(getCell('xs', 1, 10)), `background-image: url(${TAXI_16}); filter: initial`)
						break
					case 10:
						modify($(getCell('xs', 0, 11)), `background-image: url(${TAXI_17}); filter: initial`)  // memento
						break
					case 11:
						modify('p#5', 'opacity: 15%')
						modify('p#6', 'opacity: 15%')
						modify('p#7', 'opacity: 15%')
						modify('p#8', 'opacity: 100%')

						modify($(getCell('xs', 0, 1)), `filter: grayscale(100%)`)
						modify($(getCell('xs', 1, 2)), `filter: grayscale(100%)`)
						modify($(getCell('xs', 0, 3)), `filter: grayscale(100%)`)
						modify($(getCell('xs', 1, 4)), `filter: grayscale(100%)`)
						modify($(getCell('xs', 0, 5)), `filter: grayscale(100%)`)
						modify($(getCell('xs', 1, 6)), `filter: grayscale(100%)`)
						modify($(getCell('xs', 0, 7)), `filter: grayscale(100%)`)
						modify($(getCell('xs', 1, 8)), `filter: grayscale(100%)`)
						modify($(getCell('xs', 0, 9)), `filter: grayscale(100%)`)
						modify($(getCell('xs', 1, 10)), `filter: grayscale(100%)`)
						modify($(getCell('xs', 0, 11)), `filter: grayscale(100%)`)
				}
				subRegionApplied = true
			}

			break

		case 6:
			if (!subRegionApplied) {
				switch (subRegion) {
					case 1:
						modify('.flock#xs2', 'display: initial')
						modify('p#5', 'display: none')
						modify('p#6', 'display: none')
						modify('p#7', 'display: none')
						modify('p#8', 'display: none')
						break
					case 3:
						modify('h1#9', 'display: initial')
						modify('h1#9.stroke', 'display: initial')
						modify('p#10', 'display: initial')
						$(getCell('xs2', 3, 8)).css('z-index', '30')
						modify($(getCell('xs2', 3, 8)), 'z-index: 30; scale: 2.5; border-radius: 10px; filter: initial')
						modify($(getCell('xs2', 5, 4)), 'z-index: 30; scale: 2.5; border-radius: 10px; filter: initial')
						modify($(getCell('xs2', 5, 10)), 'z-index: 30; scale: 2.5; border-radius: 10px; filter: initial')
						break
					case 4:
						modify('h1#9', 'display: none')
						modify('h1#9.stroke', 'display: none')
						modify('p#10', 'display: none')
						modify($(getCell('xs2', 3, 8)), 'scale: initial; border-radius: initial')
						modify($(getCell('xs2', 5, 4)), 'scale: initial; border-radius: initial')
						modify($(getCell('xs2', 5, 10)), 'scale: initial; border-radius: initial')

						modify('h1#11', 'display: initial')
						modify('h1#11.stroke', 'display: initial')
						modify('p#12', 'display: initial')
						modify($(getCell('xs2', 3, 10)), 'z-index: 31; scale: 2.5; border-radius: 10px; filter: initial')
						modify($(getCell('xs', 0, 7)), 'z-index: 31; scale: 2.5; border-radius: 10px; filter: initial')
						break
					case 5:
						modify('h1#11', 'display: none')
						modify('h1#11.stroke', 'display: none')
						modify('p#12', 'display: none')
						modify($(getCell('xs2', 3, 10)), 'scale: initial; border-radius: initial')
						modify($(getCell('xs', 0, 7)), 'scale: initial; border-radius: initial')

						modify('h1#13', 'display: initial')
						modify('h1#13.stroke', 'display: initial')
						modify('p#14', 'display: initial')
						modify($(getCell('xs', 0, 11)), 'z-index: 32; scale: 2.5; border-radius: 10px; filter: initial')
						break
					case 6:
						modify('h1#13', 'display: none')
						modify('h1#13.stroke', 'display: none')
						modify('p#14', 'display: none')
						modify($(getCell('xs', 0, 11)), 'scale: initial; border-radius: initial')
						modify($(getCell('xs', 0, 11)), 'scale: initial; border-radius: initial')

						modify('h1#15', 'display: initial')
						modify('h1#15.stroke', 'display: initial')
						modify('p#16', 'display: initial')
						modify($(getCell('xs2', 4, 5)), 'z-index: 33; scale: 2.5; border-radius: 10px; filter: initial')
						break
					case 7:
						modify('h1#15', 'display: none')
						modify('h1#15.stroke', 'display: none')
						modify('p#16', 'display: none')
						modify($(getCell('xs2', 4, 5)), 'scale: initial; border-radius: initial')

						modify('h1#17', 'display: initial')
						modify('h1#17.stroke', 'display: initial')
						modify('p#18', 'display: initial')
						modify($(getCell('xs', 1, 2)), 'z-index: 34; scale: 2.5; border-radius: 10px; filter: initial')
						break
					case 8:
						modify('h1#17', 'display: none')
						modify('h1#17.stroke', 'display: none')
						modify('p#18', 'display: none')
						modify($(getCell('xs', 1, 2)), 'scale: initial; border-radius: initial')

						modify('h1#19', 'display: initial')
						modify('h1#19.stroke', 'display: initial')
						modify('p#20', 'display: initial')
						modify($(getCell('xs2', 4, 9)), 'z-index: 35; scale: 2.5; border-radius: 10px; filter: initial')
						break
					case 9:
						modify('h1#19', 'display: none')
						modify('h1#19.stroke', 'display: none')
						modify('p#20', 'display: none')
						modify($(getCell('xs2', 4, 9)), 'scale: initial; border-radius: initial')

						modify('h1#21', 'display: initial')
						modify('h1#21.stroke', 'display: initial')
						modify('p#22', 'display: initial')
						modify($(getCell('xs', 0, 9)), 'z-index: 36; scale: 2.5; border-radius: 10px; filter: initial')
						break
					case 10:
						modify('h1#21', 'display: none')
						modify('h1#21.stroke', 'display: none')
						modify('p#22', 'display: none')
						modify($(getCell('xs', 0, 9)), 'scale: initial; border-radius: initial')

						modify('h1#23', 'display: initial')
						modify('h1#23.stroke', 'display: initial')
						modify('p#24', 'display: initial')
						modify($(getCell('xs2', 3, 6)), 'z-index: 36; scale: 2.5; border-radius: 10px; filter: initial')
						break
					case 11:
						modify('h1#23', 'display: none')
						modify('h1#23.stroke', 'display: none')
						modify('p#24', 'display: none')
						modify($(getCell('xs2', 3, 6)), 'scale: initial; border-radius: initial')

						modify('h1#25', 'display: initial')
						modify('h1#25.stroke', 'display: initial')
						modify('p#26', 'display: initial')
						modify($(getCell('xs', 0, 1)), 'z-index: 36; scale: 2.5; border-radius: 10px; filter: initial')
						break
				}
				subRegionApplied = true
			}

			break
		case 7:
			$('.flock#xs').css('opacity', `${(1 - progress) * 100}%`)
			$('.flock#xs2').css('opacity', `${(1 - progress) * 100}%`)
			$('h1#25').css('opacity', `${(1 - progress) * 100}%`)
			$('h1#25.stroke').css('opacity', `${(1 - progress) * 100}%`)
			$('p#26').css('opacity', `${(1 - progress) * 100}%`)
			break
		case 8:
			modify('.flock#xs', 'display: none')
			modify('.flock#xs2', 'display: none')
			modify('h1#25', 'display: none')
			modify('h1#25.stroke', 'display: none')
			modify('p#26', 'display: none')
			modify('.flock#m2', 'display: initial')
			modify($frame, `width: 1320px; height: 660px; opacity: 100%; z-index: 10`)
			modify('h1#27', 'display: initial')
			modify('h1#28', 'display: initial')
			modify('h1#27.stroke', 'display: initial')
			modify('h1#28.stroke', 'display: initial')
			break
		case 9:
			modify('h1#27', 'opacity: 0')
			modify('h1#28', 'opacity: 0')
			modify('h1#27.stroke', 'opacity: 0')
			modify('h1#28.stroke', 'opacity: 0')
			modify($frame, 'opacity: 0')
			$('.flock#m2').css({'scale': `${(progress * 4) + 1}`, 'filter': `grayscale(${progress * 100}%)`})
			break
		case 10:
			modify('.flock#m2', 'scale: 5')
			if (!subRegionApplied) {
				switch (subRegion) {
					case 1:
						modify('p#29', 'opacity: 100%')
						modify($(getCell('m2', 5, 10)), 'margin-top: 60px; z-index: 40')
						modify($(getCell('m2', 6, 11)), 'margin-left: 60px')
						modify($(getCell('m2', 4, 11)), 'margin-top: -60px')
						break
					case 2:
						modify('p#30', 'opacity: 100%')
						modify($(getCell('m2', 5, 12)), 'margin-left: 60px')
						modify($(getCell('m2', 6, 13)), 'margin-top: 60px')
						modify($(getCell('m2', 4, 13)), 'margin-top: -60px')
						break
					case 3:
						modify('p#31', 'opacity: 100%')
						modify($(getCell('m2', 4, 9)), 'margin-top: -60px')
						modify($(getCell('m2', 6, 9)), 'margin-top: 60px')
						modify($(getCell('m2', 5, 12)), 'margin-left: 120px')
						break
				}
				subRegionApplied = true
			}

			break
		case 11:
			$(getCell('m2', 5, 10)).css({'scale': `${(progress * 8) + 1}`})
			$overlay.css('opacity', `${(progress) * 100}%`)
			break
		case 12:
			for (let i = 0; i < slice_o.length; i++) {
				$(slice_o[i]).css('opacity', `${i > mapped_o ? 0 : 100}%`)
			}

			modify('.flock#m2', 'display: none')
			modify('p#29', 'display: none')
			modify('p#30', 'display: none')
			modify('p#31', 'display: none')
			modify($overlay, 'opacity: 0%')
			modify($body, 'background-color: #363636')
			modify($(getCell('m2', 5, 10)), 'opacity: 0')

			break
		case 13:
			if (!subRegionApplied) {
				switch (subRegion) {
					case 1:
						modify('h1#32', 'display: initial')
						modify('p#33', 'display: initial')
						modify('div#int-1', 'transform: scale(1); rotate: 4deg; opacity: 100%')
						break
					case 2:
						modify('div#int-1', `background-image: url(${ROOM_1})`)
						break
					case 3:
						modify('h1#32', 'display: none')
						modify('p#33', 'display: none')
						modify('div#int-1', 'filter: grayscale(100%)')

						modify('h1#34', 'display: initial')
						modify('p#35', 'display: initial')
						modify('div#int-2', 'transform: scale(1); rotate: -2deg; opacity: 100%')
						break
					case 4:
						modify('div#int-2', `background-image: url(${ROOM_2})`)
						break
					case 5:
						modify('h1#34', 'display: none')
						modify('p#35', 'display: none')
						modify('div#int-2', 'filter: grayscale(100%)')

						modify('h1#36', 'display: initial')
						modify('p#37', 'display: initial')
						modify('div#int-3', 'transform: scale(1); rotate: 4deg; opacity: 100%')
						break
					case 6:
						modify('div#int-3', `background-image: url(${ROOM_3})`)
						break
					case 7:
						modify('h1#36', 'display: none')
						modify('p#37', 'display: none')
						modify('div#int-3', 'filter: grayscale(100%)')

						modify('h1#38', 'display: initial')
						modify('p#39', 'display: initial')
						modify('div#int-4', 'transform: scale(1); rotate: 6deg; opacity: 100%')
						break
					case 8:
						modify('div#int-4', `background-image: url(${ROOM_4})`)
						break
					case 9:
						modify('h1#38', 'display: none')
						modify('p#39', 'display: none')
						modify('div#int-4', 'filter: grayscale(100%)')

						modify('h1#40', 'display: initial')
						modify('p#41', 'display: initial')
						modify('div#int-5', 'transform: scale(1); rotate: -2deg; opacity: 100%')
						break
					case 10:
						modify('div#int-5', `background-image: url(${ROOM_5})`)
						break
					case 11:
						modify('h1#40', 'opacity: 0')
						modify('p#41', 'opacity: 0')
						modify('div#int-1', 'opacity: 0')
						modify('div#int-2', 'opacity: 0')
						modify('div#int-3', 'opacity: 0')
						modify('div#int-4', 'opacity: 0')
						modify('div#int-5', 'opacity: 0')
				}
				subRegionApplied = true
			}
			break
		case 14:
			for (let i = 0; i < slice_o.length; i++) {
				$(slice_o[i]).css('border-width', `${i > mapped_o ? 0.05 : 1.25}em`)
			}

			if (!subRegionApplied) {
				switch (subRegion) {
					case 2:
						modify('p#42', 'opacity: 100%')
						break
					case 3:
						modify('p#43', 'opacity: 100%')
						break
					case 4:
						modify('p#44', 'opacity: 100%')
						break
					case 5:
						modify('p#45', 'opacity: 100%')
						modify($overlay, 'display: none')
						break
				}
				subRegionApplied = true
			}
			break
		case 15:
			modify('p#42', 'display: none')
			modify('p#43', 'display: none')
			modify('p#44', 'display: none')
			modify('p#45', 'display: none')
			modify('.flock#o', 'display: none')

			modify($body, 'background-color: white')
			modify('.flock#s2', 'display: initial')
			modify('h1#46', 'display: initial')
			modify('h1#46.stroke', 'display: initial')

			modify($frame, 'opacity: 100%; width: 840px; height: 420px')

			modify($overlay, 'display: none')

			modify($footer, 'bottom: -10px')
			break
	}
}

Array.prototype.random = function () {
	return this[Math.floor((Math.random() * this.length))];
}

$(document).on("scroll", function() {
	if (!scrollEnabled) return

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
			currentScrollRegion--
		} else {
			regionApplied = false
			regionBumped = true
			priorRegion = currentScrollRegion
			currentScrollRegion++
		}
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
	preload()

	$body = $('body')
	$container = $('#canvas');
	$frame = $('#frame');
	$overlay = $('#overlay');
	$footer = $('footer');

	makeHeadingStrokes()

	createFlock('s', 80, 8, 16, { array: C_M_Y_K, makeCheckers: true }, false, true)
	slices['s'] = sliceFlock('s')

	createParagraphInCell('a', 's', 1, 3, 'Миллионы заказов ежедневно, десятки тысяч машин и&nbsp;невырезаемый <nobr>желто-черный</nobr> фон, навсегда сросшийся с&nbsp;москвой&nbsp;&mdash; такси везде и&nbsp;повсюду, в&nbsp;каждом дворе и&nbsp;на&nbsp;каждом перекрестке.')
	createParagraphInCell('a', 's', 5, 9, 'Эта тихая экспансия приучила людей не&nbsp;замечать ни&nbsp;водителей такси, ни&nbsp;их&nbsp;автомобили. Тем временем для самих таксистов машина&nbsp;&mdash; и&nbsp;верный друг, и&nbsp;бессменный попутчик, и&nbsp;надежный кормилец, и&nbsp;&mdash; временами&nbsp;&mdash; уютный дом.')

	createParagraphInCell('b', 's', 1, 3, 'Разумеется, как любой дом, автомобиль постепенно обрастает чертами своего хозяина, и&nbsp;начинает походить на&nbsp;него')
	createParagraphInCell('b', 's', 5, 9, 'Я&nbsp;решил исследовать эту тему и&nbsp;месяц ездил по&nbsp;москве в&nbsp;надежде отыскать среди таксистов отголосок коллективного разума&nbsp;&mdash; нечто всевоплощающее и&nbsp;единое, душу безустанных московских извозчиков.')

	createFlock('m', 60, 11, 22, { array: CM_M_CY_CMY, makeCheckers: true }, true, false)
	slices['m'] = sliceFlock('m')

	createFlock('xs2', 110, 6, 13, { array: ['#EEEEEE'], makeCheckers: true }, true, false, [-540, -640])
	createFlock('xs', 110, 3, 18, { array: ['#EEEEEE'], makeCheckers: true }, true, false, [120, -640])
	slices['xs'] = sliceFlock('xs').concat(sliceFlock('xs2'))
	$(getCell('xs2', 4, 5)).css({'background-image': `url(${TAXI_18})`, 'filter': 'grayscale(100%)'})  // бэтмен
	$(getCell('xs2', 4, 7)).css({'background-image': `url(${TAXI_19})`, 'filter': 'grayscale(100%)'})  // перепрыгни
	$(getCell('xs2', 5, 4)).css({'background-image': `url(${TAXI_20})`, 'filter': 'grayscale(100%)'})  // дагестан
	$(getCell('xs2', 3, 8)).css({'background-image': `url(${TAXI_21})`, 'filter': 'grayscale(100%)'}) // россия
	$(getCell('xs2', 5, 10)).css({'background-image': `url(${TAXI_22})`, 'filter': 'grayscale(100%)'})  // озеро
	$(getCell('xs2', 4, 9)).css({'background-image': `url(${TAXI_23})`, 'filter': 'grayscale(100%)'})  // здарова
	$(getCell('xs2', 3, 10)).css({'background-image': `url(${TAXI_24})`, 'filter': 'grayscale(100%)'})  // гонщик
	$(getCell('xs2', 3, 6)).css({'background-image': `url(${TAXI_25})`, 'filter': 'grayscale(100%)'})  // голд
	$(getCell('xs2', 5, 2)).css({'background-image': `url(${TAXI_26})`, 'filter': 'grayscale(0%)'})  // конь

	createFlock('m2', 60, 11, 22, { array: C_MY_CY_CMY, makeCheckers: true }, true, false)
	slices['m2'] = sliceFlock('m2')
	$('.flock#m2').css({'z-index': '19', 'scale': '1', 'filter': 'initial'})

	createFlock('o', 40, 25, 45, 'rgba(255,255,255,0)', false, false)
	slices['o'] = sliceFlock('o')

	$('#int-1').css('background-image', `url(${INT_1})`)
	$('#int-2').css('background-image', `url(${INT_2})`)
	$('#int-3').css('background-image', `url(${INT_3})`)
	$('#int-4').css('background-image', `url(${INT_4})`)
	$('#int-5').css('background-image', `url(${INT_5})`)

	createFlock('s2', 70, 6, 12, { array: CM_MY_Y_CMY, makeCheckers: true }, true, false)

	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
		$('#overlay').css({'background-color': '#363636', 'opacity': '0', 'z-index': '100'})
		$('#overlay > p').html('')
		$container.css('display', 'none')

		let image = $('<img>')
			.attr('id', 'buttplug')
			.attr('src', HAHA)
		$body.append(image);
	} else {
		let timeout = 2000
		if (/(?!.*\b(Edge|Edg|OPR|FxiOS|CriOS)\b) AppleWebKit.*Chrome/.test(navigator.userAgent)) {
			timeout = 0
		}
		setTimeout(() => {
			$('#overlay').css({'background-color': '#363636', 'opacity': '0', 'z-index': '100'})
			$('#overlay > p').html('')

			scrollEnabled = true

			window.scrollTo(0, 0);
			window.requestAnimationFrame(animate)
		}, timeout)
	}
});
