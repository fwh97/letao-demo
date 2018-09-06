window.LT={};
/*获取？传参值*/
LT.getSearchUrl=function () {
	var search=location.search;
	var params={};
	if (!search) return params;

	search=search.replace('?', '');
	var arr=search.split('&');

	arr.forEach(function (item, i) {
		var itemArr =item.split('=');
		params[itemArr[0]] = itemArr[1];
	});
	return params;
}
/*轮播图*/
LT.setMui=function(time){
	/*区域滚动*/
	mui('.mui-scroll-wrapper').scroll({
		indicators:false
	});
	var gallery = mui('.mui-slider');
	gallery.slider({
	  interval:time//自动轮播周期，若为0则不自动播放，默认为0；
	});
}
/*需要登录的ajax请求*/
LT.loginUrl = '/m/user/login.html';
LT.cartUrl = '/m/cart.html';
LT.userUrl = '/m/user/index.html';

LT.loginAjax=function (params) {
	$.ajax({
		type:params.type||'get',
		data:params.data||'',
		url:params.url||'#',
		dataType:params.dataType||'json',
		success:function(data){
			if (data.error == 400) {
        		location.href=LT.loginUrl+'?returnUrl='+location.href;
        		return false;
        	}
        	else{
        		params.success && params.success(data);
        	}
		},
		error:function () {
            mui.toast('服务器繁忙');
        }
	});
}

LT.serialize2object=function (serializeStr) {
	var obj={};
	if (serializeStr) {
		var arr=serializeStr.split('&');
		arr.forEach( function(item, i) {
			var itemArr=item.split('=');
			obj[itemArr[0]]= itemArr[1]; 
		});
	}
	return obj;
}

LT.getItemById = function (arr,id) {
    var obj = null;
    arr.forEach(function (item,i) {
        if(item.id == id){
            obj = item;
        }
    });
    return obj;
}