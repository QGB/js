U={};T={};N={}
U._TEXT=function(wrap) {return wrap.toString().match(/\/\*\s([\s\S]*)\s\*\//)[1];}
U.islist=U.isList=U.isArray=Array.isArray
U.isint=U.isInt=   Number.isInteger
U.isnum=U.isNum=   function(a){return typeof a==='number'}
U.istr=U.isStr=    function(a){return typeof a==='string'}
U.isbool=U.isBool= function(a){return typeof a==='boolean'}
U.log=function(){
	if(arguments.length)a=arguments
	else a=['U.log',new Date()]
	console.log(...a)
}
U.str=function(a){
	if(! (typeof a==='string') ){
		try{
			a=JSON.stringify(a)
		}catch(e){
			a=String(a)
		}
	}
	return a
}
U.getValues=U.dictValues=function(a){
	r=[]
	for(i in a)r.push(a[i])
	return r
}
U.getKeys=function(a){
	r=[]
	for(i in a)r.push(i)
	return r
}
U.list=U.toList=function(a){
	r=[]
	for(i of a)r.push(i)
	return r
}
U.slice=function(a,stop){
	len=arguments.length
	step=1//#TODO
	if(len===2)start=0
	if(len===3){
		start=arguments[1]
		stop=arguments[2]
	}
	i=0
	//if(!U.isList(a)) //TODO
	r=[]
	for(v of a){
	    //U.log(start,i,stop)
		if(start<=i && i<stop)r.push(v)
		i+=1
	}
	return r
}

T.strip=T.trim=function(a){
	return a.replace(/^\s+|\s+$/g, '')
}
T.replaceAll=function(a,old,anew){
	if(!old || !anew)return a
	while(a.includes(old)){
		a=a.replace(old,anew)
	}
	return a
}
T.sub=function (a,start,end){//#TODO start lists
	startLen=start.length
	start=a.indexOf(start)
	if(start===-1)return ''
	else start+=startLen
	
	if(end){
		if(U.isArray(end)){
			for(i of end){
				i=U.str(i)
				if(i){
					i=a.indexOf(i,start)
					if(i===-1)continue
					else{
						end=i
						break
					}
				}else{
					if(i===''){
						end=a.length
						break
					}
					else continue
				}
			}
		}else if(U.istr(end)){
			end=a.indexOf(end,start)
			if(end===-1)return ''
		}
// 		else if(U.isInt(end)){}
		else {
			throw 'end must be list or str'
		}
	}else   end=a.length
	end=end-start
	return a.substr(start,end)// substr(start,length)
}


N.http=function (url,m='get',onload=null){/*
if m not 'get'  will post(data=m) 
in snippets console.log useless???   Console > Hide all 2 Default 
*/
	var xhr = new XMLHttpRequest();
	// console.log('UNSENT', xhr.status);// UNSENT 0

	xhr.open(m, url, true);
	// console.log('OPENED', xhr.status);//        0

	xhr.onprogress = function () {
	  console.log('LOADING', xhr.status);
	};
	if(onload){
		xhr.onload = onload
	}else{
		xhr.onload = function () {
		  console.log('DONE', xhr.status);
		};
	}
	
	if(m==='get')
		xhr.send(null);	
	else xhr.send(m);
		
	return out(xhr)

}

if(window){
	window.U=U
	window.T=T
	window.N=N
	qgb='from qgb.js snippet'
	console.log(qgb)
	window.qgb=qgb
}
//////////////////////////////

function sleep(ms) {return new Promise(resolve => setTimeout(resolve, ms) )  }
giout=0
// window.glout=window.glout||[]
function out(a){
	giout+=1
	window["_"+giout]=a
	if(window['_']){
		if(! window._===window["_"+(giout-1)]){
			if(  giout===1)	return '_ 已被其他地方使用 使用 _'+giout 
			else return a
		}
	} 
	window._=a
	return a
}


async function test(){

// 	alert(0)
	console.log(new Date())
// 	sleep(999)
	console.log(new Date())
}


//alert(gs)

gsh2c='https://github.com/niklasvh/html2canvas/releases/download/v1.0.0-alpha.12/html2canvas.js'