const request = require('request-promise')
const $ = require('cheerio')

const url = 'http://diesel.elcat.kg/index.php?showforum=243&prune_day=1&sort_by=Z-A&sort_key=last_post&topicfilter=all&page=';

async function scrape(){
  var urls = []
  for(var i=1;i<=6;i++){
    await request(url+i).then((html)=>{
      var domObj = $('.topic_title',html);
      for(let j=0;j<40;j++){
        urls.push({
          href: domObj[j].attribs.href,
          title: domObj[j].attribs.title
        })
        if(j==30){
          console.log(domObj[j].attribs.href);
        }
      }
    })
  }
  console.log(urls.length);
  return populate(filterByKeywords(urls));
}

function filterByKeywords(urls){
  const keywords = [
    'javascript', 'css', 'html','sql','разработчик', 'web', 'разраб','developer','програм','tester','тест','qa'
  ]
  const regExp = new RegExp('^.+('+keywords.join('|')+').+$','i');
  const regExpTest = /Требуется/
  console.log(regExp)
  return urls.filter((url,i)=>{
    return regExp.test(url.title);
  })
}
async function populate(urls){
  // return urls.map(async function(url){
  //   await request(url.href).then((html)=>{
  //     var domObj = $('.entry-content',html);
  //     url.html = domObj.text()
  //   })
  //   return url
  // })
  for(var i=0;i<urls.length;i++){
    await request(urls[i].href).then((html)=>{
      var domObj = $('.entry-content:first-of-type', html)
      urls[i].html = domObj.text().substring(0,50);
    })

  }
  return urls;
}

module.exports = scrape;