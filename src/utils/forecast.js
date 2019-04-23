const request = require('request')


const forecast = (latitude, longitude, callback) => {

 const url = 'https://api.darksky.net/forecast/48e0c4d78275189fddc7b82bb9d32dc0/' + encodeURIComponent(longitude) + ',' + encodeURIComponent(latitude) + '?units=si'

    request({ url , json : true}, (error, { body }) => {
        if (error) {
            callback ('Unable To Connect To Weather Service', undefined)
        } else if (body.error) {
            callback ('Unable To Find Location', undefined)
        } else {
            callback (undefined, body.daily.data[0].summary + ' with a temperature of ' + body.currently.temperature + ' degrees. and a ' + body.currently.precipProbability +'% chance of rain')
        }
    })
}

module.exports = forecast