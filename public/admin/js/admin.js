/*1.进度显示功能*/
/*不显示转圈效果*/
NProgress.configure({
    showSpinner: false
});


/*在ajax开始请求的时候  把进度条显示出来*/
$(window).ajaxStart(function(){
    NProgress.start();
});
/*在ajax结束请求的时候  把进度条完成*/

$(window).ajaxSend(function(){
    NProgress.done();
});
/*2.左菜单的显示和隐藏*/
$('[data-menu]').on('click',function(){
    $('.ad_aside').toggle();
    $('.ad_section').toggleClass('menu');
});
/*3.二级菜单的显示和隐藏*/
$('.menu [href="javascript:;"]').on('click',function(){
    var $this = $(this);
    var $child = $this.siblings('.child');
    $child.slideToggle();
});
/*4.退出功能*/
$('[data-logout]').on('click',function(){
    /*1.准备模态框  html转js字符串*/
    var logoutModal =
                    '<div class="modal fade" id="logoutModal">'+
                        '<div class="modal-dialog modal-sm">'+
                            '<div class="modal-content">'+
                                '<div class="modal-header">'+
                                    '<button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>'+
                                    '<h4 class="modal-title">温馨提示</h4>'+
                                '</div>'+
                                '<div class="modal-body">'+
                                    '<p class="text-danger"><span class="glyphicon glyphicon-info-sign"></span> 您确定要退出后台管理系统吗？</p>'+
                                '</div>'+
                                '<div class="modal-footer">'+
                                    '<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>'+
                                    '<button type="button" class="btn btn-primary">确定</button>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>';
    /*2.把模态框追加到页面当中*/
    $('body').append(logoutModal);
    /*3.显示模态框*/
    $('#logoutModal').modal('show').off('click','.btn-primary').on('click',function (e) {
    	$.ajax({
    		url: '/employee/employeeLogout',
    		type: 'get',
    		dataType: 'json',
    		data: {},
    		success:function (data) {
    			
    			if (data.success) {
    				location.href='login.html';
    			}
    		}
    	})
    	
    });

});