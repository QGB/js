ips= document.querySelectorAll('div[name=ip]')
r=[]
for(i of ips){
	r.push(i.textContent)
}

chrome.storage.sync.get('cjs_post_url',function(items){
	url=items['cjs_post_url']+'data'
	console.log(url)
	N.postJSON('https://envcqb-8080-gcwmrj.web.ide.live/data',r)

 }
)

