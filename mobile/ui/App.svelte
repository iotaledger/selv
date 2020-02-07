<script>
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
    retrieveCredentials
  } from "~/lib/identity";
  import { SchemaNames } from "~/lib/identity/schemas";
  import Button from "~/components/button";
  import Scanner from "~/components/scanner";
  import io from "socket.io-client";
  import { urlPortRegex } from "../libs/utils";

  let displayScanner = false;

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
        .then(() =>
          console.log("Successfully created verifiable presentations!")
        )
        .catch(console.error);
    });
  }
</script>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
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
    <Scanner
      onQrScan={data => {
        if (data.match(urlPortRegex)) {
          io.socket.connect(data);
        }
      }} />
  {:else}
    <Button
      onClick={() => {
        displayScanner = true;
      }}
      label="Scan QR" />
  {/if}
</main>
