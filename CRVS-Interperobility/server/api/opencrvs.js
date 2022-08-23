
import axios from 'axios'  

export const getdata = (req) => {


    let return_value=[];
    const requestBody = req.body
    console.log("requestBody : " + requestBody);
    let server_url = "http://172.16.17.137";
    


    let urltoken = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJyZWdpc3RlciIsInBlcmZvcm1hbmNlIiwiY2VydGlmeSIsImRlbW8iXSwiaWF0IjoxNjYwMTMzNjA2LCJleHAiOjE2NjA3Mzg0MDYsImF1ZCI6WyJvcGVuY3J2czphdXRoLXVzZXIiLCJvcGVuY3J2czp1c2VyLW1nbnQtdXNlciIsIm9wZW5jcnZzOmhlYXJ0aC11c2VyIiwib3BlbmNydnM6Z2F0ZXdheS11c2VyIiwib3BlbmNydnM6bm90aWZpY2F0aW9uLXVzZXIiLCJvcGVuY3J2czp3b3JrZmxvdy11c2VyIiwib3BlbmNydnM6c2VhcmNoLXVzZXIiLCJvcGVuY3J2czptZXRyaWNzLXVzZXIiLCJvcGVuY3J2czpjb3VudHJ5Y29uZmlnLXVzZXIiLCJvcGVuY3J2czp3ZWJob29rcy11c2VyIiwib3BlbmNydnM6Y29uZmlnLXVzZXIiXSwiaXNzIjoib3BlbmNydnM6YXV0aC1zZXJ2aWNlIiwic3ViIjoiNjJiOTljZDk4ZjExM2E3MDBjYzE5YTFhIn0.yhdFxG0hIBep-Z87f3L314w_U-FgKq2bS76SsEbdWiu3CbcWVAJw1xZhtpVVGERu02ybQQA7_X8a5dnnvXiY8PDkxVguB6yxgeriRkCRS2wOzVH4KtX3A6AidmgpqgH_4E9ycAWtTRbOjmm_mawptt_GHkSzkF_qYBwGc6RnhsV_7zkMVi8t4SCw8htnr6liwseFhHyRF0uEarM7s-CwWtgydcCMOKosp6-Q3W0P0FR0uvaQ0K9wxKIkI5lYsdJqcxcpH-rKiW-0BAtTxQanM_1R4UWxUmouGLE2bGEt6LIDjd6X_LzJUC6gzBNTicGdQkaKa3jmFVICkPBG-zz7LA"
    let urlgraphql =  server_url+":7070/graphql"
    var identifier_type="",identifier_id="" ;

    if(requestBody.identifier_type !=null && requestBody.identifier_type !=""){
      identifier_type  = requestBody.identifier_type  ; 
    }

    if(requestBody.identifier_id !=null && requestBody.identifier_id !=""){
      identifier_id  = requestBody.identifier_id  ; 
    }
 

    if(identifier_type!=null && identifier_type!="" && identifier_id!=null && identifier_id!=""){

      let url =   server_url+":5001/fhir/Patient?identifier="+identifier_id
       
        let config_url = {
         method: 'get',
         url: url, 
         headers: {    
           Accept : "*/*" ,
           authorization: urltoken  
          }, 
       }
         
       return new Promise((resolve, reject) => {  
         console.log("url " + url)   
          
           axios(config_url).then(async (response) =>  { 
            
            let dataResult = [];

            for (let index = 0; index < response.data.entry.length; ++index) {
 
             var ConstURL = server_url+":5001/fhir/Composition?entry=Patient/"+response.data.entry[index].resource.id;
              var DataFor = await getDetailDataWithoutData('get',ConstURL,urltoken);
            //  console.log("response.data.entry[index].resource.id " + response.data.entry[index].resource.id);
            //  console.log("DataFor.data.entry[indexE].resource.id : " +  JSON.stringify( DataFor) );
            //  console.log("DataFor.data.entry[indexE].resource.id : " + DataFor.entry[0].resource.id);
              if(DataFor!=null && DataFor!="" && DataFor!=[] 
             
              && DataFor.entry!=null && DataFor.entry!=undefined && DataFor.entry!=[]){ 
                for (let indexE = 0; indexE < DataFor.entry.length; ++indexE) { 
                 
                  response.data.entry[index].detailData= await getDetailData(urlgraphql,urltoken,DataFor.entry[indexE].resource.id);
                  dataResult.push( response.data.entry[index]);
                  console.log("DataFor.data.entry[indexE].resource.id : " + response.data.entry[index])
                }
              }   
              
              //console.log("response.data.entry[index].resource.id " + response.data.entry[index].resource.id) 
            }
            //console.log("asasd : " +response);
           resolve(dataResult);
         }) 
       }).then(function(res){ 
         return res;
       }); 


    }else{
  
      var name = "", fathername = "",mothername= "",firstname="",lastname="";
      if(requestBody.first_name_value !=null && requestBody.first_name_value !=""){
        name  = requestBody.first_name_value  ;
        firstname = requestBody.first_name_value  ;
      }
      if(requestBody.last_name_value!=null && requestBody.last_name_value!=""){
        if(name){
         name = name  + " ";
        }
        name  = name + requestBody.last_name_value ;
        lastname =  requestBody.last_name_value;
      }
      if(requestBody.father_name_value !=null &&requestBody.father_name_value!=""){
        if(name){
         name = name  + " ";
        }
        name  = name +requestBody.father_name_value ;
        fathername = requestBody.father_name_value ;
      }
      if(requestBody.mother_name_value !=null && requestBody.mother_name_value !=""){
        if(name){
          name = name  + " ";
        }
        name  = name +requestBody.mother_name_value ;
        mothername= requestBody.mother_name_value ;
      }
      var brndrn = "";
      if(requestBody.brn_value){
        brndrn = requestBody.brn_value
      } 
      if(requestBody.drn_value){
        brndrn = requestBody.drn_value
      } 
       
      var contactNumber = "";
      if(requestBody.contactNumber){
        contactNumber = requestBody.contactNumber
      } 
        

   
   // let urltoken = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJyZWdpc3RlciIsInBlcmZvcm1hbmNlIiwiY2VydGlmeSIsImRlbW8iXSwiaWF0IjoxNjU5MzQ4NzM3LCJleHAiOjE2NTk5NTM1MzcsImF1ZCI6WyJvcGVuY3J2czphdXRoLXVzZXIiLCJvcGVuY3J2czp1c2VyLW1nbnQtdXNlciIsIm9wZW5jcnZzOmhlYXJ0aC11c2VyIiwib3BlbmNydnM6Z2F0ZXdheS11c2VyIiwib3BlbmNydnM6bm90aWZpY2F0aW9uLXVzZXIiLCJvcGVuY3J2czp3b3JrZmxvdy11c2VyIiwib3BlbmNydnM6c2VhcmNoLXVzZXIiLCJvcGVuY3J2czptZXRyaWNzLXVzZXIiLCJvcGVuY3J2czpjb3VudHJ5Y29uZmlnLXVzZXIiLCJvcGVuY3J2czp3ZWJob29rcy11c2VyIiwib3BlbmNydnM6Y29uZmlnLXVzZXIiXSwiaXNzIjoib3BlbmNydnM6YXV0aC1zZXJ2aWNlIiwic3ViIjoiNjJiOTljZDk4ZjExM2E3MDBjYzE5YTFhIn0.eHPrb0AllvU7gqyPqDYshQBuUZjVp1V6PFAgvuGyzjT1QMwPqlPRb0VRK2HejcvV_DngyGc4xW8Ta2gPnOk48G8HQB61_CO3TfbK7YYAzZ6Cg6osXMze9HYO8gfxOUCrHhCYDE1Xhqvb9wkuMBW0TtK9msnguBdf9A_r7ovqGu8FcHwzkAxpWabTqHtZ04ySvEkTOZi0Zeo-AN7woNCmpS-y65w82Z0lkv8HCzt3A0IADipbWpvFzbAkRVKkV_yEZWPehCFjAQEzYuMmVQV9a64fELO87-DbisRaNOYZ0sfCp-CssxUxHek6YkPd1M9BvBNuLlEsggo5jvsnq2KdJw"
    
    let data = {"operationName":"searchEvents",
    "variables":{
    "locationIds":["c9c4d6e9-981c-4646-98fe-4014fddebd5e"],
    "sort":"DESC",
    "trackingId":"",
    "registrationNumber":brndrn,
    "contactNumber":contactNumber,
    "name":name
    },
    "query":"query searchEvents($sort: String, $trackingId: String, $contactNumber: String, $registrationNumber: String, $name: String, $locationIds: [String!]) {\n  searchEvents(\n    sort: $sort\n    trackingId: $trackingId\n    registrationNumber: $registrationNumber\n    name: $name\n    contactNumber: $contactNumber\n    locationIds: $locationIds\n  ) {\n    totalItems\n    results {\n      id\n      type\n      registration {\n        status\n        contactNumber\n        trackingId\n        registrationNumber\n        registeredLocationId\n        duplicates\n        assignment {\n          userId\n          firstName\n          lastName\n          officeName\n          __typename\n        }\n        createdAt\n        modifiedAt\n        __typename\n      }\n      ... on BirthEventSearchSet {\n        dateOfBirth\n        childName {\n          firstNames\n          familyName\n          use\n          __typename\n        }\n        __typename\n      }\n      ... on DeathEventSearchSet {\n        dateOfDeath\n        deceasedName {\n          firstNames\n          familyName\n          use\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n"}
   
     let config_url = {
      method: 'post',
      url: urlgraphql,
      data : data,
      headers: {    
        Accept : "*/*" ,
        authorization: urltoken  }, 
    }
      
    return new Promise((resolve, reject) => {  
      console.log("url " + urlgraphql)   
       
        axios(config_url).then(async (response) =>  { 
 
        let dataResult = [];
        for (let index = 0; index < response.data.data.searchEvents.results.length; ++index) {
            
          response.data.data.searchEvents.results[index].detailData= await getDetailData(urlgraphql,urltoken,response.data.data.searchEvents.results[index].id);
         
        }
          for (let index = 0; index < response.data.data.searchEvents.results.length; ++index) {
            
            //response.data.data.searchEvents.results[index].detaildata= await getDetailData(url,urltoken,response.data.data.searchEvents.results[index].id);
           
            const element = response.data.data.searchEvents.results[index];

            var fatherNameReturn = "", monthernameReturn = "";
            console.log("asd" +element.detailData)
            if(element.detailData!=null && element.detailData!= undefined && 
              element.detailData.father!=null && element.detailData.father!= undefined && 
              element.detailData.father.name[0]!=null && element.detailData.father.name[0]!= undefined   ){
                fatherNameReturn = element.detailData.father.name[0].firstNames;
            }

            if(element.detailData!=null && element.detailData!= undefined && 
              element.detailData.mother!=null && element.detailData.mother!= undefined && 
              element.detailData.mother.name[0]!=null && element.detailData.mother.name[0]!= undefined  ){
                monthernameReturn = element.detailData.mother.name[0].firstNames;
            }
 
            
            var thisRecordShouldCount = 0;
            if(fathername!=null && fathername !=""){
                if(fathername.toLowerCase()   != fatherNameReturn.toLowerCase()){
                    thisRecordShouldCount++;
                }
            }
            if(mothername!=null && mothername !=""){
                if(mothername.toLowerCase()  != monthernameReturn.toLowerCase()){
                    thisRecordShouldCount++;
                }
            }
            console.log(" element.type  "+ element.type );
           
            console.log(" fatherNameReturn  "+ fatherNameReturn );
            console.log(" monthernameReturn  "+ monthernameReturn );
            
            if(element.type == "Death"){
 
                if(firstname !=null && firstname!=""  ){ 
                    if(firstname.toLowerCase() != element.deceasedName[0].firstNames.toLowerCase()){
                        thisRecordShouldCount++;
                    } 
                }

                if(lastname !=null && lastname !=""){
                    if(lastname.toLowerCase()  != element.deceasedName[0].familyName.toLowerCase()){
                        thisRecordShouldCount++;
                    }
                }
                 
               if(thisRecordShouldCount==0){
                dataResult.push( response.data.data.searchEvents.results[index]); 
               }
              
            }else if(element.type =="Birth"){
             
              var ConstURL = server_url+":5001/fhir/Patient?identifier="+ element.registration.registrationNumber
             
              response.data.data.searchEvents.results[index].birthIdentifier= await getDetailDataWithoutData('get',ConstURL,urltoken);
         
                if(firstname !=null && firstname!=""  ){ 
                    if(firstname.toLowerCase() != element.childName[0].firstNames.toLowerCase()){
                        thisRecordShouldCount++;
                    } 
                }

                if(lastname !=null && lastname !=""){
                    if(lastname.toLowerCase()  != element.childName[0].familyName.toLowerCase()){
                        thisRecordShouldCount++;
                    }
                }
                 
                if(thisRecordShouldCount==0){
                  dataResult.push( response.data.data.searchEvents.results[index]); 
                }
            }
        }
 
        resolve(dataResult);
      }) 
    }).then(function(res){ 
      return res;
    }); 
  }
  }


function getDetailData(url,urltoken,IdForFeatch){
 
    let data = { 
      "operationName": "fetchDeathRegistrationForReview",
      "variables": {
        "id": IdForFeatch
      },
      "query": "query fetchDeathRegistrationForReview($id: ID!) {\n  fetchDeathRegistration(id: $id) {\n    _fhirIDMap\n    id\n    deceased {\n      id\n      name {\n        use\n        firstNames\n        familyName\n        __typename\n      }\n      birthDate\n      age\n      gender\n      maritalStatus\n      nationality\n      identifier {\n        id\n        type\n        otherType\n        __typename\n      }\n      gender\n      deceased {\n        deathDate\n        __typename\n      }\n      address {\n        type\n        line\n        district\n        state\n        city\n        postalCode\n        country\n        __typename\n      }\n      __typename\n    }\n    informant {\n      id\n      relationship\n      otherRelationship\n      individual {\n        id\n        identifier {\n          id\n          type\n          otherType\n          __typename\n        }\n        name {\n          use\n          firstNames\n          familyName\n          __typename\n        }\n        nationality\n        occupation\n        birthDate\n        telecom {\n          system\n          value\n          __typename\n        }\n        address {\n          type\n          line\n          district\n          state\n          city\n          postalCode\n          country\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    father {\n      id\n      name {\n        use\n        firstNames\n        familyName\n        __typename\n      }\n      __typename\n    }\n    mother {\n      id\n      name {\n        use\n        firstNames\n        familyName\n        __typename\n      }\n      __typename\n    }\n    spouse {\n      id\n      name {\n        use\n        firstNames\n        familyName\n        __typename\n      }\n      __typename\n    }\n    medicalPractitioner {\n      name\n      qualification\n      lastVisitDate\n      __typename\n    }\n       eventLocation {\n      id\n      type\n      address {\n        type\n        line\n        district\n        state\n        city\n        postalCode\n        country\n        __typename\n      }\n      __typename\n    }\n    questionnaire {\n      fieldId\n      value\n      __typename\n    }\n    mannerOfDeath\n    causeOfDeathEstablished\n    causeOfDeathMethod\n    causeOfDeath\n    deathDescription\n    maleDependentsOfDeceased\n    femaleDependentsOfDeceased\n      __typename\n  }\n}\n"
    }
     let config_url = {
      method: 'post',
      url: url,
      data : data,
      headers: {    
        Accept : "*/*" ,
        authorization: urltoken
         }, 
    }
      
    return new Promise((resolve, reject) => {  
     // console.log("url " + url)   
    //  console.log("config_url " + JSON.stringify( config_url) )  
        axios(config_url).then((response) =>  { 
        resolve(response.data.data.fetchDeathRegistration);
      }) 
    }).then(function(res){ 
      return res;
    }); 
  }


  export const getdatamediator = (req) => {

    var requestdata = req.body;

    let url =  "http://172.16.17.10:5001/searchevent"
   // let urltoken = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJyZWdpc3RlciIsInBlcmZvcm1hbmNlIiwiY2VydGlmeSIsImRlbW8iXSwiaWF0IjoxNjU5MzQ4NzM3LCJleHAiOjE2NTk5NTM1MzcsImF1ZCI6WyJvcGVuY3J2czphdXRoLXVzZXIiLCJvcGVuY3J2czp1c2VyLW1nbnQtdXNlciIsIm9wZW5jcnZzOmhlYXJ0aC11c2VyIiwib3BlbmNydnM6Z2F0ZXdheS11c2VyIiwib3BlbmNydnM6bm90aWZpY2F0aW9uLXVzZXIiLCJvcGVuY3J2czp3b3JrZmxvdy11c2VyIiwib3BlbmNydnM6c2VhcmNoLXVzZXIiLCJvcGVuY3J2czptZXRyaWNzLXVzZXIiLCJvcGVuY3J2czpjb3VudHJ5Y29uZmlnLXVzZXIiLCJvcGVuY3J2czp3ZWJob29rcy11c2VyIiwib3BlbmNydnM6Y29uZmlnLXVzZXIiXSwiaXNzIjoib3BlbmNydnM6YXV0aC1zZXJ2aWNlIiwic3ViIjoiNjJiOTljZDk4ZjExM2E3MDBjYzE5YTFhIn0.eHPrb0AllvU7gqyPqDYshQBuUZjVp1V6PFAgvuGyzjT1QMwPqlPRb0VRK2HejcvV_DngyGc4xW8Ta2gPnOk48G8HQB61_CO3TfbK7YYAzZ6Cg6osXMze9HYO8gfxOUCrHhCYDE1Xhqvb9wkuMBW0TtK9msnguBdf9A_r7ovqGu8FcHwzkAxpWabTqHtZ04ySvEkTOZi0Zeo-AN7woNCmpS-y65w82Z0lkv8HCzt3A0IADipbWpvFzbAkRVKkV_yEZWPehCFjAQEzYuMmVQV9a64fELO87-DbisRaNOYZ0sfCp-CssxUxHek6YkPd1M9BvBNuLlEsggo5jvsnq2KdJw"
    let urltoken = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJyZWdpc3RlciIsInBlcmZvcm1hbmNlIiwiY2VydGlmeSIsImRlbW8iXSwiaWF0IjoxNjYwMTMzNjA2LCJleHAiOjE2NjA3Mzg0MDYsImF1ZCI6WyJvcGVuY3J2czphdXRoLXVzZXIiLCJvcGVuY3J2czp1c2VyLW1nbnQtdXNlciIsIm9wZW5jcnZzOmhlYXJ0aC11c2VyIiwib3BlbmNydnM6Z2F0ZXdheS11c2VyIiwib3BlbmNydnM6bm90aWZpY2F0aW9uLXVzZXIiLCJvcGVuY3J2czp3b3JrZmxvdy11c2VyIiwib3BlbmNydnM6c2VhcmNoLXVzZXIiLCJvcGVuY3J2czptZXRyaWNzLXVzZXIiLCJvcGVuY3J2czpjb3VudHJ5Y29uZmlnLXVzZXIiLCJvcGVuY3J2czp3ZWJob29rcy11c2VyIiwib3BlbmNydnM6Y29uZmlnLXVzZXIiXSwiaXNzIjoib3BlbmNydnM6YXV0aC1zZXJ2aWNlIiwic3ViIjoiNjJiOTljZDk4ZjExM2E3MDBjYzE5YTFhIn0.yhdFxG0hIBep-Z87f3L314w_U-FgKq2bS76SsEbdWiu3CbcWVAJw1xZhtpVVGERu02ybQQA7_X8a5dnnvXiY8PDkxVguB6yxgeriRkCRS2wOzVH4KtX3A6AidmgpqgH_4E9ycAWtTRbOjmm_mawptt_GHkSzkF_qYBwGc6RnhsV_7zkMVi8t4SCw8htnr6liwseFhHyRF0uEarM7s-CwWtgydcCMOKosp6-Q3W0P0FR0uvaQ0K9wxKIkI5lYsdJqcxcpH-rKiW-0BAtTxQanM_1R4UWxUmouGLE2bGEt6LIDjd6X_LzJUC6gzBNTicGdQkaKa3jmFVICkPBG-zz7LA"
      
    var countBrnDrn = 0,brndrnvalue="";;
    if(requestdata.brn_value!=null && requestdata.brn_value!=undefined && requestdata.brn_value!=""
      && requestdata.drn_value!=null && requestdata.drn_value!=undefined && requestdata.drn_value!=""){
        countBrnDrn++;
    }else if(requestdata.brn_value!=null && requestdata.brn_value!=undefined && requestdata.brn_value!="" ){
      brndrnvalue = requestdata.brn_value;
    }else if(requestdata.drn_value!=null && requestdata.drn_value!=undefined && requestdata.drn_value!=""){
      brndrnvalue= requestdata.drn_value;
    }
    console.log("countBrnDrn " +countBrnDrn);
if(countBrnDrn ==0){
    let data = {
      "identifier_type": requestdata.identifier_type, 
      "identifier_id": requestdata.identifier_id, 
      "first_name_value" : requestdata.first_name_value, 
      "last_name_value" :requestdata.last_name_value,
      "father_name_value" :requestdata.father_name_value,
      "mother_name_value" :requestdata.mother_name_value,
      "brn_value" :brndrnvalue,
      "drn_value" :requestdata.drn_value,
      "contactNumber" :requestdata.contactNumber
  }
 
  
     let config_url = {
      method: 'post',
      url: url,
      data :  data ,
      headers: {    
        Accept : "*/*" ,
        authorization: urltoken 
       }, 
    }
      
      return new Promise((resolve, reject) => {  
       // console.log("url " + url)    
          axios(config_url).then(async (response) =>  { 
         //   console.log("Asdasddsddd")
          //  console.log(JSON.parse(JSON.stringify(response.data)));
          resolve(JSON.parse(JSON.stringify( response.data)));
        }) 
      }).then(function(res){ 
        return res;
      }); 
    }else {
      let data = {
        "identifier_type": requestdata.identifier_type, 
        "identifier_id": requestdata.identifier_id, 
        "first_name_value" : requestdata.first_name_value, 
        "last_name_value" :requestdata.last_name_value,
        "father_name_value" :requestdata.father_name_value,
        "mother_name_value" :requestdata.mother_name_value,
        "brn_value" :requestdata.brn_value, 
        "contactNumber" :requestdata.contactNumber
    } 
       let config_url = {
        method: 'post',
        url: url,
        data :  data ,
        headers: {    
          Accept : "*/*" ,
          authorization: urltoken 
         }, 
      }
        
        return new Promise((resolve, reject) => {  
        //  console.log("url " + url)    
            axios(config_url).then(async (response) =>  { 

              let data1 = {
                "identifier_type": requestdata.identifier_type, 
                "identifier_id": requestdata.identifier_id, 
                "first_name_value" : requestdata.first_name_value, 
                "last_name_value" :requestdata.last_name_value,
                "father_name_value" :requestdata.father_name_value,
                "mother_name_value" :requestdata.mother_name_value, 
                "drn_value" :requestdata.drn_value,
                "contactNumber" :requestdata.contactNumber
            } 
               let config_url1 = {
                method: 'post',
                url: url,
                data :  data1 ,
                headers: {    
                  Accept : "*/*" ,
                  authorization: urltoken 
                 }, 
              }
                
              var responseArray = [];
              if(response==null || response==undefined){
                console.log("Null  response for brn "); 
              }else{
                console.log("response for brn: " + JSON.stringify(response.data.data)); 
              }
             
              if(response!=null  && response!=undefined  
              && response.data!=undefined && response.data!=[] && response.data!="" 
              && response.data.data!=undefined && response.data.data!=[] && response.data.data!=""   ){
                for(var i = 0;i<response.data.data.length;i++){
                  responseArray.push(response.data.data[i]);
                }                 
              } 
              console.log("response 1 " + JSON.stringify({data:responseArray}));  
               const secondrespose= await new Promise((resolve, reject) => {  
                  
                    axios(config_url1).then(async (response1) =>  {                       
                      resolve(JSON.parse(JSON.stringify( response1.data)));                      
                    }) 
                  }).then(function(res){ 
                    return res;
                  }); 

                if(secondrespose!=null && secondrespose!="" && secondrespose!=undefined && secondrespose!=undefined
                && secondrespose.data!=undefined && secondrespose.data!=[] && secondrespose.data!=""  ){
                  for(var i = 0;i<secondrespose.data.length;i++){
                    responseArray.push(secondrespose.data[i]);
                  }                 
                } 

                console.log("response 2 " + JSON.stringify({data:responseArray}));
               resolve(JSON.parse(JSON.stringify({data:responseArray}))); 
          }) 
        }).then(function(res){ 
          return res;
        }); 
    }
  } 

function getDetailDataWithoutData(methodtype,url,urltoken){

  let config_url = {
    method: methodtype,
    url: url, 
    headers: {    
      Accept : "*/*" ,
      authorization: urltoken 
     } 
  }
    
    return new Promise((resolve, reject) => {   
        axios(config_url).then(async (response) =>  {  
        // console.log(JSON.parse(JSON.stringify(response.data)));
         resolve(JSON.parse(JSON.stringify( response.data)));
      }) 
    }).then(function(res){ 
      return res;
    }); 
  

}

function getDetailDataWithData(methodtype,url,urltoken,data){

  let config_url = {
    method: methodtype,
    url: url, 
    data:data,
    headers: {    
      Accept : "*/*" ,
      authorization: urltoken 
     } 
  }
    
    return new Promise((resolve, reject) => {   
        axios(config_url).then(async (response) =>  {  
         console.log(JSON.parse(JSON.stringify(response.data)));
         resolve(JSON.parse(JSON.stringify( response.data)));
      }) 
    }).then(function(res){ 
      return res;
    }); 
  

}