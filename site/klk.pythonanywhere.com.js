chrome.storage.sync.get('cjs_post_url',function(items){
	url=items['cjs_post_url']
	alert([url,document.URL])
 }
)


