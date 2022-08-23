function gOnPageLoad() {
	
	$( ".nav-link.edit" ).addClass( "active" );
    
    $( '#dateInput' ).datetimepicker( { 
		format: 'DD-MMM-YYYY',
        sideBySide: true,
        showTodayButton: true,
        showClear: true,
        icons: {
            time: 'fa fa-clock-o',
            date: 'fa fa-calendar',
            up: 'fa fa-chevron-up',
            down: 'fa fa-chevron-down',
            previous: 'fa fa-chevron-left',
            next: 'fa fa-chevron-right',
            today: 'fa fa-check',
            clear: 'fa fa-trash',
            close: 'fa fa-times'
        }
	} );
    
    $( ".bootstrap-select" ).removeClass( "form-select form-select-sm" );
	
    gHidePageLoader();
}