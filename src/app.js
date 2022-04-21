import express from 'express'
import bcrypt from 'bcryptjs'
import { v4 } from 'uuid'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import axios from 'axios'


import { connectToDatabase } from '../db/connection'
const { couchDb } = connectToDatabase();

const swaggerDocument = YAML.load('./swagger.yaml')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.get('/', function (req, res) {
  res.send('<body onload="window.location = \'/swagger-ui/\'"><a href="/swagger-ui/">Click here to see the API</a>')
})

app.post("/profile", async (req, res) => {
  if (!req.body.email || !req.body.pass) {
    return res.status(400).send({
      "message": `${!req.body.email ? 'email ' : ''}${(!req.body.email && !req.body.pass)
        ? 'and pass are required' : (req.body.email && !req.body.pass)
          ? 'pass is required' : 'is required'
        }`
    })
  }

  const id = v4();
  const profile = { _id: id, uuid: id, ...req.body, pass: bcrypt.hashSync(req.body.pass, 10) }

  await couchDb.createDocument({
    doc: { ...profile },
  })
    .then((result) => res.send({ "message": "SUCCESS", ...profile, ...result }))
    .catch((e) => res.status(500).send({
      "message": `Profile Insert Failed: ${e.message}`
    }))

  // IL EST EGALEMENT POSSIBLE DE FAIRE DES REQUETES UTILISANT L'API, DECOMMENTER ICI POUR VOIR
  // await axios.put('http://admin:saveHealth@localhost:5984/labo_app_database/' + id, {
  //   ...profile
  // })
  //   .then((result) => res.send({ "message": "SUCCESS", ...profile, result: result.data }))
  //   .catch((e) => res.status(500).send({
  //     "message": `Profile Insert Failed: ${e.message}`
  //   }))
})

app.get("/profile/:_id", async (req, res) => {
  try {
    await couchDb.getDocument({
      docId: req.params._id
    })
      .then((result) => res.send(result))
      .catch((error) => res.status(500).send({
        "message": `Operation Failed: ${error.message}`
      }))
  } catch (error) {
    console.error(error)
  }
})

app.put("/profile/:_id", async (req, res) => {
  try {
    await couchDb.getDocument({
      docId: req.params._id
    })
      .then(async (result) => {
        /* Create a New Document with new values, 
          if they are not passed from request, use existing values */
        const newDoc = {
          // _id: result._id,
          firstName: req.body.firstName ? req.body.firstName : result.firstName,
          lastName: req.body.lastName ? req.body.lastName : result.lastName,
          email: req.body.email ? req.body.email : result.email,
          pass: req.body.pass ? bcrypt.hashSync(req.body.pass, 10) : result.pass,
        }

        // CE CODE DE LA BUGGE, J'AI DONC UTIILSE L'API DIRECTEMENT
        // /* Persist updates with new doc */
        // await couchDb.updateDocument({
        //   // docId: newDoc._id,
        //   docId: req.params._id,
        //   rev: result._rev,
        //   updatedDoc: newDoc
        // })
        //   .then((result) => res.send({ ...newDoc, ...result }))
        //   .catch((e) => res.status(500).send(e))

        await axios.put('http://admin:saveHealth@localhost:5984/labo_app_database/' + req.params._id, {
          // docId: newDoc._id,
          _rev: result._rev,
          ...newDoc
        })
          .then((result) => res.send({ "message": "SUCCESS", result: result.data }))
          .catch((e) => res.status(500).send({
            "message": `Profile Insert Failed: ${e.message}`
          }))
      })
      .catch((e) => res.status(500).send({
        "message": `Profile Not Found, cannot update: ${e.message}`
      }))
  } catch (e) {
    console.error(e)
  }
})

app.delete("/profile/:_id", async (req, res) => {
  try {
    await couchDb.getDocument({
      docId: req.params._id
    })
      .then(async (result) => {
        console.log(result);
        await couchDb.deleteDocument({
          docId: req.params._id,
          rev: result._rev
        })
          .then((result) => res.send({ "message": 'Successfully Deleted', result }))
          .catch((error) => res.status(500).send({
            "message": `Profile Not Found, cannot delete: ${error.message}`
          }))
      })
      .catch((error) => res.status(500).send({
        "message": `Profile Not Found, cannot delete: ${error.message}`
      }))
  } catch (e) {
    console.error(e)
  }
})

app.get("/profiles", async (req, res) => {


  // findOptions: {
  //   // selector: {
  //   //   // _id: { '$gt': 2010 }
  // docId: req.params._id
  //   // },
  //   fields: ['_id', '_rev', 'firstName', ],
  //   sort: [{ firstName: 'asc' }],
  //   limit: 2,
  //   skip: 0,
  //   execution_stats: true
  // }

  // ON VA GERER CECI PLUS TARD
  try {
    await couchDb.getDocuments('labo_app_database')
      .then((result) => res.send(result))
      .catch((error) => res.status(500).send({
        "message": `Query failed: ${error.message}`
      }))
  } catch (e) {
    console.error(e)
  }
})

// module.exports = { app, ensureIndexes }
module.exports = { app }
