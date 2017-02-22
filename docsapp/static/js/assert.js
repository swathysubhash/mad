export function equal ( a, b, msg ) {
	if ( !msg ) msg = format( '%s does not equal %s', a, b );
	if ( a != b ) throw new Error( msg );
}