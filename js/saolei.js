//创建一个棋盘的构造函数
function Mine(tr, td, mineNum, count) {
    this.tr = tr;//棋盘行数
    this.td = td;//棋盘列数
    this.mineNum = mineNum;//雷的数量
    this.squares = [];//用于存储每个方块的信息
    this.tds = [];//存储每一个td的dom对象；
    this.setMine = mineNum;
    this.surplusMine = this.setMine;//存储剩余雷的数量；
    this.allRight = false;//雷是否被全部找出来
    this.parent = document.getElementById("box");//棋盘容器
    this.count = count;//存储玩家允许踩雷的次数；
    this.num = this.count;//计算玩家允许踩雷的次数；
}
//获取随机数，随机定义雷的位置
Mine.prototype.randomNum = function () {
    //生成this.tr*this.td为长度的数组
    var square = new Array(this.tr * this.td);
    var len = square.length;
    for (var i = 0; i < len; i++) {
        square[i] = i
    }
    //随机打乱数组
    square.sort(function () {
        return .5 - Math.random()
    })

    return square.splice(0, this.setMine);


}
//在Mine原型上绑定创建棋盘的方格的方法
Mine.prototype.createDom = function () {
    var This = this;

    var table = document.createElement('table');
    table.oncontextmenu = function () {
        return false
    }
    for (var i = 0; i < this.tr; i++) {
        var domTr = document.createElement('tr');
        this.tds[i] = []
        for (var j = 0; j < this.td; j++) {
            var domTd = document.createElement('td');
            domTd.pos = [i, j];
            domTd.onmousedown = function () {
                This.play(event, this)//This指的是实例对象，this指的是被点击的domtd，传入到paly方法中
            }
            //判断该domtd是否是雷
            //  if(this.squares[i][j].type == 'mine'){
            //      domTd.setAttribute('name','mine')
            //   }else{
            //     domTd.setAttribute('name','num')   
            //   }
            this.tds[i][j] = domTd;

            domTr.appendChild(domTd)
        }
        table.appendChild(domTr)
    }
    this.parent.appendChild(table);
}
//找出雷周围的格子，格子的value+1
Mine.prototype.getAround = function (square) {
    var x = square.x;
    var y = square.y;
    var result = [];
    for (var i = x - 1; i <= x + 1; i++) {
        for (var j = y - 1; j <= y + 1; j++) {
            if (
                //对格子超出边界的限制，不能等与自身，不能超出棋盘，不能type == ’mine‘
                (i == 0 && j == 0) ||
                i < 0 ||
                j < 0 ||
                i > this.td - 1 ||
                j > this.tr - 1 ||
                this.squares[j][i].type == 'mine'
            ) {
                continue
            }
            result.push([j, i])
        }
    }
    return result
}
//对雷周围的方格中的数字进行更新
Mine.prototype.updataNum = function () {
    for (var i = 0; i < this.tr; i++) {
        for (var j = 0; j < this.td; j++) {
            if (this.squares[i][j].type == 'number') {
                continue;
            }
            var num = this.getAround(this.squares[i][j]);
            for (var k = 0; k < num.length; k++) {
                this.squares[num[k][0]][num[k][1]].value += 1


            }
        }
    }

}
//玩家点击
Mine.prototype.play = function (ev, obj) {
    var This = this,
        curSquare = this.squares[obj.pos[0]][obj.pos[1]],

        cl = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
    if (ev.which == 1) {//左键点击的事件
        if (curSquare.type == 'number') {
            obj.className = cl[curSquare.value];

            if (curSquare.value == 0) {//value = 0；如果该格子周围没有雷
                function getAllZero(square) {//对该格子的四周搜索
                    var around = This.getAround(square);
                    for (var i = 0; i < around.length; i++) {
                        var x = around[i][0];
                        var y = around[i][1];
                        This.tds[x][y].className = cl[This.squares[x][y].value];

                        if (This.squares[x][y].value == 0) {//如果周围有value = 0的格子，则继续往此格子四周搜索（递归的出口，不为零时）
                            This.tds[x][y].innerText = ''
                            if (!This.squares[x][y].check) {
                                This.squares[x][y].check = true;//为了避免重复搜索陷入死循环
                                getAllZero(This.squares[x][y])//递归

                            }

                        }
                        else {
                            This.tds[x][y].innerText = This.squares[x][y].value

                        }
                    }
                }
                getAllZero(curSquare)
            }
            else {
                obj.innerText = curSquare.value;
            }
        } else {
            var audio = new Audio("bao.mp3");
            audio.play();//踩雷时播放雷爆炸的音效
            obj.className = 'onlymine';//记录踩雷的位置
            this.num--;
           
            this.surplusMine--;
            num.innerText = this.surplusMine;
            span.innerHTML = '剩余次数' + ' ' + this.num;
            if (this.num == 0) {
                setTimeout(() => {
                    alert('游戏结束');
                    span.innerHTML = '游戏结束';
                    span.style.color = 'red';

                    This.gameOver(obj);
                }, 1000)

            }


        }

    }
    if (ev.which == 3) {
        if (obj.className && obj.className != 'flag') {
            return
        }
        obj.className = obj.className == 'flag' ? '' : 'flag';
        if (obj.className == 'flag') {
            this.surplusMine--;
        }
        else {
            this.surplusMine++
        }
        num.innerText = this.surplusMine;

        if (this.surplusMine == 0) {
            setTimeout(() => {
                var bool = confirm('雷已经排完了，是否要提交游戏？');
                var count = 0;
                if (bool == true) {

                    This.alls()//检验游戏成功或者失败

                }
            }, 100)
        }

    }
}
//判断玩家是否全部选中
Mine.prototype.alls = function (a) {
    var n = 0;
    for (var i = 0; i < this.tr; i++) {
        for (var j = 0; j < this.td; j++) {
            if (this.tds[i][j].className == 'flag') {
                if (this.squares[i][j].type != 'mine') {
                    alert('游戏失败')
                    this.gameOver()
                    return
                } else {
                    alert('游戏成功')
                    this.gameOver()
                    return
                }

            }
            n++

        }

    }
}
//游戏结束
Mine.prototype.gameOver = function () {
    for (var i = 0; i < this.tr; i++) {
        for (var j = 0; j < this.td; j++) {
            if (this.squares[i][j].type == 'mine') {
                if (this.tds[i][j].className != 'onlymine') {
                    this.tds[i][j].className = 'mine'
                }

            }
            this.tds[i][j].onmousedown = null
        }
    }
   

}
Mine.prototype.init = function () {
    var rn = this.randomNum(),//雷的位置
        n = 0;//用来计算数组索引
    for (var i = 0; i < this.tr; i++) {
        this.squares[i] = []
        for (var j = 0; j < this.td; j++) {

            if (rn.indexOf(n) != -1) {//如果该索引有在雷的数组中寻找到，他的type：mine
                this.squares[i][j] = { type: 'mine', x: j, y: i }
            } else {
                this.squares[i][j] = { type: 'number', x: j, y: i, value: 0 }

            }
            n++

        }
    }
    //对剩余雷的数量进行统计
    var num = document.getElementById('num'),
        span = document.getElementById('span');
    this.surplusMine = this.setMine;//对类的数量进行还原
    num.innerText = this.setMine;
    this.num = this.count;//对踩雷次数进行还原
    span.innerHTML = '剩余次数' + ' ' + this.num;
    this.updataNum();
    this.createDom();
    console.log()


}


