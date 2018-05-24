loadQGB(false)
print(window['qgb']+' > taobao.js')
gs={
item     : 'div.item'     ,//4*11=44
img      : 'a.pic-link'   ,//1
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

// t()

// print()
// alert(233333)

function sPage(){
	items=qs(gsv[0])
	len=items.length
	print(len)
	for(e of items){
		rd={}
		for(j of U.slice(gsv,1,8)){
			
			rd[j]=e.querySelectorAll(j).length
		}
		print(rd)
		break
	}
}
sPage()


