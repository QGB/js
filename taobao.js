loadQGB(false)
print(window['qgb']+' > taobao.js')
gs={                                 
item     : 'div.item'     ,           //4*11=44
url      : 'div.title > a',          
img      : 'img.img' ,                 //'a.pic-link'   ,//1
title    : 'div.title'    ,          
price    : 'div.price'   ,           
ship     : 'div.ship'     ,          
deal     : 'div.deal-cnt' ,          
shop     : '.shopname'    ,          
location : 'div.location' ,          
icons    : 'ul.icons'     ,          //8

pn  : 'li.item.active > span.num' ,
next     : 'li.item.next' ,

}
gsv=U.getValues(gs)

gshop={
item     : 'dl.item',        //3*8=24
img      : 'dt.photo > a > img',
title    : 'a.item-name',//url a.href
price    : 'span.c-price',
sprice   : 'span.s-price',
deal     : 'span.sale-num',
comment  : 'dd.rates > div > h4 > a > span',//i
}
B={}
chrome.extension.sendMessage({eval: 'sender.tab.id'},function(r){B.gtabid=r});
B.eval=function (a){
	chrome.extension.sendMessage({eval: a});
}
B.close=function (){
	B.eval("chrome.tabs.remove(sender.tab.id);")
}
B.create=function(url){
	if(!url)url='http://192.168.2.3'
	// if U.islist(url){
		// setTimeout(function(){
			// B.create()
		// })
	// }
	
	sc=U._TEXT(function(){/*
chrome.tabs.create({'url': '#url', 'selected': true} ,function( tab) {
	setTimeout(function(){
		chrome.tabs.executeScript(tab.id,{
			'code':"#code"
		})
		setTimeout(function(){
			chrome.tabs.sendMessage(#id, { type: 'taobao_nextItem',options: {}	} )
		},999)
	},1000*11)
 }   
);
	*/})
	scitem=U._TEXT(function(){/*
x=new XMLHttpRequest();
x.open('GET','https://coding.net/u/qgb/p/js/git/raw/master/item.js');
x.onload=function(){eval(this.response)}
x.send();
	*/})
	scitem=T.replaceAll(scitem,'\n',' ').trim()
	// print(scitem)
	sc=sc.replace('#code',scitem).replace('#url',url)
	sc=T.replaceAll(sc,'#id',B.gtabid)
	// U.log(sc)
	print(sc)
	B.eval(sc)
}
B.getTabId=function(){
	B.eval("sender.tab.id")
}

function taobao_nextItem(){
	if(!U.islist(B.urls) )return U.log('B.urls not list')
	if(B.urls.length<1 )return U.log('B.urls is empty')
	if(gtaobao_pause){
		setTimeout(function(){
			taobao_nextItem()
		},7999)
		return U.log('gtaobao_pause',new Date())
	}
	url=B.urls.pop()
	if(U.islist(url))  url=url[0]
	B.create(url)
}

r=[]
function sPage(){
	items=qs(gs.item)
	len=items.length
	print(len)
	
	for(e of items){
		re=[]
		re.push(e.querySelector(gs.url).href)
		re.push(e.querySelector(gs.img ).src )
		re.push(e.querySelector(gs.title).innerText)
		re.push(e.querySelector(gs.price ).innerText )
		re.push(e.querySelectorAll(gs.ship ).length===1 ? 'free' : '' )
		re.push(e.querySelector(gs.deal ).innerText )
		re.push(e.querySelector(gs.shop ).innerText )
		re.push(e.querySelector(gs.location ).innerText )
		re.push(e.querySelector(gs.icons ).innerHTML.trim() )
		r.push(re)
	}
	N.postJSON('https://lk.lk:1122/SItem',r)
	clearOut()
	B.urls=r
	print(r)
	
	taobao_nextItem()
	// B.create(r)
	
	
}
setTimeout(function(){
	sPage()
},111)// 1  B.gtabid  undefined


// U.log(U.str(B))
