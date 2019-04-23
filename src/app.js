const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')


// Setup Handlebars engine and view location
app.set('view engine','hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))



app.get('', (req,res) =>{
    res.render('index',{
        title: 'Weather',
        name: 'Alon Kishoni'

    })
})

app.get('/about', (req,res) =>{
    res.render('about',{
        title: 'About Me',
        name: 'Alon Kishoni'
    })
})

app.get('/Weather',(req, res) => {
    if(!req.query.address){
       return res.send({
            error: 'You Must Provide an address'
        })
    } geocode(req.query.address, (error, {latitude, longitude, location} = {})=>{
        if(error){
            return res.send({
                error : 'Unable To Get Weather, Try a Different Search.'
            })
        }
        forecast(latitude, longitude, (error, forecastData)=>{
            if (error) {
                return res.send({
                    error : 'Unable to get forecast'
                })
            }
            res.send({
                location: location,
                forecast: forecastData,
                address: req.query.address
            })
        })

    }) 
    
      
     
})


app.get('/help', (req,res)=>{
    res.render('help',{
        text: 'Search For a Location To Get a Concise Current Weather Report',
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
