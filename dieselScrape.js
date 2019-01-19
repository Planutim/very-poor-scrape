const request = require('request-promise')
const $ = require('cheerio')

const url = 'http://diesel.elcat.kg/index.php?showforum=243&prune_day=1&sort_by=Z-A&sort_key=last_post&topicfilter=all&page=';


async function scrapet(){
  const keywords = [
    'javascript', 'css', 'html','sql'
  ]
  const regExp = new RegExp('^.+('+keywords.join('|')+').+$');
  
  var linkElem = '.topic_title'
  var urls = []
  var promises = []
  for(var i=1;i<=5;i++){
      let promise = new Promise(resolve=>{
        var result = []
        request(url+i).then((html)=>{
          for(let i=0;i<40;i++){
            result.push({
              href: $(linkElem,html)[i].attribs.href,
              title: $(linkElem,html)[i].attribs.title
            })
            if(i==30){
              console.log($(linkElem,html)[i].attribs.href)
            }
            resolve(result)
          }
        })
        
      })
      promises.push(promise);
  }
  await Promise.all(promises).then((results)=>{
    results.forEach(result=>{
      urls=urls.concat(result);
    })
  })
  // urls = urls.filter(url=>{
  //   return url.title.toLowerCase().match(regExp)!==null;
  // })
  // urls = urls.filter(url=>{
  //   return url.title.toLowerCase().match(regExp)!==null;
  // })
  console.log(urls);
  console.log(urls.length+ ' РАЗ!')
  return urls;
}

async function scrapev2(){
  var urls= [];
  var promises = []
  var linkElem = '.topic_title'
  for(var i=1;i<=5;i++){
    promises.push(request(url+i));
  }
  await Promise.all(promises).then((results)=>{
    console.log(results.length);
    results.forEach(html=>{
      var domObj = $(linkElem,html);
      for(let j=0;j<40;j++){
        urls.push({
          href: domObj[i].attribs.href,
          title: domObj[i].attribs.title
        })
        if(j==30){
          console.log(domObj[i].attribs.href);
        }
      }
    })
  })
  return urls;
}


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