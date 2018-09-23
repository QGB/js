is= document.querySelectorAll('p[align="center"] > input')

for(i of is){
	i.outerHTML='<img src={}></img>'.replace('{}',i.getAttribute('data-src'))
}

