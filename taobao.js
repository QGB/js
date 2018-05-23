print(window['qgb']+' > taobao.js')
loadQGB()
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
gsv=U.getValues(gs)

function t(){
	if(gtaobao_pause)return
	print([,new Date()])
	setTimeout(function(){
		t()
		
	},999)
	
}

// t()

// print()
// alert(233333)

function onePage(){
	items=qs(gsv[0])
	len=items.length
	print(len)
	for(i of items){
		print(i)
		break
	}
}