imgs=document.querySelectorAll('#flow-ppt-wrap > div > div > div.ppt-page-item > div > img')
r=[]
for(i of imgs){
	r.push(i.src)
}


chrome.storage.sync.get('cjs_post_url',function(items){
	url=items['cjs_post_url']+'data'
	console.log(url)
	N.postJSON(url,r)
	
 }
)