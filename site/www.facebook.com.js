ds=document.querySelectorAll('div._4-u2')
ts=[]
for(i of ds){
	try{
		t=i.querySelector('._5ptz').getAttribute('data-time')
		ts.push([i.textContent,t])
	}catch(e){
		console.log('Error :',i,e)
	}
	
}
N.postJSON('https://qgb.facebook.com/',ts)

document.title= ts.length+' ' +new Date()
