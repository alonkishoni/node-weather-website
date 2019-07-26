const weatherForm = document.querySelector('#weather')
const search = document.querySelector('input')
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')
const currentLocation = document.querySelector('#my-location')



currentLocation.addEventListener('click', (e)=>{
    e.preventDefault()
    navigator.geolocation.getCurrentPosition((position)=>{
       const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }
        console.log(position.coords)

    messageOne.textContent = 'Loading...'
    messageTwo.textContent = '  '
    
    
   fetch('/weatherbylocation?location=' + location.latitude +'&location='+ location.longitude).then((response)=>{
    response.json().then((data)=>{

        if (data.error) {
            messageOne.textContent = data.error
            messageTwo.textContent = ''
              
        } else {
                     messageOne.textContent = data.location
                     messageTwo.textContent = data.forecast
                
                        
            }
    })
})
    })
})

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()
console.log(document.getElementsByClassName("container")[0])
if(document.getElementsByClassName("container")[0] !== undefined){
    document.getElementsByClassName("container")[0].parentNode.removeChild(document.getElementsByClassName("container")[0])
}
    var container = document.createElement("div")
        container.id = 'photo_container'
        container.className = 'container'
        document.getElementById("weather").appendChild(container)

    


    const location = search.value


    messageOne.textContent = ' '
    messageTwo.textContent = ' Fetching Weather For ' + location
    
    
   fetch('/weatherData?address=' + location).then((response)=>{
    response.json().then((data)=>{
        
        if(data.photos.error){
            messageOne.textContent = data.location
            messageTwo.textContent = data.forecast
        }
        

        if (data.error) {
            messageOne.textContent = data.error
            messageTwo.textContent = ''
              
        } else {
           

            if(data.photos[0]){ // !== undefined
                
                data.photos.forEach((item)=>{

                    var a = document.createElement("a")
                    a.href = `https://www.instagram.com/${item.user_name}`
                    a.target="_blank"

                    var img = document.createElement("img")
                    img.src = item.display_url
                    img.id = 'photos'

                    var div = document.createElement("div")
                

                    var p1 = document.createElement("p")
                    p1.id = 'time'
                    p1.textContent = item.time_ago

                    document.getElementsByClassName("container")[0].appendChild(a).appendChild(img)
                    document.getElementsByClassName("container")[0].appendChild(div).appendChild(p1)

                })

                     messageOne.textContent = data.location
                     messageTwo.textContent = data.forecast


        }else{

                     messageOne.textContent = data.location
                     messageTwo.textContent = data.forecast
        }
    
                     
                     
            
        }
    })

})

})

