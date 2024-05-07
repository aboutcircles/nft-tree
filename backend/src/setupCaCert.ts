import * as fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();

const caCert = process.env.DB_CA_CERT;
if (caCert) {
  const formattedCert = caCert.replace(/\\n/g, "\n");

  fs.writeFileSync("./dist/db/config/ca-cert.crt", formattedCert, "utf8");
  fs.writeFileSync("./src/db/config/ca-cert.crt", formattedCert, "utf8");
} else {
  console.error("CA certificate environment variable not set!");
  process.exit(1);
}
