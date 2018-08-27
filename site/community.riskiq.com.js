subdomains=[]
btn=document.querySelector('.search-data-dataList-nextPage')
do{
	rs=document.querySelectorAll('.search-subdomains-column  > span > span.inlineAction-content > a')
	for(i of  rs){
		subdomains.push(i.text)
	}
	console.log(subdomains.length)
	btn.click()
}while(btn=document.querySelector('.search-data-dataList-nextPage'))



chrome.storage.sync.get('cjs_post_url',function(items){
	url=items['cjs_post_url']+'data'
	console.log(url)
	N.postJSON(url,subdomains)

 }
)