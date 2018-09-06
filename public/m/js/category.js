$(function () {
	// 一级分类
	getCategoryData(function (data) {
		$('.cate_left ul').html(template('template_cata_left', data));
		var categoryId=$('.cate_left ul li:first-child').find('a').attr('data-id');
		render(categoryId);
	});

	//二级分类
	$('.cate_left').on('tap','a',function (e) {
        /*当前选中的时候不去加载*/
        var $this=$(this)
        if($this.parent().hasClass('now')) return false;
        /*样式的选中功能*/
        $('.cate_left li').removeClass('now');
        $this.parent().addClass('now');
        /*数据的渲染*/
        render( $this.data('id'));
    });
});

var getCategoryData=function (callback) {
	$.ajax({
		url:'/category/queryTopCategory',
		dataType:'json',
		type:'get',
		success:function (data) {
			callback&&callback(data);
		}
	});
}
var getSecondCategoryData=function (params, callback) {

	$.ajax({
		url:'/category/querySecondCategory',
		dataType:'json',
		type:'get',
		data:params,
		success:function (data) {
			callback&&callback(data);
		}
	});
}

var render=function(categoryId){
	getSecondCategoryData({id:categoryId}, function (data) {
		$('.cate_right ul').html(template('template_cata_right', data));
	});
}