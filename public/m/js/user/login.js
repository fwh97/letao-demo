$(function () {
	$('#submit').on('tap', function(e) {
		
		var data=$('form').serialize();

		var dataObject=LT.serialize2object(data);

		if(!dataObject.username){
            mui.toast('请您输入用户名');
            return false;
        }
        if(!dataObject.password){
            mui.toast('请您输入密码');
            return false;
        }

        $.ajax({
        	url:'/user/login',
        	type:'post',
        	data:dataObject,
        	dataType:'json',
        	success:function (data) {
        		/*如果成功 根据地址跳转*/
                /*如果没有地址 默认跳转个人中心首页*/
                if(data.success == true){
                    /*业务成功*/
                    var returnUrl = location.search.replace('?returnUrl=','');
                    if(returnUrl){
                        location.href = returnUrl;
                    }else{
                        location.href = CT.userUrl;
                    }
                }else{
                    /*业务不成功*/
                    mui.toast(data.message);
                }
        	}
        });

	});;
});