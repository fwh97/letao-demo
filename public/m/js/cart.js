$(function () {

	mui('.mui-scroll-wrapper').scroll({
		indicators:false
	});

	mui.init({
		pullRefresh: {
            container: "#refreshContainer",
            down: {
            	auto:true,
            	callback:function(data){
            		var that=this;
            		window.down=this;
            		setTimeout(function () {
            			getCartData(function (data) {
							$('#cart_box').html(template('cartTpl', data));
							/*加载状态隐藏*/
							window.cartData = data;
                        	that.endPulldownToRefresh();
						});
						
            		},1000);
            	}
            }
        }
	});
	/*点击刷新*/
	$('.fa-refresh').on('tap', function(e) {
		down.pulldownLoading();
	});
	/*侧滑的时候  点击删除  弹出对话框 确认框*/
	$('.mui-table-view').on('tap','.mui-btn-blue',function () {
		var id = $(this).attr('data-id');
		var li = this.parentNode.parentNode;
        var item = LT.getItemById(window.cartData.data,id);
        var html = template('cartUpdate',item);
        /*replace()替换方法   \n换行 */
        mui.confirm(html.replace(/\n/g,''), '商品编辑', ['确认', '取消'], function(e) {
        	if (e.index == 0) {
                var size= $('.btn_size.now').html();
                var num= $('.p_number input').val();
                var params={
                	id:id,
                	size:size,
                    num:num
                };
                if(!params.size){
                    mui.toast('请选择尺码');
                    return false;
                }
                if(!params.num){
                    mui.toast('请选择数量');
                    return false;
                }
                LT.loginAjax({
					url:'/cart/updateCart',
					type:'post',
					data: params,
					dataType:'json',
					success:function(data){
			            if (data.success==true) {
			            	// item.num=num;	//更新window.catrData里的数据
			            	// item.size=size;
							mui.toast('编辑成功');
	                        mui.swipeoutClose(li);
	                        $.extend(item,params); //extend() 更换数据
	                        $(li).find('.number').html('x'+num+'双');
	                        $(li).find('.size').html('鞋码：'+size);
			            	setAmount();
			            }
			            else{
			            	mui.toast(data.message);
			            }
					}
				});
            }
        });
	})
	/*删除*/
	.on('tap','.mui-btn-red',function () {
		var $this = $(this);
        var id = $this.data('id');
		mui.confirm('您确认是否删除该商品？', '商品删除', ['确认', '取消'], function(e) {
			if (e.index == 0) {
			LT.loginAjax({
					url:'/cart/deleteCart',
					type:'get',
					data:{ id:id },
					dataType:'json',
					success:function (data) {
						if (data.success==true) {
							$this.parent().parent().remove();
							setAmount();
						}
					}
				});
			}
		});
	});
	/*选尺码样式效果*/
	$('body').on('tap','.btn_size',function () {
        $(this).addClass('now').siblings().removeClass('now');
    })
    .on('tap','.p_number span',function () {/*数量业务逻辑*/
    	var $input=$(this).siblings('input');
		var currNum=$input.val();
		var maxNum=parseInt($input.attr('data-max'));

		if ($(this).hasClass('jian')) {
			if (currNum <= 1) {
				mui.toast('至少一件商品');
                return false;
			}
			currNum--;
		}else{
			if (currNum >= maxNum){ /*消息框点击的时候会消失 正好和加号在一块  (击穿 tap,点击穿透)*/
                mui.toast('库存不足');
                return false;
            }
			currNum++;
		}
		$input.val(currNum);
    })
    .on('change','input[type="checkbox"]',function () {	/*5.点击复选框  计算总金额 */
        /* 总金额 = 每个商品数量*单价 的总和  */
        setAmount();
    });

});

/*计算总价*/
var setAmount=function(){
	var amount = 0;
    var checkPro = $('input:checked');
    for(var i = 0 ; i < checkPro.length ; i ++){
        var product = LT.getItemById(window.cartData.data,$(checkPro[i]).attr('data-id'));
        amount += product.price*product.num;
    }
    $('#cartAmount').html(Math.ceil(amount*100)/100);
}

var getCartData=function (callback) {
	LT.loginAjax({
		url:'/cart/queryCartPaging',
		type:'get',
		data: {
			page:1,
			pageSize:100
		},
		dataType:'json',
		success:function(data){
			callback && callback(data);
		}
	});
}