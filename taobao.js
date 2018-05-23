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
	print(new Date())
	setTimeout(function(){
		t()
		
	},999)
	
}

t()

print(gs)
// alert(233333)