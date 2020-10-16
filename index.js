const express = require('express')

const bodyParser=require('body-parser');
const cors=require('cors')
const MongoClient = require('mongodb').MongoClient
require('dotenv').config()

;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.arzqi.mongodb.net/agency?retryWrites=true&w=majority`;
const app = express()

app.use(bodyParser.json());
app.use(cors())
const port = 5000;


const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("agency").collection("data");
  const adminCollection = client.db("agency").collection("addAdmin");
app.post('/addData',(req,res)=>{
  const data=req.body;
  console.log(data)
  collection.insertOne(data)
  .then(result=>{
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
  app.post('/addAdmin',(req,res)=>{
    const data=req.body;
    console.log(data)
    adminCollection.insertOne(data)
    .then(result=>{
      console.log(result)
    })
  })

  app.get("/adminEmail", (req, res) => {
    console.log(req.query.email)
    adminCollection.find({email:req.query.email}).toArray((err, documents) => {
      res.send(documents);
    });
  })

  app.get("/allData", (req, res) => {
    
    collection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  })
});


app.listen(port)