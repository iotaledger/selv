<script>
  import { onDestroy } from "svelte";
  import Theme from "~/components/Theme";

  import {
    Credential,
    GenerateECDSAKeypair,
    GenerateSeed,
    CreateRandomDID,
    Hash,
    DID,
    Schema,
    ProofTypeManager,
    VerifiableCredential,
    VerifiablePresentation,
    Presentation
  } from "@iota/identity";
  import Keychain from "~/lib/keychain";
  import {
    createCredential,
    createVerifiablePresentations,
    Identity,
    retrieveIdentity,
    createIdentity,
    storeIdentity,
    storeCredential,
    retrieveCredential
  } from "~/lib/identity";
  import { parse, encrypt, parseLink, QRLink } from "~/lib/helpers";
  import { Schemas, SchemaNames } from "~/lib/identity/schemas";
  import Button from "~/components/Button";
  import Scanner from "~/components/scanner";
  import io from "socket.io-client";
  import { WEBSOCKETS_URL } from "~/lib/config";

  let displayScanner = false;
  let socket = null;
  let channelId;
  let password;
  let requestedCredentials = Object.keys(Schemas); // Default to all schemas

  function handleScannerData(event) {
    const parsedLink = parseLink(event.detail);

    if (parsedLink) {
      channelId = parsedLink.channelId;
      password = parsedLink.password;
      requestedCredentials = parsedLink.requestedCredentials;

      establishConnection();
      registerMobileClient(channelId);
    }
  }

  function processIdentity() {
    createIdentity()
      .then(identity => storeIdentity("did", identity))
      .then(() => console.info("Identity successfully stored in keychain!"))
      .catch(console.error);
  }

  function processCredential() {
    const schemaName = SchemaNames.BANK_ACCOUNT;

    const _createAndStore = (schemaName, identity, data) => {
      return createCredential(identity, schemaName, data).then(credential => {
        return storeCredential(schemaName, credential).then(() =>
          console.log(
            `Credential with schema name ${schemaName} successfully created!`
          )
        );
      });
    };

    retrieveIdentity("did")
      .then(identity => {
        // Create credential for address
        _createAndStore(SchemaNames.ADDRESS, identity, {
          language: "English",
          locale: "en",
          address: {
            city: "Islamabad",
            state: "Punjab",
            country: "Pakistan",
            postCode: "44000",
            street: "02"
          }
        });

        // Create credential for bank account
        _createAndStore(SchemaNames.BANK_ACCOUNT, identity, {
          language: "English",
          locale: "en",
          bank: {
            name: "Foo Bank",
            accountType: "Current",
            accountNumber: "XXXX-XXXX"
          }
        });

        // Create credential for company
        _createAndStore(SchemaNames.COMPANY, identity, {
          language: "English",
          locale: "en",
          company: {
            name: "Foo Company",
            address: "Street # 02, Block # C, NPF"
          }
        });

        // Create credential for contact details
        _createAndStore(SchemaNames.CONTACT_DETAILS, identity, {
          language: "English",
          locale: "en",
          contacts: {
            email: "Foo@baz.com",
            phone: "+92-446-99900000"
          }
        });

        // Create credential for insurance
        _createAndStore(SchemaNames.INSURANCE, identity, {
          language: "English",
          locale: "en",
          insurance: {
            name: "Insurer",
            startDate: "10/10/1993"
          }
        });

        // Create credential for personal data
        _createAndStore(SchemaNames.PERSONAL_DATA, identity, {
          language: "English",
          locale: "en",
          personalInfo: {
            username: {
              title: "Mr.",
              firstName: "Umair",
              lastName: "Sarfraz"
            },
            dob: {
              date: "02/02/1993"
            }
          }
        });
      })
      .catch(console.error);
  }

  function processVerifiablePresentations() {
    retrieveIdentity("did").then(identity => {
      requestedCredentials
        .reduce((promise, schemaName) => {
          return promise.then(acc => {
            return retrieveCredential(schemaName)
              .then(credentials => {
                acc[schemaName] = credentials;

                return acc;
              })
              .catch(console.log);
          });
        }, Promise.resolve({}))
        .then(schemaNamesWithCredentials =>
          createVerifiablePresentations(
            identity,
            Object.keys(schemaNamesWithCredentials).reduce(
              (acc, schemaName) => {
                if (schemaNamesWithCredentials[schemaName]) {
                  acc[schemaName] = schemaNamesWithCredentials[schemaName];
                }

                return acc;
              },
              {}
            ),
            Date.now().toString()
          )
        )
        .then(verifiablePresentations => {
          console.log("Successfully created verifiable presentations!");
          const payload = encrypt(
            password,
            JSON.stringify(verifiablePresentations)
          );

          sendVerifiablePresentations(channelId, payload);
        })
        .catch(console.error);
    });
  }

  function establishConnection() {
    socket = io(WEBSOCKETS_URL, {
      reconnection: true,
      reconnectionDelay: 500,
      jsonp: false,
      reconnectionAttempts: Infinity,
      transports: ["websocket"]
    });

    initiateListeners();
  }

  function registerMobileClient(channelId) {
    socket.emit("registerMobileClient", { channelId });
  }

  function sendVerifiablePresentations(channelId, payload) {
    socket.emit("verifiablePresentations", { channelId, payload });
  }

  function initiateListeners() {
    socket.on("createCredential", console.log);
  }

  onDestroy(() => {
    if (socket) {
      socket.disconnect();
    }
  });
</script>

<style>
  div {
    text-align: center;
    padding: 1em;
    max-width: 540px;
    margin: 0 auto;
  }

  button {
    color: #fff;
    text-transform: uppercase;
    text-decoration: none;
    background: #ed3330;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 5px;
    display: inline-block;
    border: none;
    cursor: pointer;
  }
</style>

<div>
  <button on:click={processIdentity}>Create Own Identity</button>
  <button on:click={processCredential}>Process Credentials</button>
  <button on:click={processVerifiablePresentations}>
    Create Verifiable Presentation
  </button>
  {#if displayScanner}
    <Scanner on:message={handleScannerData} />
  {:else}
    <button
      on:click={() => {
        displayScanner = true;
      }}>
      Scan QR
    </button>
  {/if}
</div>
