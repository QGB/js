U.glog=0
gb=0

function c(){
	
}

function next(){
  ds=document.querySelectorAll('#followlist > li')
  if(ds.length<2){
    console.log('ds empty!!!')
    return      
  }

  last=ds[ds.length - 1];
  r=[]
  for(i of ds){
   r.push(i.outerHTML)  
   if(! (i===last) )
       i.outerHTML=''
  
   
  }

  N.postJSON('http://127.0.0.1:1212/',r)

}



function sleep(ms) {return new Promise(resolve => setTimeout(resolve, ms) )  }
async function loop(){
	while(true){
		next()
		if(gb)break;

		//console.log(new Date())
		await sleep(999)
		
	}
}

//loop()