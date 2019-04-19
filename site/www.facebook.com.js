//U.int()  前端只负责数据【分类】抓取，数据处理由py来做更简单。。
ds=document.querySelectorAll('div._4-u2')
ts=['gsName="'+window.location.host+'"']
for(i of ds){
	// i.getAttribute('data-time')  这是页面动态上显示时间
	// i.querySelector('._5ptz').getAttribute('data-utime')// what this??
	try{
		time=i.getAttribute('data-time')
		text=i.textContent
		if(text &&　time){
			ts.push([text,time])
			i.innerHTML=''
		}
	}catch(e){
		console.log('Error :',i,e)
	}
	
}

N.postJSON('https://qgb.facebook.com/',ts)

document.title= ts.length+' ' +new Date()
i.innerHTML='<div>' +document.title+ '</div>'