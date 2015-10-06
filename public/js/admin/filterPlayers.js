var query = {};
var $list = $( "#playersList" );

$( "select" ).on( "change", function( e ) {
	// Form the query:
	query[ $( this ).attr( "name" ) ] = $( this ).val();

	// Send request to backend:
	$.ajax({
		url     : "/api/players?" + $.param( query ),
		method  : "GET",
		success : function( response ) {
			$list.html( "" );
			response.players.forEach( function( player ) {
				$list.append( "<li>" + player.team + " - " + player.jerseyNum + " - (" + player.position + ") " + player.name + " - " + player.status + " &middot; <a href='/admin/player/update?id=" + player._id + "'>edit</a> &middot; <a href='/admin/player/delete?id=" + player._id + "'>delete</a></li>" );
			});
		}
	});
});