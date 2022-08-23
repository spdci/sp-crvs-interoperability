function gOnPageLoad() {
	
	$( ".nav-link.home" ).addClass( "active" );
    
    var trs = [];
    for( var i = 2; i <= 100; i++ ) {
        var tr = $( ".tr-1" ).clone().removeClass( "tr-1" ).addClass( "tr-" + i );
        $( ".sr-td", tr ).text( i );
        $( ".name-td", tr ).text( "Name " + i );
        $( ".desc-td", tr ).text( "Description " + i );
        trs.push( tr );
    }
    $( "#dbTbody" ).append( trs );
	
	$( "#dbTable" ).DataTable({
		scrollX         : true,
        scrollY         : $( window ).height() - 200,
        scrollCollapse  : true,
        paging          : true,
        dom             : 'ftp',
		responsive		: false,
		autoWidth		: false
	});
	
    gHidePageLoader();
}