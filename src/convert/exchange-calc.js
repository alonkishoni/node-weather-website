const request = require ('request')




const exchange = (base, compare ,callback)=>{

const url = 'https://free.currconv.com/api/v7/convert?q=' + base +'_'+ compare + '&apiKey=3f58d9948ae26908dbc2'

request({url, json : true}, (error, {body} = {}) => {
    if (error){
        callback ('could not reach database',undefined)
    }else if(body.error){
        callback (body, undefined)
    }else{
        callback (undefined, body)
    } 
  })
}



module.exports = exchange