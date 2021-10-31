const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');


const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bm6uk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//connect to the client site
async function run(){
    try{
        await client.connect();
        console.log('connected to database');
     
        const database = client.db('tourism_website');
        const servicesCollection = database.collection('services');
        
  
        // //GET API
        app.get('/services', async(req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });


        // //GET single Service
        app.get('/services/:id', async(req, res) => {
            const id = req.params.id;
            console.log("getting specific service", id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })
        
        
        
        
        // //POST API
        app.post('/services', async(req, res) => {
            const service = req.body;
            console.log('hit the post api', service);
           
         const result = await servicesCollection.insertOne(service);
        console.log(result);
         res.json(result)
        // res.send('post hitted')
         });

        // //DELETE API
        app.delete('/services/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally{
        //await client.close();
    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Tourism website server is running")
});


app.listen(port, ()=>{
    console.log("Server running at port",port)
})