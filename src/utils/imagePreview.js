;(function (global, name, factory) {
	'use strict'
	if (typeof define === 'function' && define.amd) {
		define(factory)
	} else if (typeof exports !== 'undefined') {
		module.exports = factory()
	} else {
		global[name] = factory()
	}
})(typeof window !== 'undefined' ? window : this, 'ImagePreview', function () {
	// 屏蔽服务端渲染
	// if (!process.browser) {
    //     return;
    // }
	
	let mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(window.navigator.userAgent)
	let touchstart = mobile ? 'touchstart' : 'mousedown'
	let touchend = mobile ? 'touchend' : 'mouseup'
	let touchmove = mobile ? 'touchmove' : 'mousemove'

	document.addEventListener(touchmove, function (e) {
		e.preventDefault()
	})
	// // // // // // // // // // // // // // // // // // // //
	function ImagePreview(selector, options = {}) {
		if (!(this instanceof ImagePreview)) {
			console.error('ImagePreview is a constructor and should be called with the `new` keyword')
			return
		}
		// options
		let previewContainer = null
		let body = document.body || document.getElementsByTagName('body')[0]
		let defaulConfig = {
				ratio: 0.9,
				scale: {
					min: 0.1,
					max: 3,
					ratio: 0.1
				}
			},
			imageSrcs = [],
			config = null
		// 窗口宽度
		let dW = window.innerWidth,
			dH = window.innerHeight - 60,
			oldOffsetX = 0,
			oldOffsetY = 0,
			imageEl = null,
			currentImgScale = 1,
			oldCurrentImgScale = 1,
			oldWidth = 0,
			oldHeight = 0,
			currentWidthScale = 0,
			currentHeightScale = 0

		// let fullSvg = `<svg t="1607321261219" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6140" width="20" height="20" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><style type="text/css"></style></defs><path d="M224 416H160V192l32-32h224v64H224zM832 864h-224v-64h192v-192h64v224z" fill="#fff" p-id="6141"></path><path d="M416 864H192l-32-32v-224h64v192h192zM864 416h-64V224h-192V160h224l32 32z" fill="#fff" p-id="6142"></path></svg>`
		// let unFullSvg = `<svg t="1607311907496" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5947" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20"><defs><style type="text/css"></style></defs><path d="M704 864v-96c0-54.4 41.6-96 96-96h96c19.2 0 32-12.8 32-32s-12.8-32-32-32h-96c-89.6 0-160 70.4-160 160v96c0 19.2 12.8 32 32 32s32-12.8 32-32z m-64-704v96c0 89.6 70.4 160 160 160h96c19.2 0 32-12.8 32-32s-12.8-32-32-32h-96c-54.4 0-96-41.6-96-96v-96c0-19.2-12.8-32-32-32s-32 12.8-32 32z m-256 704v-96c0-89.6-70.4-160-160-160h-96c-19.2 0-32 12.8-32 32s12.8 32 32 32h96c54.4 0 96 41.6 96 96v96c0 19.2 12.8 32 32 32s32-12.8 32-32z m-64-704v96c0 54.4-41.6 96-96 96h-96c-19.2 0-32 12.8-32 32s12.8 32 32 32h96c89.6 0 160-70.4 160-160v-96c0-19.2-12.8-32-32-32s-32 12.8-32 32z" p-id="5948" fill="#ffffff"></path></svg>`
		let template = `<div class="preview-header">
                            <div class="nums">
                                <p>
                                    <span id="current-index"></span>
                                    /
                                    <span id="total-nums"></span>
                                </p>
                            </div>
                            <div class="tool-btn">
                                <button id="refush" class="refush"><svg t="1607311493006" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4935" xmlns:xlink="http://www.w3.org/1999/xlink" width="15" height="15"><defs><style type="text/css"></style></defs><path d="M780.9 902.4c-9.7 0-19.3-4.4-25.6-12.8-10.6-14.1-7.8-34.2 6.4-44.8C867.4 765.4 928 644.1 928 512c0-229.4-186.6-416-416-416-17.7 0-32-14.3-32-32s14.3-32 32-32c264.7 0 480 215.3 480 480 0 152.4-70 292.4-192 384-5.7 4.3-12.5 6.4-19.1 6.4zM512 992C247.3 992 32 776.7 32 512c0-130 51.1-251.7 144-342.8 12.6-12.4 32.9-12.2 45.3 0.4 12.4 12.6 12.2 32.9-0.4 45.3C140.3 293.8 96 399.3 96 512c0 229.4 186.6 416 416 416 17.7 0 32 14.3 32 32s-14.3 32-32 32z" fill="#fff" p-id="4936"></path><path d="M601.6 230.4c-10.3 0-20.5-5-26.7-14.3L485.4 81.8c-9.8-14.7-5.8-34.6 8.9-44.4 14.7-9.8 34.6-5.8 44.4 8.9l89.6 134.4c9.8 14.7 5.8 34.6-8.9 44.4-5.5 3.6-11.7 5.3-17.8 5.3zM512 992c-10.3 0-20.5-5-26.7-14.3l-89.6-134.4c-9.8-14.7-5.8-34.6 8.9-44.4 14.7-9.8 34.5-5.8 44.4 8.9l89.6 134.4c9.8 14.7 5.8 34.6-8.9 44.4-5.4 3.7-11.6 5.4-17.7 5.4z" fill="#fff" p-id="4937"></path></svg></button>
                                <button id="close"><svg t="1607311466226" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3729" xmlns:xlink="http://www.w3.org/1999/xlink" width="15" height="15"><defs><style type="text/css"></style></defs><path d="M877 859.2L166.2 148.4c-14.4-14.4-14.4-37.8 0-52.2 14.4-14.4 37.8-14.4 52.2 0L929.2 807c14.4 14.4 14.4 37.8 0 52.2-14.3 14.4-37.8 14.4-52.2 0z" fill="#fff" p-id="3730"></path><path d="M166.2 807L877 96.2c14.4-14.4 37.8-14.4 52.2 0 14.4 14.4 14.4 37.8 0 52.2L218.4 859.2c-14.4 14.4-37.8 14.4-52.2 0-14.3-14.3-14.3-37.8 0-52.2z" fill="#fff" p-id="3731"></path></svg></button>
                            </div>
                        </div>
                        <div class="image-container">
                            <span class="img-content" id="image-content"><img id="preview-image" src="" alt="" /></span>
                        </div>`
		//                                <button id="close" class="el-icon-close"></button>

		function everyImageBindEvent(imageEls) {
			imageEls.forEach((item, index) => {
				item.addEventListener('click', (e) => {
					taggleModel(true)
					show(e, item.src)
					document.getElementById('current-index').innerText = index + 1
				})
			})
			document.getElementById('total-nums').innerText = imageEls.length
		}
		// 绑定事件
		function bindEvent(imageEls) {
			everyImageBindEvent(imageEls)
			// 点击蒙版关闭
			previewContainer.addEventListener('click', (e) => {
				if (e.target.classList[0] === 'image-container') {
					hide()
					imageEl.onmousemove = null
				}
			})
			// 图片缩放
			imageEl.addEventListener(
				'mousewheel',
				(e) => {
					let { min, max, ratio } = config.scale
					let img = imageEl || document.getElementById('preview-image')
					if (e.wheelDelta > 0 && currentImgScale < max) {
						currentImgScale += ratio
					} else if (currentImgScale > min) {
						currentImgScale -= ratio
					}
					img.style.setProperty('--scale', `${currentImgScale.toFixed(2)}`)
				},
				true
			)
			// 鼠标拖动
			imageEl.addEventListener(touchstart, function (e) {
				let diffX = e.clientX - imageEl.offsetLeft
				let diffY = e.clientY - imageEl.offsetTop
				this.style.transition = 'none 0s ease 0s'
				this[`on${touchmove}`] = function (e) {
					let moveX = e.clientX - diffX
					let moveY = e.clientY - diffY
					this.style.left = `${moveX}px`
					this.style.top = `${moveY}px`
				}
				this[`on${touchend}`] = function () {
					this.style.cssText = this.style.cssText.replace('transition: none 0s ease 0s', '')
					this.onmousemove = null
				}
				this.onmouseout = function () {
					this.style.cssText = this.style.cssText.replace('transition: none 0s ease 0s', '')
					this.onmousemove = null
				}
			})
			
			// 点击关闭
			document.getElementById('close').addEventListener('click', hide)
			// 重置样式
			document.getElementById('refush').addEventListener('click', reset)
			// 阻止原生拖拽事件
			document.ondragstart = function (ev) {
				ev.preventDefault()
			}
			document.ondragend = function (ev) {
				ev.preventDefault()
			}
			let resizeFn = debounce.bind(
				null,
				() => {
					// console.log(window.innerWidth)
					dW = window.innerWidth
					dH = window.innerHeight - 60
				},
				100
			)()
			window.onresize = resizeFn
		}
		/**
		 * 防抖函数
		 *
		 * @export {Funcion}
		 * @param {Function} fn 回调函数
		 * @param {Number} delay 防抖时间
		 * @returns {Function}
		 */
		function debounce(fn, delay) {
			var timer = null
			return function (arg) {
				clearTimeout(timer)
				timer = setTimeout(() => {
					fn(arg)
					clearTimeout(timer)
				}, delay)
			}
		}
		// 重置
		function reset() {
			let img = imageEl || document.getElementById('preview-image')
			img.style.top = `${oldOffsetY}px`
			img.style.left = `${oldOffsetX}px`
			img.style.setProperty('--scale', `${oldCurrentImgScale}`)
		}
		// 隐藏
		function hide() {
			let img = imageEl || document.getElementById('preview-image')
			let opacity = 0.6
			let timer = window.setInterval(() => {
				opacity -= 0.01
				previewContainer.style.background = `rgba(0, 0, 0, ${opacity})`
			}, 0)
			img.style.cssText = `width:${oldWidth}px;height:${oldHeight}px;position: fixed; top: ${oldOffsetY}px; left: ${oldOffsetX}px;`
			previewContainer.classList.remove('show')
			previewContainer.classList.add('hiding')

			// img.addEventListener('transitionend',() => {
			// 	console.log('隐藏')
			// 	img.style = ''
			// 	img.src = ''
			// 	previewContainer.style.background = ``
			// 	img.ontransitionend = null
			// 	window.clearInterval(timer)
			// 	taggleModel(false)
			// })
			setTimeout(() => {
				img.style = ''
				img.src = ''
				let hasDisplay = false;
				let elDialogs = document.querySelectorAll(`.el-dialog__wrapper`)
				for(let i = 0; i < elDialogs.length; i++){
					(!elDialogs[i].style.display || elDialogs[i].style.display != 'none') ? hasDisplay = true : ""
				}
				hasDisplay ? "" : body.style.overflow = 'auto'
				previewContainer.style.background = ``
				previewContainer.classList.remove('hiding')
				window.clearInterval(timer)
				taggleModel(false)
			}, 500)
		}
		// 切换蒙版显示与隐藏
		function taggleModel(flag) {
			previewContainer.style.display = flag ? 'block' : 'none'
		}
		// 显示
		function show(e, src) {
			let { ratio } = config
			let img = imageEl || document.getElementById('preview-image')
			let target = e.target,
				offsetX = e.clientX - e.offsetX,
				offsetY = e.clientY - e.offsetY,
				width = target.width,
				height = target.height,
				imgX = dW / 2 - width / 2 - offsetX,
				imgY = dH / 2 - height / 2 - offsetY
			img.style.cssText = `width:${width}px;height:${height}px;position:fixed; top:${offsetY}px; left:${offsetX}px;`
			img.src = src
			// 记录历史位置
			oldOffsetX = offsetX
			oldOffsetY = offsetY
			//
			oldWidth = width
			oldHeight = height
			// 放大比例
			currentWidthScale = (dW * ratio) / width
			currentHeightScale = (dH * ratio) / height
			currentImgScale = currentWidthScale > currentHeightScale ? currentHeightScale : currentWidthScale
			oldCurrentImgScale = currentImgScale
			// setTimeout(() => {
			img.style.setProperty('--offsetX', `${imgX}px`)
			img.style.setProperty('--offsetY', `${imgY + 60}px`)
			img.style.setProperty('--scale', `${currentImgScale}`)
			// }, 0)
			previewContainer.classList.add('show')
			let hasDisplay = false;
			let elDialogs = document.querySelectorAll(`.el-dialog__wrapper`)
			for(let i = 0; i < elDialogs.length; i++){
				(!elDialogs[i].style.display || elDialogs[i].style.display != 'none') ? hasDisplay = true : ""
			}
			hasDisplay ? "" : body.style.overflow = 'hidden'
			// body.style.overflow = 'hidden'
		}
		// 渲染
		function render() {
			let el = document.getElementById('image-preview-container')
			if (!el) {
				previewContainer = document.createElement('div')
				previewContainer.classList.add('image-preview-container')
				previewContainer.id = 'image-preview-container'
				previewContainer.innerHTML = template
				body.appendChild(previewContainer)
			} else {
				previewContainer = el
			}
			imageEl = document.getElementById('preview-image')
		}
		// 初始化
		function init(_config) {
			let imageEls = document.querySelectorAll(`${selector} img`)
			for (let i = 0, len = imageEls.length; i < len; i++) {
				imageSrcs.push(imageEls[i].src)
			}
			config = _config
			!render() ? bindEvent(imageEls) : everyImageBindEvent(imageEls)
		}
		// 参数处理
		function defaultParams(options) {
			if (!selector && typeof selector === 'string') {
				throw new Error('ImagePreview plugin should css string selector that on first params')
			}
			let config = Object.assign({}, defaulConfig, options)
			return config
		}
		// 向外暴露接口
		this.updateImage = function () {
			let imageEls = document.querySelectorAll(`${selector} img:not(#preview-image)`)
			for (let i = 0, len = imageEls.length; i < len; i++) {
				imageSrcs.push(imageEls[i].src)
			}
			// console.log(imageEls)
			everyImageBindEvent(imageEls)
		}
		this.imageEls = imageSrcs
		// 初始化
		init(defaultParams(options))
	}
	return ImagePreview
})
