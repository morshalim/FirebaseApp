$(function() {
	$('.page-header').html($('#page-header').html());
	$('a[rel="downloadAttachment"]').on('click',function(){
		var ele=$(this);
		downloadAttachment(ele);
	});
});

function downloadAttachment(ele){
	var guid = $(ele).attr('guid');
	//var workItemId = $(ele).attr('workItemId');
	var url = fileDownloadURL + "?guid=" +guid;

 	showLoading();
	$.fileDownload(url, {
		successCallback: function (url) {
		 	closeLoading();
		 	showSuccess("File Downloaded Successfully");
		},
		failCallback: function (html, url) {
			closeLoading();
			showError("File Download Failed");
		}
	});
}
