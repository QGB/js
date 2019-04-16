function sleep(ms) {return new Promise(resolve => setTimeout(resolve, ms) )  }
async function test(){
    U.log()
    await sleep(9999)  
    U.log()

}
test()