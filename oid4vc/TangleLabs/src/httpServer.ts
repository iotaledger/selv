import { RelyingParty } from "@tanglelabs/oid4vc";
import express from "express";
import asyncHandler from "express-async-handler";
import { UserService } from "./userService";
import { decodeJWT } from 'did-jwt';

export const createServer = (rp: RelyingParty, userService: UserService) => {
  
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.route("/api/health").get(
    asyncHandler(async (req, res) => {
        res.status(200).send();
    })
  );
  app.route("/api/auth").post(
    asyncHandler(async (req, res) => {
      
      console.debug(req.body)
      const { id_token: idToken } = req.body;
      const { state } = req.body;
      const { iss } = await rp.validateJwt(idToken);
      
      
      console.debug(req, state, iss);
      await userService.connectUser(iss, state);
      res.status(204).send();
    })
  );

  // TODO: expose IssuerMetadata end point for VP and VCI (use VCIssuer)

  const port = 3333;
  const server = app.listen(port, "0.0.0.0", () => {
    console.log(`HTTP server listening on port ${port}`);
  });
  
};
