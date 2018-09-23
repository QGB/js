is= document.querySelectorAll(' input[type="image"]')

for(i of is){
	i.outerHTML='<img src={}></img>'.replace('{}',i.getAttribute('data-src'))
}

