import React, { useEffect, useState } from 'react';
import SocketIOClient from 'socket.io-client';
import randomstring from 'randomstring';
import { Button } from 'antd';
import 'antd/dist/antd.css';
import { websocketURL } from './config.json'
import { Form } from './components'
import { createIdentity, createCredential, createPresentations } from './did'
import 'rsuite/lib/styles/index.less';
import { encrypt, decrypt, retrieveCredential } from './helper'

// https://randomuser.me/api/
const App = () => {
  const [password] = useState("RecJ683STt8cOKMBsPACNE08ysSuJOYr")
  const [challengeNonce] = useState("Umxl7CiqSm43TjoEyYzX685Mdl8sX0nb")
  const [channelId, setChannelId] = useState(null)
  const [ioClient, setIoClient] = useState(null)

  useEffect(() => {
    // Removing the listener before unmounting the component in order to avoid addition of multiple listener
    return () => {
      ioClient.disconnect();
    }
  }, [])

  async function setChannel(channelId) {
    console.log('setChannel', channelId);
    setChannelId(channelId)
    connectWebSocket(channelId)
  }

  async function connectWebSocket(channelId) {
    console.log('connectWebSocket', channelId)
    if (channelId) {
      // ioClient && ioClient.disconnect()
      const newIoClient = SocketIOClient(websocketURL, {
        reconnection: true,
        reconnectionDelay: 500,
        jsonp: false,
        reconnectionAttempts: Infinity,
        transports: ['websocket']
      })
      setIoClient(newIoClient)

      newIoClient.emit('registerMobileClient', { channelId })

      // newIoClient.on('error', async (payload) => {
      //     console.error('WebSocket error', payload)
      // })
    
      newIoClient.on('createCredential', async (payload) => {
        try {
          const response = await processCustomCredential(payload)
          const responsePayload = await encrypt(password, JSON.stringify({ status: response.status, payload: response.payload }))
          if (payload.schemaName === 'Company') {
            newIoClient.emit('createCompany', { payload: response.payload })
          }
          newIoClient.emit('createCredentialConfirmation', { channelId, payload: responsePayload })
        } catch (error) {
          console.log(error.toString())
          newIoClient.emit('errorMessage', { channelId, payload: error.toString() })
        }
      })
    } else {
      console.log('No websocket connection details')
    }
  } 

  async function processIdentity() {
    console.log('Creating identity')
    const result = await createIdentity()
    console.log('processIdentity result', result.status)
  } 

  async function processCustomCredential({ schemaName, data }) {
    try {
      console.log('Creating custom verifiable credential for', schemaName, data)
      let decryptedData = await decrypt(password, data)
      let payload = JSON.parse(decryptedData)
      console.log('payload', payload)

      if (schemaName === 'Company') {
        const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        const userData = await retrieveCredential('PersonalData')
        const CompanyNumber = randomstring.generate({
          length: 7,
          charset: 'numeric'
        });
        const CompanyStatus = 'Pending'
        const CompanyCreationDate =  (new Date()).toLocaleDateString('en-GB', dateOptions)
        const CompanyOwner = `${userData.data.UserPersonalData.UserName.FirstName} ${userData.data.UserPersonalData.UserName.LastName}`
        
        payload = { ...payload, CompanyNumber, CompanyStatus, CompanyCreationDate, CompanyOwner }
      }

      const result = await createCredential(schemaName, payload)
      console.log(`${schemaName} result`, result.status)
      return { status: result.status, payload }
    } catch (error) {
      throw new Error(error);
    }
  } 

  async function processCredential() {
    console.log('Creating verifiable credential')
    let result = await createCredential('PersonalData', {
      Language: 'English',
      UserPersonalData: {
        UserName: {
          FirstName: 'Bob',
          LastName: 'Smith'
        },
        UserDOB: {
          Date: '15/09/1972',
        },
        Birthplace: 'Wakanda',
        Nationality: 'wakandian'
      }
    })
    console.log('PersonalData result', result.status)

    result = await createCredential('Address', {
      Language: 'English',
      UserAddress: {
        City: 'Leicester',
        Country: 'England',
        State: '',
        Postcode: 'LE2 6QT',
        Street: 'Main Street',
        House: '77'
      }
    })
    console.log('Address result', result.status)

    result = await createCredential('ContactDetails', {
      Language: 'English',
      UserContacts: {
        UserName: {
          Email: 'bob.smith@iota.com',
          Phone: '777-777-7777'
        }
      }
    })
    console.log('ContactDetails result', result.status)
  } 

  async function processPresentation() {
    const schemas = ['Address', 'PersonalData', 'ContactDetails'] // , 'Company' , 'BankAccount'

    console.log('Creating verifiable presentation')
    const presentationJSON = await createPresentations(schemas, challengeNonce)
    console.log('createPresentation result')
    console.log(JSON.stringify(presentationJSON))
    const payload = await encrypt(password, JSON.stringify(presentationJSON))
    await emitMessage(payload)
  } 

  async function emitMessage(payload) {
    console.log('emitMessage')
    console.log(ioClient)
    ioClient && ioClient.emit('verifiablePresentation', { channelId, payload })
    return true;
  } 

  return (
      <div>
        <Form setChannel={setChannel} />
        <hr />
        <Button type="primary" onClick={processIdentity}>Create Own Identity</Button>
        <hr />
        <Button type="primary" onClick={processCredential}>Process Credential</Button>
        <hr />
        <Button type="primary" onClick={processPresentation}>Create Presentation</Button>
      </div>
  );
}

export default App;

