let {Module} = require('../main');
/*
Credit: javinkurt/#
Module({
pattern: 'autobio ?(.*)',
fromMe: true
*/
let on_aano = false
Module({on:"text",fromMe:true},async (m)=>{
if (on_aano=== true || on_aano === null) return;
if (m.message.toLowerCase() == "autobio off") {
on_aano = null
clearInterval(bioSetter)
await m.send("Autobio devre dışı, plugini kaldır!")
}
on_aano = true
async function setAbout(){
let status = "📆 "+new Date().toLocaleDateString()+" ⌚ "+new Date().toLocaleTimeString()+" OTO BİO ⚡"
await m.client.updateProfileStatus(status)
return "Done"
}
m.jid = m.client.user.id
await m.send("OTO bio aktif!");
let bioSetter = setInterval(setAbout,15)
})
