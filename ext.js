(function(){
var E={}

E.getAllTabs=async function (){
	var ts=await new Promise(function (resolve, reject) {
		chrome.tabs.query({},function(tabs){
			resolve(tabs)
		})
    });
	
	return ts
}



E.test=async function (){

// 	alert(0)
	console.log(new Date())
// 	sleep(999)
	console.log(qgbext,new Date())
}

return function(){
	if(window){
		window.E=E
		var ext='loaded ext.js '+new Date()
		console.log(ext)
		window.qgbext=ext
	}
}



 }())  ()//end of closure
 
if(window){
	window.E.eval=window.E.weval=function(a){
		try{
			return window.eval(a)
		}catch(e){
			return e
		}
	}
}