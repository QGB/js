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

@app.route('/tabs',methods=['POST','GET'])
def chrome_tabs():
	sa='<a href={}>{}</a>  <br>'
	r=''
	max=py.max([len(i['title'].encode('utf-8')) for i in ts)
	for i in ts:
		u=i['url']
		t=i['title']
		il=i['title'].encode('utf-8')
		il=py.len(il)
		r+=sa.format(u,t+'&nbsp'*(max+5-il)+u)

	if request.method =='GET':
		return make_response(U.stime()+'\n===============\n'+U.pformat(U.threads()  )   )
	#'Access-Control-Request-Headers': '_host',	#OPTIONS 预检请求
	#'-Host': '0731.mfyq.com.cn',               # POST
	if request.method =='PUT':
		IPython.embed()
	if request.method =='POST':
		# U.log(request.headers)
		if '-Host' in request.headers:
			gsName=request.headers['-Host']
				
	r=json_loads(request)

app.static_folder='..'
# @app.route('/<f>', methods=['GET'] )
@app.errorhandler(404)
def staticFile(e):
	f=request.path[1:]
	p=F.Path(__file__).absolute().parent.parent
	p=p.joinpath(f)
	if p.exists():
		rb=p.read_bytes()
		if globals()['gbt'] and not 'qgb.js' in f:
			rb=T.detectAndDecode(rb)
			rb=rb.replace('var ','')
			rb=rb.encode('utf-8')
		r=make_response(rb)
		r.headers['Content-Type'] = 'text/plain;charset='+T.detect(rb,0.8,'utf-8')
	else:
		r=make_response(str(p)+'\n\n\t\t\t not found!',404)
		r.headers['Content-Type'] = 'text/plain'
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

gbt=False
@app.route('/t<ai>', methods=['GET'] )
def test(ai):
	ai=U.int(ai)
	if ai==0:
		globals()['gbt']=False
	elif ai==1:
		globals()['gbt']=True
	r=make_response(U.pformat(globals())+'\n%s' % len(gdata)  )
	r.headers['Content-Type'] = 'text/plain'
	return r	
	
@app.route('/x', methods=['GET'] )
def exit():
	save()
	U.exit()
	
@app.route('/', methods=['POST','GET','OPTIONS'] )
def on_receive():
	global gdata,gsName,giAutoSave
	# F.dill_dump(request,file='request')
	# U.log([233333333,request])
	# U.log(request.get_data())
	
	if request.method =='GET':
		IPython.embed()
		return make_response(U.stime()+'\n===============\n'+U.pformat(U.threads()  )   )
	#'Access-Control-Request-Headers': '_host',	#OPTIONS 预检请求
	#'-Host': '0731.mfyq.com.cn',               # POST
	if request.method =='PUT':
		IPython.embed()
	if request.method =='POST':
		# U.log(request.headers)
		if '-Host' in request.headers:
			gsName=request.headers['-Host']
				
	r=json_loads(request)
	if py.islist(r) and [i for i in r if py.islist(i)]:# 自动 去除外层多余list
		for i in r:
			if i not in gdata:
				gdata.append(i)
				import es_0731_mfyq
				# es_0731_mfyq.insert([r])
	else:
		if r and r not in gdata :gdata.append(r)
	
	r=make_response('%s\n%s   %s'%(U.stime(),len(r),type(r)   ) )
	r.headers['Access-Control-Allow-Origin'] = '*'
	r.headers['Access-Control-Allow-Methods'] = '*'
	r.headers['Access-Control-Allow-Headers'] = '*'
	r.headers['Content-Type'] = 'text/plain;charset=utf-8'
	# U.log(r.headers)
	return r
	
	
# U.set(value=__file__,name='file')
# U.set(name='file',value='facebook')
def save():
	global gdata
	gdata=U.unique(gdata)
	return F.dill_dump(obj=gdata,file='{}_{}_{}'.format(gsName,U.sdate(),len(gdata) )    )
def autoSave():
	global gdata,gsName
	while True:
		U.log('[%s] saved!!!!'% save() )
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

ka={'port':port,'host':host}
if port==443:
	ka['ssl_context']=(crt,key)

if __name__=='__main__':
	# U.thread(target=IPython.embed).start() 
	app.run(**ka,debug=1,threaded=True)