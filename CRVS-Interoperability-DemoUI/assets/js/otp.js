function gOnPageLoad() {
    
    //$( "#otpForm" ).on( "submit", onOtpFormSubmit );
    
    $( "#otp1" ).on( "keyup", function(){ $( "#otp2" ).focus(); } );
    $( "#otp2" ).on( "keyup", function(){ $( "#otp3" ).focus(); } );
    $( "#otp3" ).on( "keyup", function(){ $( "#otp4" ).focus(); } );
    $( "#otp4" ).on( "keyup", function(){ $( "#otp5" ).focus(); } );
    $( "#otp5" ).on( "keyup", function(){ $( "#otp6" ).focus(); } );
    $( "#otp6" ).on( "keyup", function(){ $( "#submitButton" ).focus(); } );
    $( "#otp1" ).focus();
    
}

/*function onOtpFormSubmit() {
    $( ".border-danger" ).removeClass( "border border-danger" );
    
    if(  ) {
        
    }
}*/