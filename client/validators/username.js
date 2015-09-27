var excludeRegex = /[!,@,#,$,%,^,&,*,?,~,\-,(,),=,\/,.,\s,',",:,;]|^$|admin/;

exports.isValid = function( username ) {
	return !excludeRegex.test( username );
};