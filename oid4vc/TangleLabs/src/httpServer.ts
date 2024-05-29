import { RelyingParty, VcIssuer } from "@tanglelabs/oid4vc";
import express from "express";
import asyncHandler from "express-async-handler";
import { UserService } from "./userService";
import { decodeJWT } from "did-jwt";
import { Cache } from "./cache";
import cors from "cors";

import { Resolver } from "did-resolver";
import * as didJWT from "did-jwt";

import * as IOTADIDResolver from "./IOTADIDResolver";
import { credentials } from "@grpc/grpc-js";
const iotaDidResolver = IOTADIDResolver.getResolver();
let resolver = new Resolver(iotaDidResolver);

export const createServer = (
  rp: RelyingParty,
  issuer: VcIssuer,
  userService: UserService,
  tokenCache: Cache<string, any>,
  credentialCache: Cache<string, any>,
) => {
  const app = express();
  app.use(express.json());
  app.use(cors({ origin: true }));
  app.use(express.urlencoded({ extended: true }));

  app.route("/api/health").get(
    asyncHandler(async (req, res) => {
      console.debug(req);
      res.status(200).send();
    }),
  );

  app.route("/api/token").post(
    asyncHandler(async (req, res) => {
      console.debug(req.body);
      
      // TODO: remove only for testing
      const { signer, payload } = await didJWT
      .verifyJWT(req.body["pre-authorized_code"], {
        resolver: resolver,
        policies: { aud: false },
      })
      .catch((e) => {
        console.error("ERROR", e);
        throw new Error("invalid_request");
      });
      // end remove
      const response = await issuer.createTokenResponse(req.body);
      console.debug(response);
      res.json(response);
    }),
  );

  app.route("/api/offer/:id").get(
    asyncHandler(async (req, res) => {
      console.debug(req.params);
      const offer_id = req.params.id;

      // TODO: consider consuming the token
      const offer = await tokenCache.retrieveItem(offer_id);

      if (!offer) {
        res.status(500).send();
      }

      res.send(offer);
    }),
  );

  app.route("/api/credential-offer/:id").get(
    asyncHandler(async (req, res) => {
      console.debug(req.params);
      const offer_id = req.params.id;

      // TODO: consider consuming the token
      const offer = await credentialCache.retrieveItem(offer_id);

      if (!offer) {
        res.status(500).send();
      }

      res.json(offer);
    }),
  );

  app.route("/api/credential").post(
    asyncHandler(async (req, res) => {

      console.debug("received credential request", req.headers, req.body);

      const bearer_token = req.headers.authorization?.split("Bearer ")[1];

      await issuer.validateCredentialsResponse({
        token: bearer_token,
        proof: req.body.proof.jwt,
      });

      const decodedBearer = decodeJWT(bearer_token);
      const decodedJWT = decodeJWT(req.body.proof.jwt);

      const {iss} = decodedJWT.payload;

      const {state} = decodedBearer.payload;

      const { signedCredentials } = await userService.credentialRequest(
        iss,
        state,
        req.body.credential_definition,
      );

      console.debug(signedCredentials);

      // TODO: How does this relate to https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#name-credential-response
      const response = await issuer.createSendCredentialsResponse({
        credentials: signedCredentials,
      });

      console.debug(response);

      res.json({
        credential: signedCredentials[0]
      });
    }),
  );

  app.route("/api/auth").post(
    asyncHandler(async (req, res) => {
      console.debug(req.body);
      const { id_token: idToken, vp_token: vpToken } = req.body;
      const { state } = req.body;
      
      console.debug(req, state);
      if (idToken) {
        const { iss } = await rp.validateJwt(idToken);
        await userService.connectUser(iss, state);
      } else if (vpToken) {
        console.debug(req, state, vpToken);
        const { iss } = await rp.validateJwt(vpToken);
        await userService.presentCredential(iss, state, vpToken);
      } else {
        res.status(500).send();
      }

      res.status(204).send();
    }),
  );

  app.route("/.well-known/openid-credential-issuer").get(
    asyncHandler(async (req, res) => {
      const metadata = issuer.getIssuerMetadata();
      res.send(metadata);
    }),
  );

  app.route("/.well-known/oauth-authorization-server").get(
    asyncHandler(async (req, res) => {
      const metadata = issuer.getOauthServerMetadata();
      res.send(metadata);
    }),
  );

  const port = 3333;
  app.listen(port, "0.0.0.0", () => {
    console.log(`HTTP server listening on port ${port}`);
  });
};
