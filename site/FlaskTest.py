#coding=utf8
import sys;'qgb.U' in sys.modules or sys.path.append('G:/QGB/babun/cygwin/lib/python2.7/');from qgb import *;py=U.py
sys.path.pop()

from flask import Flask,request,make_response,json
app = Flask(__name__)

@app.route('/', methods=['POST','GET'] )
def on_receive():
	'''  在谷歌搜索页面控制台无法发送请求？？？？？？ 一直为 Pending   yandex浏览器
	'''
	
	U.log(request)
	U.log(request.get_data())
	return '2333333'
	
key=r'G:\QGB\software\xxnet\data\gae_proxy\Certkey.pem'
crt=r'G:\QGB\babun\cygwin\home\qgb\chromExt\tabList\lk.lk.crt'
ka={'port':443,'host':'0.0.0.0','ssl_context':(crt,key)}
if __name__=='__main__':
	app.run(**ka,debug=0)