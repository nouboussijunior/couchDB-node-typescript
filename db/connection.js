import { CouchDb } from '@teammaestro/node-couchdb-client';

const CDB_USER = process.env.CDB_USER
const CDB_PASS = process.env.CDB_PASS
const CDB_HOST = process.env.CDB_HOST
const CDB_PORT = process.env.CDB_PORT
const CDB_DATABASE = process.env.CDB_DATABASE


if (!CDB_USER) {
  throw new Error(
    'Please define the CDB_USER environment variable inside dev.env'
  )
}

if (!CDB_PASS) {
  throw new Error(
    'Please define the CDB_PASS environment variable inside dev.env'
  )
}

if (!CDB_HOST) {
  throw new Error(
    'Please define the CDB_HOST environment variable inside dev.env'
  )
}

if (!CDB_DATABASE) {
  throw new Error(
    'Please define the CDB_DATABASE environment variable inside dev.env'
  )
}

export function connectToDatabase() {
  // Instatiate new CouchDB request class
  const couchDb = new CouchDb({
    // host: CDB_HOST,  //default 'http://127.0.0.1'
    // port: CDB_PORT,  //default 5984
    auth: {
      username: CDB_USER,
      password: CDB_PASS
    },
    defaultDatabase: CDB_DATABASE
  });

  return { couchDb };

}



