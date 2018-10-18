$(function() {
	showReleaseNotes(releaseNotesItem);
});

function  showReleaseNotes(data)
{
	var tbody = [];
	var firstRecord = true;
	var hrefClassName = "";
	var styleClassName = "";
	var divClassName = "";
	$.each(data,function(key,value){
	if(firstRecord)
	{
		hrefClassName="accordion-toggle";
		styleClassName = "height: auto;";
		divClassName ="accordion-body";
		divClassName = divClassName+" "+"in"+" "+"collapse";
		firstRecord= false;
	}
			tbody.push('<div class="accordion-group">');
			tbody.push('<div class="accordion-heading">');
			tbody.push('<a href="#'+key+'" data-parent="#accordion2" data-toggle="collapse" class="'+hrefClassName+'">'+key+'</a>');
			tbody.push('</div>');
			tbody.push('<div class="'+divClassName+'" id="'+key+'" style="'+styleClassName+'">');
			tbody.push('<div class="accordion-inner">');		
			tbody.push('<table class="table table-striped table-bordered table-hover">');
			for(var i=0;i<value.length;i++){
				tbody.push('<tr>');
				tbody.push('<td>');
				tbody.push(value[i]);
				tbody.push('</td>');
				tbody.push('</tr>');
			}
			tbody.push('</table>');
			tbody.push('</div>');
			tbody.push('</div>');
			tbody.push('</div>');
			hrefClassName = "accordion-toggle"
			hrefClassName = hrefClassName+" "+"collapsed";
			styleClassName = "height: 0px;";
			divClassName = "accordion-body";
			divClassName = divClassName+" "+"collapse";
		});
		$('#accordion2').html(tbody.join(''));

}