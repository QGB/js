U={};T={};N={}
U.isList=U.isArray=Array.isArray
U.isint=U.isInt=   Number.isInteger
U.isnum=U.isNum=   function(a){return typeof a==='number'}
U.istr=U.isStr=    function(a){return typeof a==='string'}
U.isbool=U.isBool= function(a){return typeof a==='boolean'}

U.str=String

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
	console.log('UNSENT', xhr.status);

	xhr.open(m, url, true);
	console.log('OPENED', xhr.status);

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
window.glout=window.glout||[]
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