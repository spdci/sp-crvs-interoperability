import { gql } from "apollo-server-express";

const typeDefs = gql`

    

    type registrationData{
        id:Int!
        type:String!
         dateOfBirth:String!
         eventLocation: String! 
         registration:registrations
         Childname:[Childname!]!
    }

    type registrations{
        mainid:Int!
        status:String!
        contactNumber:String!
        trackingId:String 
        registrationNumber:String
        duplicates:String                
        assignment: String 
        createdAt:String 
        modifiedAt:String 
              
    }

    type Childname{
        id: Int!
        firstName:String!
        lastName:String!
        fatherName:String!
         }


    type birthRegistrations {
        id: Int!
        firstName:String!
        lastName:String!
        fatherName:String!
        dob:String!
        eventLocation: String!
    }
   
   # Queries 
    type Query {
        getAllBirthRegistrations: [birthRegistrations!]!
        EventSearchResultSet(id: Int,name:String): [birthRegistrations!]!
    }

   # Mutations

`


module.exports = {typeDefs}