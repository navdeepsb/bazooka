/**
 * @passwordPolicy
 *   + At least 8 characters
 *   + An alphabet
 *   + A special character
 *   + A number
 */

exports.isValid = function( pwd ) {

	// Length check:
	if( pwd.length < 8 ) {
		return false;
	}

	// Alphabets check:
	if( !/[a-z,A-Z]/.test( pwd ) ) {
		return false;
	}

	// Special characters check:
	if( !/[!,@,#,$,%,^,&,*,?,_,~,\-,(,)]/.test( pwd ) ) {
		return false;
	}

	// Numbers check:
	if( !/\d+/.test( pwd ) ) {
		return false;
	}

	return true;
};