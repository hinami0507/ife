function createMap(selector,num){
    var dom = document.querySelector(selector);
    var table = '<table>';//构造表格
    var icon = '';//构造标记
    var w=100/num;
    for (var row = 0; row < num; row++) {
        table += '<tr>';
        icon += '<i style="left:-'+w+'%;top:' + row * w + '%;">' + row + '</i>';
        for (var col = 0; col < num; col++) {
            if (row == 0) {
                icon += '<i style="left:' + col * w + '%;top:-'+w+'%;">' + col + '</i>';
            }
            table += '<td id="td' + row + '-' + col + '"></td>'
        }
        table += '</tr>';
    }
    table += '</table>';
    dom.innerHTML = icon + table;
}
