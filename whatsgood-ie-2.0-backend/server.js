//importing

import express from 'express';
import mongoose from 'mongoose';
import Messages from './dbMessages.js';
import Pusher from 'pusher';
import changeStream from 'mongodb';

//app config
const app = express();
const port = process.env.PORT || 9000; 



//middleware

app.use(express.json());

//database config
const connection_url = 'mongodb+srv://admin:dma7G8nRVrtIuuTD@whatsgood-ie-2-0.v8foq.mongodb.net/whatsgooddb?retryWrites=true&w=majority&appName=whatsgood-ie-2-0'
/*mongoose.connect(connection_url,{
    /*useCreateIndex:true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});
*/

try {
     mongoose.connect(connection_url)
    {
        useNewUrlParser: true;
        useUnifiedTopology: true;
    };
        console.log("DB connected");
        const db = mongoose.connection;
        const msgCollection = db.collection('messagecontents');
        const changeStream = msgCollection.watch();
    
        const pusher = new Pusher({
            app_id: "1888711",
            key : "11e9f27e75f89f1e7bd4",
            secret : "2995d32a77cd3f639e3e",
            cluster : "ap2",
            useTLS: true
        });
        changeStream.on('change', (change) => {
            console.log(change);
            if (change.operationType ==='insert'){
                const messageDetails = change.fullDocument;
                console.log("App ID:", process.env.PUSHER_APP_ID);
                console.log("Key:", process.env.PUSHER_KEY);
                console.log("Secret:", process.env.PUSHER_SECRET);
                console.log("Cluster:", process.env.PUSHER_CLUSTER);
                pusher.trigger('messages', 'inserted',
                    {
                        name: messageDetails.name,
                        message: messageDetails.message,
                        timestamp: messageDetails.timestamp
                    }
                );
            } else {
                console.log('Error triggering Pusher'); 
            }
        });

        changeStream.on('error',(err) => {
            console.error('Error in change stream', err);
        });

} catch(error) {
    console.log("error while connecting to database",error);
};
/*
const connectDB = async () => {
    try {
      const conn = await mongoose.connect(connection_url);
    }
    catch (error) {
        console.error('COULD NOT CONNECT TO DATABASE:', error.message);
    }
  };
  */


/*db.once('open', ()=> {
    console.log("DB connected");

    const msgCollection = db.collection('messagecontents');
    const changeStream = msgCollection.watch();

    changeStream.on('change', (change) => {
        console.log(change);
        console.log(process.env.PUSHER_APP_ID); // Should print your app_id

        if (change.operationType ==='insert'){
            const messageDetails = change.fullDocument;
            pusher.trigger('messages', 'inserted',
                {
                    name: messageDetails.name,
                    message: messageDetails.message,
                    timestamp: messageDetails.timestamp
                }
            );
        } else {
            console.log('Error triggering Pusher'); 
        }
    });
});
*/
//???

//api routes
//app.get('/',(req,res)=>res.status(200).send('hello world'));

/*app.get('/', (req, res) => {
    Messages.find({},(err,data) => {
        if(err){
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    });
});
*/
app.get('/messages/sync',async (req, res) => {
    try{
        const data = await Messages.find({}).exec()
        res.status(200).send(data);
    }catch (error) {
            res.status(500).send(error);
        }
});

app.post('/messages/new', async (req, res) => {
    const dbMessage = req.body;
    console.log(dbMessage);
    try{
        const result = Messages.create(dbMessage)
        res.status(201).send(result);
    
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    } 
});
     /*useCreateIndex:true,
     Messages.create(dbMessage, (err, data)=> {
        if(err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data);
        }
    })
    
    
   new Promise((resolve,reject) => {
        Messages.create(dbMessage, (err, data)=> {
            if(err) reject(err);
            else resolve(data); 
        });
   })
        .then((data) =>{
            res.status(201).send(data);
        })
        .catch((err) =>{
            res.status(500).send(err);
        });
   
})
*/
//listenersapp.listen(port);
app.listen(port, () => console.log(`Server is running on port ${port}`));