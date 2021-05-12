/**
 * 通用js方法封装处理
 * Copyright (c) 2019 ruoyi
 */

const baseURL = process.env.VUE_APP_BASE_API

// 通用下载方法
export function download(fileName) {
	window.location.href = baseURL + "/common/download?fileName=" + encodeURI(fileName) + "&delete=" + true;
}

// 字符串格式化(%s )
export function sprintf(str) {
	var args = arguments, flag = true, i = 1;
	str = str.replace(/%s/g, function () {
		var arg = args[i++];
		if (typeof arg === 'undefined') {
			flag = false;
			return '';
		}
		return arg;
	});
	return flag ? str : '';
}

// 转换字符串，undefined,null等转化为""
export function praseStrEmpty(str) {
	if (!str || str == "undefined" || str == "null") {
		return "";
	}
	return str;
}

  /**
   * 参数处理
   * @param {*} params  参数
   */
export function tansParams(params) {
	let result = ''
	Object.keys(params).forEach((key) => {
		if (!Object.is(params[key], undefined) && !Object.is(params[key], null)) {
			result += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&'
		}
	})
	return result
}
