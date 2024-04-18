import express from "express";
import asyncHandler from "express-async-handler";

export const createServer = (rp) => {
  
  const app = express();
  app.use(express.json());
  app.route("/api/health").get(
    asyncHandler(async (req, res) => {
        res.status(200).send();
    })
  );
  app.route("/api/auth").post(
    asyncHandler(async (req, res) => {
        console.debug(req);
        await rp.verifyAuthResponse(req.body);
        res.status(204).send();
    })
  );

  const port = 3333;
  const server = app.listen(port, "0.0.0.0", () => {
    console.log(`HTTP server listening on port ${port}`);
  });
  
};
