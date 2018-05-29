function qtext(a){
	try{ return document.querySelector(a).innerText
	}catch(e){return ''}
}
r=[];
r.push(document.location.href);
if(r[0].includes('item.taobao.com/')){
	r.push(qtext('h3.tb-main-title'));
	r.push(qtext('.tb-promo-price > .tb-rmb-num'));
	r.push(qtext('#J_StrPrice > .tb-rmb-num'));
	r.push(qtext('#J_PromoType'));
	r.push(qtext('#J_WlServiceTitle'));
	r.push(qtext('#J_RateCounter'));
	r.push(qtext('#J_SellCounter'));
	r.push(qtext('.J_FavCount'));
	x=new XMLHttpRequest();
	x.open('POST','https://lk.lk:1122/Item');
	x.send(JSON.stringify(r));
}
