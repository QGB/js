function qs(s,i){
	return i.querySelector(s)
}

iframe=document.querySelector('iframe[id=mframe]')
if(iframe &&　iframe.contentDocument)
	doc=iframe.contentDocument
else
	doc=document
//ds=doc.querySelectorAll (".portfolio-text-info")
function get(){
var ds=doc.querySelectorAll ('[id^=listNews]')
var r=[]
var ii=0
for(var i of ds){
	// ii+=1;	if(ii!=8)continue
	var img=i.querySelector ('.tx')//头像
	img=(img && img.getAttribute('src') ) || ''
	//img=i.querySelector ('img[src*=yqt365]')   //sinaimg
	var tag=i.querySelector ('[id^=listTag]')
	if(tag && tag.style.background === 'green') continue;

	var title=tag.querySelector('.contenttext')

	var sensitive=tag.querySelector('.mark-sensitive-status')

	var is_origin=tag.querySelector('.info-origin')//是否原创
	//origin=(origin && origin.innerText ) || ''
	
	var summary=i.querySelector('[class*=summary]')
	summary=(summary && summary.innerHTML ) || tag 

	var _pics=i.querySelector('.actizPicShow')
	var psrc=[]
	if(_pics){
		_pics=_pics.querySelectorAll('img')
		for(var ii of _pics){
			psrc.push(ii.getAttribute('src') || ii.outerHTML  )
		}
	}
	
	var keyword = i.querySelector('.keyword-wrapper')
	var xyqy = i.querySelector('.location-wrapper > span:nth-child(1) ')
	var hy = i.querySelector('.location-wrapper > span:nth-child(2) ')
	
	var article_url =i.querySelector('[onclick^=originalUrl]')
	  article_url=(article_url && article_url.getAttribute('onclick') ) || '' 
	article_url=T.sub(article_url,"originalUrl('","');")
	
	
	var article_similar_count=i.querySelector('td:nth-child(3)')
	var article_origin       =i.querySelector('td:nth-child(4)')
	var stime       =i.querySelector('[id^=pdate]')
	var time_index=''
	var time_publish=''
	if(stime){
		time_index=i.querySelector ('[name^=indexTime]')
		time_index=(time_index && time_index.getAttribute('value') ) || '' 
		
		time_publish=i.querySelector ('[name^=published]')
		time_publish=(time_publish && time_publish.getAttribute('value') ) || '' 
	}
	//       0    1        2       3         4     5      6      7   8                              
	var ri=[img,title,sensitive,is_origin,summary,psrc,keyword,xyqy,hy,
	//   9              10                   11        12      13         14
	article_url,article_similar_count,article_origin,stime,time_index,time_publish]
	
	for(var j in ri){
		if(!ri[j] ) ri[j]=''
		if(ri[j] && ri[j].innerText)	ri[j]=ri[j].innerText
	}
	
    r.push(ri)
	tag.style.background ='green';			
}

 if(r && r.length){
	N.postJSON_qgb_host(r) 
	return r
 } 
	return false
}


function sleep(ms) {return new Promise(resolve => setTimeout(resolve, ms) )  }
async function test(){
	while(!gb){
		if(gb)break
		while(!get()){
			await sleep(555)
		}

		var next=doc.querySelector('.next ')
		if(next){
			if(next.classList.contains( "disabled" )){
				console.log(new Date(), 'end reached')
				btn=querySelector('#queryList')
				btn.click()
				await sleep(5555)
				break
			}
				
			next.click()
		}
		
		await sleep(999)
		console.log(new Date())

	}
	
}


U.glog=false;

gb=0
//test()

