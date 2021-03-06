(function(){
"use strict"
var U={},T={},N={}

try{
	gs_qgb_base_url=gs_qgb_base_url
}catch(e){
	var gs_qgb_base_url='https://coding.net/u/qgb/p/js/git/raw/master/'
}
U.gs_qgb_base_url='https://coding.net/u/qgb/p/js/git/raw/master/'
// U.gs_qgb_base_url='https://qgb.'+window.location.host+'/'
// U.gs_qgb_base_url='http://192.168.1.111/'
U.gscript=''
function loadScript (script='qgb.js',isPrint=undefined){
	try{
		gs_qgb_base_url=U.gs_qgb_base_url
		if(gs_qgb_base_url.length<4)throw 'gs_qgb_base_url.length<4'
	}catch(e){
		var gs_qgb_base_url='https://coding.net/u/qgb/p/js/git/raw/master/'
	}
	var xhr=new XMLHttpRequest()
	xhr.open('get',gs_qgb_base_url+script)
	xhr.onload=function(){
		U.gscript=this.response
		eval(gscript)
		if(isPrint===undefined) console.log('loaded length  '+this.response.length)
	}
	xhr.send()
	return xhr
}

U.loads=U.loadScript=U.loadQGB=loadScript
// loadQGB()
/////////////////////////////////


U.TXT=U.text=U._TEXT=function(wrap) {return wrap.toString().match(/\/\*\s([\s\S]*)\s\*\//)[1];}
U.islist =U.isList=U.isArray=Array.isArray
U.isint  =U.isInt=   Number.isInteger
U.isnum  =U.isNum=   function(a){return typeof a==='number'}
U.istr   =U.isStr=    function(a){return typeof a==='string'}
U.isbool =U.isBool= function(a){return typeof a==='boolean'}
U.isfunc =U.callable=U.isCallable=U.isFunction=function(a){return a instanceof Function}
U.isdate =U.isDate=function(a){return a instanceof Date}
U.isregex=function(a){return a instanceof RegExp}
U.isDictEmpty=U.isEmptyDict=function(a){
    try{
		return JSON.stringify(a)==='{}'
	}catch(e){
		return false
	}
}
U.isdict =U.isDict=function (a) {
	if(U.isDictEmpty(a))return true
	if(!a)return false
	for(var i in U){
		if(!U.istr(i))continue
		if(!i.startsWith('is') || !T.islower(i))continue
		if(i.includes('dict'))continue
		if(U[i](a))return false
	}
	return true
}
U.isNode=function (o){
  return (
    typeof Node === "object" ? o instanceof Node : 
    o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
  );
}
U.rangeIter=function* (start,stop,step){
  for (var i = start; i < stop; i+=step) yield i;
}
U.range=function(stop){
	var len=arguments.length , start=0,	step=1//#TODO
	// if(len===1)start=0
	if(len===2){
		start=arguments[0]
		stop=arguments[1]
	}
	if(len===3){
		start=arguments[0]
		stop=arguments[1]
		step=arguments[2]
	}
	if(step===0)return []
	return Array.from(U.rangeIter(start,stop,step) );
}

U.giout=0
U.out=function (a){
	U.giout+=1
	window["_"+U.giout]=a
	if(window['_']){
		if(! window._===window["_"+(U.giout-1)]){
			if(  U.giout===1)	return '_ 已被其他地方使用 使用 _'+U.giout 
			else return a
		}
	} 
	window._=a
	return a
}
U.glog=true
U.log=U.logDate=function(){
	if(arguments.length) var a=arguments
	else var a=['U.log',new Date()]
	if(U.glog)console.log(...a)
	return a
}

U.str=function(a){
	if(arguments.length==0)return ''
	if(arguments.length>1){
		var a=U.list(arguments)
		return U.str(a.shift())+','+U.str(...a)
	}
	if(! (typeof a==='string') ){
		try{
			var j=JSON.stringify(a), s=String(a)
			if(j.length>s.length) var a=j
			else                  var a=s
		}catch(e){
			var a=String(a)
		}
	}
	return a
}
U.getValues=U.dictValues=function(a){
	var r=[]
	for(var i in a)r.push(a[i])
	return r
}
U.getKeys=function(a){
	var r=[]
	for(var i in a)r.push(i)
	return r
}
U.list=U.toList=function(a){
	var r=[]
	for(var i of a)r.push(i)
	return r
}
U.slice=function(a,stop){
	var len=arguments.length
	var step=1//#TODO
	if(len===2)
		var start=0
	if(len===3){
		var start=arguments[1]
		stop=arguments[2]
	}
	var i=0,r=[]
	//if(!U.isList(a)) //TODO
	for(v of a){
	    //U.log(start,i,stop)
		if(start<=i && i<stop)r.push(v)
		i+=1
	}
	return r
}
U.ArgumentError='ArgumentError'
U.ArgumentUnsupported=U.ArgumentError +' > ' + 'ArgumentUnsupported'

U.sleep=function (ms) {return new Promise(resolve => setTimeout(resolve, ms) )  }

//////////   T   //////////////////*   direct copy and paste  */
T.str2unicode=function(a){
	if(!U.istr(a)) throw U.ArgumentError
	var str =''; 
	for(var i=0;i<a.length;i++){
	  str+="\\u"+a.charCodeAt(i).toString(16);
	}
	return str;
}
T.unicode2str=function(a){
	
}	
T.isupper=T.isUpper=function(a){
	return a===a.toUpperCase()
}
T.islower=T.isLower=function(a){
	return a===a.toLowerCase()
}
T.strip=T.trim=function(a){
	return a.replace(/^\s+|\s+$/g, '')
}
T.replaceAll=function(a,old,anew){
	if(!old || anew.includes(old) )return a
	while(a.includes(old)){
		a=a.replace(old,anew)
	}
	return a
}
T.sub=function (a,start,end){//#TODO start lists
	var startLen=start.length
	start=a.indexOf(start)
	if(start===-1)return ''
	else start+=startLen
	
	if(end){
		if(U.isArray(end)){
			for(var i of end){
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
T.svgText_html_style="background:url('data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' version=\'1.1\' width=\'30px\' height=\'30px\'>   <text x=\'0\' y=\'12\' style=\'fill:green;\' font-size=\'12\'>QGB</text></svg>')"
T.svgText_js_style="url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='30px' height='30px'>   <text x='0' y='12' style='fill:green;' font-size='12'>QGB</text></svg>\")"
/////// N /////
// var 
// N.setHeader=function(xhr,header){
	// x=new XMLHttpRequest
// }

N.postJSON_qgb_host=function(data,url='/'){
	if(!url || url==='/')url='/'
	url='http://qgb.'+window.location.host+url
	var header={'_host':window.location.host}
	return N.postJSON(url,data,header)
}

N.postJSON=function(url,data,header={}){
	if(!U.istr(data))data=JSON.stringify(data)
	return N.http(url,data,null,{'header':header})
}
N.loadJQ=N.loadJQuery=function(	){
	return N.httpEval('https://coding.net/u/qgb/p/js/git/raw/master/jquery-1.8.1.js')
}
N.httpEval=N.httpeval=function(url){
	return N.http(url,'get',function(){
		eval(this.response)
		console.log('N.httpEval',url)
	})
}
N.http=function (url,m='get',onload=null,a={}){/*
if m not 'get'  will post(data=m) 
in snippets console.log useless???   Console > Hide all 2 Default 
*/
	var alog=true,	header={}
	if(onload && U.isDict(onload)){
		if(U.isDictEmpty(a))a=onload
		else throw [onload,a]
	}
	if(U.isBool(a))alog=a
	else{
		if(!U.isDict(a))throw 'Need args dict'
		if('alog' in a)alog=a.alog
		if('header' in a)header=a.header
	}
	var xhr = new XMLHttpRequest();
	// console.log('UNSENT', xhr.status);// UNSENT 0
	if(m==='get')xhr.open(m, url, true);
	else		 xhr.open('POST', url, true);
	
	for(var i in header){
		xhr.setRequestHeader(i,header[i])
	}
	// console.log('OPENED', xhr.status);//        0

	xhr.onprogress = function () {
	 if(alog) U.log('LOADING', xhr.status);
	};
	if(onload){
		xhr.onload = onload
	}else{
		xhr.onload = function () {
		  if(alog) U.log('DONE', xhr.status);
		};
	}
	
	xhr.onreadystatechange = function () {
	  // if(alog)  U.log('onreadystatechange', xhr.status,xhr.DONE);
	}
		
	if(m==='get')
		xhr.send(null);	
	else xhr.send(m);
			


	return U.out(xhr)
}


N.get=function (url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        // xhr.responseType = 'document';
        xhr.onload = function () {
            if (xhr.status == 200) {
                resolve(xhr.response);
            } else {
                reject(xhr.status);
            }
        };
        xhr.send();
    });
}
//////////////////////////////

function sleep(ms) {return new Promise(resolve => setTimeout(resolve, ms) )  }
async function test(){

// 	alert(0)
	console.log(new Date())
// 	sleep(999)
	console.log(new Date())
}
var gsh2c='https://github.com/niklasvh/html2canvas/releases/download/v1.0.0-alpha.12/html2canvas.js'


return function(){
	if(window){
		window.U=U
		window.T=T
		window.N=N
		var qgb='loaded qgb.js '+new Date()
		console.log(qgb)
		window.qgb=qgb
	}
}



 }())  ()//end of closure
 
if(window){
	window.U.eval=window.U.weval=function(a){
		try{
			return window.eval(a)
		}catch(e){
			return e
		}
	}
}