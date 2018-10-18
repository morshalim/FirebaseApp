var attachmentsCtrl = null;

$(function(){
	
	attachmentsCtrl = new AttachmentsController({
		advanced: true,
		attachmnents: attachmnentsList,
		attachmnentTypes: attachmnentTypesList,
		maxFilesize: attachmnentMaxFilesize
	}).init().render();
});