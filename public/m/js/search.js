$(function () {
	$('.lt_search a').on('tap', function (e) {
		var key=$.trim($('input').val());

		if(!key){
			mui.toast('输入关键字');
			return false;
		}

		location.href = 'searchList.html?key='+key;
	});
});