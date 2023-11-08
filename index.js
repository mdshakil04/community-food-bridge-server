const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.port||5000;

// Middlewares
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l8rzo73.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const foodCollection = client.db('foodDb').collection('food');

    app.post('/food', async(req, res)=>{
      const newFood = req.body;
      console.log(newFood);
      const result = await foodCollection.insertOne(newFood);
      res.send(result)
    })

    app.get('/food', async(req, res) => {
      const cursor = foodCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // Data Collect from Database
    const foodsCollection = client.db('allFoods').collection('foods');
    app.get('/foods', async(req, res) =>{
      const cursor = foodsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // get single item from database using id
    app.get('/foods/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const options = {
        projection:{_id:1, food_image:1, food_name:1,donator_image:1, donator_name:1, food_quantity:1, pickup_location:1, expired_date:1, additional_notes:1}
      }

      const result = await foodsCollection.findOne(query, options);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Server is rinning')
})

app.listen(port, () =>{
    console.log(`Server is running on Port ${port}`)
})
