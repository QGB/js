ds=document.querySelectorAll('div._4-u2')
ts=[]
for(i of ds){
	// i.getAttribute('data-time')  这是页面动态上显示时间
	// i.querySelector('._5ptz').getAttribute('data-utime')// what this??
	try{
		t=i.getAttribute('data-time')
		if(t){
			ts.push([i.textContent,t])
			i.innerHTML=''
		}
	}catch(e){
		console.log('Error :',i,e)
	}
	
}
N.postJSON('https://qgb.facebook.com/',ts)

document.title= ts.length+' ' +new Date()
