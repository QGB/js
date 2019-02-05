#coding=utf8
giAutoSave=99930
gsName='qgb.facebook.com'
import sys;'qgb.U' in sys.modules or sys.path.append('G:/QGB/babun/cygwin/lib/python2.7/');from qgb import *;py=U.py
sys.path.pop()
import IPython;
gdata=[]

def json_loads(request):
	import json
	try:return json.loads(request.get_data())
	except Exception as e:return py.No(e)
	
from flask import Flask,request,make_response,json
app = Flask(__name__)
app.static_folder='..'
@app.route('/<f>', methods=['GET'] )
def staticFile(f):
	p=F.Path(__file__).absolute().parent.parent
	p=p.joinpath(f)
	if p.exists():
		rb=p.read_bytes()
		r=make_response(rb)
		r.headers['Content-Type'] = 'text/plain;charset='+T.detect(rb,0.8,'utf-8')
	else:
		r=make_response(str(p)+'not found!',404)
	r.headers['Access-Control-Allow-Origin'] = '*'
	return r
	# U.ipyEmbed()()
	# return app.send_static_file(f)
# @app.route('/qgb.js', methods=['GET'] )
# def qgb_js():
	# r=make_response(F.read(r'G:\QGB\babun\cygwin\home\qgb\js\qgb.js' ) )
	# r.headers['Access-Control-Allow-Origin'] = '*'
	# r.headers['Content-Type'] = 'text/plain;charset=utf-8'
	# return r

@app.route('/qs',methods=['POST','GET'])
def qs():
	U.log(request.get_data())
	return '2333'

@app.route('/t', methods=['GET'] )
def test():
	global gdata
	gdata.append(U.stime())
	return '%s' % len(gdata)
	
	
@app.route('/x', methods=['GET'] )
def exit():
	U.exit()
	
@app.route('/', methods=['POST','GET','OPTIONS'] )
def on_receive():
	global gdata,gsName,giAutoSave
	# F.dill_dump(request,file='request')
	# U.log([233333333,request])
	# U.log(request.get_data())
	
	if request.method=='GET':
		IPython.embed()
		return make_response(U.stime()+'\n===============\n'+U.pformat(U.threads()  )   )
		
	r=json_loads(request)
	if py.islist(r) and [i for i in r if py.islist(i)]:# 自动 去除外层多余list
		gdata.extend(r)
	else:
		if r:gdata.append(r)
	
	r=make_response('%s\n%s   %s'%(U.stime(),len(r),type(r)   ) )
	r.headers['Access-Control-Allow-Origin'] = '*'
	r.headers['Access-Control-Allow-Headers'] = '*'
	r.headers['Content-Type'] = 'text/plain;charset=utf-8'
	# U.log(r.headers)
	return r
	
	
# U.set(value=__file__,name='file')
# U.set(name='file',value='facebook')
def autoSave():
	global gdata,gsName
	while True:
		
		F.dill_dump(obj=gdata,file='{}_{}'.format(gsName,U.sdate() )    )
		U.log('[%s] saved!!!!'% len(gdata))
		U.sleep(globals()['giAutoSave'])
		
gt=U.thread(target=autoSave)
gt.start()
U.log(gt)

key=r'G:\QGB\software\xxnet\data\gae_proxy\Certkey.pem'
crt=r'G:\QGB\software\xxnet\data\gae_proxy\certs\%s.crt'%gsName

port=1212;host='0.0.0.0'
if len(sys.argv)>1:
	aport=sys.argv[1]
	if ':' in aport:
		host=T.sub(aport,'',':')
		aport=T.sub(aport,':','')
	port=U.int(aport) or port

ka={'port':443,'host':'0.0.0.0','ssl_context':(crt,key)}
ka={'port':port,'host':host}

if __name__=='__main__':
	# U.thread(target=IPython.embed).start() 
	app.run(**ka,debug=1,threaded=True)