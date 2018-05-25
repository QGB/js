loadQGB(false)
print(window['qgb']+' > taobao.js')
gs={
item     : 'div.item'     ,//4*11=44
url      : 'div.title > a'    ,
img      : 'img.img' ,  //'a.pic-link'   ,//1
title    : 'div.title'    ,
price    : 'div.price'   ,
ship     : 'div.ship'     ,
deal     : 'div.deal-cnt' ,
shop     : 'span.dsrs'    ,
location : 'div.location' ,
icons    : 'ul.icons'     ,//8

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
	sc=U._TEXT(function(){/*
chrome.tabs.create({'url': '#url', 'selected': true} ,function( tab) {
	setTimeout(function(){
		
		chrome.tabs.sendMessage(#id, {
				type: 'eval',
				options: 'alert(122)'
			}
		)
		
		chrome.tabs.sendMessage(#id, {
				type: 'eval',
				options: 'alert("'+tab.title+'")'
			}
		)
		// chrome.tabs.remove(tab.id)
	},1000*11)
 }   
);
	*/})
	alert(B.gtabid)
	sc=sc.replace('#url',url).replace('#id',B.gtabid).replace('#id',B.gtabid)
	// U.log(sc)
	B.eval(sc)
}
B.getTabId=function(){
	B.eval("sender.tab.id")
}

// t()

// print()
// alert(233333)
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
	clearOut()
	print(r)
	B.create(re[0])
	
	
}
setTimeout(function(){
	sPage()
},1)


// U.log(U.str(B))
