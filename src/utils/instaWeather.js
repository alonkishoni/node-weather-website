const instamancer = require('instamancer')
const moment = require('moment')

const hashOptions = instamancer.IOptions = {
    total: 15,
    fullAPI: true,
    headless: true,
    enableGrafting: true,
    sleepTime: 0,
    hibernationTime: 0
};

const locationOptions = instamancer.IOptions = {
  total: 20,
  fullAPI: true,
  headless: true,
  enableGrafting: true,
  sleepTime: 0,
  hibernationTime: 0
};

//prepairing search - deleting spaces before searching a hashtag
const pre_search = process.argv[2]




//search for a hashtag to extract location ID
async function getLocationID(pre_search) {
  const search = pre_search.replace(/ /g,"")

  const searchHashtag = instamancer.hashtag(search, hashOptions)

  //looping through results
    for await (const post of searchHashtag){
      
      //getting result object
    var location = await post.shortcode_media.location 
    
    //check if post has an active location object
    if(post && location && location.address_json){
      var address = await JSON.parse(location.address_json)
      var isCity = address.exact_city_match
      var cityName = address.city_name
              
      //get user's intention
      var regExp = RegExp(search, 'i') //create a regular expression from uder input in order to compare
      var squeezeName = location.name.replace(" ","") //delting spaces for location name object in order to compare
      var nameMatch = squeezeName.search(regExp) //compare user input and location result to get user intent

      //conditional filter to get location ID - best scenario
      if(cityName === location.name && nameMatch !== -1 && isCity === true && location.id){
        var locID = location.id
        console.log(cityName)
        console.log(locID)
        console.log(nameMatch)
        console.log('')
        return locID
      //conditional filter to get location ID = second best scenario 
      }else if(search === location.slug && nameMatch !== -1 && location.id){
       var locID = location.id
        console.log(cityName)
        console.log(locID)
        console.log(nameMatch)
        console.log('')

        return locID
      }else{
      console.log('empty')
      
            }
          }
        }   
      
    }




async function getPhotos (location){
  const searchLocation = instamancer.location(location, locationOptions)
  var times = []
  var results = []
  
  for await (const post of searchLocation){
    if (!post.shortcode_media.accessibility_caption || !post.shortcode_media.location){

      console.log('- NO RESULT -')
      console.log('')
      

    }

    if (post.shortcode_media.accessibility_caption && post.shortcode_media.location){
      const location = post.shortcode_media.location

      const caption = post.shortcode_media.accessibility_caption
      const dateTaken = moment.unix(post.shortcode_media.taken_at_timestamp)
      const unixDate = post.shortcode_media.taken_at_timestamp
      const time_ago = moment(`${dateTaken}`).fromNow()
      const display_url = post.shortcode_media.display_url
      const location_name = post.shortcode_media.location.name
      const is_video = post.shortcode_media.is_video
      const user_name = post.shortcode_media.owner.username
      const user_id = post.shortcode_media.owner.id
  
      const people = caption.search('people')
      const person = caption.search('person')
      const outdoor = caption.search('outdoor')

      if(post && location && location.address_json){
        var address = JSON.parse(location.address_json)
        var city_name = address.city_name
      }
      var result = {
        city_name,
        location_name,
        caption,
        display_url,
        is_video,
        date: dateTaken._d,
        unixDate,
        time_ago,
        user_name,
        user_id
      }    
  
      if(caption && people !== -1 && outdoor !== -1){
      
      console.log(result)
      results.push(result)
      times.push(dateTaken._d)
  
      console.log('-   -    po    -    -')
      console.log('')
                        
      }else if(caption && people !== -1 || person !== -1 ){
  
        results.push(result)
        console.log(result)
        times.push(dateTaken._d)
        console.log(post)
                        
        console.log('-   -    p    -    -')
        console.log('')
                        
      }else{
        console.log('- NO RESULT -')
        console.log('')
      }         
    }
  }

  console.log(times)

  return results
}



async function get(search){
  const q = await getLocationID(search)
  const res = await getPhotos(q)

  var result = res.sort(function(a, b) {
    a = a.unixDate
    b = b.unixDate
    return a>b ? -1 : a<b ? 1 : 0
})

  return result
}


module.exports = {get}
