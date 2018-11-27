#coding=utf8
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
	if not request or 1:
		return make_response(U.stime()+'\n===============\n'+U.pformat(U.threads()  )   )

	#IPython.embed()
	
	t=request.path[1:]
	
	r=json.loads(request.get_data())
	gdata.append(r)
	# if t.startswith('Item'):gdb.merge(Item(r))
	# else:
		# for i in r:gdb.merge(globals()[t](i))
	# try:
		# gdb.commit()
	# except Exception as e:
		# py.traceback(e)
		# gdb.rollback()
	# response = make_response(pformat(request.headers)+'\n===============\n'+pformat(request.get_data())  )
	return make_response('%s\n%s   %s'%(U.stime(),len(r),type(r)   ) )

U.set(value=__file__,name='file')
def autoSave():
	global gdata
	while True:
		
		F.dill_dump(obj=gdata,file=U.sdate()+T.fileName(U.get('file')))
		U.log('[%s] saved!!!!'% len(gdata))
		U.sleep(30)
		
gt=U.thread(target=autoSave)
gt.start()
U.log(gt)

key=r'G:\QGB\software\xxnet\data\gae_proxy\Certkey.pem'
crt=r'G:\QGB\babun\cygwin\home\qgb\chromExt\tabList\lk.lk.crt'
ka={'port':443,'host':'0.0.0.0','ssl_context':(crt,key)}
if __name__=='__main__':
	# U.thread(target=IPython.embed).start() 
	app.run(**ka,debug=0)