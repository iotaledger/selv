<script>
  import { onDestroy } from "svelte";
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
    createCredentials,
    createVerifiablePresentations,
    Identity,
    retrieveIdentity,
    createIdentity,
    storeIdentity,
    storeCredentials,
    retrieveCredentials,
    parse
  } from "~/lib/identity";
  import { encrypt, parseLink, QRLink } from "~/lib/helpers";
  import { SchemaNames } from "~/lib/identity/schemas";
  import Button from "~/components/button";
  import Scanner from "~/components/scanner";
  import io from "socket.io-client";
  import { urlPortRegex } from "../libs/utils";
  import { WEBSOCKETS_URL } from "~/lib/config";

  let displayScanner = false;
  let socket = null;
  let channelId;
  let password;

  function handleScannerData(event) {
    const parsedLink = parseLink(event.detail);

    if (parsedLink) {
      channelId = parsedLink.channelId;
      password = parsedLink.password;

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

  function processCredentials() {
    const schemaName = SchemaNames.BANK_ACCOUNT;

    retrieveIdentity("did")
      .then(identity =>
        createCredentials(identity, schemaName, {
          language: "English",
          locale: "en",
          bank: {
            name: "foo",
            accountType: "current",
            accountNumber: "XXXX-XXXX"
          }
        })
      )
      .then(credentials => storeCredentials(schemaName, credentials))
      .then(() => console.log("Credentials successfully created!"))
      .catch(console.error);
  }

  function processVerifiablePresentations() {
    retrieveIdentity("did").then(identity => {
      Object.values(SchemaNames)
        .reduce((promise, schemaName) => {
          return promise.then(acc => {
            return retrieveCredentials(schemaName)
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
  }

  function registerMobileClient(channelId) {
    socket.emit("registerMobileClient", { channelId });
  }

  function sendVerifiablePresentations(channelId, payload) {
    socket.emit("verifiablePresentations", { channelId, payload });
  }

  onDestroy(() => {
    if (socket) {
      socket.disconnect();
    }
  });
</script>

<style>
  main {
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

<main>
  <button on:click={processIdentity}>Create Own Identity</button>
  <button on:click={processCredentials}>Process Credentials</button>
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
</main>
