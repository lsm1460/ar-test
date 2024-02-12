import cors from "cors";
import express, { Application, Request, Response } from "express";
import fs from "fs";
import path from "path";

const app: Application = express();

const port: number = 3001;

const option = {
  key: fs.readFileSync(path.join(__dirname, "../pem/key.pem"), "utf-8"),
  cert: fs.readFileSync(path.join(__dirname, "../pem/cert.pem"), "utf-8"),
};

app.get("/toto", (req: Request, res: Response) => {
  res.send("Hello toto");
});

app.listen(port, function () {
  console.log(`App is listening on port ${port} !`);
});

app.use(cors());
app.use(express.static("public"));

app.post("/getImage", async (req, res) => {
  res.sendFile(path.join(__dirname, `../public/nft/pinball.fset3`));
});
