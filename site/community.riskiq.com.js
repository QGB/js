rs=document.querySelectorAll('.search-subdomains-column  > span > span.inlineAction-content > a')
for(i of  rs){
	subdomains.push(i.text)
}
console.log(subdomains.length)