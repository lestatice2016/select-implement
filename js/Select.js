
function Select() {}
//通过创建input,ul元素来构成select元素
Select.prototype.init = function () {
    var select = document.createElement('div');
    select.className = 'select';
    this.input = document.createElement('input');
    this.input.className = 'input';
    this.list = document.createElement('ul');
    this.list.className = 'list';
    document.body.appendChild(select);
    select.appendChild(this.input);
    select.appendChild(this.list);
    $('.input').css({
        "width":"180px",
        "height":"30px",
        "border":"1px solid #808080",
        "padding-left":"5px"
    });
    $('.list').css({
        "width":"180px",
        "margin":"0px",
        "padding":"0px",
        "list-style":"none"
    });
}
//ajax异步加载数据
Select.prototype.requestData = function (url) {
    var self = this;
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 )
        {
            //将返回的匹配数据传给select元素的data数组中
            self.data = JSON.parse(xhr.responseText);
        }
        // else
        //     console.log(xhr.status);
    }
    xhr.open('get',url);
    xhr.send(null);
}

Select.prototype.listen = function () {
    var self = this;
    var body =document.querySelector('body');
    var input = document.querySelector('.input');
    var list = document.querySelector('.list');
    var value ;
    on(input,'focus',function () {
        value = this.value;
        self.autoComplete(value);
    });

    on(input,'keyup',function () {
        value = this.value;
        self.autoComplete(value);
    })
    on(list,'click',function (event) {
        var target = event.target;
        var itemValue;
        var node = target.tagName.toLowerCase();
        if (node === 'li'){
            itemValue = target.innerText;
        }else if (node === 'span'){
            itemValue = target.parentNode.innerText;
        }
        input.value = itemValue;
        $('.list').css({
            "visibility" : "hidden"
        });
    });
    //非input元素上的点击,则隐藏list
    on(body,'click',function (event) {
        var target = event.target.tagName.toLowerCase();
        if (target !== 'input') {
            $('.list').css({
                "visibility" : "hidden"
            });
        }
    });
}
//对输入字符与data中的数据匹配
Select.prototype.autoComplete = function (str) {
    $('.list').css({
        "visibility" : "visible"
    });
    var items = [];
    //为了IE兼容用了for..in
    for(var i in this.data){
        var item = this.data[i];
        if (item.indexOf(str) === 0){
            items.push('<li class="item"><span class="item-red">'+str+'</span>'+item.substring(str.length)+'</li>');
        }
    }
    this.list.innerHTML = items.join('');

    $('.item').css({
        "border-bottom": "1px solid #dfdfdf",
        "cursor": "pointer",
        "color": "#999",
        "line-height": "30px",
        "padding": "0 10px",
        "background": "#eee",
    });
    //匹配到的字符前缀颜色改变
    $('.item-red').css({
            "color":"red"
    }
    );
    var len = items.length;
    //list列表项超出,则出现滚动条
    if (len >6) {
        $('.list').css({
            "height":"200px",
            "overflow":"scroll"
        });
    }else {
        $('.list').css({
            "overflow":"auto"
        });
    }
}
//封装跨浏览器的绑定事件
function on(elem,type,callback) {
    if (elem.addEventListener)
        elem.addEventListener(type,callback);
    else if (elem.attachEvent)
        elem.attachEvent('on'+type,function (event) {
            var e = fixEvent(event);
            callback.call(elem,e);
        });
    else {
        elem['on' + type] = function() {
            var e = fixEvent(window.event);
            callback.call(elem, e);
        }
    }
}
//修复event不兼容的地方
function fixEvent(event) {
    event.target = event.target || event.srcElement;
    event.preventDefault = event.preventDefault || function() {
            event.returnValue = false;
        };
    event.stopPropagation = event.stopPropagation || function() {
            event.cancelBubble = true;
        };
    return event;
}

