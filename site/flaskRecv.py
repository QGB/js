#coding=utf8
gsName='qgb.facebook.com'
import sys;'qgb.U' in sys.modules or sys.path.append('G:/QGB/babun/cygwin/lib/python2.7/');from qgb import *;py=U.py
sys.path.pop()
import IPython;
gdata=[]

from flask import Flask,request,make_response,json
app = Flask(__name__)

@app.route('/t', methods=['GET'] )
def test():
	global gdata
	gdata.append(U.stime())
	return '%s' % len(gdata)
	
@app.route('/qgb.js', methods=['GET'] )
def qgb_js():
	r=make_response(F.read(r'G:\QGB\babun\cygwin\home\qgb\js\qgb.js' ) )
	r.headers['Access-Control-Allow-Origin'] = '*'
	r.headers['Content-Type'] = 'text/plain;charset=utf-8'
	return r
	
@app.route('/x', methods=['GET'] )
def exit():
	U.exit()
	
@app.route('/', methods=['POST','GET'] )
def on_receive():
	global gdata
	U.log(request)
	U.log(request.get_data())
	if request.method=='GET':
		return make_response(U.stime()+'\n===============\n'+U.pformat(U.threads()  )   )
	#IPython.embed()
	
	r=json.loads(request.get_data())
	if py.islist(r) and [i for i in r if py.islist(i)]:# 自动 去除外层多余list
		gdata.extend(r)
	else:
		gdata.append(r)
	
	r=make_response('%s\n%s   %s'%(U.stime(),len(r),type(r)   ) )
	r.headers['Access-Control-Allow-Origin'] = '*'
	r.headers['Content-Type'] = 'text/plain;charset=utf-8'
	return r
	
	
# U.set(value=__file__,name='file')
# U.set(name='file',value='facebook')
def autoSave():
	global gdata,gsName
	while True:
		
		F.dill_dump(obj=gdata,file='{}_{}'.format(gsName,U.sdate() )    )
		U.log('[%s] saved!!!!'% len(gdata))
		U.sleep(30)
		
gt=U.thread(target=autoSave)
gt.start()
U.log(gt)

key=r'G:\QGB\software\xxnet\data\gae_proxy\Certkey.pem'
crt=r'G:\QGB\software\xxnet\data\gae_proxy\certs\%s.crt'%gsName
ka={'port':443,'host':'0.0.0.0','ssl_context':(crt,key)}
if __name__=='__main__':
	# U.thread(target=IPython.embed).start() 
	app.run(**ka,debug=0)