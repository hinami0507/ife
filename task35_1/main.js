function mapInit(selector, cols, w) {
    var dom = document.querySelector(selector);
    var table = '<table>';//构造表格
    var icons = '';//构造标记
    var style = 'width:' + w + 'px;height:' + w + 'px;line-height:' + w + 'px;';
    for (var row = 0; row < cols; row++) {
        table += '<tr>';
        icons += '<i style="left:' + -w + 'px;top:' + row * (w + 1) + 'px;' + style + '">' + row + '</i>';
        for (var col = 0; col < cols; col++) {
            if (row == 0) {
                icons += '<i style="top:' + -w + 'px;left:' + col * (w + 1) + 'px;' + style + '">' + col + '</i>';
            }
            table += '<td style="' + style + '" id="td' + row + '-' + col + '"></td>';
        }
        table += '</tr>';
    }
    table += '</table>';

    //小车
    var def = JSON.stringify({width: w, max: cols});
    var car = '<div data-def= \'' + def + '\'' +
        'id="car" data-x="0" data-y="0" data-direction="right" style="' + style + 'top:1px;left:1px;"></div>';

    dom.innerHTML = icons + table + car;
}


var consoler_error_handler;
function consoleInit(selector) {
    var consoler = document.querySelector(selector);
    consoler.innerHTML = '<div class="ruler"><i></i></div><textarea></textarea>';

    var textarea = consoler.querySelector('textarea');
    var ruler = consoler.querySelector('.ruler');
    var iNode = document.createElement('i');
    var row = 1;
    /*输入事件更新行号*/
    textarea.addEventListener('input', function () {
        var arr = textarea.value.split(/\n/);
        var len = arr.length
        while (len > row) {
            row++;
            ruler.appendChild(iNode.cloneNode(false));
        }
        while (len < row) {
            row--;
            ruler.removeChild(ruler.lastChild);
        }

        //延迟分析指令对错并标注
        clearTimeout(consoler_error_handler);
        consoler_error_handler = setTimeout(function () {
            check_consoler_errors(arr);
        }, 1000);

        //保存指令
        consoler.dataset.cmd = JSON.stringify(arr);
    });
    /*滚动条事件调整行号位置*/
    textarea.addEventListener('scroll', function () {
        ruler.style.top = -textarea.scrollTop + 'px';
    });
    /*焦点移出时调用一次校验*/
    textarea.addEventListener('blur', function () {
        clearTimeout(consoler_error_handler);
        check_consoler_errors(JSON.parse(consoler.dataset.cmd || '[]'));
    });
    function check_consoler_errors(arr) {
        var errors = [];
        arr.forEach(function (e, index) {
            var item = e.split(' ');
            if (item.length < 2 || item.length > 3) {
                errors.push(index);
                ruler.children[index].classList.add('error');
            } else {
                ruler.children[index].classList.remove('error');
            }
        });
        consoler.dataset.errors = JSON.stringify(errors);
    }

    return consoler;
}

/*动作：前进*/
function toMove(car, direction, callback) {
    var def = JSON.parse(car.dataset.def);
    var x = parseInt(car.dataset.x), y = parseInt(car.dataset.y);
    //计算新状态
    switch (direction) {
        case 'right':
            x = x + 1 < def.max - 1 ? x + 1 : def.max - 1;
            break;
        case 'left':
            x = x - 1 > 0 ? x - 1 : 0;
            break;
        case 'top':
            y = y - 1 > 0 ? y - 1 : 0;
            break;
        case 'bottom':
            y = y + 1 < def.max - 1 ? y + 1 : def.max - 1;
            break;
    }
    if (x != car.dataset.x || y != car.dataset.y) {
        if (callback) {
            var eventHandler = function () {
                callback();
                car.removeEventListener('transitionend', eventHandler);
            }
            car.addEventListener('transitionend', eventHandler);
        }
        //更新car
        car.dataset.x = x;
        car.dataset.y = y;

        car.style.left = (def.width + 1) * x + 1 + 'px';
        car.style.top = (def.width + 1) * y + 1 + 'px';
    }

}
/*动作：转向*/
function toTurn(car, direction, callback) {
    if (car.dataset.direction != direction) {
        if (callback) {
            var eventHandler = function () {
                callback();
                car.removeEventListener('transitionend', eventHandler);
            }
            car.addEventListener('transitionend', eventHandler);
        }
        car.dataset.direction = direction;
    }

}