rs=document.querySelectorAll('.search-subdomains-column  > span > span.inlineAction-content > a')
for(i of  rs){
	r.push(i.text)
}
console.log(r.length)