'use strict'

import express from 'express'
import { ApolloServer } from 'apollo-server-express';
import {typeDefs} from './Schema/TypeDefs';
import {resolvers} from './Schema/Resolvers';
import api from "./api/index"
import cors from "cors"

import bodyParser from 'body-parser'


// The OpenHIM Mediator Utils is an essential package for quick mediator setup.
// It handles the OpenHIM authentication, mediator registration, and mediator heartbeat.
import {
  registerMediator,
  activateHeartbeat,
  fetchConfig
} from 'openhim-mediator-utils'

// The mediatorConfig file contains some basic configuration settings about the mediator
// as well as details about the default channel setup.
import mediatorConfig, { urn } from '../mediatorConfig.json'

// The config details here are used to authenticate and register the mediator with the OpenHIM instance
const openhimConfig = {
  username: 'root@openhim.org',
  password: 'password-openhim',
  apiURL: 'https://openhim-core:8080',
  trustSelfSigned: true,
  urn
}

const app = express();;
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors());

api(app);
  
// Any request regardless of request type or url path to the mediator port will be caught here
// and trigger the Hello World response.
app.all('/', (_req, res) => {  
  console.log("Hello world!!!")
  res.send("Hello world!!!")
})

 
 

async function startApolloServer(typeDefs, resolvers){
  const server = new ApolloServer({typeDefs, resolvers})
   
  await server.start();
  server.applyMiddleware({app},'/graphql');
  
  app.listen(3001,  () => {
    console.log('Server listening on port 3001...') 
      mediatorSetup()
  });
}

startApolloServer(typeDefs, resolvers);

//app.listen(3002, () => {
//  console.log('Server listening on port 3000...')

//  mediatorSetup()
//})

const mediatorSetup = () => {
  // The purpose of registering the mediator is to allow easy communication between the mediator and the OpenHIM.
  // The details received by the OpenHIM will allow quick channel setup which will allow tracking of requests from
  // the client through any number of mediators involved and all the responses along the way(if the mediators are
  // properly configured). Moreover, if the request fails for any reason all the details are recorded and it can
  // be replayed at a later date to prevent data loss.
  registerMediator(openhimConfig, mediatorConfig, err => {
    if (err) {
      throw new Error(`Failed to register mediator. Check your Config. ${err}`)
    }

    console.log('Successfully registered mediator!')

    fetchConfig(openhimConfig, (err, initialConfig) => {
      if (err) {
        throw new Error(`Failed to fetch initial config. ${err}`)
      }
      console.log('Initial Config: ', JSON.stringify(initialConfig))

      // The activateHeartbeat method returns an Event Emitter which allows the mediator to attach listeners waiting
      // for specific events triggered by OpenHIM responses to the mediator posting its heartbeat.
      const emitter = activateHeartbeat(openhimConfig)

      emitter.on('error', err => {
        console.error(`Heartbeat failed: ${err}`)
      })

      // The config events is emitted when the heartbeat request posted by the mediator returns data from the OpenHIM.
      emitter.on('config', newConfig => {
        console.log('Received updated config:', JSON.stringify(newConfig))
      })
    })
  })
}
