const request = require('request')


const forecast = (latitude, longitude, callback) => {

 const url = 'https://api.darksky.net/forecast/48e0c4d78275189fddc7b82bb9d32dc0/' + encodeURIComponent(longitude) + ',' + encodeURIComponent(latitude) + '?units=si'

    request({ url , json : true}, (error, { body }) => {
        if (error) {
            callback ('Unable To Connect To Weather Service', undefined)
        } else if (body.error) {
            callback ('Unable To Find Location', undefined)
        } else {
            console.log(body.daily.data[0])
            callback (undefined, body.daily.data[0].summary + ' Right Now It Is ' + body.currently.temperature + ' Degrees With A High Of '+ body.daily.data[0].temperatureHigh +' And A Low Of ' + body.daily.data[0].temperatureLow + '. There Is ' + body.currently.precipProbability +'% Chance Of Rain.')
        }
    })
}

module.exports = forecast