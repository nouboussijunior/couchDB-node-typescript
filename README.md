# Profile Store in CouchDB with Node JS and Express


To run this prebuilt project, you will need:

- CouchDB installed locally
- NodeJS & NPM (v12+)
- Code Editor


## Update environment variables appropriately

We've included a `dev.env` file with some basic default values, but you may need to update these according to your configuration.
- `CDB_HOST` - The Couchbase endpoint to connect to. Use `localhost` for a local/Docker cluster, or the Wide Area Network address for a Capella instance (formatted like `cb.<xxxxxx>.cloud.couchbase.com`)
- `CDB_USER` - The username of an authorized user on your cluster. Follow [these instructions](https://docs.couchbase.com/cloud/clusters/manage-database-users.html#create-database-credentials) to create database credentials on Capella
- `CDB_PASS` - The password that corresponds to the user specified above
- `CDB_DATABASE` - The bucket to connect to. We'll use `user_profile` for this
- `IS_CAPELLA` - `true` if you are using Capella, `false` otherwise

**NOTE on TLS:** The connection logic in this sample app ignores mismatched certificates with the parameter `tls_verify=none`. While this is super helpful in streamlining the connection process for development purposes, it's not very secure and should **not** be used in production. To learn how to secure your connection with proper certificates, see [the Node.js TLS connection tutorial](https://developer.couchbase.com/tutorial-nodejs-tls-connection).

## Setup and Run The Application

After cloning the repo, install required dependencies:

```sh
npm install
```

At this point our application is ready to run:

```sh
npm start
```

**_NOTE:_** The connection is handled by the `db/connection.js` file. This connection is automatically cached so subsequent calls won't spawn excess connections. The `connnectToDatabase()` function must be called to obtain a reference to the cluster, bucket, collection (default), or profileCollection. You'll notice in this example that the function is called by each route's handler function. This is merely an implementation detail and can be customized to fit your needs and application.


## Running The Tests

The first two commands are only required to be run once before running the integration tests to ensure the database is set up in the right configuration:

```sh
npm run init-test-db && \
npm run init-test-index
```
