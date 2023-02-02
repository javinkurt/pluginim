const {Module} = require('../main')
const axios = require('axios')
const cheerio = require('cheerio')
const fs = require("fs")
const ffmpeg = require('fluent-ffmpeg');
const {Readable} = require('stream');
const {
    skbuffer
} = require('raganork-bot');
const { fromBuffer } = require('file-type')
const {HANDLERS}= require('../config');
const {MODE} = require('../config');
let handler = HANDLERS !== 'false'?HANDLERS.split("")[0]:""
let auto = MODE == 'public' ? false : true
Module({pattern: 'wallpaper ?(.*)', fromMe: true ,desc: ' Wallpaper downloader ', use: ' utility ',}, async (m,match) => {
if(!match[1]){return await m.send("give me a query")}
let tt=match[1]
const url ="https://wallpapers.com/search/"+tt
let news=[]
axios(url)
.then(async response =>{
    const html = response.data
    const ch = cheerio.load(html)
    const article= []
    ch('.kw-contents li',html).each(function(){
        
       
        const title = ch(this).find('figcaption').text().replaceAll('\n','').replaceAll('  ','')
        const lin = ch(this).find('a').attr('href')
    
        article.push({
            title,
            lin
        })
    })
    console.log(article);
    for(let i of article){
     await news.push({title:i.title, rowId:handler+"wlfull "+i.lin})
    }
    let c= ch('div .navigation a')
    let a = ch(c[c.length -1]).attr('href')
    if(a){
      await news.push({title:"More", rowId:handler+"wlmore "+a})
    }
    const sections=[{title:"Click for wallpaper",rows:news}]
    const listMessage={footer:"made by dark death",
    text:"\nFree wallpaper",
    title:"*"+article[0].title+"*",
    buttonText:"select",
    sections}
    return await m.client.sendMessage(m.jid,listMessage,{quoted:m.data})
}).catch(err => console.log(err))

});

Module({pattern: 'wlmore ?(.*)', fromMe: true ,desc: ' Wallpaper downloader ', use: ' utility ',}, async (m,match) => {

let tt=match[1]
const url =tt
let news=[]
axios(url)
.then(async response =>{
    const html = response.data
    const ch = cheerio.load(html)
    const article= []
    ch('.kw-contents li',html).each(function(){
        
       
        const title = ch(this).find('figcaption').text().replaceAll('\n','').replaceAll('  ','')
        const lin = ch(this).find('a').attr('href')
    
        article.push({
            title,
            lin
        })
    })
    console.log(article);
    for(let i of article){
     await news.push({title:i.title, rowId:handler+"wlfull "+i.lin})
    }
    let c= ch('div .navigation a')
    let a = ch(c[c.length -1]).attr('href')
    if(a){
      await news.push({title:"More", rowId:handler+"wlmore "+a})
    }
    const sections=[{title:"Click for wallpaper",rows:news}]
    const listMessage={footer:"made by dark death",
    text:"\nFree wallpaper",
    title:"*"+article[0].title+"*",
    buttonText:"select",
    sections}
    return await m.client.sendMessage(m.jid,listMessage,{quoted:m.data})
}).catch(err => console.log(err))

});
Module({pattern: 'wlfull ?(.*)', fromMe: true ,desc: ' manga downloader\n.manga one piece ', use: ' utility ',}, async (m,match) => {

let tt=match[1]
const url =tt
let news=[]
axios(url)
.then(async response =>{
    const html = response.data
    const ch = cheerio.load(html)
    const article= []
    
    
    let a = "https://wallpapers.com"+ch('.img-unit a').attr('href')
    console.log(a);
    let igbuffer = await skbuffer(a)
    let data=await getVideoDimensions(igbuffer)
    if(data.height>3000){
        return await m.client.sendMessage(m.jid,{document:igbuffer,mimetype:"image/jpeg",fileName:"wallpaper.jpg"},{quoted:m.data})
    }
    return await m.send({url:a},'image',{quoted:m.data})
    
}).catch(err => console.log(err))
async function getVideoDimensions(buffer) {
    return new Promise((resolve, reject) => {
        const bufferStream = new Readable();
        bufferStream.push(buffer);
        bufferStream.push(null);
        ffmpeg.ffprobe(bufferStream, (err, metadata) => {
            if (err) {
                reject(err);
                return;
            }
            const { width, height } = metadata.streams.find(
                s => s.codec_type === 'video'
            );
            resolve({ width, height });
        });
    });
}

});
