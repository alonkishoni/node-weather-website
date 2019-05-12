const rateForm = document.querySelector('form')
var coin1 = document.getElementById('base')
var coin2 = document.getElementById('compare')
var result = document.getElementById('result')
var amount = document.querySelector('input')




rateForm.addEventListener('submit', (e) => {
    e.preventDefault()
    base = coin1.options[coin1.selectedIndex].text
    compare = coin2.options[coin2.selectedIndex].text
    result.textContent = 'Loading...'

    

    
   fetch('/ratesData?base=' + base + '&compare=' + compare).then((response)=>{
    response.json().then((data)=>{
        if(!data){
          result.textContent = 'Could Not Reach Database'
        }
        else if (data.error) {
            console.log(data.error)
            result.textContent = data.error
        } else {
            if (amount.value < 1){ 
                var query = base + '_' + compare           
                return result.textContent =  '1 ' + base + ' equals ' + data.results[query].val + ' ' + compare
        } else{
            var query = base + '_' + compare
            console.log(data.results[query].val)

            var sum = amount.value * data.results[query].val



            result.textContent = amount.value + ' ' + base + ' equals ' + sum + ' ' + compare
            
        }

        }
     })
  })
})