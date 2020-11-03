class Moyu{
	constructor(width,name){
		this.width = width
		this.name = name
		this.timer = null
        this.faviconWidth = this.faviconHeight = this.SIDE = 32 // favcion边长32px
	}
	initCanvas(){
		this.canvas = document.createElement('canvas')
		this.canvas.width = this.canvas.height = this.SIDE = 32
	  }
	initVideo(){
		let video = document.createElement('video')
		video.width = this.width
		video.controls = "controls"
		video.src = "./video/" + this.name + ".mp4"
		video.crossOrigin = "anonymous"
		video.autoplay = "autoplay"
		document.body.appendChild(video)

		this.video = video
		this.bindVideoEvents()
	}
	bindVideoEvents(){
		// video相关的事件
        const video = this.video
        video.addEventListener('play', () => {
            // 视频转图标
            this.videoToFavcion()
        })
        video.addEventListener('canplay', () => {
            video.volume = 0.5
            setTimeout(() => {
                video.play()
            }, 500)
        })
    }
    bindKeyboardEvents(){
        const directions = {
            left: ()=> this.video.currentTime-=5,
            right: ()=> this.video.currentTime+=5,
            up: ()=> this.video.volume+=0.1,
            down: ()=> this.video.volume-=0.1,
        }
		document.onkeydown = (event)=> {
            console.log(this.video.volume)
			// 左上右下 37 38 39 40
            let key = event.keyCode
            if(key in DIRECTION){
                directions[DIRECTION[key]]()
            }
		}
    }
	videoToFavcion() {
        if (this.video.ended) {
            return
        }
        const context = this.canvas.getContext('2d')
        // 清空
        context.clearRect(0,0,this.faviconWidth,this.faviconHeight)
        context.drawImage(this.video,0,0,this.faviconWidth,this.faviconHeight)

        // 定期画图
        this.timer = setTimeout(() => {
            this.videoToFavcion()
        }, 50)
        this.setFavivon()
    }
	setFavivon() {
        // 设置图标
        const url = this.canvas.toDataURL('image/png')
        // document.querySelector('#img').src = url
        // 找到head里的link标签，rel属性有icon的，设置一下href属性
        const icons = [...document.querySelector('head').querySelectorAll('link')]
                        .filter(link => {
                            const rel = link.getAttribute('rel') || ''
                            return rel.indexOf('icon') > -1
                        })
        if (icons.length) {
            // 有 就设置
            icons.forEach(icon => icon.setAttribute('href', url))
        } else {
            // 网站没有icon 就新建一个
            const icon = document.createElement('link')
            link.setAttribute('ref', 'shortcut icon')
            link.setAttribute('href', url)
            document.querySelector('head').appendChild(icon)
        }
    }
	init(){
		this.initCanvas()
		this.initVideo()
	}
}

const m = new Moyu(videoWidth,videoName)
m.init()