import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { readFile, writeFile } from "fs/promises";
import path from "path";

import {
    IssuerStoreData,
    SimpleStore,
} from "@tanglelabs/oid4vc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const file = path.resolve(__dirname, "./store.test-mock");

const reader = async () => {
  const raw = await readFile(file).catch((e) => {
      if (e.code === "ENOENT") writer([]);
      return Buffer.from(JSON.stringify([]));
  });
  return JSON.parse(raw.toString());
};

const writer = async (data: IssuerStoreData[]) => {
  await writeFile(file, JSON.stringify(data));
};

export const createStore = () => {
    return new SimpleStore({ reader, writer });
}