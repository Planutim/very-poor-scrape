var express = require('express')
var app = express()
var scrape = require('./dieselScrape')

app.set('view engine', 'pug');
app.use(express.static('public'))
app.listen(3000,()=>{
  console.log('its up!')
})


app.get('/', async (req,res)=>{
    var urls = await scrape()
    res.render('diesel',{urls})
    
})

