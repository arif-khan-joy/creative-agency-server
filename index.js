const express = require('express')

const bodyParser = require('body-parser');
const cors = require('cors')
const fs = require('fs-extra')
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient
require('dotenv').config()

  ;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.arzqi.mongodb.net/agency?retryWrites=true&w=majority`;
const app = express()

app.use(bodyParser.json());
app.use(cors())
app.use(express.static('admin'));
app.use(fileUpload());
const port = 5000;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("agency").collection("data");
  const adminCollection = client.db("agency").collection("addAdmin");
  const imageCollection = client.db("agency").collection("adminImg");
  app.post('/addData', (req, res) => {
    const data = req.body;
    console.log(data)
    collection.insertOne(data)
      .then(result => {
        console.log(result)
      })
  })
  app.get("/singleData", (req, res) => {
    collection.find({ email: req.query.email }).toArray((err, documents) => {
      res.send(documents);
    });
  })
  console.log('database connected')
  // app.get("/singleData", (req, res) => {
  //   collection.find( {}).toArray((err, documents) => {
  //     res.send(documents);
  //   });
  // });
  app.post('/addAdmin', (req, res) => {
    const data = req.body;
    console.log(data)
    adminCollection.insertOne(data)
      .then(result => {

      })
  })

  app.get("/adminEmail", (req, res) => {

    adminCollection.find({ email: req.query.email }).toArray((err, documents) => {
      res.send(documents);
    });
  })

  app.get("/allData", (req, res) => {

    collection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  })


  app.post('/addService', (req, res) => {
    const file = req.files.file;
    const name = req.body.name;
    const dec = req.body.decription;

    const filePath = `${__dirname}/admin/${file.name}`;
    console.log(name, dec, file)
    file.mv(filePath, err => {
      if (err) {
        console.log(err)
        return res.status(500).send({ message: 'failed to upload Image' })
      }
      // return res.send ({name:file.name,path: `/${file.name}`})
    })

    const newImg = fs.readFileSync(filePath);

    const encImg = newImg.toString('base64');

    var image = {
      contentType: req.files.file.mimetype,
      size: req.files.file.size,
      img: Buffer(encImg, 'base64')

    }

    imageCollection.insertOne({ name, dec, image })
      .then(result => {
        fs.remove(filePath, error => {
          if (error) { console.log(error) }
          res.send(result.insertedCount > 0)
        })

      })
  })







  app.post('/addServiceAll', (req, res) => {
    const file = req.files.file;
    const name = req.body.name;
    const description = req.body.decription;


    const Img = file.data;
    const encImg = Img.toString('base64');
    const image = {
      contentType: req.files.file.mimetype,
      size: req.files.file.size,
      img: Buffer.from(encImg, 'base64')
    }
    imageCollection.insertOne({ name, description, image })
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })


  app.get('/adminImgShow', (req, res) => {
    imageCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  });




});


app.listen(process.env.PORT || port)