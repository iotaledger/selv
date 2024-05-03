import { RelyingParty, VcIssuer } from "@tanglelabs/oid4vc";
import express from "express";
import asyncHandler from "express-async-handler";
import { UserService } from "./userService";
import { decodeJWT } from "did-jwt";
import { Cache } from "./cache";

export const createServer = (
  rp: RelyingParty,
  issuer: VcIssuer,
  userService: UserService,
  tokenCache: Cache<string, any>,
  credentialCache: Cache<string, any>
) => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.route("/api/health").get(
    asyncHandler(async (req, res) => {
      console.debug(req);
      res.status(200).send();
    })
  );

  app.route("/api/token").get(
    asyncHandler(async (req, res) => {
      console.debug(req);
      res.json(await issuer.createTokenResponse(req.body));
    })
  );

  app.route("/api/offer/:id").get(
    asyncHandler(async (req, res) => {
      console.debug(req);
      const offer_id = req.params.id;

      const offer = await tokenCache.consumeItem(offer_id);

      if (!offer) {
        res.status(500).send();
      }

      res.send(offer);
    })
  );

  app.route("/api/credential-offer/:id").get(
    asyncHandler(async (req, res) => {
      console.debug(req);
      const offer_id = req.params.id;

      const offer = await credentialCache.consumeItem(offer_id);

      if (!offer) {
        res.status(500).send();
      }

      res.json(offer);
    })
  );

  app.route("/api/credential").post(
    asyncHandler(async (req, res) => {
      console.debug(req);
      await issuer.validateCredentialsResponse({
        token: req.headers.authorization?.split("Bearer ")[1],
        proof: req.body.credential_requests[0].proof.jwt,
      });
      // TODO: get state from token, need to decode
      const iss = "";
      const state = "";
      const unsigned_credentials = [];

      const { credentials } = await userService.credentialRequest(
        iss,
        state,
        unsigned_credentials
      );

      const response = await issuer.createSendCredentialsResponse({
        credentials,
      });
      res.json(response);
    })
  );

  app.route("/api/auth").post(
    asyncHandler(async (req, res) => {
      console.debug(req.body);
      const { id_token: idToken, vp_token: vpToken } = req.body;
      const { state } = req.body;
      const { iss } = await rp.validateJwt(idToken);

      if (idToken) {
        console.debug(req, state, iss);
        await userService.connectUser(iss, state);
      } else if (vpToken) {
        await userService.presentCredential(iss, state, vpToken);
      } else {
        res.status(500).send();
      }

      res.status(204).send();
    })
  );

  app.route("/.well-known/openid-credential-issuer").get(
    asyncHandler(async (req, res) => {
      console.debug(req);
      const metadata = issuer.getIssuerMetadata();
      res.send(metadata);
    })
  );

  app.route("/.well-known/oauth-authorization-server").get(
    asyncHandler(async (req, res) => {
      console.debug(req);
      const metadata = issuer.getOauthServerMetadata();
      res.send(metadata);
    })
  );

  const port = 3333;
  app.listen(port, "0.0.0.0", () => {
    console.log(`HTTP server listening on port ${port}`);
  });
};
