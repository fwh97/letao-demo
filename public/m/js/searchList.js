$(function () {
	mui('.mui-scroll-wrapper').scroll({
		indicators:false
	});

	// 1获取的关键字
	var urlParams=LT.getSearchUrl();
	// 搜索框显示关键字
	var $input=$('input').val(urlParams.key || '');

	// 
	getSeachData({
		proName:urlParams.key,
		page:1,
		pageSize:4

	},function (data) {
		// 渲染
		$('.lt_product').html(template('list', data));
	});

	$('.lt_search a').on('tap',  function(e) {
		var key = $.trim($input.val());
        if (!key) {
            mui.toast('请输入关键字');
            return false;
        }

		getSeachData({
			proName:key,
			page:1,
			pageSize:4
		},function (data) {
			$('.lt_product').html(template('list', data));
		});
	});

	$('.lt_order a').on('tap', function(e) {
		var $this=$(this);
		var page=window.page *4;
		console.log(page)
		if ($this.hasClass('now')) {
			if ($this.find('span').hasClass('fa-angle-down')) {

				$this.find('span').removeClass('fa-angle-down').addClass('fa-angle-up');
			}
			else{
				$this.find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
			}
		}else{
			$this.addClass('now').siblings().removeClass('now')
			.find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
		}

		var order=$this.data('order');

		var orderValue=$this.find('span').hasClass('fa-angle-up') ? 1 : 2;
		var key=$.trim($input.val());

		if(!key){
			mui.toast('输入关键字');
			return false;
		}
		var params={
			proName:key,
			page:1,
			pageSize:page
		};
		params[order]=orderValue;
		getSeachData(params,function (data) {
			console.log(data)
			$('.lt_product').html(template('list', data));
		});
	});

	mui.init({
		pullRefresh : {
		    container:"#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器
		    down : {
		      	auto: true,//可选,默认false.首次加载自动上拉刷新一次
			    callback :function (data) {
			      	var that=this;
		      	 	var key = $.trim($input.val());
		                if (!key) {
		                    mui.toast('请输入关键字');
		                    that.endPulldownToRefresh();
		                    return false;
		                }
		                /*排序功能也重置*/
	                $('.lt_order a').removeClass('now').find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
		            getSeachData({
						proName:key,
						page:1,
						pageSize:4
					},function (data) {
						setTimeout(function () {
							$('.lt_product').html(template('list', data));
							/*注意：停止下拉刷新*/
		                    that.endPulldownToRefresh();
		                    /*上拉加载重置*/
		                    that.refresh(true);
						},200);
					});
		      	} 
		    },

		    up : {
		    	callback :function (data) {
		    		window.page++;
			      	var that=this;
		      	 	var key = $.trim($input.val());
		      	 	if (!key) {
		                    mui.toast('请输入关键字');
		                    that.endPullupToRefresh(true);
		                    return false;
		                }
	               	
	                /*获取当前点击的功能参数  price 1 2 num 1 2*/
	            	var order = $('.lt_order a.now').data('order');
	                var orderValue = $('.lt_order a.now').find('span').hasClass('fa-angle-up') ? 1 : 2;
	                var params={
						proName:key,
						page:window.page,
						pageSize:4
					};
					params[order]=orderValue;
		            getSeachData(params,function (data) {
						setTimeout(function () {
							// 添加数据
							$('.lt_product').append(template('list', data));
							/*注意：停止上拉加载*/
	                        if(data.data.length){
	                            that.endPullupToRefresh();
	                        }else{
	                            that.endPullupToRefresh(true);
	                        }
						},500);
					});
		      	}
	    	}
	    }
	});
});

var getSeachData=function (params, callback) {
	$.ajax({
		url:'/product/queryProduct',
		type:'get',
		data: params,
		dataType:'json',
		success:function(data){
			console.log(data.page)
			/*存当前页码*/
            window.page = data.page;
			callback&& callback(data);
		}
	});
}