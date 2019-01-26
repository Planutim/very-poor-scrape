const request = require('request-promise')
const $ = require('cheerio')

const url='https://hh.ru/search/vacancy?clusters=true&enable_snippets=true&order_by=publication_time&schedule=remote&search_period=1&specialization=1&experience=&from=cluster_experience'
var queries = [
  'noExperience',
  'between1And3'
]
queries = queries.map(query=>{
  var index = url.indexOf('&from=')
  return url.slice(0,index)+query+url.slice(index)
})

const hhScrape = async function(){
  var promises = []
  var urls = []
  queries.map(query=>{
    var promise = request(query).then((html)=>{
      var domObj = $('.resume-search-item__name > a',html)
      for(let j=0;j<domObj.length;j++){
        urls.push({
          href: domObj[j].attribs.href,
          title: domObj[j].firstChild.nodeValue
        })
        if(j==0){
          console.log(urls[0])
        }
      }
      
    })
    promises.push(promise)
  })
  const results = await Promise.all(promises)

  return urls;
}

module.exports = hhScrape