function qs(s,i){
	return i.querySelector(s)
}

[
'#listTag_21548215827072251376395 > div > span:nth-child(1)'

]





iframe=document.querySelector('iframe[id=mframe]')
if(iframe &&　iframe.contentDocument)
	doc=iframe.contentDocument
else
	doc=document
//ds=doc.querySelectorAll (".portfolio-text-info")
ds=doc.querySelectorAll ('[id^=listNews]')
r=[]
var ii=0
for(var i of ds){
	// ii+=1;	if(ii!=8)continue
	var img=i.querySelector ('.tx')
	img=(img && img.getAttribute('src') ) || ''
	//img=i.querySelector ('img[src*=yqt365]')   //sinaimg
	tag=i.querySelector ('[id^=listTag]')
	title=tag.querySelector('.contenttext')

	sensitive=tag.querySelector('.mark-sensitive-status')

	origin=tag.querySelector('.info-origin')
	//origin=(origin && origin.innerText ) || ''
	
	summary=i.querySelector('.wb_summary')
	summary=(summary && summary.innerHTML ) || '' 

	_pics=i.querySelector('.actizPicShow')
	psrc=[]
	if(_pics){
		_pics=_pics.querySelectorAll('img')
		for(var ii of _pics){
			psrc.push(ii.getAttribute('src') || ii.outerHTML  )
		}
	}
	ri=[img,title,sensitive,origin,summary,psrc]
	for(j in ri){
		if(ri[j].innerText)	ri[j]=ri[j].innerText
	}
	//qqq=i.querySelector('')
	//qqq=i.querySelector('')
    r.push(ri)
}


N.postJSON_qgb_host(r)