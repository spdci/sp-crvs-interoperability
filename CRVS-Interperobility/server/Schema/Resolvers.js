import {birthRegistrationsList,registrationsList,registrationDataList,ChildnameList} from '../data/fakedata'
import _ from "lodash"

const resolvers = {

    Query:{
        getAllBirthRegistrations:(parent,args, context, info) =>{
            console.log("args0"+parent)
            console.log("args0"+JSON.stringify(args))
            console.log("context"+JSON.stringify(context))
            console.log("info"+JSON.stringify(info))
            return birthRegistrationsList
        },
        EventSearchResultSet: (parent,args, context, info) =>{
        
            const id = args.id;
            const name = args.name;
            console.log("id" + id) 
            console.log("name" + name) 
            let userlist = null
            if(id!=undefined && id!="" && id!=0){
                userlist= _.filter(birthRegistrationsList,(birth) =>  birth.id == id  );
            }else{
                userlist = _.filter(birthRegistrationsList,(birth) =>  
                birth.firstName.includes(name) || 
                birth.lastName.includes(name) || 
                birth.fatherName.includes(name)    );
            }
           
            return userlist
        },
        // registrationData :{
        //     registration: ()=>{

        //     }
        // }
    },


}

module.exports = {resolvers}