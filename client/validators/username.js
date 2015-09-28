var minLength    = 5;
var excludeRegex = /[!,@,#,$,%,^,&,*,?,~,\-,(,),=,\/,.,\s,',",:,;]|^$|admin/;

exports.isValid = function( username ) {
	return !excludeRegex.test( username ) && username.length >= minLength;
};