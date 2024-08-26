//App inclusions
const { clear } = require("console");
const express = require("express");
const http = require("http");


const app = express();
const router = express.Router();
const PORT = process.env.PORT || 8888;


app.use(express.json());

app.listen(PORT, () => {
    console.log("Server Listening on port:", PORT);
  });

app.get("/status", (request, response) => {
    const status = {
      Status: "Running",
    };
    response.send(status);
  });

app.post("/event", function (req, res) {
    console.log(req.headers.topic)
    console.log(req.body);
    var obj = req.body
    var topic = 'na'
    if(req.headers.topic !== undefined){
        topic = req.headers.topic;
        res.status(200).send(req.body);
    }else if(obj.topic !== undefined){
        topic = obj.topic;
        res.status(200).send(req.body);
    }else{
        topic = 'lvt/deadLetter';
        res.status(418).send("Topic is required. Please check your API documentation.");
    }
    console.log("topic: "+topic)
    sendMsg(topic, JSON.stringify(req.body))

    
})  

// MQTT Inclusions and constants
const mqtt = require('mqtt')

const protocol = 'mqtt';
const host = '54.68.243.164';
const mqttPort = '1883';
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

// const topic = 'lvt/test';

const connectUrl = `${protocol}://${host}:${mqttPort}`;

const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: 'postUser',
    password: 'post123!@#',
    reconnectPeriod: 1000,
  });

  client.on('connect', () => {
    console.log('MQTT Connected');
  })

const sendMsg = function(topic,msg) {
    client.publish(topic, msg, { qos: 0, retain: false }, (error) => {
        if (error) {
          console.error(error)
        }
      }) 
}
//   client.on('connect', () => {
//     // console.log('MQTT Connected');
//     client.publish(topic, 'nodejs mqtt test', { qos: 0, retain: false }, (error) => {
//       if (error) {
//         console.error(error)
//       }
//     })
//   })
  
