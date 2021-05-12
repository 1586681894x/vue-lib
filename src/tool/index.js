import './lodash';
import './message';
import './extend';
import moment from 'moment';

// Object.defineProperty
Object.defineProperty(Object.prototype, 'formatTimePicker', {
    value: function(key = 'Picker',name1 = 'beginTime',name2 = 'endTime'){
        let params = this;
        let value = params[key];
        if(value && value[1]){
            params[name1] = `${value[0]} 00:00:00`;
            params[name2] = `${value[1]} 23:59:59`;
        }else{
            params[name1] = void 0;
            params[name2] = void 0;
        }
        //delete params[key];
        return params;
    }
})

// Object.defineProperty
Object.defineProperty(Object.prototype, 'setForm', {
    value: function(obj = {}){
        let form = this;
        Object.keys(obj).forEach((v)=>{
            obj[v] !== void 0 && form.append(v,obj[v])
        })
        return form;
    }
})

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.format = function(fmt) {
    return moment(this).format(fmt);
}

// Extend the default Number object with a formatMoney() method:
// usage: someVar.formatMoney(decimalPlaces, symbol, thousandsSeparator, decimalSeparator)
// defaults: (2, "$", ",", ".")
Number.prototype.formatMoney = function (places = 2, symbol = ' ', thousand = ',', decimal = '.') {
    places = !isNaN(places = Math.abs(places)) ? places : 2;
    symbol = symbol !== undefined ? symbol : "$";
    thousand = thousand || ",";
    decimal = decimal || ".";
    var number = this,
        negative = number < 0 ? "-" : "",
        i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
};
