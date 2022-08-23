function gShowPageLoader( callback ) {
	$('#gPageLoader').removeClass('d-none');
	if( callback ){
		setTimeout( callback, 100 );
	}
}
function gShowPageLoader1( callback, args1 ) {
	$('#gPageLoader').removeClass('d-none');
	setTimeout( callback, 100, args1 );
}
function gShowPageLoader2( callback, args1, args2 ) {
	$('#gPageLoader').removeClass('d-none');
	setTimeout( callback, 100, args1, args2 );
}
function gShowPageLoader3( callback, args1, args2, args3 ) {
	$('#gPageLoader').removeClass('d-none');
	setTimeout( callback, 100, args1, args2, args3 );
}
function gShowPageLoader4( callback, args1, args2, args3, args4 ) {
	$('#gPageLoader').removeClass('d-none');
	setTimeout( callback, 100, args1, args2, args3, args4 );
}
function gShowPageLoader5( callback, args1, args2, args3, args4, args5 ) {
	$('#gPageLoader').removeClass('d-none');
	setTimeout( callback, 100, args1, args2, args3, args4, args5 );
}
function gHidePageLoader(){ $('#gPageLoader').addClass('d-none'); }

function gAlert( title, htmlMsg, callback ) {
    $( '#gAlertModal .modal-title' ).text( title );
    $( '#gAlertModal .modal-body' ).html( htmlMsg );
    $( '#gAlertModal' ).off( "hide.bs.modal" );
    if( callback ) {
        $( '#gAlertModal' ).one( "hide.bs.modal", callback );
    }
    $( '#gAlertModal' ).modal( 'show' );
}

function gConfirm( title, htmlMsg, callback ) {
    $( '#gConfirmModal .modal-title' ).text( title );
    $( '#gConfirmModal .modal-body' ).html( htmlMsg );
    $( '#gConfirmModal .btn-confirm' ).off( 'click' ).one( 'click', function() {
        callback();
        $( '#gConfirmModal' ).modal( 'hide' );
    } );
    $( '#gConfirmModal' ).modal( 'show' );
}

const SUCCESS = 200, ERROR = 500, REDIRECT = 300;
function gAjax( options, callback, fCallback ) {
    gShowPageLoader();
    if( options.enctype == "multipart/form-data" ) {
        options.data.append( 'REQUEST_URL', options.url );
    } else {
        options.data["REQUEST_URL"] = options.url;
    }
    
    options.url = "/AjaxController/";
    
    $.ajax( options )
     .done( function( ajaxResponse ) {
        if( ajaxResponse &&
            ajaxResponse.ajaxResponseCode &&
            parseInt( ajaxResponse.ajaxResponseCode ) == SUCCESS ) {
	
            callback( ajaxResponse );

        } else if( ajaxResponse &&
            ajaxResponse.ajaxResponseCode &&
            parseInt( ajaxResponse.ajaxResponseCode ) == REDIRECT ) {
	
            window.location.href = ajaxResponse.ajaxResponseUrl;

        } else if( ajaxResponse && ajaxResponse.ajaxResponseText ) {
	
			if( fCallback ) {
	            fCallback( ajaxResponse );
			} else {
				gAlert( "Request Failed", ajaxResponse.ajaxResponseText );
	            gHidePageLoader();
			}
			
        } else {
	
			if( fCallback ) {
				fCallback();
			} else {
	            gAlert( "Request Failed", "Unable to process your request." );
	            gHidePageLoader();
			}
        }
    } )
    .fail( function( jqXHR ) {
		if( fCallback ) {
			fCallback();
		} else {
	        gAlert( "Request Failed", "HD: " + jqXHR.statusText );
	        gHidePageLoader();
		}
    } );
}

function changePassword() {
    var pwd = $( "#changePasswordInput" ).val();
    if( !pwd || pwd.length == 0 ) {
        gAlert( "Password", "Please enter new password." );
        return;
    }
    
    var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
	if( !(re.test( pwd )) ) {
		gAlert( "Password should be at least 8 character long. Required minimum 1 special char, 1 Captical Letter, 1 small letter and 1 number.");
		return;
	}
    
    gAjax({
		context : this,
		method  : "POST",
		url     : "/ChangePassword/",
        data    : {
            pwd: pwd
        }
	}, function( ar ) {
        $( "#changePasswordSpan" ).text( null );
        $( "#changePasswordInput" ).val( null );
        $( "#changePasswordModal" ).modal( "hide" );
		gAlert( "Password", "Password changed successfully." );
		gHidePageLoader();
	});
}
 

// Main function while runnning the script default
$( function () {
	var isOnIOS = navigator.userAgent.match(/iPad/i)|| navigator.userAgent.match(/iPhone/i);
	var eventName = isOnIOS ? "pagehide" : "beforeunload";
	window.addEventListener( eventName, gShowPageLoader );
    
    $( ".modal .close span" ).text( "x" );
    
    $( '.card-header' ).on( 'click', function() {
        var $icon = $( '.panel-expand-collapse', this );
        if( $icon.hasClass( 'fa-chevron-up' ) ) {
            $( this ).siblings( '.card-body' ).hide( 500 );
            $icon.removeClass( 'fa-chevron-up' )
                 .addClass( 'fa-chevron-down' );
        } else {
            $( this ).siblings( '.card-body' ).show( 500 );
            $icon.removeClass( 'fa-chevron-down' )
                 .addClass( 'fa-chevron-up' );
        }
    } );
    
     

   $(".rowforsearch").hide();

   $("#first_name_tr").show();
   $("#first_name_value").attr("data-show","1");  
   $("#last_name_tr").show();
   $("#last_name_value").attr("data-show","1");  
    
    $('#select_multiselect').on('change', function(){
        $(".rowforsearch").hide();  
        $(".allfields").attr("data-show","0");
        $(".allfields").val("")
        var count = 0;
        $('.select_multiselect option:selected').each(function(){ 
            count++;
            $("#"+$(this).val()+"_tr").show(); 
            $("#"+$(this).val()+"_value").attr("data-show","1");  
        }); 
        
        if(count==0){  
            gAlert( "Alert", "Minimum one field is required for the search" )
            $('.select_multiselect').val("first_name")
             $("#first_name_tr").show();
            
             $('.select_multiselect').selectpicker('refresh');
             $('.select_multiselect').closest(".bootstrap-select").removeClass("form-select"); 
             $('.select_multiselect').closest(".bootstrap-select").removeClass("form-select-sm"); 
             
             $("#first_name_value").attr("data-show","1");  
        } 
    });

    var Column_array = {

        "radio1" : ["national_id"],
        "radio2" : ["brn"],
        "radio3" : ["first_name","last_name","father_name","mother_name","contact_no"],

    }

    $('input[type=radio][name=radioSearchon]').change(function() {
        debugger
        $(".rowforsearch").hide();  
        $(".allfields").attr("data-show","0");
        $(".allfields").val("")
        var thisSelectedValue = $(this).val();
        var radioValue = $("input[name='radioSearchon']:checked").val();
        var array = Column_array[thisSelectedValue];

        for(var i = 0;i<array.length;i++){
             
            $("#"+array[i]+"_tr").show(); 
            $("#"+array[i]+"_value").attr("data-show","1");  
        } 


    });


    $( "#searchbtn" ).on( "click", function(){
        searchFunction();
    });

 

    $( "#searchbtn1" ).on( "click", function(){
        var count = 0;
        $('.allfields').each(function(){ 
           
            if( $(this).attr("data-show")!=null &&  $(this).attr("data-show")!=undefined &&
            (  $(this).attr("data-show")==1 ||  $(this).attr("data-show")=="1") && 
            $(this).val()!=null && 
            $(this).val()!=undefined && 
            $(this).val()!="" ){
                count++;
            }
        }); 
        if(count==0){
           
            gAlert( "Alert", "Minimum one value is required for the search", function(){

            } )
            return;
        } else {
  
        gShowPageLoader();
         
        const authToken ="Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJyZWdpc3RlciIsInBlcmZvcm1hbmNlIiwiY2VydGlmeSIsImRlbW8iXSwiaWF0IjoxNjU4OTI2Mzc5LCJleHAiOjE2NTk1MzExNzksImF1ZCI6WyJvcGVuY3J2czphdXRoLXVzZXIiLCJvcGVuY3J2czp1c2VyLW1nbnQtdXNlciIsIm9wZW5jcnZzOmhlYXJ0aC11c2VyIiwib3BlbmNydnM6Z2F0ZXdheS11c2VyIiwib3BlbmNydnM6bm90aWZpY2F0aW9uLXVzZXIiLCJvcGVuY3J2czp3b3JrZmxvdy11c2VyIiwib3BlbmNydnM6c2VhcmNoLXVzZXIiLCJvcGVuY3J2czptZXRyaWNzLXVzZXIiLCJvcGVuY3J2czpjb3VudHJ5Y29uZmlnLXVzZXIiLCJvcGVuY3J2czp3ZWJob29rcy11c2VyIiwib3BlbmNydnM6Y29uZmlnLXVzZXIiXSwiaXNzIjoib3BlbmNydnM6YXV0aC1zZXJ2aWNlIiwic3ViIjoiNjJiOTljZDk4ZjExM2E3MDBjYzE5YTFhIn0.NEROfXLDaGP14NBbCQF1Xv0R1R3GrofJ1NTePzlPS1eKFUbRzDye6enmsMN__eHpIYuBj9d5ifI8B_BPlChOXvA8VxvblJi3dTQxlfNe2YNehHarh1NVtWR9Ip6AQaZfD-ePfGxpqPqips2G6yuT3yBxu-zHk8rpemcgQEpZndUsZDyPKd3-pltOMUxOLZG5FpTuHd9RGaMg6JN14oi32UE27_DxH-OAWvhh2TgpBQ8xD033RXubpG83Kt7JFrFIPLhWUeirm_bJgEGJY7Z4BOWwht_YhlrYJpldnVZ_0Ld1r9jxqA3vtLD7BhpLK-JOVTi5Frr73Tk1-Ax-zTD19w"
        var options = [];
        options.data =  
        {
            "operationName": "searchEvents",
            "variables": {
            "locationIds": [
            "c9c4d6e9-981c-4646-98fe-4014fddebd5e"    ],    "sort": "DESC",   "trackingId": "",    "registrationNumber": "",   "contactNumber": "",   "name": "Ing"   },   "query": "query searchEvents($sort: String, $trackingId: String, $contactNumber: String, $registrationNumber: String, $name: String, $locationIds: [String!]) {\n  searchEvents(\n    sort: $sort\n    trackingId: $trackingId\n    registrationNumber: $registrationNumber\n    name: $name\n    contactNumber: $contactNumber\n    locationIds: $locationIds\n  ) {\n    totalItems\n    results {\n      id\n      type\n      registration {\n        status\n        contactNumber\n        trackingId\n        registrationNumber\n        registeredLocationId\n        duplicates\n        assignment {\n          userId\n          firstName\n          lastName\n          officeName\n          __typename\n        }\n        createdAt\n        modifiedAt\n        __typename\n      }\n      ... on BirthEventSearchSet {\n        dateOfBirth\n        childName {\n          firstNames\n          familyName\n          use\n          __typename\n        }\n        __typename\n      }\n      ... on DeathEventSearchSet {\n        dateOfDeath\n        deceasedName {\n          firstNames\n          familyName\n          use\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n"
        }
        //options.url = "http://172.16.17.12:7070/graphql";
        options.url = "http://localhost:5001/inappobilitylayer";
        options.type= "POST",
        options.headers = {
            //"content-type": "application/json",
            "Authorization": authToken,
          }
          var  tableBody = $("#searchedRecords");
          tableBody = $("#searchedRecords").html("");
        $.ajax( options )
         .done( function( ajaxResponse ) {
            if( ajaxResponse.data ) {
                
                 
                $.each(ajaxResponse.data["searchEvents"].results, function(key,value) {
                  
                    if(value.type == "Death"){
                       var  markupTr = "<tr>" 
                       +"<td>"  + value.type   + "</td>"
                       +"<td>"  + value.deceasedName[0].firstNames   + "</td>"
                       +"<td>"  + value.deceasedName[0].familyName   + "</td>" 
                       +"<td>"  + value.registration.contactNumber   + "</td>"
                       +"<td></td>"
                       +"<td>"  + value.dateOfDeath   + "</td>" 
                       +"</tr>";
                        tableBody.append(markupTr);
                    }else if(value.type =="Birth"){
                        var  markupTr = "<tr>"
                        +"<td>"  + value.type   + "</td>"
                        +"<td>"  + value.childName[0].firstNames   + "</td>"
                        +"<td>"  + value.childName[0].familyName   + "</td>"
                        +"<td>"  + value.registration.contactNumber   + "</td>"                       
                        +"<td>"  + value.dateOfBirth   + "</td>"
                        +"<td></td>" 
                        +"</tr>";
                         tableBody.append(markupTr);
                    }
                  }); 
                gHidePageLoader();
    
            } else if( ajaxResponse.error ) {
        
                gAlert( "Request Failed", ajaxResponse.error );
                    gHidePageLoader();
    
            }  else if( ajaxResponse.errors ) {
        
                gAlert( "Request Failed", ajaxResponse.errors );
                    gHidePageLoader();
    
            }else if( ajaxResponse && ajaxResponse.ajaxResponseText ) {
        
                 
                
            } else {
        
               
            }
        } )
        .fail( function( jqXHR ) {
             
        } );

        }
    });

    $( "#clearbtn" ).on( "click", function(){ 
        $(".allfields").val("")
    });

    gOnPageLoad();
} );

async function searchFunction(){
    var count = 0;
    $('.allfields').each(function(){ 
       
        if( $(this).attr("data-show")!=null &&  $(this).attr("data-show")!=undefined &&
        (  $(this).attr("data-show")==1 ||  $(this).attr("data-show")=="1") && 
        $(this).val()!=null && 
        $(this).val()!=undefined && 
        $(this).val()!="" ){
            count++;
        }
    }); 
    if(count==0){
       
        gAlert( "Alert", "Minimum one value is required for the search", function(){

        } )
        return;
    } else {

    gShowPageLoader();
     
    const authToken ="Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJyZWdpc3RlciIsInBlcmZvcm1hbmNlIiwiY2VydGlmeSIsImRlbW8iXSwiaWF0IjoxNjU5MDA5OTIxLCJleHAiOjE2NTk2MTQ3MjEsImF1ZCI6WyJvcGVuY3J2czphdXRoLXVzZXIiLCJvcGVuY3J2czp1c2VyLW1nbnQtdXNlciIsIm9wZW5jcnZzOmhlYXJ0aC11c2VyIiwib3BlbmNydnM6Z2F0ZXdheS11c2VyIiwib3BlbmNydnM6bm90aWZpY2F0aW9uLXVzZXIiLCJvcGVuY3J2czp3b3JrZmxvdy11c2VyIiwib3BlbmNydnM6c2VhcmNoLXVzZXIiLCJvcGVuY3J2czptZXRyaWNzLXVzZXIiLCJvcGVuY3J2czpjb3VudHJ5Y29uZmlnLXVzZXIiLCJvcGVuY3J2czp3ZWJob29rcy11c2VyIiwib3BlbmNydnM6Y29uZmlnLXVzZXIiXSwiaXNzIjoib3BlbmNydnM6YXV0aC1zZXJ2aWNlIiwic3ViIjoiNjJiOTljZDk4ZjExM2E3MDBjYzE5YTFhIn0.KCbw0Zlv26rTtxxUFlHT3D3rku-ht9W1Bv4gGg6zMYxgLdM1f_ExAbb0fMfcn6JxI07TDEH3wBG-FNfbmnLHKEinwUuQlqLE2PuF6QMw0Fdm6RekqAxoLtIrJG5akhRb9UkpArfS1KaMKst8maAuJcgkzUCNArOAhQldBW23wstLgDHzvwcRwv2p08rTNyBdtivqYKyufoL_K6dUYGONoF3JgzDMUEDdmPx6ST_sS6Ti5LyBb1oarstrSbpuXfHfpI3_nvWNZ4JtqMGH7PBWelR1b2bd9m8Lvu8ywPBhT7hBJuO72scDYE1XBsrB_r3QdpJZKAh-EzA56myxMLYYKw"
    
    var options = [];

        var name  = "";
        
        if($("#first_name_value").val() !=null && $("#first_name_value").val() !=""){
            name  = $("#first_name_value").val() ;
        }
        if($("#last_name_value").val() !=null && $("#last_name_value").val() !=""){
            if(name){
                name = name  + " ";
            }
            name  = name + $("#last_name_value").val() ;
        }
        if($("#father_name_value").val() !=null && $("#father_name_value").val() !=""){
            if(name){
                name = name  + " ";
            }
            name  = name + $("#father_name_value").val() ;
        }
        if($("#mother_name_value").val() !=null && $("#mother_name_value").val() !=""){
            if(name){
                name = name  + " ";
            }
            name  = name + $("#mother_name_value").val() ;
        }
    var brndrn = "";
    if($("#brn_value").val()){
        brndrn = $("#brn_value").val()
    }
    if($("#drn_value").val()){
        brndrn = $("#drn_value").val()
    }
    options.data =  
    JSON.stringify( {
        "operationName": "searchEvents",
        "variables": {
        "locationIds": [
        "c9c4d6e9-981c-4646-98fe-4014fddebd5e"    ],
            "sort": "DESC",   "trackingId": "", 
               "registrationNumber":brndrn,  
                "contactNumber": $("#contact_no_value").val(),
                  "name": name   },   "query": "query searchEvents($sort: String, $trackingId: String, $contactNumber: String, $registrationNumber: String, $name: String, $locationIds: [String!]) {\n  searchEvents(\n    sort: $sort\n    trackingId: $trackingId\n    registrationNumber: $registrationNumber\n    name: $name\n    contactNumber: $contactNumber\n    locationIds: $locationIds\n  ) {\n    totalItems\n    results {\n      id\n      type\n      registration {\n        status\n        contactNumber\n        trackingId\n        registrationNumber\n        registeredLocationId\n        duplicates\n        assignment {\n          userId\n          firstName\n          lastName\n          officeName\n          __typename\n        }\n        createdAt\n        modifiedAt\n        __typename\n      }\n      ... on BirthEventSearchSet {\n        dateOfBirth\n        childName {\n          firstNames\n          familyName\n          use\n          __typename\n        }\n        __typename\n      }\n      ... on DeathEventSearchSet {\n        dateOfDeath\n        deceasedName {\n          firstNames\n          familyName\n          use\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n"
   
                                })


    var MainURL =   "http://172.16.17.13:7070/graphql"                                  
    options.url = MainURL;
   
    options.type= "POST",
    options.headers = {
        "Content-Type": "application/json",
        "Authorization": authToken,
        "Accept" :"*/*"
      }
      var  tableBody = $("#searchedRecords");
      tableBody = $("#searchedRecords").html("");
      $("#totalrecordsinput").text(0);
      
    $.ajax( options )
     .done( async function( ajaxResponse ) {
        if( ajaxResponse.data ) {
             var trcount = 0;
             new Promise( function(resolve, reject) {
                 
                var totalcounts = 0;
                $.each(ajaxResponse.data["searchEvents"].results, async function(key,value) {
                    totalcounts++
                if(value.type == "Death"){

                    var thisRecordShouldCount = 0;

                    if($("#first_name_value").val() !=null && $("#first_name_value").val() !=""  ){

                        if($("#first_name_value").val().toLowerCase() 
                        != value.deceasedName[0].firstNames.toLowerCase()){
                            thisRecordShouldCount++;
                        }

                    }
                    if($("#last_name_value").val() !=null && $("#last_name_value").val() !=""){
                        if($("#last_name_value").val().toLowerCase() 
                        != value.deceasedName[0].familyName.toLowerCase()){
                            thisRecordShouldCount++;
                        }
                    }
                    
    

                    const detailData =  await getDeathData(MainURL,authToken,value.id);
                    
                    var fatherName = "", monthername = "";
                    fatherName =  detailData?.fetchDeathRegistration?.father?.name[0].firstNames
                    monthername =  detailData?.fetchDeathRegistration?.mother?.name[0].firstNames
                    

                    if($("#father_name_value").val() !=null && $("#father_name_value").val() !=""){
                        if($("#father_name_value").val().toLowerCase() 
                        != fatherName.toLowerCase()){
                            thisRecordShouldCount++;
                        }
                    }
                    if($("#mother_name_value").val() !=null && $("#mother_name_value").val() !=""){
                        if($("#mother_name_value").val().toLowerCase() 
                        != monthername.toLowerCase()){
                            thisRecordShouldCount++;
                        }
                    }

                    var  markupTr = "<tr>" 
                   +"<td>"  + value.type   + "</td>"
                   +"<td>"  + value.deceasedName[0].firstNames   + "</td>"
                   +"<td>"  + value.deceasedName[0].familyName   + "</td>" 
                   +"<td>"  + (fatherName ? fatherName:"")  + "</td>"
                   +"<td>"  +  (monthername ? monthername:"")   + "</td>"
                   +"<td>"  + value.registration.contactNumber   + "</td>"
                   +"<td></td>"
                   +"<td>"  + value.dateOfDeath   + "</td>" 
                   +"</tr>";
                   debugger
                   if(thisRecordShouldCount==0){
                     tableBody.append(markupTr);
                     trcount++;
                     $("#totalrecordsinput").val(  trcount );
                     $("#totalrecords").text("Total Records found : "+$("#totalrecordsinput").val());
                   }
                  
                }else if(value.type =="Birth"){


                    var thisRecordShouldCount = 0;

                    if($("#first_name_value").val() !=null && $("#first_name_value").val() !=""  ){

                        if($("#first_name_value").val().toLowerCase() 
                        != value.childName[0].firstNames.toLowerCase()){
                            thisRecordShouldCount++;
                        }

                    }
                    if($("#last_name_value").val() !=null && $("#last_name_value").val() !=""){
                        if($("#last_name_value").val().toLowerCase() 
                        != value.childName[0].familyName.toLowerCase()){
                            thisRecordShouldCount++;
                        }
                    }

                    const detailData =  await getDeathData(MainURL,authToken,value.id);
                    
                    var fatherName = "", monthername = "";
                    fatherName =  detailData?.fetchDeathRegistration?.father?.name[0].firstNames
                    monthername =  detailData?.fetchDeathRegistration?.mother?.name[0].firstNames
                    if($("#father_name_value").val() !=null && $("#father_name_value").val() !=""){
                        if($("#father_name_value").val().toLowerCase() 
                        != fatherName.toLowerCase()){
                            thisRecordShouldCount++;
                        }
                    }
                    if($("#mother_name_value").val() !=null && $("#mother_name_value").val() !=""){
                        if($("#mother_name_value").val().toLowerCase() 
                        != monthername.toLowerCase()){
                            thisRecordShouldCount++;
                        }
                    }
                    var  markupTr = "<tr>"
                    +"<td>"  + value.type   + "</td>"
                    +"<td>"  + value.childName[0].firstNames   + "</td>"
                    +"<td>"  + value.childName[0].familyName   + "</td>"
                    +"<td>"  + fatherName  + "</td>"
                    +"<td>"  + monthername  + "</td>"
                    +"<td>"  + value.registration.contactNumber   + "</td>"                       
                    +"<td>"  + value.dateOfBirth   + "</td>"
                    +"<td></td>" 
                    +"</tr>";
                    debugger
                    if(thisRecordShouldCount==0){
                        tableBody.append(markupTr);
                        trcount++;
                        $("#totalrecordsinput").val(  trcount );
                        $("#totalrecords").text("Total Records found : "+$("#totalrecordsinput").val());
                      }
                }
                 
                if(ajaxResponse.data["searchEvents"].results.length ==totalcounts ){
                    resolve(true);
                   } 
              });

              
              if(ajaxResponse.data["searchEvents"].results.length ==0 ){
                   resolve(true);
              }
            }).then(()=>{
                debugger
                if(trcount==0){
                    addNoRecordsfound(); 
                    $("#totalrecordsinput").val(  0 );
                        $("#totalrecords").text("Total Records found : "+$("#totalrecordsinput").val());
                      
                  }
                 
                gHidePageLoader();

            });
            
            
              

        } else if( ajaxResponse.error ) {
    
            gAlert( "Request Failed", ajaxResponse.error );
                gHidePageLoader();
                addNoRecordsfound()
        }  else if( ajaxResponse.errors ) {
            addNoRecordsfound()
            gAlert( "Request Failed", ajaxResponse.errors );
                gHidePageLoader();
                addNoRecordsfound()
        }else if( ajaxResponse && ajaxResponse.ajaxResponseText ) {
    
            addNoRecordsfound()
            
        } else {
    
            addNoRecordsfound()
        }
    } )
    .fail( function( jqXHR ) {
        addNoRecordsfound()
    } );

    }
}

function addNoRecordsfound(){
    $("#searchedRecords").append('<tr><td colspan="8" style="text-align: center;">No Records Found</td></tr>');
}


async function getDeathData(url,authToken,IdForFeatch){

let myPromise =    new Promise( function(resolve, reject) {

       var options=[]; 
     options.data =  
    JSON.stringify( { 
        "operationName": "fetchDeathRegistrationForReview",
        "variables": {
          "id": IdForFeatch
        },
        "query": "query fetchDeathRegistrationForReview($id: ID!) {\n  fetchDeathRegistration(id: $id) {\n    _fhirIDMap\n    id\n    deceased {\n      id\n      name {\n        use\n        firstNames\n        familyName\n        __typename\n      }\n      birthDate\n      age\n      gender\n      maritalStatus\n      nationality\n      identifier {\n        id\n        type\n        otherType\n        __typename\n      }\n      gender\n      deceased {\n        deathDate\n        __typename\n      }\n      address {\n        type\n        line\n        district\n        state\n        city\n        postalCode\n        country\n        __typename\n      }\n      __typename\n    }\n    informant {\n      id\n      relationship\n      otherRelationship\n      individual {\n        id\n        identifier {\n          id\n          type\n          otherType\n          __typename\n        }\n        name {\n          use\n          firstNames\n          familyName\n          __typename\n        }\n        nationality\n        occupation\n        birthDate\n        telecom {\n          system\n          value\n          __typename\n        }\n        address {\n          type\n          line\n          district\n          state\n          city\n          postalCode\n          country\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    father {\n      id\n      name {\n        use\n        firstNames\n        familyName\n        __typename\n      }\n      __typename\n    }\n    mother {\n      id\n      name {\n        use\n        firstNames\n        familyName\n        __typename\n      }\n      __typename\n    }\n    spouse {\n      id\n      name {\n        use\n        firstNames\n        familyName\n        __typename\n      }\n      __typename\n    }\n    medicalPractitioner {\n      name\n      qualification\n      lastVisitDate\n      __typename\n    }\n       eventLocation {\n      id\n      type\n      address {\n        type\n        line\n        district\n        state\n        city\n        postalCode\n        country\n        __typename\n      }\n      __typename\n    }\n    questionnaire {\n      fieldId\n      value\n      __typename\n    }\n    mannerOfDeath\n    causeOfDeathEstablished\n    causeOfDeathMethod\n    causeOfDeath\n    deathDescription\n    maleDependentsOfDeceased\n    femaleDependentsOfDeceased\n      __typename\n  }\n}\n"
      } )
    options.url = url;
   
    options.type= "POST",
    options.headers = {
        "Content-Type": "application/json",
        "Authorization": authToken,
        "Accept" :"*/*"
      }
     
    $.ajax( options )
     .done( function( ajaxResponse ) {
       
        if( ajaxResponse.data ) {
             
            resolve( ajaxResponse.data);

        } else if( ajaxResponse.error ) {
    
           
           resolve(  null);
        }  else if( ajaxResponse.errors ) {
    
           
             resolve(  null);
        } else{
            resolve(  null);
        }
    } )
    .fail( function( jqXHR ) {
        resolve(  null); 
    } );
    }
    )

    return  await myPromise;

    }

 