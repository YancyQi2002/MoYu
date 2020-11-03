// 核心逻辑

// 1.加载视频 放在页面

// 2.给视频截图
//  canvas绘图
// 3.视频截图放在icon的link标签上 (定时任务)

class Moyu {
    constructor(width="100", name='[高清 1080P+] 杜喆——劝千岁') {
        this.width = width
        this.name = name
        this.timer = null
        this.faviconWidth = this.faviconHeight = 32
    }

    initVideo() {
        let video = document.createElement('video')
        video.width = this.width
        video.controls = 'controls'
        video.src = "./video/" + this.name + '.mp4'
        video.crossOrigin = "anonymous"
        document.body.appendChild(video)
        this.video = video

        this.bindVideoEvents()
    }

    bindVideoEvents() {
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

    initCanvas() {
        this.canvas = document.createElement('canvas')
        this.canvas.width = this.canvas.height = 32
    }

    init() {
        this.initVideo()
        this.initCanvas()
    }
}

const m = new Moyu(videoWidth, videoName)
m.init()