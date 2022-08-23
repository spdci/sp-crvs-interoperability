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
    $( '#gAlertModal .modal-header h5' ).text( title );
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

   $("#national_id_type_tr").show();
   $("#national_id_tr").show();
   $("#national_id_value").attr("data-show","1");  
   $("#national_id_type_value").attr("data-show","1");  
    
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

        "national_id" : ["national_id", "national_id_type"],
        "brndrn" : ["brn", "drn"],
        "otherradio" : ["first_name","last_name","father_name","mother_name","contact_no"],

    }

    $('input[type=radio][name=radioSearchon]').change(function() {
         
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
 
    var radioValue = $("input[name='radioSearchon']:checked").val();

    if(radioValue == "national_id" && ($("#national_id_value").val()==null || $("#national_id_value").val() ==""
    || $("#national_id_type_value").val() ==null || $("#national_id_type_value").val() =="")){
       count=0;
   }

    if(radioValue == "otherradio" && ($("#first_name_value").val()==null || $("#first_name_value").val() ==""
     || $("#last_name_value").val() ==null || $("#last_name_value").val() =="")){
        count=0;
    }

    if(count==0){
       
        gAlert( "Alert", "Enter the mendatory fields for the search", function(){

        } )
        return;
    } else {

    gShowPageLoader();
     
    const authToken ="Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJyZWdpc3RlciIsInBlcmZvcm1hbmNlIiwiY2VydGlmeSIsImRlbW8iXSwiaWF0IjoxNjU5MDkzMDg0LCJleHAiOjE2NTk2OTc4ODQsImF1ZCI6WyJvcGVuY3J2czphdXRoLXVzZXIiLCJvcGVuY3J2czp1c2VyLW1nbnQtdXNlciIsIm9wZW5jcnZzOmhlYXJ0aC11c2VyIiwib3BlbmNydnM6Z2F0ZXdheS11c2VyIiwib3BlbmNydnM6bm90aWZpY2F0aW9uLXVzZXIiLCJvcGVuY3J2czp3b3JrZmxvdy11c2VyIiwib3BlbmNydnM6c2VhcmNoLXVzZXIiLCJvcGVuY3J2czptZXRyaWNzLXVzZXIiLCJvcGVuY3J2czpjb3VudHJ5Y29uZmlnLXVzZXIiLCJvcGVuY3J2czp3ZWJob29rcy11c2VyIiwib3BlbmNydnM6Y29uZmlnLXVzZXIiXSwiaXNzIjoib3BlbmNydnM6YXV0aC1zZXJ2aWNlIiwic3ViIjoiNjJiOTljZDk4ZjExM2E3MDBjYzE5YTFhIn0.KhAJ7osK9av-jsza7H2Id7ULCnbDL7aMKjSFo3KgTb1XZzboVzqKLDst-eTx4J8qM2yI5WLRfY2EBEz4Q__oLkG0auQ26TUb9M8yQyu-UzuZoM7z2YVBTffQzZUG7YxCqnN2pIDftmWYuMduMMxe59OSRklNeIvSe709RwD-tCgN-vUFAsrUHnlryVPbBJym86yfIWdBIcvi8Rx5SNQw7C0NapTTWFjgMU_BOUoPvwQV1tkb7ZnVh494RehNVIuisuDdQiQKsb1Csqi6CFlPRnAs3aWSC-C5TaS-E_vJstaeLuB-gQhcmfukaKt9TTLbA2Mri1pQbYgzrBuJPB6N9A"
    
    var options = {};
    var dataForsearch = {
        "identifier_type":"",
        "identifier_id":"",
        "first_name_value" : "" , 
        "last_name_value" :"",
        "father_name_value" :"",
        "mother_name_value" :"",
        "brn_value" :"",
        "drn_value" :"",
         "contactNumber" :"" 
    }

        var name  = "";

        if($("#national_id_type_value").val() !=null && $("#national_id_type_value").val() !=""){
            dataForsearch.identifier_type  = $("#national_id_type_value").val() ;
        }
        if($("#national_id_value").val() !=null && $("#national_id_value").val() !=""){
            dataForsearch.identifier_id  = $("#national_id_value").val() ;
        }
        if($("#first_name_value").val() !=null && $("#first_name_value").val() !=""){
            dataForsearch.first_name_value  = $("#first_name_value").val() ;
        }
        if($("#last_name_value").val() !=null && $("#last_name_value").val() !=""){
             dataForsearch.last_name_value  =  $("#last_name_value").val() ;
        }
        if($("#father_name_value").val() !=null && $("#father_name_value").val() !=""){
            dataForsearch.father_name_value  = $("#father_name_value").val() ;
        }
        if($("#mother_name_value").val() !=null && $("#mother_name_value").val() !=""){
            dataForsearch.mother_name_value  =  $("#mother_name_value").val() ;
        } 
        if($("#brn_value").val()){
            dataForsearch.brn_value  = $("#brn_value").val()
        }
        if($("#drn_value").val()){
            dataForsearch.drn_value  = $("#drn_value").val()
        }
        if($("#contact_no_value").val()){
            dataForsearch.contactNumber  = $("#contact_no_value").val()
        }
    
    options.data =     JSON.stringify(dataForsearch);
 
    var MainURL = "http://localhost:3001/getdatamediator"                                  
    options.url = MainURL;
   
    options.type= "POST", 
    options.dataType= 'json',
    options.headers = {
        "Content-Type": "application/json", 
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
               
                trcount = forDetailData(ajaxResponse,tableBody,dataForsearch,trcount);
             
                   resolve();
              
            }).then(()=>{
                
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


function forDetailData(ajaxResponse,tableBody,dataForsearch,trcount){


    var s = ajaxResponse.data.data;
    var totalcounts = 0;
    debugger
    if( dataForsearch.identifier_type!=null &&  dataForsearch.identifier_type!=""
    &&  dataForsearch.identifier_id !=null && dataForsearch.identifier_id!=""){
        $.each(ajaxResponse.data.data,   function(key,value) {
           var responseValue =  value.resource;
            var fatherName = "";    
            var motherName ="";
            var identiferId = "NATIONAL_ID";
            var indetifeirType="";
            var typeOfRecord = "Birth";
            var registrationNumber = "";


            if(value.detailData !=null && value.detailData!=undefined && 
                value.detailData.father !=null && value.detailData.father!=undefined && 
                value.detailData.father.name !=null && value.detailData.father.name  !=undefined && 
                value.detailData.father.name[0] !=null && value.detailData.father.name[0] !=undefined && 
                value.detailData.father.name[0].firstNames !=null && value.detailData.father.name[0].firstNames !=undefined ) {
                    fatherName =  value.detailData.father.name[0].firstNames;
            }
            if(value.detailData !=null && value.detailData!=undefined && 
                value.detailData.mother !=null && value.detailData.mother!=undefined && 
                value.detailData.mother.name !=null && value.detailData.mother.name !=undefined && 
                value.detailData.mother.name[0] !=null && value.detailData.mother.name[0] !=undefined && 
                value.detailData.mother.name[0].firstNames !=null && value.detailData.mother.name[0].firstNames !=undefined ) {
                    motherName =  value.detailData.mother.name[0].firstNames;
            }

            if(  responseValue.identifier !=null && responseValue.identifier !=undefined  ) {
                    $.each( responseValue.identifier,   function(keyIdenti,valueIdenti) {
                    
                        if(valueIdenti.type ==  identiferId ){
                            indetifeirType =valueIdenti.value
                        }
                        if(valueIdenti.type ==  "DEATH_REGISTRATION_NUMBER" ){
                            typeOfRecord = "Death";
                            registrationNumber = valueIdenti.value;
                        }else   if(valueIdenti.type ==  "BIRTH_REGISTRATION_NUMBER" ){
                            registrationNumber =  valueIdenti.value;
                        }
                    });
                
                }

                if(typeOfRecord== "Death"){

                    var  markupTr = "<tr>" 
                    +"<td>"  + (indetifeirType!=null && indetifeirType!=undefined && indetifeirType!="" ?identiferId:"")   + "</td>"
                    +"<td>"  +  indetifeirType + "</td>"
                    +"<td></td>"
                    +"<td>"  + registrationNumber + "</td>"         
                    +"<td>"  + typeOfRecord   + "</td>"
                    +"<td>"  + responseValue.name[0].given[0]   + "</td>"
                    +"<td>"  + responseValue.name[0].family[0]   + "</td>"
                    +"<td>"  + fatherName  + "</td>"
                    +"<td>"  +  motherName   + "</td>"
                    +"<td></td>"
                    +"<td></td>"
                    +"<td>"  + responseValue.deceasedDateTime   + "</td>" 
                    +"</tr>";
                
                
                    tableBody.append(markupTr);
                    trcount++;
                    $("#totalrecordsinput").val(  trcount );
                    $("#totalrecords").text("Total Records found : "+$("#totalrecordsinput").val());
                
                
                }else if(typeOfRecord =="Birth"){

                    var  markupTr = "<tr>"
                    +"<td>"  + (indetifeirType!=null && indetifeirType!=undefined && indetifeirType!="" ?identiferId:"")   + "</td>"
                    +"<td>"  +  indetifeirType + "</td>"                  
                    +"<td>"  + registrationNumber + "</td>"  
                    +"<td></td>"        
                    +"<td>"  +typeOfRecord  + "</td>"
                    +"<td>"  + responseValue.name[0].given[0]   + "</td>"
                    +"<td>"  + responseValue.name[0].family[0]   + "</td>"
                    +"<td>"  + fatherName + "</td>"
                    +"<td>"  +  motherName  + "</td>"
                    +"<td></td>"                       
                    +"<td>"  + responseValue.birthDate   + "</td>"
                    +"<td></td>" 
                    +"</tr>";
                    
                    
                    tableBody.append(markupTr);
                    trcount++;
                    $("#totalrecordsinput").val(  trcount );
                    $("#totalrecords").text("Total Records found : "+$("#totalrecordsinput").val());
                    
                }

        });
    }else{                   
        $.each(ajaxResponse.data.data,   function(key,value) {
            totalcounts++

            var fatherName = "";    
            var motherName ="";
            if(value.detailData !=null && value.detailData!=undefined && 
                value.detailData.father !=null && value.detailData.father!=undefined && 
                value.detailData.father.name !=null && value.detailData.father.name  !=undefined && 
                value.detailData.father.name[0] !=null && value.detailData.father.name[0] !=undefined && 
                value.detailData.father.name[0].firstNames !=null && value.detailData.father.name[0].firstNames !=undefined ) {
                    fatherName =  value.detailData.father.name[0].firstNames;
            }
            if(value.detailData !=null && value.detailData!=undefined && 
                value.detailData.mother !=null && value.detailData.mother!=undefined && 
                value.detailData.mother.name !=null && value.detailData.mother.name !=undefined && 
                value.detailData.mother.name[0] !=null && value.detailData.mother.name[0] !=undefined && 
                value.detailData.mother.name[0].firstNames !=null && value.detailData.mother.name[0].firstNames !=undefined ) {
                    motherName =  value.detailData.mother.name[0].firstNames;
            }
            var identiferId = "NATIONAL_ID";
           

            
        if(value.type == "Death"){

            var indetifeirType="";
            if(value.detailData !=null && value.detailData!=undefined && 
                value.detailData.deceased !=null && value.detailData.deceased!=undefined && 
                value.detailData.deceased.identifier !=null && value.detailData.deceased.identifier !=undefined  ) {
                    $.each( value.detailData.deceased.identifier,   function(keyIdenti,valueIdenti) {
                    
                        if(valueIdenti.type ==  identiferId ){
                            indetifeirType =valueIdenti.id
                        }
                    });
                
                }

            var  markupTr = "<tr>" 
            +"<td>"  + (indetifeirType!=null && indetifeirType!=undefined && indetifeirType!="" ?identiferId:"")   + "</td>"
            +"<td>"  +  indetifeirType + "</td>"
            +"<td></td>"
            +"<td>"  + value.registration.registrationNumber   + "</td>" 

        +"<td>"  + value.type   + "</td>"
        +"<td>"  + value.deceasedName[0].firstNames   + "</td>"
        +"<td>"  + value.deceasedName[0].familyName   + "</td>" 
        +"<td>"  + fatherName  + "</td>"
        +"<td>"  +  motherName   + "</td>"
        +"<td>"  + value.registration.contactNumber   + "</td>"
        +"<td></td>"
        +"<td>"  + value.dateOfDeath   + "</td>" 
        +"</tr>";
        
        
            tableBody.append(markupTr);
            trcount++;
            $("#totalrecordsinput").val(  trcount );
            $("#totalrecords").text("Total Records found : "+$("#totalrecordsinput").val());
        
        
        }else if(value.type =="Birth"){

            var indetifeirType="";
            if(value.birthIdentifier !=null && value.birthIdentifier!=undefined && 
                value.birthIdentifier.entry !=null && value.birthIdentifier.entry!=undefined && 
                 value.birthIdentifier.entry[0] !=null &&  value.birthIdentifier.entry[0] !=undefined &&
                 value.birthIdentifier.entry[0].resource !=null &&  value.birthIdentifier.entry[0].resource !=undefined &&
                 value.birthIdentifier.entry[0].resource.identifier !=null &&  value.birthIdentifier.entry[0].resource.identifier !=undefined   ) {
                    $.each(  value.birthIdentifier.entry[0].resource.identifier,   function(keyIdenti,valueIdenti) {
                    
                        if(valueIdenti.type ==  identiferId ){
                            indetifeirType =valueIdenti.value
                        }
                    });
                
                }

            var  markupTr = "<tr>"
            +"<td>"  + (indetifeirType!=null && indetifeirType!=undefined && indetifeirType!="" ?identiferId:"")   + "</td>"
            +"<td>"  +  (indetifeirType!=null && indetifeirType!=undefined ?indetifeirType:"")+ "</td>"                  
            +"<td>"  + value.registration.registrationNumber   + "</td>" 
            +"<td></td>"

            +"<td>"  + value.type   + "</td>"
            +"<td>"  + value.childName[0].firstNames   + "</td>"
            +"<td>"  + value.childName[0].familyName   + "</td>"
            +"<td>"  + fatherName + "</td>"
        +"<td>"  +  motherName  + "</td>"
        +"<td>"  + value.registration.contactNumber   + "</td>"                       
            +"<td>"  + value.dateOfBirth   + "</td>"
            +"<td></td>" 
            +"</tr>";
            
            
                tableBody.append(markupTr);
                trcount++;
                $("#totalrecordsinput").val(  trcount );
                $("#totalrecords").text("Total Records found : "+$("#totalrecordsinput").val());
            
        }
        
        
    });

     }

return trcount;
}

function addNoRecordsfound(){
    $("#searchedRecords").append('<tr><td colspan="12" style="text-align: center;">No Records Found</td></tr>');
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

 