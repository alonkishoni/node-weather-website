const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const exchange = require('./convert/exchange-calc')
const insta = require('./utils/instaWeather')

const app = express()
const port = process.env.PORT || 3000

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup Handlebars engine and views path
app.set('view engine','hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))





app.get('/about', (req,res) =>{
    res.render('about',{
        title: 'About Me',
        name: 'Alon Kishoni'
    })
})

app.get('/weatherbylocation', (req,res)=>{
    if(!req.query.location){
        return res.send({error: "Search for a location to get a weather report..."})
    }
    
    forecast(req.query.location[1], req.query.location[0], (error, forecastData)=>{
        if (error) {
            return res.send({
                error : 'Unable to get forecast'
            })
        }
        
        res.send({
            location: 'Your Current Location',
            forecast: forecastData,
            address: req.query.location
        })
    }) 
})

app.get('/weatherData', async (req, res)=>{
    if(!req.query.address){
        return res.send({error: "Search for a location to get a weather report..."})
    }


    const photos = await insta.get(req.query.address).then((response)=>{
       return response
    })

    var location_q
    

    if(photos === [] || !photos){
        location_q = req.query.address
    }else{
        try{
            location_q = await photos[0].city_name
        }catch{
            location_q = await photos[0].location_name
        }
        
    }

   await geocode(location_q, (error, {latitude, longitude, location} = {})=>{
        if(error){
            return res.send({
                error : 'Unable To Get Weather, Try a Different Search.'
            })
        }
        forecast(latitude, longitude, (error, forecastData)=>{
            console.log(latitude, longitude)
            if (error) {
                return res.send({
                    error : 'Unable to get forecast'
                })
            }
           
            
            res.send({
                photos: photos,
                location: location,
                forecast: forecastData,
                address: req.query.address
            })
        })
    })  
})

    


app.get('', (req, res)=>{
        res.render('weather',{
            text: 'Get Your Weather',
            title: 'What To Weather',
            name: 'Alon Kishoni'
          })
    })

app.get('/currency', (req, res)=>{
        res.render('currency',{
            text: 'A Simple Currency Converter',
            title: 'Currency Converter',
            name: 'Alon Kishoni'
          }) 
        })


app.get('/ratesData', (req,res)=>{
 
    exchange(req.query.base, req.query.compare, (error, result)=>{
        if(error){

            console.log(error)
            res.send(error)

        }else if(req.query.base === req.query.compare){


        res.send(result)

        }else{

            res.send(result)


        }

    })
   

})



app.get('/help', (req,res)=>{
    res.render('help',{
        text: 'Search For a Location To Get Current Weather',
        title: 'Help',
        name: 'Alon Kishoni'
    })
})

app.get('/help/*', (req, res) => {
    res.render('404',{
    title: 'Help',
    error: 'Help Article Not Found',
    name: 'Alon Kishoni'
    })
})

app.get('*', (req, res) => {
    res.render('404',{
    title: 'Error 404',
    error: 'Page Not Found',
    name: 'Alon Kishoni'
    })
})

app.listen(port, () =>{
    console.log('server is up on port ' + port)
})
