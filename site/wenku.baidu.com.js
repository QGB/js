imgs=document.querySelectorAll('#flow-ppt-wrap > div > div > div.ppt-page-item > div > img')
r=[]
for(i of imgs){
	if(i.src)i=i.src
	else     i=i.getAttribute('data-src')
	r.push(i)
}


chrome.storage.sync.get('cjs_post_url',function(items){
	url=items['cjs_post_url']+'data'
	console.log(url)
	N.postJSON(url,r)

 }
)