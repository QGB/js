print(window['qgb']+' > taobao.js')
gs={
item     : 'div.item'     ,
img      : 'a.pic-link'   ,
price    : 'div.price.'   ,
ship     : 'div.ship'     ,
deal     : 'div.deal-cnt' ,
title    : 'div.title'    ,
shop     : 'span.dsrs'    ,
location : 'div.location' ,
icons    : 'ul.icons'     ,
}


function t(){
	if(gtaobao_pause)return
	print([,new Date()])
	setTimeout(function(){
		t()
		
	},999)
	
}

// t()

print(U.getValues(gs))
// alert(233333)

function onePage(){
	items=qs(g)
	
}