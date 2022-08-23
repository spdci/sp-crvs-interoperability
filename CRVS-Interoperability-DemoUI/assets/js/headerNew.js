var server_url = "http://172.16.17.137"


function gShowPageLoader( callback ) {
	$('#gPageLoader').removeClass('d-none');
	if( callback ){
		setTimeout( callback, 100 );
	}
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

        "national_id" : ["national_id","national_id_type"],
        "brndrn" : ["brn","drn"],
        "otherradio" : ["first_name","last_name","father_name","mother_name","contact_no"],

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

    if(radioValue == "otherradio" && ($("#first_name_value").val()==null || $("#first_name_value").val() ==""
     || $("#last_name_value").val() ==null || $("#last_name_value").val() =="")){
        count=0;
    }
    if(radioValue == "national_id" && ($("#national_id_value").val()==null || $("#national_id_value").val() ==""
    || $("#national_id_type_value").val() ==null || $("#national_id_type_value").val() =="")){
       count=0;
   }

 

   var brndrncount = 0; 
   if($("#brn_value").val()){
    brndrncount++;
   }
   if($("#drn_value").val()){
    brndrncount++;
   }
   var MainURL = server_url+ ":7070/graphql";
  
    if(count==0){
       
        gAlert( "Alert", "Enter the mendatory fields for the search", function(){

        } )
        return;
    } else {

    gShowPageLoader();
    var options = [];
    const authToken ="Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJyZWdpc3RlciIsInBlcmZvcm1hbmNlIiwiY2VydGlmeSIsImRlbW8iXSwiaWF0IjoxNjYwMTMzNjA2LCJleHAiOjE2NjA3Mzg0MDYsImF1ZCI6WyJvcGVuY3J2czphdXRoLXVzZXIiLCJvcGVuY3J2czp1c2VyLW1nbnQtdXNlciIsIm9wZW5jcnZzOmhlYXJ0aC11c2VyIiwib3BlbmNydnM6Z2F0ZXdheS11c2VyIiwib3BlbmNydnM6bm90aWZpY2F0aW9uLXVzZXIiLCJvcGVuY3J2czp3b3JrZmxvdy11c2VyIiwib3BlbmNydnM6c2VhcmNoLXVzZXIiLCJvcGVuY3J2czptZXRyaWNzLXVzZXIiLCJvcGVuY3J2czpjb3VudHJ5Y29uZmlnLXVzZXIiLCJvcGVuY3J2czp3ZWJob29rcy11c2VyIiwib3BlbmNydnM6Y29uZmlnLXVzZXIiXSwiaXNzIjoib3BlbmNydnM6YXV0aC1zZXJ2aWNlIiwic3ViIjoiNjJiOTljZDk4ZjExM2E3MDBjYzE5YTFhIn0.yhdFxG0hIBep-Z87f3L314w_U-FgKq2bS76SsEbdWiu3CbcWVAJw1xZhtpVVGERu02ybQQA7_X8a5dnnvXiY8PDkxVguB6yxgeriRkCRS2wOzVH4KtX3A6AidmgpqgH_4E9ycAWtTRbOjmm_mawptt_GHkSzkF_qYBwGc6RnhsV_7zkMVi8t4SCw8htnr6liwseFhHyRF0uEarM7s-CwWtgydcCMOKosp6-Q3W0P0FR0uvaQ0K9wxKIkI5lYsdJqcxcpH-rKiW-0BAtTxQanM_1R4UWxUmouGLE2bGEt6LIDjd6X_LzJUC6gzBNTicGdQkaKa3jmFVICkPBG-zz7LA"
      debugger
    if( $("#national_id_value").val()!=null && $("#national_id_value").val() !=""
    && $("#national_id_type_value").val() !=null && $("#national_id_type_value").val() !=""){

            var MainURL1 =  server_url+":5001/fhir/Patient?identifier=" + $("#national_id_value").val()                               
            options.url = MainURL1;
        
            options.type= "get",
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
                if( ajaxResponse.entry ) {
                    var trcount = 0;
                    $.each(ajaxResponse.entry,  async function(key,value) {
                    var responseValue =  value.resource;
                    var fatherName = "";    
                    var motherName ="";
                    var identiferId = "NATIONAL_ID";
                    var indetifeirType="";
                    var typeOfRecord = "Birth";
                    var registrationNumber = "";
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
                        debugger
                        var ConstURL = server_url+":5001/fhir/Composition?entry=Patient/"+responseValue.id;
                        var DataFor = await getDataByUrL('get',ConstURL,authToken,null);
                        var fatherName = "", motherName = "";
                        if(DataFor!=null && DataFor!="" && DataFor!=[] 
             
                        && DataFor.entry!=null && DataFor.entry!=undefined && DataFor.entry!=[]){ 
                            for (let indexE = 0; indexE < DataFor.entry.length; ++indexE) { 
                                const detailData =  await getDeathData(MainURL,authToken,DataFor.entry[indexE].resource.id); 
                               
                                fatherName =  detailData?.fetchDeathRegistration?.father?.name[0].firstNames
                                motherName =  detailData?.fetchDeathRegistration?.mother?.name[0].firstNames
                            }
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
                            +"<td>"  + (fatherName!=null && fatherName!=undefined && fatherName!="" ?fatherName:"")  + "</td>"
                            +"<td>"  + (motherName!=null && motherName!=undefined && motherName!="" ?motherName:"")   + "</td>"
                            +"<td></td>"
                            +"<td></td>"
                            +"<td>"  + responseValue.deceasedDateTime   + "</td>" 
                            +"</tr>";
                        
                        
                            tableBody.append(markupTr);
                            trcount++;
                            $("#totalrecordsinput").val(  trcount );
                            $("#totalrecords").text("Total Records found : "+$("#totalrecordsinput").val());
                        
                        
                        }else if(typeOfRecord =="Birth"){

                            var consturl =  server_url+":5001/fhir/Patient?identifier=" + $("#national_id_value").val()    ;   
                            var Response_data = await getDataByUrL('get',consturl,authToken,null);

                            var  markupTr = "<tr>"
                            +"<td>"  + (indetifeirType!=null && indetifeirType!=undefined && indetifeirType!="" ?identiferId:"")   + "</td>"
                            +"<td>"  +  indetifeirType + "</td>"                
                            +"<td>"  + registrationNumber + "</td>"  
                            +"<td></td>"        
                            +"<td>"  +typeOfRecord  + "</td>"
                            +"<td>"  + responseValue.name[0].given[0]   + "</td>"
                            +"<td>"  + responseValue.name[0].family[0]   + "</td>"
                            +"<td>"  + (fatherName!=null && fatherName!=undefined && fatherName!="" ?fatherName:"")  + "</td>"
                            +"<td>"  + (motherName!=null && motherName!=undefined && motherName!="" ?motherName:"")   + "</td>"
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
                        gHidePageLoader();
                } else if( ajaxResponse.error ) {
            
                    gAlert( "Request Failed", ajaxResponse.error );
                    
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

    } else if(brndrncount == 2){
        debugger
        returnFunction(MainURL,$("#brn_value").val(),authToken)
        returnFunction(MainURL,$("#drn_value").val(),authToken)


    }   else{
 
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


                    var identiferId = "NATIONAL_ID";
                    var indetifeirType="";
                    
                    

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
                    if(detailData!=null && detailData!=undefined && 
                        detailData.fetchDeathRegistration !=null && detailData.fetchDeathRegistration!=undefined && 
                        detailData.fetchDeathRegistration.deceased !=null && detailData.fetchDeathRegistration.deceased!=undefined && 
                        detailData.fetchDeathRegistration.deceased.identifier !=null && detailData.fetchDeathRegistration.deceased.identifier !=undefined  ) {
                            $.each( detailData.fetchDeathRegistration.deceased.identifier,   function(keyIdenti,valueIdenti) {
                            
                                if(valueIdenti.type ==  identiferId ){
                                    indetifeirType =valueIdenti.id
                                }
                            });
                        
                        }


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
                    +"<td>"  + (indetifeirType!=null && indetifeirType!=undefined && indetifeirType!="" ?identiferId:"")   + "</td>"
                    +"<td>"  +  indetifeirType + "</td>"                  
                    
                    +"<td></td>"
                    +"<td>"  + value.registration.registrationNumber   + "</td>" 
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
                    
                    var consturl =  server_url+":5001/fhir/Patient?identifier=" +  value.registration.registrationNumber    ; 
                    debugger  
                    var Response_data = await getDataByUrL('get',consturl,authToken,null);
                    

                    if( Response_data!=null && Response_data!=undefined &&  
                        Response_data.entry !=null && Response_data.entry !=undefined && 
                        Response_data.entry[0] !=null && Response_data.entry[0] !=undefined && 
                        Response_data.entry[0].resource !=null && Response_data.entry[0].resource !=undefined && 
                        Response_data.entry[0].resource.identifier !=null && Response_data.entry[0].resource.identifier !=undefined  ) {

                        $.each( Response_data.entry[0].resource.identifier,   function(keyIdenti,valueIdenti) {
                        
                            if(valueIdenti.type ==  identiferId ){
                                indetifeirType =valueIdenti.value
                            }
                            
                        });
                    
                    }



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
                    +"<td>"  + (indetifeirType!=null && indetifeirType!=undefined && indetifeirType!="" ?identiferId:"")   + "</td>"
                    +"<td>"  + (indetifeirType!=null && indetifeirType!=undefined && indetifeirType!="" ?indetifeirType:"")   + "</td>"   
                    +"<td>"  + value.registration.registrationNumber   + "</td>"   
                    +"<td></td>"                  
                    +"<td>"  + value.type   + "</td>"
                    +"<td>"  + value.childName[0].firstNames   + "</td>"
                    +"<td>"  + value.childName[0].familyName   + "</td>"
                    +"<td>"  + fatherName  + "</td>"
                    +"<td>"  + monthername  + "</td>"
                    +"<td>"  + value.registration.contactNumber   + "</td>"                       
                    +"<td>"  + value.dateOfBirth   + "</td>"
                    +"<td></td>" 
                    +"</tr>";
                     
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
}



function returnFunction(MainURL,brndrn,authToken){
    gShowPageLoader();
    debugger
    var options = [];
options.data =  
JSON.stringify( {
    "operationName": "searchEvents",
    "variables": {
    "locationIds": [
    "c9c4d6e9-981c-4646-98fe-4014fddebd5e"    ],
        "sort": "DESC",   "trackingId": "", 
           "registrationNumber":brndrn,  
            "contactNumber":"",
              "name": ""   },   "query": "query searchEvents($sort: String, $trackingId: String, $contactNumber: String, $registrationNumber: String, $name: String, $locationIds: [String!]) {\n  searchEvents(\n    sort: $sort\n    trackingId: $trackingId\n    registrationNumber: $registrationNumber\n    name: $name\n    contactNumber: $contactNumber\n    locationIds: $locationIds\n  ) {\n    totalItems\n    results {\n      id\n      type\n      registration {\n        status\n        contactNumber\n        trackingId\n        registrationNumber\n        registeredLocationId\n        duplicates\n        assignment {\n          userId\n          firstName\n          lastName\n          officeName\n          __typename\n        }\n        createdAt\n        modifiedAt\n        __typename\n      }\n      ... on BirthEventSearchSet {\n        dateOfBirth\n        childName {\n          firstNames\n          familyName\n          use\n          __typename\n        }\n        __typename\n      }\n      ... on DeathEventSearchSet {\n        dateOfDeath\n        deceasedName {\n          firstNames\n          familyName\n          use\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n"

                            })

                               
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


                var identiferId = "NATIONAL_ID";
                var indetifeirType="";
                
                

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
                if(detailData!=null && detailData!=undefined && 
                    detailData.fetchDeathRegistration !=null && detailData.fetchDeathRegistration!=undefined && 
                    detailData.fetchDeathRegistration.deceased !=null && detailData.fetchDeathRegistration.deceased!=undefined && 
                    detailData.fetchDeathRegistration.deceased.identifier !=null && detailData.fetchDeathRegistration.deceased.identifier !=undefined  ) {
                        $.each( detailData.fetchDeathRegistration.deceased.identifier,   function(keyIdenti,valueIdenti) {
                        
                            if(valueIdenti.type ==  identiferId ){
                                indetifeirType =valueIdenti.id
                            }
                        });
                    
                    }


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
                +"<td>"  + (indetifeirType!=null && indetifeirType!=undefined && indetifeirType!="" ?identiferId:"")   + "</td>"
                +"<td>"  +  indetifeirType + "</td>"                  
                
                +"<td></td>"
                +"<td>"  + value.registration.registrationNumber   + "</td>" 
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

                var consturl =  server_url+":5001/fhir/Patient?identifier=" +  value.registration.registrationNumber    ; 
                debugger  
                var Response_data = await getDataByUrL('get',consturl,authToken,null);
                

                if( Response_data!=null && Response_data!=undefined &&  
                    Response_data.entry !=null && Response_data.entry !=undefined && 
                    Response_data.entry[0] !=null && Response_data.entry[0] !=undefined && 
                    Response_data.entry[0].resource !=null && Response_data.entry[0].resource !=undefined && 
                    Response_data.entry[0].resource.identifier !=null && Response_data.entry[0].resource.identifier !=undefined  ) {

                    $.each( Response_data.entry[0].resource.identifier,   function(keyIdenti,valueIdenti) {
                    
                        if(valueIdenti.type ==  identiferId ){
                            indetifeirType =valueIdenti.value
                        }
                        
                    });
                
                }

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
                +"<td>"  + (indetifeirType!=null && indetifeirType!=undefined && indetifeirType!="" ?identiferId:"")   + "</td>"
                +"<td>"  +  indetifeirType + "</td>"   
                +"<td>"  + value.registration.registrationNumber   + "</td>"   
                +"<td></td>"                  
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
                $("#totalrecordsinput").val(  0 );
                    $("#totalrecords").text("Total Records found : "+$("#totalrecordsinput").val());
                  
              }
             
            gHidePageLoader();

        });
        
        
          

    } else if( ajaxResponse.error ) {

        gAlert( "Request Failed", ajaxResponse.error );
            gHidePageLoader();
          //  addNoRecordsfound()
    }  else if( ajaxResponse.errors ) {
       // addNoRecordsfound()
        gAlert( "Request Failed", ajaxResponse.errors );
            gHidePageLoader();
          //  addNoRecordsfound()
    }else if( ajaxResponse && ajaxResponse.ajaxResponseText ) {

       // addNoRecordsfound()
        
    } else {

      //  addNoRecordsfound()
    }
} )
.fail( function( jqXHR ) {
   // addNoRecordsfound()
} );


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


function getDataByUrL(urltype,url,authToken,data){ 
    return new Promise( function(resolve, reject) { 
        var options=[]; 
        if(data!=null && data!="" && data!=undefined){
        options.data = JSON.stringify( data)
        } 
        options.url = url; 
        options.type= urltype,
        options.headers = {
            "Content-Type": "application/json",
            "Authorization": authToken,
            "Accept" :"*/*"
        } 
        $.ajax( options ).done( function( ajaxResponse ) { 
              resolve( ajaxResponse );  
        })
        .fail( function( jqXHR ) {
            resolve(  null ); 
        });
    }); 
}
        

 