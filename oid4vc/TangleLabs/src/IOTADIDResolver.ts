import {
  ParsedDID,
  Resolver,
  DIDResolutionOptions,
  DIDDocument,
  DIDResolutionResult,
} from "did-resolver";

import {
  IotaDID,
  IotaDocument,
  IotaIdentityClient,
} from "@iota/identity-wasm/node/";

import { AliasOutput, Client } from "@iota/sdk-wasm/node";

export function getResolver() {
  async function resolve(
    did: string,
    parsed: ParsedDID,
    didResolver: Resolver,
    options: DIDResolutionOptions
  ): Promise<DIDResolutionResult> {
    console.log(parsed);

    const client = new Client({
      //TODO: Pass node url
      primaryNode: "https://api.testnet.shimmer.network",
      localPow: true,
    });
    const didClient = new IotaIdentityClient(client);
    const didDocumentMetadata = {};

    // Resolve the associated Alias Output and extract the DID document from it.
    const didDocument: IotaDocument = await didClient.resolveDid(
      IotaDID.fromJSON(did)
    );
    console.log("Resolved DID document:", JSON.stringify(didDocument, null, 2));

    const contentType =
      typeof didDocument?.["@context"] !== "undefined"
        ? "application/did+ld+json"
        : "application/did+json";

    // We can also resolve the Alias Output directly.
    const aliasOutput: AliasOutput = await didClient.resolveDidOutput(
      IotaDID.fromJSON(did)
    );
    console.log(
      "The Alias Output holds " + aliasOutput.getAmount() + " tokens"
    );

    return {
      didDocument: didDocument.toJSON() as DIDDocument,
      didDocumentMetadata,
      didResolutionMetadata: { contentType },
    };
  }

  return { iota: resolve };
}
