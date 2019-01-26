var express = require('express')
var app = express()
var dieselScrape = require('./dieselScrape')
var hhScrape = require('./hhScrape')
app.set('view engine', 'pug');
app.use(express.static('public'))
app.listen(3001,()=>{
  console.log('its up!')
})


app.get('/diesel', async (req,res)=>{
    var urls = await dieselScrape()
    res.render('diesel',{urls, })
    
})

app.get('/', async(req,res)=>{
  var urls = await hhScrape()
  res.render('diesel', {urls, main:true })
})