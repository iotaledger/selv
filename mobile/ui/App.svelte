<script>
  import { writable } from "svelte/store";
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

  const verifiableCredentials = writable(null);
  const subjectDIDDocument = writable(null);

  let hasGeneratedCredentials = false;

  function getUserSchema() {
    return {
      type: "object",
      required: ["id", "dateOfBirth"],
      properties: {
        name: {
          type: "string"
        },
        dateOfBirth: {
          type: "string"
        },
        emailAddress: {
          type: "string"
        }
      }
    };
  }

  async function generateCredentials() {
    // 1. Create issuer
    const issuerSeed = GenerateSeed();
    const issuerDIDDocument = CreateRandomDID(issuerSeed);
    const issuerKeyPair = await GenerateECDSAKeypair();
    // Add keypair to isser DID document
    issuerDIDDocument.AddKeypair(issuerKeyPair, "0");

    // 2. Create subject
    const subjectSeed = GenerateSeed();
    $subjectDIDDocument = CreateRandomDID(subjectSeed);
    const subjectKeyPair = await GenerateECDSAKeypair();
    // Add keypair to subject DID document
    $subjectDIDDocument.AddKeypair(subjectKeyPair, "0");

    // 3. Create credentials
    const credentialsData = {
      name: "John Doe",
      dateOfBirth: "02/02/1993",
      emailAddress: "foo@baz.com"
    };
    const credentials = Credential.Create(
      new Schema("UserSchema", getUserSchema()),
      issuerDIDDocument.GetDID(),
      credentialsData
    );

    // 4. Build verifiable credential
    const proof = ProofTypeManager.GetInstance().CreateProofWithBuilder(
      "EcdsaSecp256k1VerificationKey2019",
      { issuer: issuerDIDDocument, issuerKeyId: "0" }
    );
    // Signs the document
    proof.Sign(credentials.EncodeToJSON());
    verifiableCredentials.set(VerifiableCredential.Create(credentials, proof));

    hasGeneratedCredentials = true;
  }

  async function createVerifiablePresentation() {
    const challenge = Date.now().toString();
    const presentation = Presentation.Create([$verifiableCredentials]);
    const proofMethod = ProofTypeManager.GetInstance().GetProofBuilder(
      "EcdsaSecp256k1VerificationKey2019"
    );

    const presentationProof = proofMethod({
      issuer: $subjectDIDDocument,
      issuerKeyId: "0",
      challengeNonce: challenge
    });

    presentationProof.Sign(presentation.EncodeToJSON());
    const verifiablePresentation = VerifiablePresentation.Create(
      presentation,
      presentationProof
    );
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
  <button on:click={generateCredentials}>Generate Credentials</button>
  {#if hasGeneratedCredentials}
    <button on:click={createVerifiablePresentation}>
      Create Verifiable Credentials
    </button>
  {/if}
</main>
