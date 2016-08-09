var isIE = function(ver) {
	var b = document.createElement('b');
	b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->';
	return b.getElementsByTagName('i').length === 1;
};
if (isIE(8) || isIE(7) || isIE(6)) {
	alert('配装器已经放弃了对IE 8 及其以下版本的支持，请升级浏览器，或更换 Chrome，Firefox 等现代浏览器访问。');
}
