const rateForm = document.querySelector('form')
var coin1 = document.getElementById('base')
var coin2 = document.getElementById('compare')
var result = document.getElementById('result')



rateForm.addEventListener('submit', (e) => {
    e.preventDefault()
    base = coin1.options[coin1.selectedIndex].text
    compare = coin2.options[coin2.selectedIndex].text
    result.textContent = 'Loading...'

    
   fetch('/ratesData?base=' + base + '&compare=' + compare).then((response)=>{
    response.json().then((data)=>{
 
        if (data.error) {
            result.textContent = data.error
              
        } else {
            console.log(data)
            result.textContent = data.result

        }
    })

})

})
