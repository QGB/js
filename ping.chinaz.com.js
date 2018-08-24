ips= document.querySelectorAll('div[name=ip]')
r=[]
for(i of ips){
	r.push(i.textContent)
}

N.postJSON('https://envcqb-8080-gcwmrj.web.ide.live/data',r)
