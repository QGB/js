from qgb import *
from qgb import py

#U.repl()
gm=U.getModulesByFile( 'flaskRecv.py')[0][1]
local_gdata=gm.gdata  #globals()['gdata']
gd={('新浪博客',):'博客', ('百度贴吧',):'论坛' ,('新浪微博',):'新浪微博',
('微信',):'微信'
}
def get_classify(a):
	for i in gd:
		if a in i:return gd[i]
	return '网站'

def insert(data):
	from elasticsearch import Elasticsearch
	import elasticsearch.helpers 
	
	import logging
	es_log=logging.getLogger('elasticsearch')
	es_log.setLevel(logging.CRITICAL)
	
	actions=[]
	fs='img,title,sensitive,is_origin,summary,psrc,keyword,xyqy,hy,article_url,article_similar_count,article_origin,stime,time_index,time_publish'.split(',')
	for i in data:
		img,title,sensitive,is_origin,summary,psrc,keyword,xyqy,hy,article_url,article_similar_count,article_origin,stime,time_index,time_publish=i
		source= {
		# '@timestamp': '2019-01-28T11:49:36.186Z',
		  # '@version': '1',
		  # 'cctv_msgclass_id': 2,
		  'column_classify': get_classify(article_origin),
		'channel': article_origin,
		  #'classify': '晚间新闻',  #l爬虫监测
		  'content':summary,
		  'datetime': time_publish,
		  #'nid': 54215,
		  'source': xyqy,
		  #'time': '2018-12-22',# 废弃
		  'title': title,
		  #'type': 'jdbc',
		  'url': article_url,
		 
		  
		  }
		# VARS=vars()
		# for field in fs:
			# source[field]=VARS[field]
		
		rec=get_recognized(i)
		if rec:
			t=source['title'].encode('utf-8')
			
			# source['title']=source['title']+'&nbsp'*(200-len(t)  ) +'图片已识别'
			source['is_recognized']=True
			source['content']=source['content']+rec
		
		actions.append(
			{
				'_op_type': 'index',
				'_index': "mifeng_search",  
				'_type': "doc",
				'_source': source
			}
		)
	# return actions
	# print('#'*55, len(data),  U.ct(gd))
	es=Elasticsearch(['http://sp.mfyq.com.cn:9200'])
	return elasticsearch.helpers.bulk( es, actions )  


def sogou_ocr(url):
	# raise Exception()
	from requests import get, post
	file=get(url).content if url.startswith('http') else open(url,'rb')
	json=post('https://ocr.shouji.sogou.com/v2/ocr/json',files={'pic':('________.jpg', file)}).json()
	
	return json
	
def get_recognized(a):
	st=''
	if not py.isdict(a[5]):return py.No('a[5] is not dict',a)
	for i in a[5]:
		d=a[5][i]
		if d['success']:
			if not st :
				st='<br>'+'='*110
			st+='<br><img src="{}" ><br>'.format(i)
			for line in d['result']:
				st+=line['content']
	
	return st

gsPath=r'E:/!weibo_img/'
def download(url):
	from requests import get
	file=T.subLast(url,'/')
	with open(gsPath+file,'wb') as f:
		f.write(get(url).content )
		