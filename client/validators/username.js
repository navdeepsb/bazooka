var excludeRegex = /[!,@,#,$,%,^,&,*,?,~,\-,(,),=,\/,.,\s,',",:,;]|^$/;

exports.isValid = function( username ) {
	return !excludeRegex.test( username );
};