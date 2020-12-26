const express = require('express')
const https = require('https')
const app = express()
const PORT = process.env.PORT || 3000
const got = require("got")
const bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/index.html")
})

let thisbe;


app.post("/",(req, res) => {
    // we get access to what the user has typed using "req.body" into the form using our body parser
    const query = (req.body.date)
    const apiKey = "&api_key=6g3whd0g4y9Pz7tHvm4A41eO9vdkoqRea57frx2d"
    const api = "https://api.nasa.gov/neo/rest/v1/feed?start_date=" + query + " &end_date=" + query + apiKey

    https.get(api, function (response) {
        console.log(response.statusCode);

        // on a certain action perform this
        response.on("data", async function (data){

            //convert the data into a javascript object
            // in order to parse the data we call json.parse. Then keep that for every api call.
            const asteroidData = await got(api).json();
            const asteroidName = asteroidData.near_earth_objects['2020-12-05'][0].name
            const hazardous = asteroidData.near_earth_objects['2020-12-05'][0].is_potentially_hazardous_asteroid
            res.write(`There was a near earth asteroid called ${asteroidName} `)
            res.write(`The Asteroid Seems to be identified ${hazardous} for hazardous`)
            res.send()
        })
    })
})


//handles errors
app.use((req, res) => {
    res.status(400).sendFile(__dirname + "/404.html")
})



app.listen(PORT, (req, res, next) => {
    console.log(`App up and listening on ${PORT}`)
})