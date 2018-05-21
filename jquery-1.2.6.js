/*
* jQuery 1.2.6 - New Wave Javascript
*
* Copyright (c) 2008 John Resig (jquery.com)
* Dual licensed under the MIT (MIT-LICENSE.txt)
* and GPL (GPL-LICENSE.txt) licenses.
*
* $Date: 2008-05-24 14:22:17 -0400 (Sat, 24 May 2008) $
* $Rev: 5685 $
*/
/*
*整个jQuery代码都定义在一个自运行(定义完成之后马上运行)的匿名函数的内部:
* (function(){
*
* //jQuery code runs here
*
* })();
*
* 这样, 这个匿名函数所形成的闭包会保护jQuery的代码,避免了匿名函数内部的jQuery代码与外部之间发生冲突(如使用了相同的变量名).
* 另外, 函数自运行也保证了jQuery在能在第一时间得到初始化.
*/
(function(){
/*
* 写下面两行代码，是出于这样的考虑：
*在多库共存的环境中，很可能会与别人的库使用相同的关键字，那就先把人家的jQuery、$(如果真的有人用的话)保存下来，
*然后再换上自己的。需要的时候再把自己的jQuery,$关键字卸掉，恢复人家的代码对这个两个关键字的使用权.调用jQuery.noConflict便可恢复.
* 恢复的详细内容, 请参考jQuery.noConflict的中文注释.
*/
// Map over jQuery in case of overwrite
// 保存jQuery的关键字, 免得被重写后没法恢复.
var _jQuery = window.jQuery,
// Map over the $ in case of overwrite
// 保存$的关键字, 免得被重写后没法恢复.
_$ = window.$;
/* 当前作用域内(也就是这个自运行的匿名函数所形成的闭包内)、全局作用域内中的jQuery和$都是注释下面的这个函数的引用.
* 而这个函数实际上是调用jQuery.fn.init来构造一个jQuery对象.
* 使用jQuery的人可能会奇怪:为什么我直接使用$('#someId')就能选择到我要的对象? 怎么$就可以用啦?$到底是什么意思? 这里的代码就能给出一点答案:
* 原来$不过是一个jQuery构造函数的引用. 使用$()就是调用了下面这个函数.
*/
/**
* jQuery的构造函数.通过selector选择器构造并返回一个jQuery对象.
* @param {string} selector
* @param {Object} context
*/
var jQuery = window.jQuery = window.$ = function( selector, context ){
// The jQuery object is actually just the init constructor'enhanced'
/*
* 实际上,jQuery.fn.init才是jQuery真正的构造函数.这里就是jQuery美妙世界的入口.
*/
return new jQuery.fn.init( selector, context );
};
// A simple way to check for HTML strings or ID strings
// (both of which we optimize for)
/* 翻译:一个检测HTML字符串和ID字符串的简单方法.
* 说明:
* 以下是一个正则表达式,意在快速地检测字符串是不是HTML string or IDstring
*/
var quickExpr = /^[^<]*(<(.|\s)+>)[^>]*$|^#(\w+)$/,
// Is it a simple selector
//isSimple是一个简单选择器的正则表达式.简单是说选择器字符串里面只有一个选择器,如:
// '#eleID'就是一个简单的选择器,而:
// '#eleID .address'则是一个复杂(complex)选择器
isSimple = /^.[^:#\[\.]*$/,
// Will speed up references to undefined, and allows munging its name.
undefined;
/*
* 我要对以上这个undefined进行解释:
* ECMAScriptv3的规范里面规定了名为undefined的全局变量,它的初始值就是undefined.
*但是我们并不确定世界上的任何一个JavaScript实现都有全局变量undefined,那么这时我们
* 只需要自己声明一个但不给它赋值即可,它的值就是undefined.
*
* 上面那个undefined就是声明了这样的一个变量.
*
*/
/*
* 下面的对通过jQuery.prototype的定义来规划jQuery对象的主要行为.所有通过构造函数(如jQuery,$)new出来的jQuery对象都继承来自jQuery.prototype
* 的属性和方法. 注意jQuery.prototype使用了另外一个别名:jQuery.fn.在jQuery的代码当中, 使用jQuery.fn来代替jQuery.prototype, 其实是一样的.
*/
jQuery.fn = jQuery.prototype = {
/**
* jQuery的初始化函数. 每次new 一个jQuery对象的时候,总是首先由这个函数实现初始化.
*初始化的主要工作是根据选择器selector选择到匹配的元素,并将这些元素放入一个jQuery称之为matched element set的集合当中, 最后返回这个jQuery对象.
* 注意, jQuery对象并没有实实在在的一个"matched elementset"属性. 假设我们的新定义了一个jQuery对象:
* var jq = new jQuery('a');
*那么页面上的所有a标签元素就会以jq[0],jq[1],jq[2]...,jq[n]的形式存储到jQuery对象(即jq)当中. jQuery把这些匹配到的元素在逻辑上看作是一个
* 集合, 并称之为"matched element set".
*
* @param {string} selector - 选择器.以这个字符串指定需要选择的元素.
* @param {Object} context - 选择器的上下文.即指明要在一个什么范围之内选择seletor所指定的元素.
*/
init: function( selector, context ) {
// Make sure that a selection was provided
// 如果没有传入selector,那么docuemnt就会成为默认的selector.没有selector就用document来"凑数".让"matched element set"里面至少要
// 有一个元素.
selector = selector || document;
/*
* 下面要对selecotr对象进行进行分类的检查,不同类型,不同的处理.
* selector可能的类型如下:
* (1) 直接的一个Dom元素类型
* (2) 数组类型
* (3) 函数(function)类型
* (4) jQuery或者其他的类数组对象类型
* (5) string类型
* a) 没有context的情况
* b) 有context的情况
*/
/* 好了, 现在就分情况进行处理 */
// Handle $(DOMElement)
// 是不是(1) "直接的一个Dom元素类型" 啊?如果是,就将这个Dom元素直接放入jQuery对象的[0]属性中,设置匹配元素集合的大小为1, 返回
if ( selector.nodeType ) {//是Dom元素就应该有一个nodeType
this[0] = selector;
this.length = 1;
return this;
}
// Handle HTML strings
// 是不是类型(5) - string类型?
if ( typeof selector == "string" ) {
// Are we dealing with HTML string or an ID?
// 翻译:我们是否正在处理HTML或者ID字符串?
var match = quickExpr.exec( selector );
/*
* 通过match变量来将string类型的情况再区分成两类:
* (1) 是HTML字符串或者ID字符串的情况
* (2) 其他,如'.className', 'tagName'之类.
*/
// Verify a match, and that no context was specified for#id
// 核对这个匹配, 还有那些没有为#id提供context的情况.
if ( match && (match[1] || !context) ) {
// HANDLE: $(html) -> $(array)
// 如果传入的是HTML:
//那么调用jQuery.clean将字符串转化成真正的DOM元素然后装在一个数组里面,最后返回给selector
// 这样selector最后将变成了(2)类型.
if ( match[1] )
selector = jQuery.clean( [ match[1] ], context );//clean的作用就是将传入的HTML string转化成为DOM//元素, 并用一个数组装着,最后返回.
// HANDLE: $("#id")
// 如果传入的是#id
else {
/* 如果是#id,那就调用JavaScript原生的getElementById
*有些jQuery的性能提升方法当中建议尽量使用id选择符, 说这样比较高效.从这里可以看到, 是有道理的.
*/
var elem = document.getElementById( match[3] );
// Make sure an element was located
// 翻译: 确保一个元素被定位. 即能够get到一个元素
if ( elem ){
/*
* 原本可以直接返回结果了,但是由于IE和Opera有一个小小的Bug, 因此要处理一下再返回.
*/
// Handle the case where IE and Opera returnitems
// by name instead of ID
// COMP: 翻译:处理IE和Opera会用name代替ID返回元素的问题
if ( elem.id != match[3] )//jQuery()将会返回一个用document生成的jQuery对象
return jQuery().find( selector );
// Otherwise, we inject the element directlyinto the jQuery object
// 好了,我们将选择到的元素注入到jQuery对象的里, 最后返回.
return jQuery( elem );
}
// 如果代码能运行到这里,说明match[3]并不能让getElementById选择到任何元素,把selector设置成[], 让后面的代码收拾手尾
selector = [];
}
}
// HANDLE: $(expr, [context])
// (which is just equivalent to: $(content).find(expr)
// 翻译: 处理 $(expr,[context])
// (这跟$(content).find(expr)是一样的)
/*如果传入的selector不是HTML字符串或者ID字符串(如'.class','div'之类),那就用context新建一个jQuery对象, 然后在这个对象中再查找
* selector所指定的元素, 最后返回一个jQuery对象.更多细节, 可以参考jQuery.fn.find函数的中文注释.
*/
else
return jQuery( context ).find( selector );
}
// HANDLE: $(function)
// Shortcut for document ready
// 看看是不是类型(3)- 函数(function)类型?
// 如果传进来的是一个function,那么就用docuemnt新建一个jQuery对象, 让后使用jQuery对象的ready函数,将selector(现在它是一个函数)绑定
// 到DOM Ready 事件(不知道什么是DOM Ready事件? Ctrl+F搜索"read:"!最后一个搜索结果有说明 ).
// 要完成上面我所说的功能下面代码中的'load'就显得比较诡异.在 jQuery 1.3.2里面, 下面的代码已经被改进为:
/*
* else if ( jQuery.isFunction( selector ) )
* return jQuery( document ).ready( selector );
*/
else if ( jQuery.isFunction( selector ) )
return jQuery( document )[ jQuery.fn.ready ? "ready" :"load" ]( selector );
// 如果是类型(2)和(4)(从代码中可以看出他们是作相同的处理的):
//经过上面的处理之后,程序还能运行到这里(没有return),说明selector是一个类数组对象(或者就是Array对象). 那我们就不管你是jQuery对象还是Array对
// 象,都使用jQuery.makeArray(selector)来把这个selector对象转换成一个真正的Array.
//最后使用setArray将数组放到自己(也就是this,它是一个jQuery对象)存储匹配元素的数组(matched element set)里面,然后返回自己这个jQuery对象
// 有关细节, 可以参考jQuery.fn.setArray,jQuery.fn.setArray的中文注释.
return this.setArray(jQuery.makeArray(selector));
},
// The current version of jQuery being used
/*
* jQuery当前版本。
* 有些代码会检测这个属性来确定对象是不是jQuery对象
*/
jquery: "1.2.6",
// The number of elements contained in the matched element set
/**
*返回匹配元素集合的大小,就是说通过选择器现在到底选择中了多少个元素。这个数字存在length里面
*这里所说的"匹配元素集合"是指存在每一个jQuery对象中的一个数组。当我们用一个选择器创建一个jQuery
*对象时，选择器选中的所有匹配的元素就会存在这个数组里面。如jQuery("div")，文档中所有div的引用都
* 会被保存在这个数组里面。
*
* 以下的注释里面都会沿用"匹配元素集合"这个概念。
*/
size: function() {
return this.length;
},
// The number of elements contained in the matched element set
// 匹配元素集合长度,初始设置为0
length: 0,
// Get the Nth element in the matched element set OR
// Get the whole matched element set as a clean array
/*
* 取得匹配元素集合中的第N个元素
*/
get: function( num ) {
return num == undefined ?
// Return a 'clean' array
//如果传进来的num是一个未定义的值，返回一个"干净"的数组.意思就是返回一个新建的数组副本
jQuery.makeArray( this ) :
// Return just the object
// 如果num有值，直接就返回num这个位置上的那个元素
this[ num ];
},
// Take an array of elements and push it onto the stack
// (returning the new matched element set)
/*
*使用传入的元素生成一个新的jQuery元素,并将这个对象的prevObject设置成当前这个对象(this).最后将这个新生成的jQuery对象返回.
* 似乎jQuery里面把匹配元素集合称为matched elements set 或者stack / 暂时还不明白为什么它叫做" pushStack ", stack在哪里.
*
* ANSWER:在链式的方法调用中，有很多的函数"returnthis"，以便不用再写诸如"obj.method2;obj.method2()"这样的代码，而是直接用
*"obj.method1().method2()"，这样代码就会相当简洁。但是链式方法调用有一个前提，那就要保证所有每一个"return this"的方法不能具有
* "破坏性".就是函数说不能修改jQuery对象的匹配元素集合.如果某一个方法真的要修改匹配元素集合, 那么它就会调用pushStack方法,把当前的
* jQuery对象保存起来,以便以后使用end方法恢复这个jQuery对象.
*/
pushStack: function( elems ) {
// Build a new jQuery matched element set
var ret = jQuery( elems );
// Add the old object onto the stack (as a reference)
ret.prevObject = this;
// Return the newly-formed element set
return ret;
},
// Force the current matched set of elements to become
// the specified array of elements (destroying the stack in theprocess)
// You should use pushStack() in order to do this, but maintainthe stack
/*
*原文翻译:使当前匹配元素集合变成另一个特定的元素集合(在这个过程中原来的匹配元素的集合将会被破坏[也就是原来的那个集合不复存在].)
* 如果你想保持原来的那个匹配元素集合,那么你应该使用pushStack()
*
*使用这个函数将会把this对象原来的匹配对象集合重新设置成一个新的集合,而是使用pushStack()则保持原来的集合.
*/
setArray: function( elems ) {
// Resetting the length to 0, then using the native Array push
// is a super-fast way to populate an object with array-likeproperties
//将length设为0,然后是用本地Array的push方法(也就是说将对象的指针传给Array.prototype.push,作为它的上下文,然后执行. this所代表的对象并不是
//Array对象,但是this又想使用Array对象才具有的push方法,于是使用了apply方法).
// 这是一个高速填充具有"类数组"属性的对象的方法
this.length = 0;//Array的push函数是在数组的末尾追加元素.值得注意的是Array类的push方法会修改this.length属性.这是//为什么选用Array的push的方法另外一个原因.如果不使用Array的push方法,那么就需要另外写代码来设置jQuery//对象的length属性,以使它的值与匹配元素集合中的元素个数相匹配.
Array.prototype.push.apply( this, elems );
//最后把追加了元素的jQuery对象返回
return this;
},
// Execute a callback for every element in the matched set.
// (You can seed the arguments with an array of args, but this is
// only used internally.)
/*
*原文翻译:为匹配元素集合内的每一个元素执行一遍回调函数.(你可以用数组的形式提供args这个参数, 不过它将被作为内部参数使用)
*
*遍历匹配元素集合里面的每一个元素,并对每一元素调用callback函数进行处理.这样匹配元素集合还是原来那个集合,不过里面的元素都经过了callback的处理
* 可以看到遍历的操作实际上是调用了jQuery的静态方法each来完成的.
*/
each: function( callback, args ) {//this指的是一个jQuery对象(这个你应该很清楚).由于一个jQuery对象是一个类数组的对象, 因此jQuery.each能像对待数组一样
//对待jQuery对象,也因此jQuery匹配元素集合中的每一个元素都能被访问.
return jQuery.each( this, callback, args );
},
// Determine the position of an element within
// the matched set of elements
/**
* 上文翻译:确定一个元素在匹配元素集合中的位置(索引)
* @param {Object} elem-要确定位置的那个元素.它可以是一个jQuery对象.
*/
index: function( elem ) {
var ret = -1;
// Locate the position of the desired element
return jQuery.inArray(
// If it receives a jQuery object, the first element isused
elem && elem.jquery ? elem[0] : elem
, this );
},
/**
*获取或设置元素的属性值(这些属性可以是普通的属性值,如title,也可以是样式属性值)
*
* name - 属性名称
* value - 属性值. 可以为空. 为空时表示要返回
* type -表示要设置/获取的属性是一般元素属性,还是样式属性.如果没有传入这个参数,则表明是一般的属性;如果有传入(如"curCSS"),则表示要设置样式属性
*/
attr: function( name, value, type ) {
var options = name;
// Look for the case where we're accessing a style value
if ( name.constructor == String )
// 如果没有传入要设置的值,那么就是要获得该属性的值.函数将返回匹配元素集合内首元素的相应属性
if ( value === undefined )
return this[0] && jQuery[ type || "attr" ]( this[0],name );
/*
* 我想解释一下上面那行return语句:
* (1)运算符&&的行为是这样的:对于它两边表达式,谁要把运算给中止了,就返回谁的值.
*在这里,this[0]如果是null或者是其他可以转换成false的值(如果0,undefined),
* 那么运算中止,null(或其他与false等价 [ == ]的值)就会被返回. 若this[0]的确
* 有值,那么运算不会中止, 继续&&右边的运算,并返回右边表达式计算的结果.
*
* (2) 而 " ||"运算符号也类似,左右两边谁把运算中止了, 就返回谁的值. 先计算左边
* 的表达式, 如果不是false的等价值( ==false),就中止计算, 返回左边表达式的值.
* 若左边表达返回的是一个和false等价的值,那么计算右边的表达式子, 并返回该表达式的
* 值
*
* (3)如果给本函数传入了type,这个type一般就是"curCSS".
*/
//如果传入了要设置的值,让options成为一个"字典"(术语,即Key-Value对式的数据结构)
else {
options = {};
options[ name ] = value;
}
// Check to see if we're setting style values
//为每一个jQuery的匹配元素调用一个函数处理一下.这个函数处理的内容是:
//在当前的dom元素上,让opptions内记录的每一个属性都设置上相应的值.
// 最后将处理过的jQuery对象返回
return this.each(function(i){
/*
* 注意在这个函数内的 this, 它的含义已经不同.现在它指的是匹配元素集合中的每一个DOM元素
* 所有下面的代码中才会有this.style.如果this指向的是一个jQuery对象, 它又怎么会有这个
* 属性呢?
*/
// Set all the styles
for ( name in options )
jQuery.attr(
type ?//如果有传入type,就表示要设置样式属性;如果没有则表示要设置一般的属性
this.style :
this,
name, jQuery.prop( this, options[ name ], type, i, name )//调用prop取得正确的属性值(像"这个属性值是否要带单位?"这样的工作都交由prop来处理)
);
});
},
/*
* 有两种情况:
* (1)当没有传入value值的时候,获取第一个匹配元素key所指定样式属性的值.
* (2)当有的传入value的时候,设置匹配元素集合中每一个元素上key所指定的样式属性值为value
*/
css: function( key, value ) {
// ignore negative width and height values
// 原文翻译:在width 或者 height 上设置负值将会被忽略
if ( (key == 'width' || key == 'height') && parseFloat(value)< 0 )
value = undefined;
// 最后调用attr函数获取样式值.注意,如果没有传入最后一个参数,则表示获取/设置的是普通的属性(如title)而不是样式属性.
return this.attr( key, value, "curCSS" );
},
/*
* 返回/设置所有匹配元素的文本
*如果是返回文本的话,结果是由所有匹配元素包含的文本内容组合起来的文本。这个方法对HTML和XML文档都有效。
* 如果是设置的话,则返回一个jQuery对象
*
* text - 要设置的文本内容(可选)
*/
text: function( text ) {
if ( typeof text != "object" && text != null )
return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );
var ret = "";
jQuery.each( text || this, function(){
jQuery.each( this.childNodes, function(){
if ( this.nodeType != 8 )//8是comment节点
ret += this.nodeType != 1 ?
this.nodeValue :
jQuery.fn.text( [ this ] );//递归获取this内的text,注意this是一个dom元素的引用
});
});
return ret;
},
/* 以下为API文档摘抄:
* 将所有匹配的元素用单个元素包裹起来
* 这于 '.wrap()'是不同的，'.wrap()'为每一个匹配的元素都包裹一次。
*这种包装对于在文档中插入额外的结构化标记最有用，而且它不会破坏原始文档的语义品质。
*这个函数的原理是检查提供的第一个元素并在它的代码结构中找到最上层的祖先元素－－这个祖先元素就是包装元素。
*/
wrapAll: function( html ) {
if ( this[0] )
// The elements to wrap the target around
jQuery( html, this[0].ownerDocument )//jQuery(this[0].ownerDocument).find(html);
.clone()
.insertBefore( this[0] )//这句之后,新clone出来的节点就在this[0]这个位置了
.map(function(){
var elem = this;
while ( elem.firstChild )
elem = elem.firstChild;
return elem;
})
.append(this);//this是一个dom 元素的引用
return this;
},
/*
* 把jQuery对象内的每一个匹配元素中的内容用指定的html包装起来
*/
wrapInner: function( html ) {
return this.each(function(){
jQuery( this ).contents().wrapAll( html );
});
},
/*
* jQuery对象内的每一个元素都用指定的html包装起来
*/
wrap: function( html ) {
return this.each(function(){
jQuery( this ).wrapAll( html );
});
},
/**
* 向jQuery对象内的每个匹配的元素内部追加内容。
*
* 可以看到append实际上是调用了jQuery.fn.domManip来完成任务的.
* jQuery.fn.domManip其实是所有DOM修改方法(插入,删除等)的"母"方法.
*只要在domManip方法的基础上修改调用参数,就能将domManip改头换面成另外一个
* 方法.
*
*本方法就是修改了domManip的最后一个参数callback,使之成为一个追加元素的方法.
*
* 同时参考jQuery.fn.domManip
*/
append: function() {
/*
*domManip第二个参数的布尔(true)是说,所要进行的操作对象可能会是<table>,在IE中操作table有一些
* 限制,所以在此标出.具体是什么限制,可以参看domManip的注释
* 第二个布尔(false)是说arguments的参数是否需要翻转(即倒序).
*/
return this.domManip(arguments, true, false, function(elem){
if (this.nodeType == 1)
this.appendChild( elem );
});
},
/**
* 向jQuery对象内的每个匹配的元素内的子元素前前插入内容。
*
* 可以看到prepend实际上是调用了jQuery.fn.domManip来完成任务的.
* jQuery.fn.domManip其实是所有DOM修改方法(插入,删除等)的"母"方法.
*只要在domManip方法的基础上修改调用参数,就能将domManip改头换面成另外一个
* 方法.
*
*本方法就是修改了domManip的最后一个参数callback,使之成为一个追加元素的方法.
*/
prepend: function() {
/*
*注意domManip的第三个参数(true),它表明arguments内的参数将会被倒序插入
*如要插入内容(即arguments)为'<div>1</div><div>2</div><div>3</div>',
*那么当他们被插入之后就会变成'<div>3</div><div>2</div><div>1</div>'
*/
return this.domManip(arguments, true, true, function(elem){
if (this.nodeType == 1)
this.insertBefore( elem, this.firstChild );
});
},
/*
* 在匹配元素集合内的每一个元素前插入内容
*
* 说明同上
*/
before: function() {
// 插入之前由domManip函数进行"把关",保证插入的内容是合法的(如<option>必须有<select>的包裹等)、IEbug得到修复等等。
return this.domManip(arguments, false, false, function(elem){
this.parentNode.insertBefore( elem, this );
});
},
/*
* 在匹配元素集合内的每一个元素之后插入内容
*/
after: function() {
/*
*注意domManip的第三个参数(true),它表明arguments内的参数将会被倒序插入
*如要插入内容(即arguments)为'<div>1</div><div>2</div><div>3</div>',
*那么当他们被插入之后就会变成'<div>3</div><div>2</div><div>1</div>'
*/
// 插入之前由domManip函数进行"把关",保证插入的内容是合法的(如<option>必须有<select>的包裹等)、IEbug得到修复等等。
return this.domManip(arguments, false, true, function(elem){
this.parentNode.insertBefore( elem, this.nextSibling );
});
},
/*
* 将匹配的元素列表变为前一次的状态。
* 可以看到, 要保证这个需求能够实现,jQuery其实是通过在jQuery对象内保存上一次操作的jQuery对象的引用来实现的.这个对象就保存了上一次的匹配元素集合.
* 一般情况下, jQuery对象是没有prevObject这个属性的.但是只要经过pushStack函数的操作之后,jQuery对象就具有了prevObject属性.并且jQuery对象
*变成了pushStack返回的那个新的jQuery对象.请查看jQuery.fn.pushStack
*/
end: function() {
return this.prevObject || jQuery( [] );
// 以下是pushStack的代码,可以结合查看,以理解end的工作原理.
// pushStack: function( elems ) {
// var ret = jQuery( elems );
// ret.prevObject = this;
// return ret;
// }
},
/**
*搜索所有与指定表达式匹配的元素。这个函数是找出正在处理的元素的后代元素的好方法。
*可以看到它调用了jQuery.find函数完成任务.这是一个类静态方法而不是实例方法.
*另外它调用pushStack改变了jQuery对象匹配元素集合的内容,使用end函数能够回到集合内容改变之前的状态.
* 具体可查看jQuery.fn.end,jQuery.fn.pushStack函数的注释.
* @param {string} selector - 用这个字符串指定需要选择的元素.如'.titleBody','div', '#id'等
*/
find: function( selector ) {//查找匹配元素集合内每一个元素的后代元素(这些后代元素由selector指定),把这些后代元素全部集中起来放到elems中
var elems = jQuery.map(this, function(elem){
return jQuery.find( selector, elem );//查找每一个元素的后代元素
});
//下面将利用pushStack将elems转化成一个新的jQuery对象,并将这个对象的preObject属性设为this, 最后pushStack将这个新对象返回,而find在接收到
// 这个新对象时后,又把它返回(return).
return this.pushStack( /[^+>] [^+>]/.test( selector ) ||selector.indexOf("..") > -1 ?
jQuery.unique( elems ) :
elems );
},
/**
* 克隆一个jQuery对象.
*
* @param {Object} events
*/
clone: function( events ) {
/*
*COMP:本来可以直接克隆的,但是IE浏览器的一些问题让我们不得不要针对它进行一些处理.
*于是在map函数里面针对不同的浏览器进行的处理.具体是IE的什么问题,可以看看下
* 面那大段英文.
*/
var ret = this.map(function(){//注意jQuery对象的map方法返回的一个jQuery对象
//如果是IE浏览器
if ( jQuery.browser.msie && !jQuery.isXMLDoc(this) ) {
// IE copies events bound via attachEvent when
// using cloneNode. Calling detachEvent on the
// clone will also remove the events from the orignal
// In order to get around this, we use innerHTML.
// Unfortunately, this means some modifications to
// attributes in IE that are actually only stored
// as properties will not be copied (such as the
// the name attribute on an input).
var clone = this.cloneNode(true),//参数true说明孩子节点也要一起被克隆
container = document.createElement("div");
container.appendChild(clone);
return jQuery.clean([container.innerHTML])[0];
}
else
return this.cloneNode(true);
});
// Need to set the expando to null on the cloned set if itexists
// removeData doesn't work here, IE removes it from theoriginal as well
// this is primarily for IE but the data expando shouldn'tbe copied over in any browser
var clone = ret.find("*").andSelf().each(function(){
if ( this[ expando ] != undefined )
this[ expando ] = null;
});
// Copy the events from the original to the clone
// 把事件监听函数也一并拷贝到克隆的的对象上.
if ( events === true )
this.find("*").andSelf().each(function(i){
if (this.nodeType == 3)//3是TextNode
return;
//获得this所指jQuery对象上的所有event集合
var events = jQuery.data( this, "events" );//遍历这个集合上每一种事件类型.每一个type就是一个事件类型,如click等
for ( var type in events )
//遍历每一种事件类型上所有handler,即事件监听器.注意,不是"事件处理器".事件处理器
//只有一个.
for ( var handler in events[ type ] )
//给clone[i]的type类型的事件添加上events[type ][ handler ]这个事件句柄(即事件监听器,叫句柄专业一些...).
//更多的细节,请查看jQuery.event.add函数的细节.
jQuery.event.add( clone[ i ], type, events[type ][ handler ], events[ type ][ handler ].data );
});
// Return the cloned set
return ret;
},
/**
* 在原来的匹配元素集合中去掉selector中指定的元素.
*
*由于改变了匹配元素集合中的元素,所以调用pushStack来设置一个"回退点".如果调用jQuery.fn.end函数就能恢
* 复为原来的那个jQuery对象.
*
* @param {Object} selector它的取值范围跟jQuery.fn.init的selector一样.
*/
filter: function( selector ) {
return this.pushStack(
/*
*如果selector是一个函数,那么使用这个函数对jQuery对象内匹配元素集合中的每一个元素进行过滤
*/
jQuery.isFunction( selector ) &&
jQuery.grep(this, function(elem, i){
return selector.call( elem, i );
}) ||
/*
* 如果不是函数, 那就交给jQuery.multiFilter进行处理.
* this 指明了一个过滤的上下文,即要在这个范围内(它的匹配元素集合内)进行过滤.
*multiFilter在过滤匹配元素集合方面处于核心的地位,许多方法都是用它来完成任务的.
*/
jQuery.multiFilter( selector, this ) );
},
/**
* 在jQuery对象的匹配元素集合中去掉由seletor指定的元素.
*
* @param {Object} selector selector的取值范围跟jQuery.fn.init一样
*/
not: function( selector ) {
//要将selector分开两种情况来讨论哦:字符串还是数组类结构?
//如果是字符串
if ( selector.constructor == String )
// test special case where just one selector is passed in
// isSimple是一个简单的正则选择器,如 '#id'这样的选择器,它没有空格' '.
// 像 '.div1 h1'这样的选择器就算是一个较为复杂的选择器
if ( isSimple.test( selector ) )
// multiFilter的最后一个参数 true表示启用'非模式'.具体请看jQuery.multiFilter的注释
//'非模式'如果启动了,selector中指定的元素就不要.如果不启动,则selector中指定的元素就是结果集.
return this.pushStack( jQuery.multiFilter( selector,this, true ) );
else
selector = jQuery.multiFilter( selector, this );
//看看selector是不是类数组对象
var isArrayLike = selector.length && selector[selector.length- 1] !== undefined && !selector.nodeType;
return this.filter(function() {
//注意, this指的是匹配元素集合中的每一个元素
return isArrayLike ?//selector如果是数组,那么这个数据就划定了一个范围.若this所指的元素不在这个范围内
//就把元素保留(这时jQuery.inArray(this,selector)< 0 将返回true).
jQuery.inArray( this, selector ) < 0 ://如果selector不是类数组的元素,那么只要不跟selector在逻辑上相等,就可以保留
this != selector;
});
},
/**
* 将selector指定的元素添加到匹配元素集合中去.
*
*由于修改了匹配元素集合的内容,所以使用了pushStack.具体参见pushStack以及end的注释
* @param {Object} selector
*/
add: function( selector ) {
return this.pushStack( jQuery.unique( jQuery.merge(
this.get(),
typeof selector == 'string' ?
jQuery( selector ) :
jQuery.makeArray( selector )
)));
},
/**
*返回一个布尔值,确定匹配元素集合中的元素是否在selector指定的一个范围之内.
* 如果有一个在,那么就返回true;
* 如果没有一个在, 或者selector是一个无效的选择器,返回false.
*
* @param {Object} selector 任意合法的selector.参见jQuery.fn.init
*/
is: function( selector ) {
/*!运算符会先把它的运算数转换成一个布尔类型的值.任何值x,两次取反(!!)之后都可以把它转换成为一个布尔值
*multiFilter是一个'多功能'过滤器,可以用它来过滤掉不需要的元素(给它的三个参数传入true);也可以用它来
*过滤剩下selector所指定的元素(第三个参数为false或者不传入第三个参数).
*/
return !!selector && jQuery.multiFilter( selector, this ).length > 0;
},
/**
*返回一个布尔,确定匹配元素集合中的元素是否具有selector指定的类名.
* 规则同 is 函数
* @param {Object} selector
*/
hasClass: function( selector ) {
return this.is( "." + selector );
},
/**
* 设置每一个匹配元素的值。或者是获取匹配元素集合中首元素的值
* 如果有一个非空的返回值,说明设置成功.
*
* @param {Object} value
*/
val: function( value ) {
//如果value为undefined说明要取值而不是要设值.
if ( value == undefined ) {
//如果匹配元素集合不是空的
if ( this.length ) {
var elem = this[0];
// We need to handle select boxes special
// 如果节点是<select>,那么需要特别的处理
if ( jQuery.nodeName( elem, "select" ) ) {//nodeName函数测试一个节点不是指定类型的节点
var index = elem.selectedIndex,
values = [],
options = elem.options,
one = elem.type == "select-one";//这个<select>是多选的还是单选的?
// Nothing was selected
if ( index < 0 )
return null;
// Loop through all the selected options
/*
* 这个for循环的初始化部分使用了嵌套的' ? :'运算符,比较晦涩.
*/
for ( var i = one ? index : 0, max = one ? index+ 1 : options.length; i < max; i++ ) {
var option = options[ i ];
if ( option.selected ) {
// Get the specifc value for the option
/*
*COMP:IE的option获取值的方式竟然是这么地麻烦.各位记住就好.
*/
value = jQuery.browser.msie && !option.attributes.value.specified ? option.text : option.value;
// We don't need an array for one selects
// 如果是单选的<select>,就把值返回
if ( one )
return value;
// Multi-Selects return an array
// 如果是多选的,就把值放进一个数组.
values.push( value );
}
}
return values;
// Everything else, we just grab the value
}//如果不是<select>而是其他的节点
else
// /r 匹配一个回车符
return (this[0].value || "").replace(/\r/g, "");
}
return undefined;
}
if( value.constructor == Number )
value += '';
return this.each(function(){
/*注意哈,this现在不是指向jQuery对象,而是匹配元素集合内的每一个元素 */
if ( this.nodeType != 1 /* ELEMENT_NODE */)
return;
/*
*如果要设置的值是一个数组,并且each当前遍历到的元素的是radio或者checkbox的
* 那么就设置他们的checked值.设置的规则如下:
*如果当前元素的值(this.value)或者名字(this.name)在数组所划定的范围之内,
* 就把checked值设为true.否则为false.
*/
if ( value.constructor == Array && /radio|checkbox/.test(this.type ) )
this.checked = (jQuery.inArray(this.value, value) >=0 ||
jQuery.inArray(this.name, value) >= 0);
// 如果当前元素是<select>
else if ( jQuery.nodeName( this, "select" ) ) {
var values = jQuery.makeArray(value);
//由当前这个<select>元素的所有option孩子新建一个jQuery对象.这样就能够利用jQuery的方法
// 方便地操作这些孩子了.
jQuery( "option", this ).each(function(){//用each来遍历<select>的每一个<option>孩子
/* 注意啦,现在 this 指向的是一个<option>元素咯 */
/*
*如果孩子的value(这个孩子是<option>元素来的)或者text在values所界定的范围之内
* 那么就把孩子的selected设置为true.
*/
this.selected = (jQuery.inArray( this.value,values ) >= 0 ||
jQuery.inArray( this.text, values ) >= 0);
});
//如果values的长度为0,就设置selectedIndex为-1.
if ( !values.length )
this.selectedIndex = -1;
}
// 都不是以上情况,那就直接把值设置进来就是了
else
this.value = value;
});//end function 'each'
},
/**
* 设置/获取元素的html内容
* 在value没有指定的时候返回匹配元素集合中首元素的innerHTML.
*如果指定了value,那么匹配元素集合中每一个元素的子元素为由value生成的元素.
*
* 同时参考:jQuery.fn.append
*
* @param {Object} value
*/
html: function( value ) {
return value == undefined ?
(this[0] ?
this[0].innerHTML :
null
)
:
this.empty().append( value );
},
/**
*在匹配元素集合中的每一个元素之后插入value做为兄弟节点,并调用remove方法将value值内的类似'<>'的符号
* 去掉.
*
* @param {Object} value
*/
replaceWith: function( value ) {
return this.after( value ).remove();
},
/**
*将匹配的元素集合缩减为一个元素。这个元素在匹配元素集合中的位置变为0，而集合长度变成1。
* 最后用这个集合重新构建一个jQuery对象,并将其返回.由于修改了匹配元素集合,所以在slice方法体内使用了
* pushStack来保留一个'恢复点',以便能使用jQuery.fn.end方法恢复到以前的状态.
*
* 同时参考jQuery.fn.pushStack 和 jQuery.fn.slice
*
* @param {Object} i i指示要将哪一个保留元素
*/
eq: function( i ) {
return this.slice( i, i + 1 );
},
/**
* 将匹配的元素集合缩减为若干个元素。
* 最后用这个集合重新构建一个jQuery对象,并将其返回.由于修改了匹配元素集合,所有使用pushStack
* 来保留一个'恢复点',以便能使用jQuery.fn.end方法恢复到以前的状态.
*
* 同时参考jQuery.fn.pushStack
*
* @param 传入的参数需要符合JavaScriptCore中Array对象的slice方法的要求指示要将哪一个保留元素
* slice需要两个参数:
* 第一个参数指定截取的位置,第二个参数指定截取长度.
*/
slice: function() {
return this.pushStack( Array.prototype.slice.apply( this,arguments ) );
},
/**
*使用callback处理匹配元素集合中的每一个元素,完后用pushStack新建一个jQuery对象,最后返回这个新
* 的jQuery对象.
*
* 具体细节可以参看pushStack的注释.
*
* 注意:
* 本实例方法调用了jQuery.map静态函数完成任务,它返回值是一个数组.
* 而jQeury.fn.map也就是本方法是一个实例方法,它的返回值却是一个jQuery的对象.
*
* @param {Function} callback 用来做映射的函数.
*/
map: function( callback ) {
return this.pushStack( jQuery.map(this, function(elem, i){//callback将会作为elem的方法来调用,那么callback代码内的this指的就是正在处理的匹配元素集合中的元素.
return callback.call( elem, i, elem );
}));
},
/**
* 将this.prevObejct内的匹配元素集合也加进当前的匹配元素集合
* 注意:this.prevObject是一个jQuery对象的引用.
*/
andSelf: function() {
return this.add( this.prevObject );
},
data: function( key, value ){
var parts = key.split(".");
parts[1] = parts[1] ? "." + parts[1] : "";
if ( value === undefined ) {
var data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);
if ( data === undefined && this.length )
data = jQuery.data( this[0], key );
return data === undefined && parts[1] ?
this.data( parts[0] ) :
data;
} else
return this.trigger("setData" + parts[1] + "!", [parts[0], value]).each(function(){
jQuery.data( this, key, value );
});
},
removeData: function( key ){
return this.each(function(){
jQuery.removeData( this, key );
});
},
/* domManip 其实是 Dom manipulate的缩写.
*让每一个jQuery匹配元素集合内的元素都执行一遍callbak(callback可以是插入、修改等), args为参数.
*与此同时本函数会对args进行处理以保证args在dom内的正确性(如<option>必须要有<select>的包裹等)
*另外本函数也保证了包含在args内的脚本能在具体的dom结构生成之后才执行,避免了出错.
*/
/*
* 为了能够更好地理解domManip函数的功能,可以结合jQuery.fn.append来说明此函数的作用:
* 在append函数中有这样的代码:return this.domManip(arguments,true, fals, function(elem){if (this.nodeType == 1)this.appendChild( elem );});
*
*/ //true //false //function(){...
domManip: function( args, table, reverse, callback ) {
// args是类似这样的字符串:"<b>Hello</b>"
// 如果length>1 就要clone
var clone = this.length > 1, elems;
//遍历jQuery对象(this)匹配元素集合中的每一个元素,并调用匿名函数对集合内每一个元素进行处理
// 处理的内容是:为每一个元素进行callback操作,参数是args
// 例如:如果callback的功能是为元素追加内容(即append),则args就是要追加的具体内容
return this.each(function(){
if ( !elems ) {
elems = jQuery.clean( args, this );//jQuery.clean之后,elems变成一个数组.这个数组内装的是一些dom元素.这些dom元素由args内表示XHTML的//字符串变成清空内容的dom元素得来.具体请查看jQuery.clean函数.
if ( reverse )
elems.reverse();
}
var obj = this;//为了方便叙述下面的代码分析,这里作一个标记[1]. 注意,this是一个dom元素的引用. 不是jQuery对象的引用.
//在IE中,如果需要在table中操作tr(如插入一个tr),IE要求你在tbody内进行操作.
// 以下的if就是说要在tbody内进行操作,如果没有tbody就自己建一个,然后再操作
if ( table && jQuery.nodeName( this, "table" ) && jQuery.nodeName( elems[0], "tr" ) )//appendChild返回值是一个指向新增子节点的引用
obj = this.getElementsByTagName("tbody")[0] || this.appendChild( this.ownerDocument.createElement("tbody") );
// 如果发现操作(如插入操作)的内容中含有脚本,先把这些脚本装进这个集合,最后才来运行他们
var scripts = jQuery( [] );
// 对于每一个要操作(如插入操作)的对象(elem)进行一些处理.
// 这些处理的内容是: 如果对象里面含有脚本,将这些脚本添加到一个脚本集合内,留待后面执行.
jQuery.each(elems, function(){
var elem = clone ? //true的意思是说,把绑定在jQuery(this)上的事件也一并克隆
jQuery( this ).clone( true )[0] ://clone返回的是一个jQuery对象,这对象的匹配元素集合内
//只有一个元素, 所以clone(true)[0]就是this的一个副本
this;
// execute all scripts after the elements have beeninjected
//如果插入的内容里面含有script,用集合先把这些script装起来,等到最后所有的内容都插入完毕了, 执行这个集合里面的所有脚本
if ( jQuery.nodeName( elem, "script" ) )
scripts = scripts.add( elem );
else {
// Remove any inner scripts for later evaluation
if ( elem.nodeType == 1 )
scripts = scripts.add( jQuery( "script", elem).remove() );
// Inject the elements into the document
// 这里的obj要么是上面代码[1]处的this( obj =this ), 要么是this内的tbody( obj =this.getElementByTagName("tbody")||... )
//最后在obj上执行callback指定的操作类型(elem为参数).
// 例如, callback是一个追加内容的函数,那么这里就让obj追加内容elem
callback.call( obj, elem );
/*
* 对于上面的这行代码还有一点要补充:
* 其他函数在使用domManip都是像这样使用的:
* domManip(arguments,true,true,function(elem){
* // callback body
* });
* 请特别注意callback body 内的this和参数elem.
*由于callback.call(obj,elem)使用了obj作为函数调用上下文,故obj自然就成为了this
*所指向的对象.又于是,给domManip传入的callback只有一个形式参数elem.
*
*/
}
});//end each//为一个元素插入完内容之后(即注入完HTML),就个执行刚才保存的脚本
scripts.each( evalScript );
});//end each
}
};
// Give the init function the jQuery prototype for later instantiation
// 通过这一句之后, jQuery.fn.init也能实例化一个jQuery对象的对象了.
jQuery.fn.init.prototype = jQuery.fn;
function evalScript( i, elem ) {
if ( elem.src )
jQuery.ajax({
url: elem.src,
async: false,
dataType: "script"
});
else
jQuery.globalEval( elem.text || elem.textContent || elem.innerHTML || "" );
if ( elem.parentNode )
elem.parentNode.removeChild( elem );
}
function now(){
return +new Date;
}
/**
*这是jQeury核心中很重要的一个函数.通过它我们就可以轻松地在jQuery或者jQuery对象中随意扩展自己想要的方法
*/
jQuery.extend = jQuery.fn.extend = function() {
// copy reference to target object
var target = arguments[0] || {}, //target是被扩展的对象,默认是第一个参数(下标为0)或者是一个空对象{}
i = 1,//i是一个"指针",它指向扩展对象.也就是说要把这个对象的属性或方法扩展到被扩展对象上
length = arguments.length, //参数的长度.通过这个长度来判断扩展的模式
deep = false, //是否要进行深度扩展(拷贝).当一些属性是一个对象,对象内又有对象时,就需要取舍了:到底要不是拷贝整个对象树?
options;//当前正在拷贝的扩展对象的引用
// Handle a deep copy situation
//如果传进来的首个参数是一个boolean类型的变量，那就证明要进行深度拷贝。而这时传进来的argumens[1]就是要拷贝的对象.如果是这种情况,那就要做一些
// "矫正"工作,因为这个时候,target变量指向的是一个布尔变量而不是我们要拷贝的对象.
if ( target.constructor == Boolean ) {
deep = target;//保存target的布尔值
target = arguments[1] || {};//让target真正指向我们要拷贝的对象.
// skip the boolean and the target
// 可以说是一个指针，现在指向argument[2].arguments[0],arguments[1]已经得到处理,剩下需要处理的就是arguments[2],arguments[3],...
// 后面的参数.
i = 2;
}
// Handle case when target is a string or something (possible indeep copy)
// 如果target不是objet 并且也不是function 就默认设置它为{};
if ( typeof target != "object" && typeof target != "function" )
target = {};
// extend jQuery itself if only one argument is passed
// 翻译:如果只传入了一个参数, 那么扩展的就是jQuery自身:
// 如果使用jQuery.extend来扩展，那么this 就是jQuery.这样的话，参数中的函数就会作为jQuery下的静态方法。
// 如果使用jQuery.fn.extend来扩展， this指的就是jQuery.fn了。参数中所的函数或者属性就会作为jQuery对象的方法或属性了。
if ( length == i ) {
target = this;
--i;
}
for ( ; i < length; i++ )
// Only deal with non-null/undefined values
// 只有那些非null的扩展对象才把它扩展到被扩展对象上来.
if ( (options = arguments[ i ]) != null )
// Extend the base object
// 扩展被扩展对象(baseobject),将options内的属性或方法扩展到被扩展对象中来
for ( var name in options ) {//现在要遍历每一个加进来的方法或属性
//target是被扩展对象//options是扩展对象, 它的方法或属性将会被扩展到target上
var src = target[ name ], copy = options[ name ];
// Prevent never-ending loop
// taget == copy说明要加进来的引用是指向自己的，这在要进行深度拷贝时就糟糕了。所以碰到这样的情况就跳过，不把自己的引用作为自己的一个成员
if ( target === copy )
continue;
// Recurse if we're merging object values
//使用递归的方法实现深度拷贝 //这个条件是说,要是没有nodeType, 就是非Dom对象引用, 可以对它进行深度拷贝
if ( deep && copy && typeof copy == "object" && !copy.nodeType )
target[ name ] = jQuery.extend( deep,
// Never move original objects, clone them
src || ( copy.length != null ? [ ] : { } )
, copy );
// Don't bring in undefined values
// 如果要加进来的引用不是对象的引用(可能是函数、简单变量，只要不是undefined ) 那就把引用加进来:可能是覆盖也可能是新建name这个属性或方法
else if ( copy !== undefined )
target[ name ] = copy;
}
// Return the modified object
// 把扩展好的对象返回
return target;
};
/*定义好了jQuery.extend和jQuery.fn.extend方法之后,以后我们就使用这个方法来为jQuery
* 或者jQuery.fn,又或者jQuery.fx等随意添加(扩展)方法了.
*/
var expando = "jQuery" + now(),//当元素需要缓存数据时,这样使用expando: id = elem[expando];data =jQueyr.catche[id];
uuid = 0, //如果一个元素需要缓存数据,那么uuid++就会成为它的缓存区全局唯一编号.
windowData = {}, //这是数据缓存区.
// exclude the following css properties to add px
// 以下这些CSS属性是不需要加单位'px'的
exclude = /z-?index|font-?weight|opacity|zoom|line-?height/i,
// cache defaultView
//在这里定义一个defaultView在需要的函数里就可以直接调用,而不用再写一长串document.XXXXXXXX了.
defaultView = document.defaultView || {};
// ------------------------------------- jQuery静态核心函数--------------------------------------------
//这些静态函数为jQuery对象实例方法或者其他需要的函数所调用.jQuery很多的实例方法实际上是调用了这里定义的方法'幕后'完成任务的
//
//通过jQuery.extand这个'巨大'的函数调用,许多jQuery的核心函数都被定义并加进了jQuery这个命名空间里.
//注意,这些函数都是静态的.这意味着你调用他们的时候必须使用完整的限定符号,如果jQuery.noConfiict,并且不能像jQuery实例方
// 法那样调用它,如jQuery(seloector).swap是不合法的.
//----------------------------------------------------------------------------------------------------
jQuery.extend({
/**
* 将命名空间$归还.调用这个函数就不能再用jQuery或者$了
* @param {Object} deep
*/
noConflict: function( deep ) {
window.$ = _$;//刚才是存起来的$引用现在'还'给人家.
if ( deep )//如果传入deep,说明连jQuery这个关键字的使用权也要放弃.真的比较'deep'了.
window.jQuery = _jQuery;
return jQuery;
},
// See test/unit/core.js for details concerning this function.
/**
* 测试一个对象是不是Function.
* 可以看到,检查一个对象是不是函数还是比较多'工序'的.
* @param {Object} fn
*/
isFunction: function( fn ) {
/*
* 这里使用了将函数转化为字符串(使用 函数对象+""的方法),然后用正则表达式测试是否符合一个函数所应该有的模式.
* 所以下情况会造成混淆:
* (1) 一个内容为'function(){}'的字符串;
* (2)一个含有混淆字符串元素的数组,如['function','()','{}'],这个数组一转化成字符串,就成为了(1)所说的情况
*
* 至于为什么不用typeof fn来确定一个元素是否为function,这点可能是'兴趣爱好'问题,又可能是由于某些老式浏览器
*会返回不正确的结果(我在IE5.5+,Firefox3,Safari3.0.4,Chrome,Opera9.62上都测试过typeof,结果正常 ).请
* 读者自行斟酌.
*/
return !!fn && typeof fn != "string" && !fn.nodeName &&
fn.constructor != Array && /^[\s[]?function/.test( fn +"" );
},
// check if an element is in a (or is an) XML document
/**
* 检查一个元素是否是XML的document
* @param {Object} elem
*/
isXMLDoc: function( elem ) {//body是HTMLDocument特有的节点常用这个节点来判断当前的document是不是一个XML的文档引用//注意,HTMLDocment接口是XMLDocument的扩展,即HTMLDocument中特定于处理HTML文档的方法
//(如getElementById等)是不能用在XML文档使用的.
return elem.documentElement && !elem.body ||
elem.tagName && elem.ownerDocument && !elem.ownerDocument.body;
},
// Evalulates a script in a global context
/**
* 原文翻译:
* 在全局的作用域中运行脚本
*
* @param {Object} data
*/
globalEval: function( data ) {
//调用trim函数将data两头的空格去掉.
data = jQuery.trim( data );
//如果是有脚本内容的就运行,没有就结束函数,返回.
if ( data ) {
// Inspired by code by Andrea Giammarchi
//http://webreflection.blogspot.com/2007/08/global-scope-evaluation-anddom.html
var head = document.getElementsByTagName("head")[0] ||document.documentElement,
script = document.createElement("script");
script.type = "text/javascript";
if ( jQuery.browser.msie )
script.text = data;
else
script.appendChild( document.createTextNode( data ) );
// Use insertBefore instead of appendChild tocircumvent an IE6 bug.
// This arises when a base node is used (#2709).
head.insertBefore( script, head.firstChild );
head.removeChild( script );
}
},
/*
* 判断一个元素的nodeName是不是给定的name
*
* elem - 要判定的元素
* name - 看看elem.nodeName是不是这个name
*/
nodeName: function( elem, name ) {
return elem.nodeName && elem.nodeName.toUpperCase() == name.toUpperCase();
},
/**
*全局数据缓存区.每一个需要缓存数据元素都会在这里开辟一个空间存自己的数据
*/
cache: {},
/**
* 在jQuery全局数据缓存区中缓存数据.
*
* 注意别被"数据缓存区"吓到了.在技术上它不过就是一个对象,存了一些
* 数据而已.
*
* @param {Object} elem 要在这个元素上存放数据
* @param {Object} name 数据的键名
* @param {Object} data 数据的键值
*/
data: function( elem, name, data ) {
elem = elem == window ?
windowData :
elem;
/*获取元素的id.这个id被存在一个叫expando的属性里.
* expando 只是一个由 " jQuery " + now()组成的字符串
*它将作为elem的一个属性,同时这个属性的值也是全局数据缓存区中
*某一块的名字.根据这个名字就可以找到元素相应的缓存数据.
*注意别被"数据缓存区"吓到了.在技术上它不过就是一个对象,存了一些
* 数据而已.
*/
var id = elem[ expando ];
// Compute a unique ID for the element
//如果元素还没有expando编号,给它新建一个
if ( !id )
id = elem[ expando ] = ++uuid;
// Only generate the data cache if we're
// trying to access or manipulate it
/*
*如果有传入name属性,那么就在jQuery.cache区内新建一个属于本元素的cache
*/
if ( name && !jQuery.cache[ id ] )
jQuery.cache[ id ] = {};
// Prevent overriding the named cache with undefined values
// 翻译(意译): 别让未定义的值设置进来.
if ( data !== undefined )
jQuery.cache[ id ][ name ] = data;
// Return the named cache data, or the ID for the element
//最后把缓存的数据返回.值得注意的是,在没有传入name的情况之下,函数返回元素的id.这种不给data函数传name值的用法
// 可以参见jQuery.unique函数或者jQuery.find函数
return name ?
jQuery.cache[ id ][ name ] :
id;
},
/**
* 取消元素的缓存的数据.
*
* @param {Object} elem
* @param {Object} name
*/
removeData: function( elem, name ) {
elem = elem == window ?
windowData :
elem;
//取得元素的全局ID
var id = elem[ expando ];
// If we want to remove a specific section of the element'sdata
// 下面就删除这些数据
if ( name ) {
if ( jQuery.cache[ id ] ) {
// Remove the section of cache data
delete jQuery.cache[ id ][ name ];
// If we've removed all the data, remove theelement's cache
name = "";
/*以下这个for循环不断地从jQuery.cache[id]取属性名出来,并放入到name,
*一旦name获得了一个可以转化为true的值,for的循环体就会被执行.执行之后
*居然是break...于是就起到了一个作用:检测元素是否还有自定义的属性.
* 注意,元素的继承属性不能被forin循环枚举.例如从Object中继承下来的
* toString函数就不能被for in访问到.
*/
for ( name in jQuery.cache[ id ] )
break;
if ( !name )//如果如果name仍然是空的,那么就说明jQuery,cache[id]中再也没有数据了,可以把这个//数据缓存去删掉了.递归调用removeData.这时,removeData函数执行的就是下面那个
//else里面的代码了.
jQuery.removeData( elem );
}
// Otherwise, we want to remove all of the element's data
}
// Otherwise, we want to remove all of the element's data
//有些人英语比较水,我翻译一下,呵呵:否则,我需要删除元素所有缓存的数据.
//也就是说,当没有把name值传进来的时候(但有传一个elem进来),说明要删除元素elem上的所有缓存数据.
else {
// Clean up the element expando
/*删除元素上的expando属性.先用delete操作符删除这个元素的expanddo属性.如果出问题了,那问题可能是
* 由当前浏览器是IE所致,在catch中尝试removeAttribute.
*
* TEACH教学时间:
*removeAttribute方法属于w3c标准中1级DOM的API.而1级DOM在现代浏览器中已经得到了相当广泛的支持.
*也就是说,如果不考虑老式的浏览器,直接使用removeAttribute而不用try/catch也是可以的.delete操作
*符号属于JavaScript核心,也就是说,只要是个JavaScript的解释器就不应该不认识delete.因此下面的
* try/catch先用delete试试.不行了就用removeAttribute.
*/
try {
/* TEACH教学时间:
*注意啦,delete操作符号只是删除元素的属性而已,它并不会删除属性所引用的内存地址的内容.回收内存空间那
*是垃圾回收机制的事情.程序员唯一要能做的就是相信它能够起作用!这跟C++的delete相当不同,C++程序员要注意.
*另外,delete可以删除一个属性,但是不能删除由var定义的变量.不过隐式定义变量可以删除.
*/
delete elem[ expando ];
} catch(e){
// COMP: 以下是IE在delete方面的一个bug:
// IE has trouble directly removing the expando
// but it's ok with using removeAttribute
//翻译:直接删除exando属性在IE中会出问题.不过用removeAttribute一样能达到删除属性的目的.
if ( elem.removeAttribute )
elem.removeAttribute( expando );
}
// Completely remove the data cache
//完全删除掉数据.跟上面的忠告一样,delete只是删除一个地址的引用,要回收那一块内存空间那必须得垃圾机制说了算.
delete jQuery.cache[ id ];
}
},
// args is for internal usage only
/**
*遍历集合中的每一个元素.对每一个元素调用callback对其进行处理.jQuery代码中大量使用到这个函数.
*
* object -就是要遍历的数组或者类数组对象,或者干脆就是一个普通对象
* args -
*/
/**
*
* @param {Object} object -就是要遍历的数组或者类数组对象,或者干脆就是一个普通对象
* @param {Object} callback - 遍历object时, 执行的处理函数.
* @param {Object} args - 是要给callback使用的内部参数
*/
each: function( object, callback, args ) {
var name, i = 0, length = object.length;
// 如果 给callback传进了args
if ( args ) {
// length == undefined 说明 object不是类数组( array-like)对象,那就不能使用下标来访问了所以只能 for ( name in object )
if ( length == undefined ) {
for ( name in object )//遍历object内的每一个属性,并将属性作为callback的上下文,args作为callback的参数来调用callback//其实就是调用callback来处理这个属性,而args就是callback处理时要用到的参数
//当callback在处理某一个属性后返回false时,就不用对后面的属性进行处理了.至于什么时候返回false, 这个由你的callback来决定,你喜欢.
if ( callback.apply( object[ name ], args ) ===false )
break;
}
//else的话,说明object是类数组的对象(大部分情况下是jQuery对象),那就可以用下标的方式来访问
else
for ( ; i < length; )
if ( callback.apply( object[ i++ ], args ) ===false )
break;
// A special, fast, case for the most common use of each
}
// 如果没有 args 传进来
else {
// length == undefined 说明 object不是类数组( array-like)于是不能用下标的方法来访问
if ( length == undefined ) {
for ( name in object )
//call函数第一个参数跟apply一样,起一种上下文的作用.call后面的参数都作为callback的参数//可以看到,传参给callback,apply用了数组,而call则是一个一个传
if ( callback.call( object[ name ], name, object[name ] ) === false )
break;
}
//是类数组的对象,可以通过下标的方式来访问
else
for ( var value = object[0];
i < length && callback.call( value, i, value )!== false; value = object[++i] ){}
}
return object;
},
/*
*对属性值进行处理.取得正确的属性值.如,这个属性值是否要加上单位"px",等等.
*
* elem - dom元素对象
* value - 属性值
* type - 如果有值就代表是样式属性名
* i - dom元素在jQuery对象匹配元素集合中的索引
* name - 属性名
*/
prop: function( elem, value, type, i, name ) {
// Handle executable functions
// 如果属性值是function,就在elem上调用这个function(i作为参数),function处理的结果再作为value
if ( jQuery.isFunction( value ) )
value = value.call( elem, i );
// Handle passing in a number to a CSSproperty //exclude中表示了一些不需要加单位的属性值
return value && value.constructor == Number && type =="curCSS" && !exclude.test( name ) ?
value + "px" :
value;
},
/**
*jQuery.className命名空间,在这个命名空间上定义了一系列用来操作元素className属性的方法.
*不过这个命名空间内的函数并不'对外开发',只是内部使用.对外开发的方法都是这些方法的包装方法.
*/
className: {
// internal only, use addClass("class")
/**
* 给一个普通的DOM元素添加一个类名
* 内部使用,不对外公开
*
* @param {Object} elem
* @param {Object} classNames
*/
add: function( elem, classNames ) {
/* 方法体首先用split方法将classNames用空格''分开,放到一个数组里.然后使用jQuery.each方法来遍历每一个
*className.如果元素没有这个className,那就把这个className接到元素的className的后面.否则,就什么事情
* 都不做.请看代码,其中包含了了一些没有说到的细节:
*/
jQuery.each((classNames || "").split(/\s+/), function(i,className){
if ( elem.nodeType == 1/*NODE.ELEMENT_NODE*/ && !jQuery.className.has( elem.className, className ) )
elem.className += (elem.className ? " " : "") +className;
});
},
// internal only, use removeClass("class")
/**
* 去掉某个元素上的className
* 内部使用,不对外公开
* @param {Object} elem
* @param {Object} classNames
*/
remove: function( elem, classNames ) {
/*注意,以下代码中的jQuery.grep也是一个filter函数来的.可以参考jQuery.grep的中文注释. */
if (elem.nodeType == 1/* NODE.ELEMENT_NODE */)
elem.className = classNames != undefined ?
jQuery.grep(elem.className.split(/\s+/), function(className){//如果className在classNames的那个数组当中,就把它过滤掉,即不要.
return !jQuery.className.has( classNames,className );
}).
join(" ")//最后将剩下的结果用" "组合起来
:
"";
},
// internal only, use hasClass("class")
/**
* 看看elem的类名中,有没有className指定的类名
* 内部使用,不对外公开
*
* @param {HTMLElement} elem
* @param {string} className
*/
has: function( elem, className ) {
//将elem的className用""切分开来形成一个数组,然后用//jQuery.inArray看看在不在里面.
return jQuery.inArray( className, (elem.className || elem).toString().split(/\s+/) ) > -1;
}
},
// A method for quickly swapping in/out CSS properties to getcorrect calculations
/**
* 这是一个很有意思的函数:
*如果一个元素不处于一定的状态,那么直接获取它的某些属性值将会是不正确的.
*如offsetWidth/offsetHeight在元素不可见的时候,直接获取它们的值是不正确的.
* 因此先将元素的visibilty设置为 position: "absolute",visibility: "hidden", display:"block"
* 然后计算所要样式值,最后将原来的样式属性设置回去.
*
* @param {HTMLElement} elem 普通的DOM元素
* @param {Object} options对象.里面装着一些样式的键值对,用来设置计算样式值时的"环境"
* @param {Function} callback这个函数在甚至设置环境后执行.当它执行完之后,元素的样式将会被重置.
*/
swap: function( elem, options, callback ) {
var old = {};
// Remember the old values, and insert the new ones
// 把旧的CSS样式保存下来,然后换上新的
for ( var name in options ) {
old[ name ] = elem.style[ name ];
elem.style[ name ] = options[ name ];
}//换上了上新的样式值之后,赶紧'干活',获取想要的样式的值.注意这些值,在没有换上新的属性之前,是无法正确获取的.
callback.call( elem );
// Revert the old values
// 获取完毕,恢复原来的样式
for ( var name in options )
elem.style[ name ] = old[ name ];
},
/**
* 获取元素当前的CSS样式值.
*
* @param {HTMLElement} elem 元素
* @param {string} name 样式属性名
* @param {Object} force一个布尔的开关,为true则直接获取元素的内联样式的值.获取失败就再尝试获取元素的计算样式.如果
*为false或者不传入这个值,则会在获取计算样式之前先看看内联样式上有没有name所指定的样式的值.
*/
css: function( elem, name, force ) {
//如果是要获取width或者是height属性,需要特殊处理.特殊处理是基于如下的考虑:
//我们不是直接使用元素的width或者height属性来获取相应的值,而是使用了offsetWidth/Height. 这么获取widht/height
// 就需要对结果进行'修剪'.因为会有border和padding的问题.用具体看下面的代码.
if ( name == "width" || name == "height" ) {
var val,//这是最后要返回的结果
//这个对象是传给待会要调用的jQuery.swap函数的,具体看下面代码或者参考jQuery.swap
props = { position: "absolute", visibility: "hidden",display:"block" },
//确定现在要获取的是width还是height.是width就要注意左右的padding和border;是height则要注意上下
which = name == "width" ? [ "Left", "Right" ] : ["Top", "Bottom" ];
//这个嵌套定义的内部函数用来计算元素的width/height.在使用offsetXX获取widht/height值的时候要注意将border
// 和padding 减去.
function getWH() {
val = name == "width" ? elem.offsetWidth : elem.offsetHeight;
var padding = 0, border = 0;//which是一个数组,现在使用each遍历数组里面的每一个字符串.
jQuery.each( which, function() {
//注意,现在this引用的是一个字符串,为 "Left","Right" 中的一个, 或者"Top", "Bottom" 中的一个.
/*下面计算padding和border(左右或者上下),计算的目的是想在最后获得的offsetWidth/offsetHeiht
* 中将他们减掉.有两点要说明:
* (1)使用offsetWidth而不用width是因为width是内联的,如果没有在HTML中设置width属性或者在JS代码
*中显式设置width的值,那么将无法获取元素的width/height属性值,即使在样式文件中设置了元素该样式的值.
*某些自适应的元素我们并没有显式地在任何地方设置它的width/height,但有时候又的确需要获取这些自适应
*元素的width/height值.而使用offsetXXX就可以满足这些场景下的应用需求.
* (2)offsetXXX的值是包含了padding和border的(注意,不包含margin),所以下面的代码需要把他们减掉
*/
padding += parseFloat(jQuery.curCSS( elem,"padding" + this, true)) || 0;
border += parseFloat(jQuery.curCSS( elem,"border" + this + "Width", true)) || 0;
});
val -= Math.round(padding + border);
}//如果元素有'visible'的样式,直接调用getWH获取所要的值.请参考jQuery.fn.is函数的注释.
if ( jQuery(elem).is(":visible") )
getWH();//如果没有visible,并不能确定能正确地获取到width或者height的值,为了防止出乱子,调用jQuery.swap函数先将
//给元素设置上这样的属性{ position: "absolute",visibility: "hidden", display:"block" },再获取//元素的width/height的值,那样就十拿九稳了.(注意,swap函数最后会重置元素的样式值).至于为什么用swap就能
//避免乱子,可以参考jQuery.swap的中文注释.
else
jQuery.swap( elem, props, getWH );
//返回获取到的width/height值.
return Math.max(0, val);
}//如果不是获取width/height的值,就不用担心border/padding的问题,直接调用'幕后'的curCSS完成样式的获取.
return jQuery.curCSS( elem, name, force );
},
/**
*获取元素当前正在使用的CSS属性值.这个方法是真正实现获取元素样式值的'幕后函数'.
*它能够获取元素目前层叠和展现出来的样式的值,而不管这个值是内联的还是在别处(如嵌入式或css文件)层叠出来的.
*
* @param {HTMLElement} elem 要获取或设置这个元素的css
* @param {string} name css属性的名字
* @param {Object} force一个布尔的开关,为true则直接获取元素的计算样式的值.
*如果为false或者不传入这个值,则会在获取计算样式之
*前先看看内联样式上有没有name所指定的样式的值.
*/
curCSS: function( elem, name, force ) {
var ret, style = elem.style;
// A helper method for determining if an element's valuesare broken
//翻译:一个用以判断元素的值是否"有损坏"(即是否正确)的辅助方法.
/**
* 该方法主要针对Safari.
*在Safari中获取元素的color样式将会出现获取不到的情况.为了判断是否能够正确获取一个元素的计算样式
* 编写了这个跨浏览器的辅助方法.
*
* @param {Object} elem 要判断的DOM元素.
*/
function color( elem ) {
/*
*COMP:在Safari中获取元素的color样式将会出现获取不到的情况.
*如果不是Safari就可以返回false了.因为他们不会存在这个问题.
*/
if ( !jQuery.browser.safari )
return false;
/*
* 如果代码能够运行到这里, 说明当前浏览器是Safari.
* 在Safari中获取元素的color样式将会出现获取不到的情况.
*使用下面这两行代码就是为了应付这个问题:(注意,下面的代码并不处理这个问题,只是起到一种报告的作用)
*如果getComputedStyle不能获取元素的计算样式,那么返回true(!ret),说明碰到了这个问题.因为连
*CSS2Properties都没有,那就更不用说在它上面获取color样式的值啦.
*如果getComputedStyle的确是返回了非空的CSS2Properties对象,那就看看能否获取非空白的color
* 属性.请看以下代码...
*/
// defaultView is cached
/* COMP:
*getComputedStyle函数的第二个属性在Mozilla和Firefox中实现对伪元素的查找.
*如可以将参数二设置为":after"或":before".这个参数在上述两种浏览器中不能省略.
*但是IE不支持这样的调用.一般情况下我们对伪元素也没有兴趣,于是为了省得出乱子,无论
* 在那一种浏览器中我都将第二个参数设为null.
*/
var ret = defaultView.getComputedStyle( elem, null );
return !ret || ret.getPropertyValue("color") == "";
}
/* We need to handle opacity special in IE
*COMP:IE中的透明度设置与获取跟w3c的不一样.这个地球人都知道了.
*/
if ( name == "opacity" && jQuery.browser.msie ) {
// 注意,参数style其实是elem.style属性.在这行的最后ret是属性'opacity'的值
ret = jQuery.attr( style, "opacity" );
/*
*下面的代码就是通过ret的值是否为""来判断到底什么类型的浏览器从而返回相应的opacity值
*如果ret=="",说明style没有opacity这个属性,当前浏览器是IE(IE实现透明度使用filter),返回1,
* 100%的透明. 若ret!="",那就直接返回咯.
*/
return ret == "" ?
"1" :
ret;
}
/* Opera sometimes will give the wrong display answer, thisfixes it, see #2037
*COMP:我们似乎经常可以在jQuery的中都有一些很"神经"的代码,他们总是把style保存起来,然后设置一个
*新的值,又然后把保存起来的旧的值设置回去.这样子做是为了解决某些浏览器的在CSS渲染上的问题.像英文
*注释所说的那样,如果你有兴趣,可以到jQuery的官方网站上看看编号为#2037的这个issue，它地址是：
* http://dev.jquery.com/ticket/2037
* 也可以参照jQuery.swap函数的中文注释.
*/
if ( jQuery.browser.opera && name == "display" ) {
var save = style.outline;
style.outline = "0 solid black";
style.outline = save;
}
/* Make sure we're using the right name for getting thefloat value
*COMP:其实这里也涉及到了一个兼容性问题.就是float这个样式属性在w3c中叫cssFloat,而在
* IE中则叫styleFloat
*/
if ( name.match( /float/i ) )
name = styleFloat;//styleFloat会根据浏览器的不同而选择使用'cssFloat(w3c)或者styleFloat(IE)'
// 如果没有为force指定值,那就不是"强迫直接获取计算样式值".
// 那么就先返回style[]内的样式值.注意,这里用style来获取的样式值只是元素内联样式而已
//不包括其他(样式文件等地方)设置的样式值.如果的确存在name所指定的内联样式的值,可以将ret返回了.
if ( !force && style && style[ name ] )
ret = style[ name ];
/* 如果没有那个样式的内联值,说明这个样式属性应该到其他地方找. 下面的代码就是为了完这个目标 */
/* COMP:
*如果在上面那个if里面没有找到name所指定的style,那说明这个样式的值并不在内联样式中设置,那就要用到
* 计算样式了,也就是下面两个else if所要做的事情.defaultView.getComputedStyle是w3c的方法.
* 而window.currentStyle则是IE的方法.
*/
else if ( defaultView.getComputedStyle ) {//<--检查是否存在defaultView.getComputedStyle
//有就说明是在遵循w3c标准的浏览器里.
// Only "float" is needed here
if ( name.match( /float/i ) )
name = "float";
/*
* 把骆驼式的变量名改写成需要的css标准形式,如:
* backgroundColor -> background-color
* marginTop -> margin-top
*/
name = name.replace( /([A-Z])/g, "-$1" ).toLowerCase();//获取elem的计算样式.这些样式或者定义在一个css文件中,又或者定义在其他的地方如<head>中的<style>标签内.
var computedStyle = defaultView.getComputedStyle( elem,null );
/*
*以上的computedStyle对象是一个CSS2Properties类的实例,通过这个对象的getPropertyValue
* 方法,传入一个样式的名字,就能获取样式的值.下面这个if就用这个方法获取元素的计算样式.
*注意if中的!color(elem),它的意思为"获取elem的color样式不会失败,getComputedStle能够正确报告自己的
* 计算样式值".
*/
if ( computedStyle && !color( elem ) )//经过if的测试,我们能够正确地获取元素的计算样式值.可以放心地获取name所指定的属性了.
ret = computedStyle.getPropertyValue( name );
// If the element isn't reporting its values properly inSafari
// then some display: none elements are involved
/*
*运行这个else的大多数情况就是因为!color(elem)是false.这说明我们在获取元素的计算样式值会失败.
* 这里要说明一个重要的知识点:CSS(Cascade StyleSheet)是层叠样式表的意思,但是现在许多人都忽略了"层叠"
*二字.实际上"层叠"是CSS的一个最基本的特征.一个元素当前展现出来的样式,其实是它自己及其祖先的样式一层一层
* 叠加的结果.计算样式要获取的样式值就是这种叠加的结果.所以当计算样式不正常的时候,解决方案自然而然地就是
* 从自己以及祖先上,一层一层地找问题.
*于是下面的这个else就是从元素自己开始,遍历自身及其所有祖先.在遍历的过程中使用一种叫swap的方法,让元素的
*display属性为block,这样就能正常获取某些样式的值(因为他们显示不正常多半是由于自己dispaly为none所造成).
* 而swap方法最后也会重置元素的display值.
*/
else {
var swap = [], stack = [], a = elem, i = 0;
// Locate all of the parent display: none elements
//从自己开始,一直向上层找,发现不能正常获取其计算样式值的元素就把它放进stack中(压栈)
for ( ; a && color(a); a = a.parentNode )
stack.unshift(a);//在数组头"压入"元素
// Go through and make them visible, but in reverse
// (It would be better if we knew the exact displaytype that they had)
/*
*在以下的for循环里,我们从最顶层的祖先开始,倒着顺序(即从最外层到最内层)设置元素的display让其为可见(block),
* 并且记录下每一个元素原先的display类型,待会设置回去.
* 这种设置display为block,然后dosomething,最后重置display的方法,John Resig(jQeury作者,我师父)
* 称之为 Swap.在jQuery源代码中,也存在这样一个叫jQuery.swap的内部方法.
*/
for ( ; i < stack.length; i++ )
/*在上一个for中,我们首先将元素自己加进了stack中,而不管它是否经过color了的测试.因此需要在这里用
* color函数判断是不是每个元素都有问题.注意,变量a是有可能在其上正确地获取计算样式的.所以
* swap.length == stack.length 或者 swap.length== stack.length - 1.
* 所以造成了后面的代码出现swap[ stack.length -1 ]是否为null的判断.如果是null,说明元素
*的计算样式正常(因为不正常才会在swap中有"案底"),可以放心获取.
*/
if ( color( stack[ i ] ) ) {
swap[ i ] = stack[ i ].style.display;
stack[ i ].style.display = "block";
}
// Since we flip the display style, we have tohandle that
// one special, otherwise get the value
/*
*我们采用了让display为block的方法来获取正常的计算样式,但如果要获取的计算样式正是display自己呢?
*以下代码是说,如果要获取的计算样式名不是display或者是display但元素的计算样式没有broken,那么可以
*用computedStyle放心获取.如果是display并且在swap中有"案底"(!=null),就让最后的返回结果ret为
* "none". 至于为什么是none,这个我保留意见(<-TODO).
*/
ret = name == "display" && swap[ stack.length - 1 ]!= null ?
"none" :
( computedStyle && computedStyle.getPropertyValue( name ) ) || "";
// Finally, revert the display styles back
// 翻译:最后,恢复原来的样式
for ( i = 0; i < swap.length; i++ )
if ( swap[ i ] != null )
stack[ i ].style.display = swap[ i ];
}//end else
// We should always get a number back from opacity
/*经过上面的代码所要的计算样式都应该有结果了.这些结果要么是正常的值要么就是""
*特别地对opacity进行处理一下,如果获取它的结果是"",那至少让它是"1",不透明.
*/
if ( name == "opacity" && ret == "" )
ret = "1";
}
/*
* 如果代码运行这个elseif,那说明当前浏览器是IE,那就使用IE特有的方法来获取计算样式.
*/
else if ( elem.currentStyle ) {//camelCase是说类似"paddingTop"第二个单词首字母大写的变量名书写形式
//以下代码是将属性名称改写成camelCase的形式
var camelCase = name.replace(/\-(\w)/g, function(all,letter){
return letter.toUpperCase();
});
// 使用传入的属性名称试一试,如果不行,就使用camelCase的变量名形式再试一试.
ret = elem.currentStyle[ name ] || elem.currentStyle[camelCase ];
// From the awesome hack by Dean Edwards
//http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291
/*
* TODO:以下if中的代码比较匪夷所思,他的作者DeanEdwards(Resig也是'抄'来的)并没有说明其原理.
* 我分析了好久都不明玄妙,希望高人指点!
*/
// If we're not dealing with a regular pixel number
// but a number that has a weird ending, we need toconvert it to pixels
/* 直接翻译:如果获取到的结果不是一个正常的pixel值(如,100,没有px结尾)而是一个怪异结尾的数字,我需要将它
* 转换为正常pixels.
*/
if ( !/^\d+(px)?$/i.test( ret ) && /^\d/.test( ret ) ) {//正则表达式就不解释了,写起来就罗嗦了.
// Remember the original values
//暂时把style.left,runtimeStyle.lfet样式值保存起来,等获取到需要的值的时候再设回去.
var left = style.left, rsLeft = elem.runtimeStyle.left;
/*在IE中,元素的runtimeStyle与style的作用相同,但优先级更高.
*在w3c标准中document.defaultView.getOverrideStyle是与之相对应的方法,
*但是由于Gecko核心的浏览器并没有实现这个标准,所以这意味着这种方法仅对IE有效.
*/
// Put in the new values to get a computed value out
elem.runtimeStyle.left = elem.currentStyle.left;
style.left = ret || 0;//style在函数的最开始有定义:style = elem.style
ret = style.pixelLeft + "px";
// Revert the changed values
// 恢复原来的样式
style.left = left;
elem.runtimeStyle.left = rsLeft;
}
}
return ret;
},
/**
* 如果elems是Number类型,则变成数字字符;
* 如果elems是XHTML字符串,则将这些字符变成真正的DOM Element然后把这些元素存储在匹配元素集合里面.
*在jQuery对象的构造函数中,当传入的字符串是HTML字符串时,jQuery将会调用本函数来将这些字符串转化成为DOM Element.
*
* @param {string} elems - 它是一个字符串.
* @param {HTML Element} context -elem所处的上下文.在本函数中,这个context必须为一个与elems有包含关系的document.
*/
clean: function( elems, context ) {
var ret = [];
context = context || document;
// COMP: !context.createElement fails in IE with an errorbut returns typeof 'object'
//作者本来想使用'if(!context.createElement)'来代替下面这个'if',但是因为在IE中这个表达式不能达到目的, 于是使用了现在这个
// 表达式.
if (typeof context.createElement == 'undefined')//如果context没有context.createElement方法, 那必须让context//至少是一个拥有createElement的元素. 之所以不直接让context等于//document是因为考虑到jQuery的对象不仅仅是HTML, 还有XML.
context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
/* 对elems里的每一个元素都调用一个匿名函数进行处理
* 这个函数进行的处理是:
* 如果这个元素是Number类型,则把它变成数字字符.
* 如果这个元素是XHTML string,那把string中的">"和"<"之间的文本去掉,然后将它变dom对象并获取其内的子节点数组(childNodes),最后把这个数组装进一个
* 结果集里面
*
*
* 下面就是上述功能的实现. 里面包括了一些上面没有讲到的细节.
*/
jQuery.each(elems, function(i, elem){
if ( !elem )//如果elem是空的,那就不用干活了.
return;
if ( elem.constructor == Number )//如果是数字,则通过与''进行'+'运算将数字变成数字字符.
elem += '';
// Convert html string into DOM nodes
// 翻译:将HTML 字符串转化成DOM节点
if ( typeof elem == "string" ) {
// Fix "XHTML"-style tags in all browsers
//参数说明: all - 匹配到的整个字符串 ; front -match的第一个分组'<标签名';// tag - 第二个分组(在这里就是tag的名称)
elem = elem.replace(/(<(\w+)[^>]*?)\/>/g, function(all, front, tag){
return tag.match(/^(abbr|br|col|img|input|link|meta|param|hr|area|embed)$/i) ?
all ://如果是上面列出的tag(他们都是单标签),直接把匹配到的标签返回
front + "></" + tag + ">";//如果不是上面所列的单标签,就把他们变成空的双标签并返回
});
// Trim whitespace, otherwise indexOf won't work asexpected
var tags = jQuery.trim( elem ).toLowerCase(),
div = context.createElement("div");
/* 现在对以上的这个div进行说明:
*这个div只是一个临时的容器而已.目的是等下将合适的htmlstring装进这个div里面(通过innerHTML方法),
* 好让string变成DOM元素.这个是将HTMLstring转化成为DOM元素比较流行和唯一的做法.
*/
// 对下面wrap的说明:
//要elem的标签加上一个"外壳",而wrap就是用来"包住"elem的html标签
// 下面将检查tags里面是否含有所列举的标签.如果有就把wrap赋值为对应的"外壳"标签,等下使用.
// 对下面你看到的数组进行说明:
// 数组下标为0的元素表示这个"外壳"含有几层,元素1、2表示"外壳"的开始和结束标签
//请注意运算符'&&'在JavaScript中的'妙用'(参见'attr'函数的中文注释.提示,ctrl + 'F',搜索'attr:')
var wrap =
// option or optgroup
!tags.indexOf("<opt") &&
[ 1, "<select multiple='multiple'>", "</select>"] ||
!tags.indexOf("<leg") &&
[ 1, "<fieldset>", "</fieldset>" ] ||
tags.match(/^<(thead|tbody|tfoot|colg|cap)/) &&
[ 1, "<table>", "</table>" ] ||
!tags.indexOf("<tr") &&
[ 2, "<table><tbody>", "</tbody></table>" ] ||
// <thead> matched above
(!tags.indexOf("<td") || !tags.indexOf("<th")) &&
[ 3, "<table><tbody><tr>","</tr></tbody></table>" ] ||
!tags.indexOf("<col") &&
[ 2, "<table><tbody></tbody><colgroup>","</colgroup></table>" ] ||
// IE can't serialize <link> and <script> tagsnormally
jQuery.browser.msie &&
[ 1, "div<div>", "</div>" ] ||
[ 0, "", "" ];
// Go to html and back, then peel off extra wrappers
//用这个"外壳"把elem包起来.注意,通过innerHTML的运算之后,HTMLstring已经成为了实实在在的DOM元素.
div.innerHTML = wrap[1] + elem + wrap[2];
// Move to the right depth
//通过循环,让div指向被包裹的elem元素的上一层.举个简单一点的例子,如果我们传入的HTML string是 '<option>linhuihua.com</option>'
//那么经过innerHTML之后,div的DOM层次是(注意div再也不是字符串,人家现在是一个堂堂正正的DOM元素):
/* <select>
* <option>linhuihua.com</option>
* </select>
* 进过下面这个while循环之后,'div'这个引用将会指向'select'这一层
*/
while ( wrap[0]-- )
div = div.lastChild;
/*COMP:如果世界上没有IE浏览器,那么下面这个'if'就可以省略了...
* 看以下代码的时候,可以首先省略下面的这个'if':
* 经过上面的while处理之后, 现在要想获得HTMLstring所对应的DOM元素只要用div.childNodes里面的元素组成一个
*array然后返回即可(childNodes只是类数组对象,它没有数组的排序等算法).很可惜的是,IE会给<table>元素内自动
*加上<tbody>,这样就破坏了我们企图通过childNodes获得我们想要元素的美梦.下面就写一个if语句来处理IE的这个问题.
*/
// Remove IE's autoinserted <tbody> from tablefragments
// IE会在table 内自己加上<tbody>, 现在要把它去掉
if ( jQuery.browser.msie ) {
// String was a <table>, *may* have spurious<tbody>
var tbody = !tags.indexOf("<table") && tags.indexOf("<tbody") < 0 ?
div.firstChild && div.firstChild.childNodes ://如果没有table标签并且也没有tbody标签,就返回div下的所有子节点,用tbody装着
// String was a bare <thead> or <tfoot>
wrap[1] == "<table>" && tags.indexOf("<tbody") < 0 ?//如果是table标签,但其内没有tbody标签
div.childNodes ://(true)就返回标签下的所有子元素
[];//(false)就返回一个空的集合
for ( var j = tbody.length - 1; j >= 0 ; --j )
// 如果tbody[j]是一个tbody标签元素&& 这个tbody元素有子元素
if ( jQuery.nodeName( tbody[ j ], "tbody" )&& !tbody[ j ].childNodes.length )
tbody[ j ].parentNode.removeChild( tbody[j ] );//叫自己的parent把自己删除掉
// IE completely kills leading whitespace wheninnerHTML is used
// COMP:在使用innerHTML向元素注入HTML时,如果这些HTML由一个whitespace打头(开始),IE会把这个whitespace给"kill"掉
// 检查是不是属于这种情况,如果是就把这个whitespace插回去
if ( /^\s/.test( elem ) )
div.insertBefore( context.createTextNode(elem.match(/^\s*/)[0] ), div.firstChild );
}
// 处理完IE会自己加tbody的bug之后,就可以把结果返回了
// 由于childNodes并不是一个真正的数组,因此需要调用jQuery.makeArray来将它转换成为一个数组.详细参见jQuery.makeArray
// 的中文注释.
elem = jQuery.makeArray( div.childNodes );
}//end if( type of elem == "string")
//在最后返回之前如果发现结果集里面没有元素,并且elem又不是(form或者select)
if ( elem.length === 0 && (!jQuery.nodeName( elem, "form") && !jQuery.nodeName( elem, "select" )) )
return;//什么也不做了,返回.不用把这个元素加到结果集里面
// 下面两种情况都要把elem加到结果集里面
if ( elem[0] == undefined || jQuery.nodeName( elem,"form" ) || elem.options )
ret.push( elem );
else
ret = jQuery.merge( ret, elem );
});// end jQuery.each();
return ret;
},
/**
* 获取或设置属性值.没有传入value则被视为获取属性值的操作
*
* @param {HTMLElement} elem
* @param {string} name
* @param {string} value
*/
attr: function( elem, name, value ) {
// don't set attributes on text and comment nodes
if (!elem || elem.nodeType == 3 || elem.nodeType == 8)
return undefined;
var notxml = !jQuery.isXMLDoc( elem ),
// Whether we are setting (or getting)
set = value !== undefined,//我们是seting呢还是getting
msie = jQuery.browser.msie;//是否是IE
// Try to normalize/fix the name
// 一些属性名字在Js中的表述并不是原来的属性名字.如class,在JavaScript中就是className. 所以要对这种情况进行处理
name = notxml && jQuery.props[ name ] || name;
// Only do all the following if this is a node (faster forstyle)
// IE elem.getAttribute passes even for style
// 我们只对有tagName的元素进行属性的访问或者设置
if ( elem.tagName ) {
// These attributes require special treatment
var special = /href|src|style/.test( name );
// Safari mis-reports the default selected property of ahidden option
// Accessing the parent's selectedIndex property fixes it
// COMP:这是Safari的一个bug
if ( name == "selected" && jQuery.browser.safari )
elem.parentNode.selectedIndex;
// If applicable, access the attribute via the DOM 0 way
// 如果elem的属性中有name所指示的属性 &&elem不是XML类型节点 && 不是要特殊对待的属性(href/src/style)
if ( name in elem && notxml && !special ) {
if ( set ){
// We can't allow the type property to bechanged (since it causes problems in IE)
//在IE中不能改变input元素的type属性，不然就会出乱子。所以只要是修改input的type属性的操作都给它一个Exception！
if ( name == "type" && jQuery.nodeName( elem,"input" ) && elem.parentNode )
throw "type property can't be changed";
// 好了, 可以设置属性了
elem[ name ] = value;
}
// browsers index elements by id/name on forms, givepriority to attributes.
// 设置完之后还要把设置成功后的值返回
// 如果是elem是一个form && elem有这个属性
if( jQuery.nodeName( elem, "form" ) && elem.getAttributeNode(name) )
return elem.getAttributeNode( name ).nodeValue;//返回这个属性的值
// 程序运行到这里, 说明元素不是一个form元素,那直接就把元素的值返回
return elem[ name ];
}
// 程序能运行到这里, 说明 elem 并没有 name所指示的属性或者name是一个特殊属性(href/src/style)
// 如果是IE浏览器 && 不是 XML节点 && name == "style"
if ( msie && notxml && name == "style" )
return jQuery.attr( elem.style, "cssText", value );
if ( set )
// convert the value to a string (all browsers dothis but IE) see #1070
// 如果属性是一个非string的值,除IE外所有的浏览器都能很好地工作.所以为了让大家都能很好地工作,使用""+vlaue将value变成一个string
elem.setAttribute( name, "" + value );
/* set完值之后就要把刚刚设置的值返回 */
// 获取IE的href/src/style属性需要进行特别步骤
var attr = msie && notxml && special
// Some attributes require a special call on IE
? elem.getAttribute( name, 2 )//getAttribute在网上说只有一个参数. 而IE可以用两个参数.果然是"specialcall on IE"
: elem.getAttribute( name );
// Non-existent attributes return null, we normalize toundefined
// 如果返回 undefined就说明属性设置失败了
return attr === null ? undefined : attr;
}
// elem is actually elem.style ... set the style
// 前面有一行代码: " jQuery.attr( elem.style, "cssText",value ); " ,以下的代码就是处理这种情况的了
// IE uses filters for opacity
// 如果是IE的opacity滤镜
if ( msie && name == "opacity" ) {
if ( set ) {
// IE has trouble with opacity if it does not havelayout
// Force it by setting the zoom level
/*
* 原文翻译:如果元素没有layout,那么IE在处理opacity的时候就会出现问题.设置zoom值强迫它拥有layout.
*
* 一定有人不明白什么是layout的:
* layout是IE独有的概念.(请相信我,这个layout是不是你脑海里面的那个layout.总之,你可以把它当作新名词来理解就可以了):
* 简单地说, 在IE中,一个元素如果拥有layout,那么它就可以控制自己及其子元素的尺寸和位置.注意,在其他的浏览器中并没有一个元素拥有layout
* 这样的概念. layout的存在是当前IE不少Bug的根源.关于layout的更多内容,请参阅《精通CSS——高级Web标准解决方案》(CSSMastery Advanced
* Standards Solutions)一书.
*
*下面的zoom属性是Mirosoft独有的属性,通过设置它，能迫使一个元素具有layout.
*/
elem.zoom = 1;
// Set the alpha filter to set the opacity
elem.filter = (elem.filter || "").replace(/alpha\([^)]*\)/, "" ) +
(parseInt( value ) + '' == "NaN" ? "" :"alpha(opacity=" + value * 100 + ")");
}
/* set完之后,就把刚刚set的值返回.直接获取属性值,也是执行下面的代码 */
return elem.filter && elem.filter.indexOf("opacity=") >=0 ?
(parseFloat( elem.filter.match(/opacity=([^)]*)/)[1]) / 100) + '':
"";
}
// 程序能运行到这里,说明并非要设置或者获取IE的opacity属性.
// 就是要设置或获取普通的Style属性.
//正则表达式后边的ig的含义: i -忽略大小写区别 ; g - 匹配所有可能的子串,一个也不要放过
// 匿名函数中函数参数说明:参数all - 匹配到的整个字符串 ; 参数letter -匹配到的字符串的字母部分(第1个分组)
name = name.replace(/-([a-z])/ig, function(all, letter){
return letter.toUpperCase();//把匹配到的字符变成大写的,实际上是想做这样的效果:"margin-Top" ->"marginTop"
});
if ( set )
elem[ name ] = value;
return elem[ name ];
},
/**
* 普通的trim函数,和Java String的trim函数的作用一样:
* 将字符串头尾的" "空字符去掉
*
* @param {string} text 需要整理的字符串
*/
trim: function( text ) {
return (text || "").replace( /^\s+|\s+$/g, "" );
},
/**
* 用一个Array克隆另外一个内容一致的数组
*注意这种克隆并非真正意义上的克隆.因为如果源数组内的元素是引用的话,在源数组上对引用内容的任何修改都会反映到目标数组上.
* @param {Array} array 源数组.
*/
makeArray: function( array ) {
var ret = [];
if( array != null ){
var i = array.length;
// the window, strings and functions also have 'length'
//jQuery作者Resig(也就是我师父..)告诉了我们一个天大的秘密:window,string,function都有'length'属性哦.
// 如果是这些元素,那么就把这些元素作为数组的第一个元素.
if( i == null || array.split || array.setInterval ||array.call )
ret[0] = array;
else
while( i )//这里ret[--i]会比array[i]先运行哦,不然就会出现数据越界的问题.
ret[--i] = array[i];
}
//最后返回这个新的数组.
return ret;
},
/**
* 检测一个元素是否在提供的array之内.返回元素在数组中的下标.
*
* @param {HTMLElement} elem
* @param {Array} array
*/
inArray: function( elem, array ) {
for ( var i = 0, length = array.length; i < length; i++ )
// Use === because on IE, window == document
// COMP:在IE中表达式(window == document)返回true...所以使用===
if ( array[ i ] === elem )
return i;
return -1;
},
/*
* 把两个数组拼接起来(将第二个数组接到第一个数组的尾巴上)
*/
merge: function( first, second ) {
// We have to loop this way because IE & Opera overwrite thelength
// expando of getElementsByTagName
var i = 0, elem, pos = first.length;
// Also, we need to make sure that the correct elements arebeing returned
// (IE returns comment nodes in a '*' query)
// 翻译:在一个使用'*'的选择器中,IE会返回注释节点.
if ( jQuery.browser.msie ) {
while ( elem = second[ i++ ] )
if ( elem.nodeType != 8 )//NodeType == 8 是comment节点
first[ pos++ ] = elem;
} else
while ( elem = second[ i++ ] )
first[ pos++ ] = elem;
return first;
},
/**
* 返回一个数组中不重复的所有元素(用一个新的数组装着返回)
*
* @param {Object} array
*/
unique: function( array ) {
var ret = [], //结果集
done = {};//用这个对象记录某个元素是否被处理过
try {
for ( var i = 0, length = array.length; i < length; i++ ){//使用jQuery.data函数获取元素的id.即使元素没有id,jQuery函数也会为元素新建一个id.
var id = jQuery.data( array[ i ] );//如果这个id是第一出现,就在done里面记录下来,表示已经处理过.然后把元素放进结果集中等待返回.
if ( !done[ id ] ) {
done[ id ] = true;
ret.push( array[ i ] );
}
}
} catch( e ) {
//发生任何异常就直接把原数组返回.
ret = array;
}
return ret;
},
/**
* 使用过滤函数过滤数组元素。
* 此函数至少传递两个参数：
* elems - 待过滤数组
* callback - 过滤函数. 过滤函数必须返回 true 以保留元素或false 以删除元素。
* inv -第三个参数是invert的意思,即过滤的逻辑跟第二个参数指定的函数的逻辑相反.
*如,第二个参数的逻辑如果为选择大于0的元素,那么如果三个参数为true,则将小于0的元素选择出来
*
* @param {Object} elems
* @param {Object} callback
* @param {Object} inv
*/
grep: function( elems, callback, inv ) {
var ret = [];
// Go through the array, only saving the items
// that pass the validator function
for ( var i = 0, length = elems.length; i < length; i++ )
if ( !inv != !callback( elems[ i ], i ) )
ret.push( elems[ i ] );
return ret;
},
/**
* 用第二个参数 callback提供的映射函数处理第一个参数中的每一个元素,将处理结果用一个新的数组装起来并返回
*
* @param {Array} elems 类数组或者数组
* @param {Function} callback 映射处理函数
*/
map: function( elems, callback ) {
var ret = [];
// Go through the array, translating each of the items totheir
// new value (or values).
// 翻译: 遍历数组(也可以是类数组对象),把其中的每一个元素转换为他新值.
for ( var i = 0, length = elems.length; i < length; i++ ) {
var value = callback( elems[ i ], i );
// value不是 null，说明处理成功，把它加入新的数组里面去
if ( value != null )
ret[ ret.length ] = value;
}
//返回一个新的数组，这个数组中的每个元素都是由原来数组中的元素经callback处理后得来
return ret.concat.apply( [], ret );
}
});
//我们将会使用navigator.userAgent来判断当前用户代理是哪一款浏览器
var userAgent = navigator.userAgent.toLowerCase();
//Figure out what browser is being used
//COMP:userAgent并不一定是可靠的.
//在下面的代码里就使用userAgent来判断当前浏览器了.
//可以在下面看到一些挺有趣的结果:比如写着是IE但可能是opera浏览器,写着Mozilla但也有有可能是IE浏览器...
jQuery.browser = {
version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) ||[])[1],
safari: /webkit/.test( userAgent ),
opera: /opera/.test( userAgent ),
msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ),
mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent )
};
//float这个样式属性在IE和在其他现代标准浏览器中的名字有些不一样.
var styleFloat = jQuery.browser.msie ?
"styleFloat" ://如果是IE浏览器
"cssFloat";//如果是其他的浏览器
//通过extend函数让jQuery的名字空间具有以下一些属性:
//(1) boxModel:当前浏览器是否使用标准的盒子模型.
//(2) props:一些特殊的样式名称在JavaScript被改成了其他的叫法,目的是不与一些JS现有的保留字冲突,如for,这是流程控制
//语言的关键字,那么在JavaScript中就是用了htmlFor来代替它.
jQuery.extend({
// Check to see if the W3C box model is being used
//不是ie就一定使用了w3c的盒子模型.如果是ie,那就要看看有没有使用CSS1Compat,如果有的话,也是w3c的盒子模型.
boxModel: !jQuery.browser.msie || document.compatMode =="CSS1Compat",
props: {
"for": "htmlFor",
"class": "className",
"float": styleFloat,
cssFloat: styleFloat,
styleFloat: styleFloat,
readonly: "readOnly",
maxlength: "maxLength",
cellspacing: "cellSpacing"
}
});
/*
*这里调用jQuery.each函数,逐个访问下面罗列出来的各个函数.each函数的第二个参数(它是一个函数)对他们进行一定的包装
*之后,将他们'接'到每一个jQuery对象上.让每一个jQuery对象都具有这些包装方法.
* 可以看到,这组函数与DOM操作有关.具体细节请接下来慢慢欣赏:
*/
jQuery.each({
parent: function(elem){return elem.parentNode;},
parents: function(elem){return jQuery.dir(elem,"parentNode");},
next: function(elem){return jQuery.nth(elem,2,"nextSibling");},
prev: function(elem){return jQuery.nth(elem,2,"previousSibling");},
nextAll: function(elem){return jQuery.dir(elem,"nextSibling");},
prevAll: function(elem){return jQuery.dir(elem,"previousSibling");},
siblings: function(elem){return jQuery.sibling(elem.parentNode.firstChild,elem);},
children: function(elem){return jQuery.sibling(elem.firstChild);},
contents: function(elem){return jQuery.nodeName(elem,"iframe")?elem.contentDocument||elem.contentWindow.document:jQuery.makeArray(elem.childNodes);}
},
/*each函数将遍历上面列出的所有方法.然后对上面的每一个方法调用以下函数进行处理.处理的内容是:
*将每一个方法包装一下,然后将这个包装过后的方法'接'到每一个jQuery对象上.让每一个jQuery对象都具有这些包装方法.
*/
function(name, fn){//在这个scope中的代码里,this指向每一个上面列出的函数,如'parent'.而在下面的代码中,function(selector)内的
//的this指的是一个jQuery对象.
/* 以下将进行包装fn的工作.实际上,包装的内容为:
* (1)使用fn对jQuery对象内匹配元素集合中的每一个元素进行处理.处理后的结果用一个数组返回.
* (2) 使用selector对象(1)所得的数组进行过滤
* (3) 将(2)处理后的数组替换掉jQuery对象原来匹配元素集合.
* 请看以下具体代码,里面有一些这里没有提到的细节.
*/
/*以下这个函数就是所谓的包装函数了.这个包装函数最后将成为jQuery对象的一个方法.如我们要包装parent函数:
*parent函数返回元素的parent.而这个函数经过包装之后,功能就变成了返回一个集合,而这个集合就是jQuery对象
*内匹配元素集合中每一个元素的parent所组成的数组.而在返回这个数组之前,还需要经过selector的过滤.
*/
jQuery.fn[ name ] = function( selector ) {//调用map函数,让jQuery对象内匹配元素集合中每一个元素都进过fn的处理,处理后的结果集中起来,放到一个数
//组中返回给ret.也许jQuery.map的中文注释能够帮助你理解这一步...
var ret = jQuery.map( this, fn );
//经过fn的处理之后,如果有selector就是使用selector进行过滤.
if ( selector && typeof selector == "string" )
/*调用过jQuery模块的核心函数multiFilter对ret进行过滤.注意,multiFilter接收三个参数.而这里只给
*它传入了两个参数.这样调用的结果跟传入三个参数且第三个参数为false是一样的,即selector所描述的元素
*全部都要留下来作为结果.具体可以参考jQuery.multiFilter的中文注释.
*/
ret = jQuery.multiFilter( selector, ret );
/* 返回结果之前,还要进行处理:
* (1)使用unique函数将ret中重复的元素去掉.(参考jQuery.unique函数)
* (2)由于最终目的是想要用结果集替换jQuery对象内的匹配元素集合,也即本函数将会修改匹配元素集合,故需要在这里
*设置一个'恢复点',以便能在需要的时候调用jQuery.fn.end函数来恢复.(同时请参考jQuery.fn.pushStack)
*/
return this.pushStack( jQuery.unique( ret ) );
};
});
/* 以下的each调用跟上面那个each调用的思路一致.
*不过现在有些小改变.这次利用这个each调用在原有函数的基础之上稍作包装,让这些包装成为原有函数的'逆调用'.
*如原来的a.apppend(b)是把b追加到a的childNodes里,而现在则利用append,来定义一个appendTo函数,它
*在作用是若a.appendTo(b),那么就是把a追加到b的childNodes里.其他函数类推.
*
* 可以看到这组函数与DOM操作有关.
*/
jQuery.each({
appendTo: "append",
prependTo: "prepend",
insertBefore: "before",
insertAfter: "after",
replaceAll: "replaceWith"
},
//each函数给callback函数(也就是下面这个函数)传入属性的名称(name),以及属性的值(original)
//为了让更好地说明代码的思路,我结合一个具体的值来讲解.就假设我们当前处理的是appendTo(它的值是'append')
//那么name就是'appendTo',original就是'append'.
function(name, original){//这里的name如果是'appendTo',那么我们就是在定义一个jQuery.fn.appendTo函数
jQuery.fn[ name ] = function() {//记录下传给这个函数的所有参数,我们假设args的值是['"<b>Hello</b>"']
var args = arguments;
//注意,在这个scope(作用范围)内的this指的是一个jQuery对象.
//each函数处理过后,依然返回这个jQuery对象的引用.
//那each到底处理的内容是什么呢?继续往下看:
return this.each(function(){//注意,在这个scope(作用范围)内的this指的则是,jQuery对象内匹配元素集合中的每一个元素.
//对传进来的参数进行遍历.注意我们已经在上面假设args ==['"<b>Hello</b>"']//将所有的假设数据套进来看看是什么意思:(只看循环体内的代码)
/*
* jQuery('<b>Hello</b>')['append'](this);
*///可以看到,我们使用'<b>Hello</b>'新建了一个jQuery对象,然后调用'原来的'append方法,反过来将//匹配元素集合中的元素this(注意这里的this不是jQuery对象而是一个普通的DOM元素)加进了它的childNodes中.
for ( var i = 0, length = args.length; i < length; i++ )
jQuery( args[ i ] )[ original ]( this );
});
};
});
/*
*这里each调用与上面的each调用其目的也是大同小异:让下列方法成为jQuery对象的方法.
*
* 这组函数大部分与元素的属性以及样式有关.
*/
jQuery.each({
/**
*清空jQuery对象内匹配元素集合中每一个元素上的name所指定的属性值的内容.
*
* @param {string} name 属性名称
*/
removeAttr: function( name ) {//注意,在这里的this引用的是匹配元素集合中的每一个元素(它一般是一个DOM元素).在jQuery中想要清楚地知道//this所引用的对象是什么并不容易,尤其是在跟each函数'搅'在一起的时候.如果你真的被jQuery的this搞糊涂了,
//那么我建议你先看看each的中文注释.//为了避免remove掉一个并不存在属性,以下三行代码首先将name所指定的属性置为"",这样不管你有没有name所指定
//的属性,反正现在你是有了.然后调用removeAttribute来删除该属性.
jQuery.attr( this, name, "" );
if (this.nodeType == 1/* Node.ELEMENT_NODE */)
this.removeAttribute( name );
},
/**
*为元素添加一个类名.它将会在元素原有的类名后面接上空格,然后接上新的类名.
*可以看到,它的内部调用了jQeury.className命名空间内的add函数完成任务.jQuery.className内的函数只是内部
* 使用的,并不对外公开.可以参考jQuery.className的中文注释.
*
* @param {string} classNames
*/
addClass: function( classNames ) {
//this引用的是一个普通的DOMElement元素.不是jQuery对象.
jQuery.className.add( this, classNames );
},
/**
* 为元素移除classNames所指定的类名.具体说明同addClass函数.
*
* @param {string} classNames 字符串,形如"class1 class2 class3".
*/
removeClass: function( classNames ) {
//this引用的是一个普通的DOMElement元素.不是jQuery对象.
jQuery.className.remove( this, classNames );
},
/**
* 交替类名.
*其实作用很简单:如果元素有classNames指定的类名就去掉这个类名,如果没有这个类名就添加上这个类名.
* 函数说明类同于addClass.
*
* @param {Object} classNames
*/
toggleClass: function( classNames ) {
//this引用的是一个普通的DOMElement元素.不是jQuery对象.
jQuery.className[ jQuery.className.has( this, classNames ) ?"remove" : "add" ]( this, classNames );
},
/**
*无参的情况下让匹配元素集合中的每一个元素从它的parentNode中移除(remove)出来.
* 有参的话,那么就只把selector所指定的元素移除.
*
* @param {Object} selector
*/
remove: function( selector ) {
//this引用的是一个普通的DOMElement元素.不是jQuery对象.
/* 有两种情况就会执行下面的if语句:
* (1) 没有传入selector.jQuery会将这种情况会默认为'*',即选择所有的元素.
* (2)有传入selector,但是这个selecotr并不能选择到任何的元素.即下面代码中的r.length == 0
*
*注意,jQuery.filter函数将返回一个对象,其内有一个名为r的属性.这个属性装着的就是filter执行后的结果集.
*它是一个数组.因此通过查询这个集合的length属性就能够判断selector到底有没有选择到元素.具体请参考
* jQuery.filter的中文注释.
*/
if ( !selector || jQuery.filter( selector, [ this ] ).r.length ) {
// Prevent memory leaks
//翻译:防止内存泄漏.以下三行代码的目的是在删除节点之前将节点对应的所有'遗物'删除掉.这些包括元素的事件
//监听器和它缓存的数据.如果不做这个工作,那么将会有可能导致内存泄漏.
jQuery( "*", this ).add(this).each(function(){//<-用this的所有后代节点新建一个jQuery对象
//然后用add方法将自己也加进这个jQuery对象的
//匹配元素集合中.最后就对集合中的所有元素都
//移除事件监听器和缓存数据.
jQuery.event.remove(this);
jQuery.removeData(this);
});
//叫元素的双亲节点删除元素自己...
if (this.parentNode)
this.parentNode.removeChild( this );
}
},
/**
* 删除匹配元素集合中所有的子节点。
*/
empty: function() {
//注意,this引用的是一个普通的DOMElement元素.不是jQuery对象.
// Remove element nodes and prevent memory leaks
//其实单就清除子节点这个功能来说,用下面那个while循环已经能完事.但是由于remove函数会做一些防止内存泄漏的
//措施.故我们在while之前调用remove先清理一次.再调用while循环来善后.(请参考jQuery.remove的中文注释)
jQuery( ">*", this ).remove();//">*"的意思是说,this下的所有后代节点.
// Remove any remaining nodes
while ( this.firstChild )
this.removeChild( this.firstChild );
}
},
//这个就是each所调用的callback函数.它将上述每一个函数包装一下,然后把他们'接'到每一个jQuery对象上.至于'包装'的内容
//是什么,请继续往下欣赏:
function(name, fn){
jQuery.fn[ name ] = function(){//调用each函数在匹配元素集合中的每一个元素上都调用一遍那个函数(即fn).
return this.each( fn, arguments );
//如果还是不明白each的作用,建议参考jQuery.each函数的中文注释.
};
});
/**
* 为jQuery对象添加两个函数:width函数和height函数.
* 他们分别用来获取/设置jQuery对象内匹配元素集合中的宽度和高度.
*
*注意,匹配元素集合内的元素大部份情况下是普通的HTMLElement元素,但是也有可能是window或者是document对象
*要处理这种情况,随之而来要处理就是大量的在window和在document上的不兼容问题.从而使得本函数显得有些复杂.
*/
jQuery.each([ "Height", "Width" ], function(i, name){
var type = name.toLowerCase();//变成小写
//为jQuery对象添加width和height方法.
jQuery.fn[ type ] = function( size ) {
//这个函数里面用到了嵌套的?:运算符,所以要小心区分哪个':'是属于那个'?'的.
//COMP:在这里,不同浏览器之间关于窗口和文档大小的兼容性问题的解决比较精彩,值得学习!
//同时也值得注意,当本函数在获取window的width/height时,实际上获取的是客户区的大小.也即经常听说的
// '视口'的大小,而并不是整个程序窗口的大小.
// Get window width or height
return this[0] == window ?
// Opera reports document.body.client[Width/Height]properly in both quirks and standards
jQuery.browser.opera && document.body[ "client" + name ]||
// Safari reports inner[Width/Height] just fine (Mozillaand Opera include scroll bar widths)
jQuery.browser.safari && window[ "inner" + name ] ||
// Everyone else use document.documentElement ordocument.body depending on Quirks vs Standards mode
/* 教学时间:
*实际上,以下这行代码主要是面向IE浏览器.在IE怪癖模式下或者在IE的标准模式下视口的大小来源是不同的.在
*没有DOCTYPE声明的页面中,视口大小(clientWidth/clientHeight)在doucment.body上.而当有了DOCTYPE
*声明之后,他们就在document.doucmentElement上了.实际上,w3c把视口大小的名称定为innerWidth/Height
*而IE以及Opera等则把它命名为clientWidth/Height.为了迎合IE系的开发者,Firefox等浏览器都实现了
* documentElement.其使用方法也是一样的.
*/
document.compatMode == "CSS1Compat" && document.documentElement[ "client" + name ] || document.body[ "client" + name] :
// Get document width or height
this[0] == document ?
// Either scroll[Width/Height] oroffset[Width/Height], whichever is greater
Math.max(
/* 各款浏览器在对待scrollWidth/scrollHeightoffsetWidth/offsetHeight上表现迥异
* TODO:姑且先记住以下代码是一种解决方案吧...
*/
Math.max(document.body["scroll" + name], document.documentElement["scroll" + name]),
Math.max(document.body["offset" + name], document.documentElement["offset" + name])
) :
// Get or set width or height on the element
// 翻译:获取/设置 元素的width/height
size == undefined ?//如果没有给函数传进值来,那就表示要获取值,否则就是设置值
// Get width or height on the element
// 翻译:获取元素的width/height
(this.length ? jQuery.css( this[0], type ) : null) :
// Set the width or height on the element(default to pixels if value is unitless)
// 翻译:设置元素的width 或者height(如果没有带单位,缺省使用px)
//注意,这里调用了jQuery对象的css方法而不是jQuery.css方法.jQuery.css方法只能用来返回元素
//的样式值,是不能用来设置样式值的.而这里的this.css是一个jQeury对象实例的方法.这两者是不一样的
//请具体参考jQuery.fn.css方法和jQuery.fn.attr方法的中文注释.
this.css( type, size.constructor == String ? size: size + "px" );
};
});
// Helper function used by the dimensions and offset modules
// 翻译:在尺寸模块和offset模块会用到的辅助函数.
// 注意, "dimensions and offsetmodules"是jQuery源代码中的最后一个模块.
// 本函数使用jQuery.curCSS函数来获取元素某个样式的值(数字部分).
function num(elem, prop) {
return elem[0] && parseInt( jQuery.curCSS(elem[0], prop, true),10 ) || 0;
}
//COMP:
//COMP:TODO:Safari的问题.
var chars = jQuery.browser.safari && parseInt(jQuery.browser.version)< 417 ?
"(?:[\\w*_-]|\\\\.)" :
"(?:[\\w\u0128-\uFFFF*_-]|\\\\.)",
quickChild = new RegExp("^>\\s*(" + chars + "+)"),
quickID = new RegExp("^(" + chars + "+)(#)(" + chars + "+)"),
quickClass = new RegExp("^([#.]?)(" + chars + "*)");
/**
*这里将通过extned函数,扩展jQuery的功能.这些功能主要与正则表达式,过滤器有关.由于涉及正则表达式,看起来会比较吃力.
*/
jQuery.extend({
/**
* 一个问题:类似":last" 这样的伪类选择器是怎样被选择出来的?
* 下面的这个 jQuery.expr 对象内的函数将会告诉你答案.
*
*原来在我们的表达式最终将会被jQuery.filter函数接收到,然后在filter函数通过正则表达式(parse数组内的正则表达式. parse数组?查找一下吧)
*将选择器中的符号和名称部分截取出来(如':last'的符号部分就是':',名称部分
*就是'last').查看符号以及名称是什么,然后对号入座找到相应的函数进行处理.如我们的':last'就会
*由jQuery.expr[':']['last']函数进行处理.又如':first'将会由.jQuery.expr[':'].first函数进行处理.
*
*你可以看到,这些函数并没有做什么,只是根据自己的条件,做出最后的布尔判断而已.实际上,这些函数最后将会传给jQuery.grep
*函数并作为它(jQuery.grep)的一个过滤函数使用.如果下面列出的任意一个的函数(如first)返回false,意思就是告诉grep
*函数当前处理的这个元素不符合过滤的要求,当前元素不需加入最后的结果集.如果返回true,则说明当前元素符合过滤的条件,可
* 以把它放入最后的结果集.
*
*最后注意,jQuery.grep函数有一个布尔类型的参数(第三个参数),它将用来控制过滤函数返回true或false时的具体含义.
*ture是要留下这个元素呢,还是不要?这都由这个布尔参数来决定.默认情况下(不传入这个参数时)就是我上面所说的过滤逻辑
* 即false不要,true留下.
*
* 建议再查看jQuery.filter函数之前,查看jQuery.grep函数的中文注释.
*/
expr: {
"" : function(a,i,m){return m[2]=="*"||jQuery.nodeName(a,m[2]);},
"#" : function(a,i,m){return a.getAttribute("id")==m[2];},
":" : {
/*':'命名空间下的以下这些函数的作用可以查阅这份jQuery在线Api文档:
*http://jquery-api-zh-cn.googlecode.com/svn/trunk/index.html的'选择器'部分
*
* 我在这里就不copy了,那么我在这里说些有技术含量的——
*以下这些函数在什么情况下、如何被使用到呢?以下举个例子说明:
*当我们使用$('p:first')创建一个jQuery对象的时候,':first'是这样被处理的:
*jQuery对象首先用'p'选择出document中的所有p放入到匹配元素集合中去.然后调用jQuery.fn.find
*函数进行过滤.find函数又调用jQuery.grep函数(它是一个静态函数)进行过滤,jQuery.grep函数又调用
*jQuery.find(它是一个静态函数)进行过滤,jQuery.find函数又调用filter函数进行过滤.这时候,
*jQuery.filter函数就从selector中截取出':first'(注意,selector是被一层一层传进来的).jQuery.filter
*函数首先就用':'和'first'在jQuery.expr中查找合适的过滤函数,最后,它找到了jQuery.expr[':'].first
*那么jQuery.filter最后就把这个函数交给jQuery.grep做最后的过滤,最后得到过滤的结果集.
*
*是不是感觉很复杂?如果你认为这个并不重要,那你仅仅是需要知道jQuery.filter和jQuery.grep
* 函数在选择结果筛选方面处于核心地位就可以了.
*
*最后要注意,这些函数每个参数的含义:a表示当前处理的匹配元素集合中的那个元素;i表示这个元素在匹配元素集
*合中的索引,m就是在jQuery.filter函数中对选择器进行正则匹配的结果集,它是一个数组.具体见jQuery.filter
* 函数.
*/
// Position Checks
lt: function(a,i,m){return i<m[3]-0;},
gt: function(a,i,m){return i>m[3]-0;},
nth: function(a,i,m){return m[3]-0==i;},
eq: function(a,i,m){return m[3]-0==i;},
first: function(a,i){return i==0;},
last: function(a,i,m,r){return i==r.length-1;},
even: function(a,i){return i%2==0;},
odd: function(a,i){return i%2;},
// Child Checks
"first-child": function(a){return a.parentNode.getElementsByTagName("*")[0]==a;},
"last-child": function(a){return jQuery.nth(a.parentNode.lastChild,1,"previousSibling")==a;},
"only-child": function(a){return !jQuery.nth(a.parentNode.lastChild,2,"previousSibling");},
// Parent Checks
parent : function(a){return a.firstChild;},
empty : function(a){return !a.firstChild;},
// Text Check
contains: function(a,i,m){return (a.textContent||a.innerText||jQuery(a).text()||"").indexOf(m[3])>=0;},
// Visibility
visible: function(a){return "hidden"!=a.type&&jQuery.css(a,"display")!="none"&&jQuery.css(a,"visibility")!="hidden";},
hidden: function(a){return "hidden"==a.type||jQuery.css(a,"display")=="none"||jQuery.css(a,"visibility")=="hidden";},
// Form attributes
enabled: function(a){return !a.disabled;},
disabled: function(a){return a.disabled;},
checked: function(a){return a.checked;},
selected: function(a){return a.selected||jQuery.attr(a,"selected");},
// Form elements
text: function(a){return "text"==a.type;},
radio: function(a){return "radio"==a.type;},
checkbox: function(a){return "checkbox"==a.type;},
file: function(a){return "file"==a.type;},
password: function(a){return "password"==a.type;},
submit: function(a){return "submit"==a.type;},
image: function(a){return "image"==a.type;},
reset: function(a){return "reset"==a.type;},
button: function(a){return "button"==a.type||jQuery.nodeName(a,"button");},
input: function(a){return /input|select|textarea|button/i.test(a.nodeName);},
// :has()
has: function(a,i,m){return jQuery.find(m[3],a).length;},
// :header
header: function(a){return /h\d/i.test(a.nodeName);},
// :animated
animated: function(a){return jQuery.grep(jQuery.timers,function(fn){return a==fn.elem;}).length;}
}
},
// The regular expressions that power the parsing engine
// 翻译:让解析引擎具有无比威力的正则表达式
//这些正则表达式在filter函数中被使用.传进给filter函数的选择器将会经过这些正则表达式的测试.
// 具体看jQuery.filter函数.
parse: [
// Match: [@value='test'], [@foo]
/^(\[) *@?([\w-]+) *([!*$^~=]*) *('?"?)(.*?)\4 *\]/,
// Match: :contains('foo')
/^(:)([\w-]+)\("?'?(.*?(\(.*?\))?[^(]*?)"?'?\)/,
// Match: :even, :last-child, #id, .class
new RegExp("^([:.#]*)(" + chars + "+)")
],
//"
/**
*一个能够处理多个选择器的过滤器.可以看到multifilter其实是调用jQuery.filter函数来实现功能的.其'处理多个
* 选择器'的实质是多次调用filter函数.
*
* 什么是多个选择器?如"form > input,#id"内就有两个过滤器,他们之间用','隔开.
*
* expr 选择器,字符串.
* elems 即选择器其作用的范围.也就是通常所说的'上下文'.
* not一个开关,表示是否开启"非模式".到底是'过滤掉(非模式)'还是'过滤剩'呢?这都由not来决定.not为true表示,选择器t所指定
*的元素全部从过滤结果中去掉.而not为false或者不传入时,则表示选择器t所指定的元素全部加进结果集中.
*/
multiFilter: function( expr, elems, not ) {
var old,//它用来装传进来的正则表达式.由于expr在下面的while中会不断地被while修改,old就用来记录expr
//在这一次修改前前的状态.以通过 expr ==old来判断expr是否被修改过.
cur = [];//当前经过过滤的结果集.
//循环条件加上expr !=old是为了应对expr没有被匹配到的情况.在这种情况之下,while就不会停了
while ( expr && expr != old ) {
old = expr;//保存当前expr的值,等到下一次循环时看看expr有没有被改变.//调用jQuery.filter进行真正的过滤.下面对jQuery.filter函数的返回值进行说明://f是一个对象,它有两个属性,分别是r和t。r是过滤后的结果集合,而t就是经过filter截取之后的expr.
//如我们将'form > input,#id'传给jQuery.filter函数.经过处理之后,这个字符串将会变成',#id'并存放在//一个对象的t属性当中,然后这个对象被返回并给f接收了.于是现在的f.t就是',#id'了.
var f = jQuery.filter( expr, elems, not );//把f.t内位于字符串前端的','去掉.如把',#id'的','去掉就成为了'#id'.
expr = f.t.replace(/^\s*,\s*/, "" );
cur = not ? //是否有开启'非模式'?如果有就把f.r赋给elems留作下一次过滤的上下文.即在上一次过滤掉的结果
elems = f.r : //上再过滤掉后面的选择器所指定的元素.
jQuery.merge( cur, f.r );//如果没有开启'非模式',那么就把所有过滤器过滤的结果集统统合并在一起.
//经过了jQuery.filter这一回合的处理,expr会被剪掉已经匹配的那一部分选择器了.
//如果被剪掉之后expr还没有空,证明还有活干,还要继续匹配,这样循环就继续,一直到expr空了或者expr==old为止.
}
return cur;//最后把结果集返回.
},
/**
* 在context中搜寻t所指定的子元素,并将结果放在一个数组中返回.
*
* @param {string} t - 选择器
* @param {Object} context -选择器进行选择所依赖的上下文.可以看到如果没有传入,那它就是document.
*/
find: function( t, context ) {
// Quickly handle non-string expressions
// 如果选择器不是string,那就直接把t装在一个数组中返回.
if ( typeof t != "string" )
return [ t ];
// check to make sure context is a DOM element or a document
//保证context至少是一个DOM元素(HTMLElement或者HTMLDocument),如果都不是,那就返回一个空集合.
if ( context && context.nodeType != 1/* Node.ELEMENT_NODE */&& context.nodeType != 9/* Node.DOCUMENT_NODE */)
return [ ];
// Set the correct context (if none is provided)
// 至少让这个context为document元素: 有传入context当然好,没的话就让context为document
context = context || document;
// Initialize the search
// 初始化搜寻
var ret = [context], //最终的结果集
done = [],
last, //这个在下面的注释中有讲解.
nodeName;//它用来装待会在t中匹配出来的后代节点的节点类型名称.
// Continue while a selector expression exists, and while
// we're no longer looping upon ourselves
/* 在以下的while循环中,将会对t(提个醒,t是选择器字符串)进行裁减.每经过一次循环,t就有可能被裁减一次.
*如果经过一次循环回来后发现t已经是''或者t跟本次循环开始前是一样的(last!= t),那么循环就终止.
* 这个while循环的目的在于遍历t内的所有选择器.
*/
while ( t && last != t ) {
var r = [];//结果集合初始化为空集合.
last = t;//让last保存当前的t的内容,因为在等下的处理当中t的内容很可能被更改.并且我们通过对比t前后的内容以判断t是否得到匹配.
t = jQuery.trim(t);//去掉t两头空格
var foundToken = false,//一个标志,告诉我们整个查找是否已经完成了.
// An attempt at speeding up child selectors that
// point to a specific element tag
//原文翻译:加快指向特定标签的子选择器的速度...(有点不知所云,是吧...别急,继续往下看)
re = quickChild,//quickChild这个正则表达式已经在整个正则过滤模块开始的时候已经定义.可以使用Ctrl+F倒回去看看
//类似'>span'这样的选择器就叫做quickChild.
m = re.exec(t);//在t中查找符合re这个正则表达式所描述的字串,并将匹配的结果装入一个数组返回给m
//如果 exec 方法没有找到匹配，则它返回null。如果它找到匹配，则 exec 方法返回一个数组，并且更新全局 RegExp对象的属性，以//反映匹配结果。数组的0元素包含了完整的匹配，而第1到n元素中包含的是匹配中出现的任意一个子匹配。即下标1到n表示正则表达式的分组号
//如果你还不是太清楚,别急,继续往下看.
// 如果有匹配的字串,说明t是类似"> pspan"的情况,那就首先从context的childNodes里面找,看看有没有符合要求的子节点
if ( m ) {
//m[1]表示第一个分组(quickChild的第一个分组),如果t为"form >input",那么m[0] == "> input", m[1] == "input"
nodeName = m[1].toUpperCase();
// Perform our own iteration and filter
//接下来的for循环是遍历context的childNodes,把每一个tagName是nodeName的加进结果集来.如果nodeName是*,那就把所有的childNodes加进结果
//集来
//注意,ret已经初始化为ret[context]
for ( var i = 0; ret[i]; i++ )
for ( var c = ret[i].firstChild; c; c = c.nextSibling )
// nodeName = m[1]
if ( c.nodeType == 1/* Node.ELEMENT_NODE */&& (nodeName == "*" || c.nodeName.toUpperCase() == nodeName) )
r.push( c );//把节点加进结果集
ret = r;
t = t.replace( re, "" );//把匹配的字符去掉,说明这次匹配已经完成//接下来看t(提醒,它是一个selector)里面是不是还有空格,如果有,说明是活还没干完,t内仍然有选择器. 那继续在找到的集
//合里面找"儿子的儿子",继续循环
if ( t.indexOf(" ") == 0 ) continue;
foundToken = true;//做一个记号.说明查找完成了.
}//endif.利用这个if来判断t不是不是符合quickChild的字符模式.
// else是说,t这个选择器里面并没有quickChild模式的字串,即没有类似"> input"这样的串
else {
//再来定义一个正则表达式
re = /^([>+~])\s*(\w*)/i;
// 如果跟t匹配的话...(如t的值为:"> input" 或者 "+input" 又或者 "~ input")
if ( (m = re.exec(t)) != null ) {
r = [];//结果集合初始化为空集合.
var merge = {};
nodeName = m[2].toUpperCase();//注意啊,在这里的分组2才是nodeName!这个跟quickChild不一样啊.
m = m[1];// m[1]的就是">" "+" "~" 中的一种//注意,for循环中的ret被初始化为[context].这个for的意思就是在所有的context中查找t所指定的子元素.
for ( var j = 0, rl = ret.length; j < rl; j++ ) {
// m如果是"~"和"+"中的一个, 就让n =ret[j].nextSibling
// 否则(m == ">"), 就让n = ret[j].firstChild
//这是因为'>'表示的是一种父子的关系,而'~'和'+'则表示一种兄弟的关系.可以参考这篇在线文档://http://jquery-api-zh-cn.googlecode.com/svn/trunk/index.html的'选择器'->'层级'
var n = m == "~" || m == "+" ? ret[j].nextSibling : ret[j].firstChild;
for ( ; n; n = n.nextSibling )
if ( n.nodeType == 1/* Node.ELEMENT_NODE*/ ) {//只对元素节点感兴趣
var id = jQuery.data(n);//jQuery.data函数原来的作用是获取存在这个节点上的数据.//但是当我们只传入第一个元素给它的时候,它只返回元素在全局数据缓存区中的缓存区id.//这个id由jQuery全局同一分配,如果一个元素并没有id的时候,jQuery.data会给它//分配一个.这里获取这个id仅仅是为了要做一个记号,防止重复合并同一个元素而已//建议参考jQuery.data//merge初始是一个空对象
if ( m == "~" && merge[id] )
break;//如果m=="~"即要选择所有的siblings &&这个节点(n)已经被加入了结果集,马上跳出循环//如果没有指定nodeName(那就是说不管什么元素,统统都要啦)或者n的nodeName就是指定nodeName,那就把元素加进结果集
if (!nodeName || n.nodeName.toUpperCase() == nodeName ) {
if ( m == "~" ) merge[id] = true;//作个记号,说明这个元素已经被加进结果集了.
r.push( n );//把元素加进结果集
}
if ( m == "+" ) break;//如果m=="+",只要一个就够了.如'label +input'就表示紧接着label的那个input//另外还需要注意,在下一次循环中,可能还有元素要加进结果集合.因为'紧接着label的那//个input'并不能指定一个唯一的元素.
}
}//end for
ret = r;//将r中的结果交给ret,ret是最后的结果集.
// And remove the token
t = jQuery.trim( t.replace( re, "" ) );//把匹配的字符串去掉,说明这个匹配已经完成
foundToken = true;//作个记号,说明还是有收获的,选择器匹配到了元素.
}
}
/*上面的代码目的是想看看t是否匹配quickChild的模式.而下面的的一个if就是检查匹配的结果.如果下面的if内的代码能够执行
*这表明t并不是quickChild所描述的那种字符串模式.那么我们就会用其他的字符模式去尝试匹配它.请继续观看...
*/
// See if there's still an expression, and that wehaven't already
// matched a token
// t里面是不是还有selector &&还没找到合适的元素?(!foundToken)
if ( t && !foundToken ) {
// Handle multiple expressions
//如果现在的t里面不含有",",说明t是一个单独的选择器.注意','是用来分隔多个选择器的.如'#id1,#id2'就是两个选择器.
if ( !t.indexOf(",") ) {
// Clean the result set//如果ret[0]还是context,说明前面的操作并没有找到合适的元素,把context给"弹"出来,清空ret
if ( context == ret[0] ) ret.shift();
// Merge the result sets
done = jQuery.merge( done, ret );//done才是最后要返回的结果数组.而ret,r都是临时的结果集.
// Reset the context
r = ret = [context];
// Touch up the selector string
t = " " + t.substr(1,t.length);
}
//如果现在的t里面含有",",说明t是一个'复合选择器(multiSelector)',即t内还有多个选择器(它们之间用','隔开)
else {
// Optimize for the case nodeName#idName
var re2 = quickID;//quickID这个正则表达式描述的是nodeName#idName这样的字符串模式
var m = re2.exec(t);//把匹配的结果装进一个数组,然后返回给m
// Re-organize the results, so that they'reconsistent
//重新组织一下匹配的结果,这么做是为了和上面的处理保持一致:m[1]应该是一个符号,而m[2]就是符号的右边的名称
if ( m ) {
m = [ 0, m[2], m[3], m[1] ];
}
// 如果t还不能得到匹配,那现在的这个t内可能是含有传统的id或class(如'#id','.className'),用quickClass
//正则式去尝试匹配它.注意别被quickClass的名字'骗'了.通过查看它的代码可以清楚看到,quickClass即匹配id,又匹配className
else {
// Otherwise, do a traditional filter checkfor
// ID, class, and element selectors
re2 = quickClass;//quickClass正则表达式描述的是类似"#id",".className"这样的字符串模式
m = re2.exec(t);//测试t的模式,然后把匹配的结果放到放到一个数组里面,然后返回给m
}
// 将id名或者是class名内的"\"去掉
m[2] = m[2].replace(/\\/g, "");
var elem = ret[ret.length-1];
// Try to do a global search by ID, where we can
//如果m[1]是'#',那我们就看看当前的文档是不是xml文档.如果不是xml文档,并且elem具有getElementById,
//那就表明elem就是一个HTMLDocument元素.注意,getElementById并不能用在XML文档当中.
if ( m[1] == "#" && elem && elem.getElementById&& !jQuery.isXMLDoc(elem) ) {
// Optimization for HTML document case
//程序能运行到这里,说明elem是一个HTMLDocument元素.直接使用它的getElmentById函数,m[2]是匹配到的id名
var oid = elem.getElementById(m[2]);
// Do a quick check for the existence of theactual ID attribute
// to avoid selecting by the name attributein IE
// also check to insure id is a string toavoid selecting an element with the name of 'id' inside a form
/*COMP:在IE中getElementById可能会把name为同样值的元素给选择出来,如:
* <form>
* <input name="goodInput"></input>
* </form>
*当我们使用document.getElmentById('goodInput')的时候,就会把这个鬼input选择进来.
*所以为了避免这种情况给我们带来的乱子,我们首先要检测一下当前浏览器是不是IE或者Opera(他们都有这个问题),然后再看看他们的id
*属性是不是我们所要的那个id.如果不是,那么调用代码Query('[@id="'+m[2]+'"]',elem)[0] 来获得一个真正的,id为我们所指
* 定的值的元素,然后让oid指向这个元素.
*/
if ( (jQuery.browser.msie||jQuery.browser.opera) && oid && typeof oid.id == "string" && oid.id != m[2] )
oid = jQuery('[@id="'+m[2]+'"]', elem)[0];
// Do a quick check for node name (whereapplicable) so
// that div#foo searches will be really fast
/*在上面的注释中讲过,像'div#foo'这样的字符串模式被quickID匹配之后,其结果数组被保存到了m中.然后这个m经过了一个小小的
*调整之后,m内的元素顺序发生了改变.以'div#foo'为例,这个时候m[1]=='#',m[2]=='foo',m[3]=='div',所以作者才会说
* "Do a quick check for node name...".
*经过m[3]nodeName的测试,证实oid的确具有m[3]所指定的nodeName,那就把oid装进数组中并作为结果返回.如果oid根本就没有
* m[3]所指定的nodeName,则返回一个空的数组.
*/
ret = r = oid && (!m[3] || jQuery.nodeName(oid, m[3])) ? [oid] : [];
}
//如果不是上面那种情况
else {
// We need to find all descendant elements
// 翻译:我们需要找出所有的后代元素
//来一个for循环,遍历初始化时装入ret中上下文元素.也就是说,现在我们不是要找出所有的后代元素吗?那到底要找出谁的后代呢?
// 答案就是,他们都在ret中.
for ( var i = 0; ret[i]; i++ ) {
// Grab the tag name being searched for
var tag = m[1] == "#" && m[3] ? m[3] : m[1] != "" || m[0] == "" ? "*" : m[2];
// Handle IE7 being really dumb about<object>s
// COMP:TODO:在IE7中,quickID这个正则表达式似乎不能够正确地工作在<object>元素上.
//tag的匹配结果如果是'*',那并不一定是一个正常的结果.有可能是IE7的<object>bug所造成
//下面的这个if语句就是要处理IE7关于'object'的这个问题.
if ( tag == "*" && ret[i].nodeName.toLowerCase() == "object" )
tag = "param";
/*getElementByTagName是定义在HTMLElement接口中方法.所有的DOM元素都实现了这个接口
*可以看到,以下代码使用getElementByTagName取得ret中第i个上下文元素的所有后代节点,然后把这些后代并入r中.
*/
r = jQuery.merge( r, ret[i].getElementsByTagName( tag ));
}
// It's faster to filter by class and bedone with it
// 如果传入的是一个类选择器.
if ( m[1] == "." )//调用类选择器专用的filter函数.它的参数的意思是说,在r中过滤剩下具有m[2]所指定的类名的元素
r = jQuery.classFilter( r, m[2] );
// Same with ID filtering
// ID选择器
if ( m[1] == "#" ) {
var tmp = [];
// Try to find the element with the ID
//只要一找到拥有指定id的元素就可以停止查找,并返回结果了.
for ( var i = 0; r[i]; i++ )
if ( r[i].getAttribute("id") == m[2]) {
tmp = [ r[i] ];
break;
}
r = tmp;
}
ret = r;
}//endl else
t = t.replace( re2, "" );//完成对re2的匹配,可以将它从t中取出掉了.
}//end else.
}
//经过上面这么多层的过滤之后(每次过滤都会将t内的匹配字符串变为""),t内如果还有存在selector,说明我们'quickXXXX'的选择器
//并不能满足需求.那就调用最基本,最原始jQuery.filter过滤器来处理,因为它能够处理任何合法形式的选择器.
// If a selector string still exists
if ( t ) {
// Attempt to filter it
var val = jQuery.filter(t,r);//t是选择器,r是选择器其作用的上下文,也即t的作用范围.
ret = r = val.r;//val.r是filter过滤后的结果.
t = jQuery.trim(val.t);//val.t则是经过filter处理后,裁减过的选择器.
}
}//end while
// An error occurred with the selector;
// just return an empty set instead
//如果传入一个不合法的选择器,即t的值不是正常的值.那么程序运行到这里t是有可能还是有值的.在这种异常的情况之下,我们返回一个空的数组作为回应.
if ( t )
ret = [];
// Remove the root context
// 移除根元素
if ( ret && context == ret[0] )
ret.shift();
// And combine the results
done = jQuery.merge( done, ret );//done才是最后要返回的结果集.而ret是一个临时的结果集合.
return done;
},
/**
* 从r中过滤掉className不符合要求的元素
* r - 一个result set,函数将从这个集合内过滤剩或者过滤掉由m选择器指定的元素
* m - 它是一个style类名.
* not - 是要过滤掉,还是过滤剩呢?由这个参数作为一个开关
*/
classFilter: function(r,m,not){
//给m所指定的类名的左右两边各添加一个空格,是为了防止m所指定的类名被其他的类名包含的情况,如:
//'className'就会被'theclassName'包含,从而导致了等下使用indexOf函数判断的失败.
m = " " + m + " ";
var tmp = [];
//逐个检查r中的每一个元素,看看它是否有m所指定的类名.
for ( var i = 0; r[i]; i++ ) {
var pass = (" " + r[i].className + " ").indexOf( m ) >= 0;
if ( !not && pass || not && !pass )//这个表达式太精练了,没有办法用语言描述,也很简单...
tmp.push( r[i] );
}
return tmp;//返回过滤后的结果.
},
/**
*在r指定的元素里面,过滤出t所指定的元素(t是selector,一般为string类型)
*
* t - 选择器
* r - 选择器执行的上下文.即选择器要在r所指定的元素范围内
* not -一个开关,表示是否开启"非模式".是'过滤掉'还是'过滤剩'呢?这都由not来决定.not为true表示,选择器t所指定
*的元素全部从过滤结果中去掉.而not为false或者不传入时,则表示选择器t所指定的元素全部加进结果集中.
*
*/
filter: function(t,r,not) {
var last;
// Look for common filter expressions
/* t是传进来的一个字符串,它是一个选择器,形如:'selector1.selector2 :selector3'.(注意这个字符串内有3个
* 选择器)。我们需要逐步截取出每一个选择器.在'selector1'匹配的结果中再用'.selector2'过滤.一直这么循环
* 下去.while面的这个while循环就是执行上述的功能.
*
*这里再说一下while循环的循环条件中的last.它的意思是'上一次循环开始时使用的selector'.由于while的每一
*次循环中都会对选择器t进行截取,故再每一次循环后t都不应该跟原来的一样.如果经过循环之后选择器t还是保持原样
* 即 t == last,说明t已经不能再被截取并进行处理了.
*/
while ( t && t != last ) {
last = t;//记录下现在这个seletor的样子,留待下次循环条件检查的时候看看t有没有变化.
var p = jQuery.parse, m;//m等下会用来装正则表达式内的匹配结果.
//p是一个数组,其内装着三个正则表达式,用来匹配类似这样的字串情形:
//情形一: [@value='test'], [@foo]
//情形二: :contains('foo')
//情形三: :even, :last-child, #id, .class
//注意, p仅要求首次匹配的子串//遍历上面的三种情况,看看t是当中的哪一种.找出之后,将匹配的结果放入m中,再做点处理,留待下面使用.
for ( var i = 0; p[i]; i++ ) {
m = p[i].exec( t );
if ( m ) {//如果m是有值的,说明t内仍然有需要处理的选择器.
// Remove what we just matched
// 原文翻译: 把刚才的匹配的字串从t中给去掉
t = t.substring( m[0].length );
m[2] = m[2].replace(/\\/g, "");//就是符号后的字符串,例如匹配的字串为":even",则m[1] == ":" ; m[2] =="even"
break;//找到了t属于那一种情况,那就赶快跳出for吧
}
}
//如果t根本就不匹配, 那就跳出整个while循环,函数返回
if ( !m )
break;
// 好了,找到t属于哪种情况了.那么对这种情况的每一子情况进行处理
// 下面一连串的if / else if /else 就是分情况进行处理
// :not() is a special case that can be optimized by
// keeping it out of the expression list
// 原文翻译: :not() 是一个特殊的情况.把它放到表达式之外可以使它得到优化
/* 你一定在骂我'什么狗屎翻译...',我说明一下吧:
*如果选择器中有':not'则说明将紧跟其后的选择器(即m[3])所匹配的元素从结果集中过滤出去.这是目标是通
* 过递归掉用filter并传入给它第三个参数(true)达到的.
*/
if ( m[1] == ":" && m[2] == "not" )
// optimize if only one selector found (most commoncase)
r = isSimple.test( m[3] ) ? // isSimple =/^.[^:#\[\.]*$/ , 例解:m[3]是:not('inner_selector')内的inner_selector
jQuery.filter(m[3], r, true).r ://如果就是simple的选择器(以":" 、":"、"."等开头的选择器),那就交回给本函数处理,同时给本函数传多
// 一个标记:not= true. 这个表示要将匹配的元素进行剔除的操作
jQuery( r ).not( m[3] ); //如果不是simple的选择器比如说不只一个选择器,那就使用更加"专业"的not函数来处理了.
// We can get a big speed boost by filtering by class here
// 原文翻译: 使用class来过滤的话将会使速度得到很大的提升
else if ( m[1] == "." )//如果是使用类来过滤,就调用classFilter来处理
r = jQuery.classFilter(r, m[2], not);//not起一个开关的作用,为ture时,要的元素不要,不要的元素反而要...
else if ( m[1] == "[" ) {
var tmp = [], type = m[3];//m[3]是这样的一个值:如整个匹配字符串为"[att $= value]", 那么m[1]=="[" ; m[2]=="attr" ;m[3]=="$="
//提醒:r是传进本函数的一个参数.可以看看函数签名(函数头的定义)
for ( var i = 0, rl = r.length; i < rl; i++ ) {
var a = r[i],
z = a[ jQuery.props[m[2]] || m[2] ];//props数组确保m[2]所指定的属性名在JS中是有效的,如dom元素属性class在//JavaScript中应该表述为className//那么z就是a所指代元素的属性值
//如果属性值是空的 或者属性名称是href/src/selected,你就要把这个属性值"调整"一下
//为什么要调整一下呢? 因为如果上面的a[jQuery.props[m[2]] || m[2]]返回的值z是null,说明使用快捷方式来获取属性值失败了,那就使用更
//加"专业"的获取方法:attr//属性的获取在不同的浏览器下会有一些bug,这个需要attr来处理.另外像opacity这样的属性,在IE下在filter内设置,而在w3c浏览器下则是在//style.opacity内设置.这些差异性,都是需要attr来处理的.//多数情况之下,直接获取属性失败都是因为上述的那些差异.
if ( z == null || /href|src|selected/.test(m[2]) )
z = jQuery.attr(a,m[2]) || '';//获取到了属性值之后,看看到底选择器要函数干些什么.看看type就知道(m[5]是匹配到的属性值,m[4]是括住这个属性值的单引号或者双引号)
//
//"= value"等于value
//"!= vlaue"不等于value
//"^= value"以value开头
//"$= value"以value结尾
//"*= value"包含value
if ( (type == "" && !!z ||//如果z是有值的(不是undefined或者null),那!!z 就是true,否则为false
type == "=" && z == m[5] ||
type == "!=" && z != m[5] ||
type == "^=" && z && !z.indexOf(m[5]) ||//!负数 === false
type == "$=" && z.substr(z.length - m[5].length) == m[5] ||
(type == "*=" || type == "~=") && z.indexOf(m[5]) >= 0) ^ not ) //TODO: not很有可能是将集合取非,而不是Resig说的//一个或者多个selector
tmp.push( a );
}
r = tmp;
// We can get a speed boost by handling nth-child here
}
//来自API文档的描述:
//匹配其父元素下的第N个子或奇偶元素
//':eq(index)'只匹配一个元素，而这个将为每一个父元素匹配子元素。:nth-child从1开始的，而:eq()是从0算起的！
//可以使用:
//nth-child(even)
//:nth-child(odd)
//:nth-child(3n)
//:nth-child(2)
//:nth-child(3n+1)
//:nth-child(3n+2)
else if ( m[1] == ":" && m[2] == "nth-child" ) {
var merge = {}, tmp = [],
// parse equations like 'even', 'odd', '5','2n', '3n+2', '4n-1', '-n+6'
test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(
m[3] == "even" && "2n" || //" &&"在JS中操作符的说明:依次获取每一个操作数，将它们转换为布尔变
m[3] == "odd" && "2n+1" ||//量，如果是false，则直接返回这个操作数的值（注意，返回的是转换前的原值，不一定
!/\D/.test(m[3]) && "0n+" + m[3] ||//是布尔类型），中断后面操作数的处理；否则继续处理下一个操作数。如果直到最后一个操作数仍
m[3]),//然对应布尔变量true，则返回最后这个操作数的值
// calculate the numbers (first)n+(last)including if they are negative
// 如果m[3]=="-2n+1",则test[1]=="-" ;test[2]=="2" ; test[3]=="+1"
// 下面这个运算将上边分析出来的字符串转化成了数字
first = (test[1] + (test[2] || 1)) - 0, last =test[3] - 0;//获取完必要的参数之后,下面就要根据这些参数来查找(过滤)所需的元素了
// loop through all the elements left in the jQueryobject
//逐个逐个看看传进函数里面来的元素,看看是否符合需求
for ( var i = 0, rl = r.length; i < rl; i++ ) {
var node = r[i], parentNode = node.parentNode, id= jQuery.data(parentNode);
//merge用来记录已经处理过的元素.//如果id所指示的parentNode并没有被处理过,那就对这个parent的每一个孩子进行"普查",给他们每人一个"家庭编号"
//为什么要"普查"parent的孩子呢?//因为nth-child的操作的作用就是"匹配其父元素下的第N个子或奇偶元素"
//其实 "普查"的目的并不是所有的孩子,而是想知道node在这个parent的孩子中排第几
if ( !merge[id] ) {
var c = 1;
for ( var n = parentNode.firstChild; n; n = n.nextSibling )
if ( n.nodeType == 1 )
n.nodeIndex = c++;
merge[id] = true;//这个parent的孩子已经"普查"过了,记录下来
}
var add = false;//"普查"完毕之后,这个parent的每个孩子都拿到了一个编号,下面就要根据这个编号,按照条件,决定是否把一个孩子加入结果集里面
//first==0, 说明要的就是第last个孩子
if ( first == 0 ) {
if ( node.nodeIndex == last )
add = true;
}//下面是另一种情况.你的数学一定比我好,所有我就不多说了.//这个是为了保证nodeIndex跟last不相等
else if ( (node.nodeIndex - last) % first == 0 &&(node.nodeIndex - last) / first >= 0 )
add = true;
if ( add ^ not )//add跟not进行异或.not起一个开关的作用,为ture时,要的元素不要,不要的元素反而要...
tmp.push( node );
}//end for
r = tmp;
}
// Otherwise, find the expression to execute
//t都不是要匹配的三种基本情况,那就放到这个else里面处理
else {//expr是一个集合,集合里面有好多的函数,使用m[1]设定的值来索引这些函数
var fn = jQuery.expr[ m[1] ];//如果m[1]==":",那么fn还是一个对象,这个对象里面才是一堆的简单函数,使用m[2]再次索引出这些函数
if ( typeof fn == "object" )
fn = fn[ m[2] ];//如果函数是以字符串的形式给出,那么使用eval函数来使用它
if ( typeof fn == "string" )
fn = eval("false||function(a,i){return " + fn +";}");
// Execute it against the current filter
// 使用一个匿名函数来过滤元素.
// 可以看到匿名函数里面有使用了fn来做真正的过滤.
// 如果fn返回true,则把元素留下
// 如果fn返回false,则剔除元素.
//注意,这些'ture留下false去掉'的过滤逻辑并不是一成不变的,当jQuery.grep函数的第三个参数为true
// 时,过滤逻辑就是'ture去掉false留下'了
r = jQuery.grep( r, function(elem, i){
return fn(elem, i, m, r);//elem就是当前处理的匹配元素集合中的元素,i是它的索引.m是一个//数组,它装着对传入的选择器(t)进行正则匹配后的结果.r是经grep//处理过的当前结果集.只有jQuery.expr[':'].last函数使用了这个参数
}, not );//not如果为ture则翻转匿名函数的过滤逻辑:过滤函数原来那些要的元素就不要,不要的元素就要...
}
//程序到了这里,如果t里还有表达式,那就在进行一次循环.如此反复...
}//end while
// Return an array of filtered elements (r)
// and the modified expression string (t)
// 原文翻译: 将过滤得到的结果集(r)和修改过的表达式(t)返回
return { r: r, t: t };
},
/**
* 以elem为起点,沿着dir所指定的路线返回指定的元素.
* 有点晦涩,可能不太好理解,我举个例子:
*如elem是一个普通的DOM元素,而dir是'parentNode',那么dir函数就会返回[elem.parentNode,elem.parentNode.parentNode...].
*又比如,elem是一个普通的DOM元素,dir则是'nextSibling',那么dir就会返回[elem.nextSibling,elem.nextSibling.nextSibling...].
*注意,这种一层一层的返回不是没有限制的,当要处理的元素为document时,操作停止.
*
* @param {HTMLElement} elem一个普通的DOM元素.实际上它的类型并不限于HTMLElement,XML的DOM对象也可以.
* @param {string} dir字符串,'parentNode','nextSibling','previousSibling'三者其一.
*/
dir: function( elem, dir ){
var matched = [],//结果集
cur = elem[dir];//初始化cur为elem[dir]
while ( cur && cur != document ) {
if ( cur.nodeType == 1/* Node.ELEMENT_NODE */ )
matched.push( cur );
cur = cur[dir];//cur指向下一个目标.
}
return matched;
},
/**
*
*以cur指定的元素为起点,一直调用'cur[dir];cur=cur[dir]',直到调用的次数等于result并且cur是节点元素为止.下面这行代码是一个经典调用场景:
* returnjQuery.nth(a.parentNode.lastChild,1,"previousSibling")==a;
*
* 如果还是不知道我在说什么,建议详细查看代码.
*
* @param {HTMLElement} cur一个普通的DOM元素.注意,不限于HTMLElement元素,XML的DOM元素可以.
* @param {number} result一个数字.当处理到第result个元素的时候,函数停止并返回结果.
* @param {string} dir一个字符串,为'previousSibling'和'nextSibling'两者其一.
* @param {Object} elem 可以看到在本函数中并没有用到这个参数.
*/
nth: function(cur,result,dir,elem){
result = result || 1;//知道也要处理一个
var num = 0;
for ( ; cur; cur = cur[dir] )
if ( cur.nodeType == 1/* Node.ELEMENT_NODE */ && ++num ==result )
break;
return cur;
},
/**
* 选择elem的所有兄弟节点.
* 这个函数的代码已经很精练,不太好详细解释.请自行品味.
*
* @param {HTMLElement} n它给elem查找自己的兄弟划定了一个范围.elem的兄弟必须在n里面找.注意,其实并不限于HTML文档,XML内的元素也可以使用本函数
* @param {HTMLElement} elem除了这个元素之外,所有n中的兄弟节点都会被加进结果集.注意,也不限于HTML元素,XML元素亦可.
*/
sibling: function( n, elem ) {
var r = [];
for ( ; n; n = n.nextSibling ) {
if ( n.nodeType == 1 /* Node.ELEMENT_NODE */ && n != elem)
r.push( n );
}
return r;
}
});//extend 结束
//---------------------------------------------------------------下面对jQuery进行事件方面的扩展 ------------------------------
/*
* A number of helper functions used for managing events.
* Many of the ideas behind this code orignated from
* Dean Edwards' addEvent library."
*/
/*这里是一系列的事件方法.正如上面那段英文所说的那样,这些代码的许多思想并不是JohnResig自己原创的.从这我们可以到,站在巨人的肩膀之上效益是非常大的.
* 好了,说正事:
*这里定义的方法都是定义在jQuery.event命名空间上的静态方法.他们并直接不向jQuery库用户公开(当然你有权强行调用他们,只要对他们足够了解).这些方
* 法主要是被jQuery对象上的与事件相关的方法调用.
*
* 注意, 下面的中文注释中 "事件监听函数" 与 "事件处理函数"的语义是一致的, 尽管它们是不同的东西...请读者注意.
*/
//------------------------------------------------------------------------------------------------------------------------
jQuery.event = {
// Bind an event to an element
// Original by Dean Edwards
/**
* 为元素添加一个事件监听器.
*
* @param {HTMLElement} elem 元素, 就是要为它添加一个事件监听器
* @param {String} types字符串,表示要注册的事件类型,如'click','moveover'等.
* @param {Function} handlercallback函数,事件发生后,此函数将会被调用.
* @param {Object} data
*/
add: function(elem, types, handler, data) {
// 8 是comment类型的节点， 3 是 text节点,这些节点就不需要添加什么事件监听器了.
if ( elem.nodeType == 3/* Node.TEXT_NODE */ || elem.nodeType== 8 /* Node.COMMENT_NODE */ )
return;
// For whatever reason, IE has trouble passing the windowobject
// around, causing it to be cloned in the process
// 不知道咋嘀, 在IE浏览器中,如果把window对象作为函数参数传递的话往往不能正确传递(即函数内部根本不知道它是window对象).于是利用下面这
//个if来判断是不是在IE浏览器中以及检查传进来的elem会不会可能是window对象, 如果是, 就让elem引用重新指向window.
if ( jQuery.browser.msie && elem.setInterval )//elem.setIntervale是想通过这个检测elem是不是window对象。
elem = window;
// Make sure that the function being executed has a unique ID
// 翻译: 确保每一个事件处理函数(也就是handler)都有一个ID.
if ( !handler.guid )
handler.guid = this.guid++;//this指向的是jQuery.event这个命名空间,它本质就是一个对象.guid的初始值为1.
// if data is passed, bind to handler 翻译:如果传入了data,那么就把这些data绑定到handler上
if( data != undefined ) {
// Create temporary function pointer to original handler
// 把handler的引用传给一个临时的变量fn.等下要在它的外面再套一层.
var fn = handler;
// Create unique handler function, wrapped aroundoriginal handler
//翻译:创建一个唯一的处理函数,这个函数包裹着原来的那个处理函数.
// this指向的仍然是jQuery.event对象.this.proxy函数最后返回的仍然是它的第二个参数中的那个新创建的匿名函数.this.proxy的作用是
//让匿名函数具有fn一样的ID,仅此而已(可以参考jQuery.event.proxy函数的中文注释.). 隐藏在proxy背后的重要思想是"包裹"函数
//(wrapper function), 具体请留意下面的中文注释.
handler = this.proxy( fn, function() {
// Pass arguments and context to original handler
// 翻译: 传递参数和上下文给原来的那个函数(即fn)
/*
*这种将一个函数使用另外一个函数"包裹"起来的技术在jQuery中十分常见,它的目的就是通过闭包机制来传递参数以及上下文. 以此来达到改变
* 传递的参数或者改变调用上下文的目的.
* 具体来讲一下:
* 当fn最初被作为一个函数的引用传进来的时候,它所作用的上下文不一定是jQuery.event. 比如说当我们在全局的作用域中
* 定义了一个事件处理函数,这个函数中的代码中如果含有this关键子,那么这个this就可以引用window对象, 因为这个全局的函数最终将会
* 作为window对象的方法来调用.所以如果我们想要将fn作为其他对象的方法来调用,就是必须使用apply(或者call)方法来改变函数的执行上下文.
* 而这里就是想改变fn的执行上下文,想将处理函数作为触发事件的那个元素的方法来调用.注意以下代码的this关键字的含义.
*/
// 实际上还是调用原来那个处理函数来处理事件,不过使用了apply函数传递了this作为新的函数执行上下文.注意下面的this指向
// 一个HTMLElement元素, 即经过这么一层"包裹"之后,fn改变了自己的执行上下文为这个HTMLElement,它内部代码中this全部指向的是
// 这个HTMLElement元素.其实要想确定这个this到底指向的是什么,需要追溯到最终函数是怎样被调用的.具体可以查看
// jQuery.event.trigger函数的中文注释部分.
return fn.apply(this, arguments);
});
// Store data in unique handler
// 将数据存储到handler上面. handler从创建到现在,具有了与fn相同的函数功能, 与fn一样的guid, 以及用户传进来的data.而不同的就是调用的上下文
handler.data = data;
}
// Init the element's event structure
// 翻译: 初始化 element的 event数据结构.
/* 继续阅读以下代码, 必须首先了解以下jQuery的事件机制:
* 首先, jQuery的事件分为原生事件与jQuery自定义事件.像click, blur, focus等事件,都是原生事件.这些事件的触发由系统自动完成; 而自定义
* 事件的触发则需要手动来完成. 如jQuery的ajaxStart,ajaxStop等事件都是jQuery自己定义事件, 因为JavaScript并不提供这些事件.
*
* jQuery为了统一这两种事件, 推出了自己的add(注册) ->trigger -> handdle -> remove 事件模型.(虽然这些ideas来自Dean Edwards)
*
* 在JavaScript中,事件与监听函数的管理由JavaScript本身来完成,像"我的监听函数保存在哪?"这样的问题, 你根本不需要理会. 而jQuery为了获
* 取更灵活的事件扩展,它在JavaScript事件机制基础之上扩展了自己的事件机制.在这个事件机制中,jQuery自己管理那些注册在某个事件上等待触发的监听函数.
* jQuery事件机制具体内容是这样的:
* (1) 注册: 使用jQuery.event.add函数完成.add会将监听函数保存到元素的events缓存区中.如果事件是首次注册监听函数, 那么jQuery就会再
* 为元素开辟多一块叫handle的数据缓存区.这个区仅仅装一个类型为jQuery.event.handle的函数. 这个函数是一个代理,elem上所有事件被
* 触发后都首先调用这个函数,进行一些事件模型的兼容性处理(还有其他)之后,这个handle函数就会从元素的events缓存区中选择应该运行的监听
* 函数来运行.
* (2) 触发:jQuery自定义事件需要jQuery自己在合适的时机手动触发. 如ajaxStop事件,jQuery检查当前ajax请求数, 当检查到这个请求数为0时,
*jQuery就调用jQuery.event.trigger自己手动触发ajaxStop事件.
*而对于原生事件,则通过将代理handle函数注册为原生的事件监听器来触发.也举一个例子: 比如click事件. jQuery使用
*addEventListener/attachEvent将代理的handle函数注册到了JavaScript的原生事件机制中. 当click事件发生时, 代理handle函数
* 就会被调用.
* (3) 处理: jQuer.event.handle会在elem的所有事件监听器被调用之前运行.它的工作主要是作为一个代理,屏蔽事件模型的浏览器兼容性问题,
* 检查事件的命名空间,最后从元素的evnets监听函数列表中, 逐个执行需要触发的监听函数.
* (4) 卸载:原生事件需要removeEventListener/detachEvent来移除注册在事件的上的代理handle函数. 上面说过, 两种事件类型的事件监听函数
* 被jQuery存储在elem的events数据缓存区中,于是卸载事件监听函数时,jQuery就会从elem的events数据缓存区中删除该函数的引用. 如果
* jQuery发现events为空了,说明elem已经没有事件监听函数,events数据缓存区和handle数据缓存区将被移除.
*
*
*/
// 准备取得elem的缓存数据( jQuery 可以让每一个元素"缓存"数据)",这些数据用"events"做为键值来获取。如果" events " 并不对应有数据
// 就让 " events " 初始化为{}.注意jQuery.data的用法:当没有传入第三个参数时为获取元素的缓存数据.若传入了第三个参数,那么则是设置元素的
// 缓存数据.events可以使用各种事件类型的名称作为键值来存取内容, 如click,mouseover等, events['click']获得的是处理click事件处理函
// 列表.
var events = jQuery.data(elem, "events") || jQuery.data(elem,"events", {}),
//如果"||"左边的代码不能获取elem的handle,那就说明目前还没handle,那就自己初始化一个
handle = jQuery.data(elem, "handle") || jQuery.data(elem,"handle", function(){
// Handle the second event of a trigger and when
// an event is called after a page has unloaded
if ( typeof jQuery != "undefined" && !jQuery.event.triggered )
return jQuery.event.handle.apply(arguments.callee.elem, arguments);
});
// Add elem as a property of the handle function
// This is to prevent a memory leak with non-native
// event in IE.
handle.elem = elem;
// Handle multiple events separated by a space
// jQuery(...).bind("mouseover mouseout", fn);
/*
* 处理多事件的情形,这些事件使用" "号隔开.
* 调用jQuery函数的静态each函数,对每一个事件类型使用一个函数进行处理.至于处理的内容是什么,那就请往下看了
*/
jQuery.each(types.split(/\s+/), function(index, type) {
// Namespaced event handlers
var parts = type.split(".");
/* 这里要对上面的"Namespaced event handlers"进行说明:
* "Namespacedevent"是jQuery"原创"的概念,旨在将某种特定的事件类型的监听函数进行更加细的划分,从而达到更加灵活地删除,触发事件监听函
* 数的目的.而jQuery通过为事件类型添加".namespace"的方式来对一个事件类型的不同监听函数进行划分. 如"click.myClick",
*"click.yourClick",这样我们当我们需要卸载或者激活某类特定的Click事件监听器时可以这么写:$('.someClass').unbind('click.yourClick').
*这样使用"click.yourClick"绑定的事件处理函数就会被移除,但是使用"click.myClick"注册的事件处理函数就被保留.
*
* 更多有关"Namespaced eventhandlers"的信息,请参考jQuery的官方网站, 以下是链接:
* http://docs.jquery.com/Namespaced_Events
*/
type = parts[0];//part[0]是"."左边的部分,如"click.yours"中的"click"
handler.type = parts[1];//parts[1]是事件的命名空间,如"click.yours"中的"yours"
// Get the current list of functions bound to this event
// 翻译:获取当前绑定在这个事件上的处理函数列表.
var handlers = events[type];
// Init the event handler queue
// 如果并不存在type所指示的事件类型的处理函数列表,就自己创建一个.
if (!handlers) {
handlers = events[type] = {};
// Check for a special event handler
// Only use addEventListener/attachEvent if thespecial
// events handler returns false
/* 先翻译:检测特殊事件(ready, mouseenter,mouseleave)的处理函数,如果特殊事件的处理函数返回false那就只用
* addEventListener/attachEvent 来添加处理函数
*
* 好,现在进行说明:
* 所谓的特殊事件也就三种:ready,mouseenter,mouseleave
*ready事件并不是浏览器所支持的事件(即浏览器中没有类似"onReady"这样的事件),ready是DOM Ready之意,有些浏览器有"DOMContentLoaded"事件与之相对应.
*由于DOMContentLoaded事件并不普及,因此不能通过统一的addEventListener/attachEvent来添加这个事件.jQuery中使用bindReady来将你的函数绑定到
* DOMContentLoaded事件当中,因此不需要使用addEventListener/attachEvent来绑定事件,也就是说不用下面的代码来做这件事情. 下面的代码(整个if语句)是
*用来为一般的事件(如mouseover,click等)添加处理函数的.由于IE和w3c采用了不同的事件模型,因此if内的语句又有if对两种事件模型进行了区分.
*
*mouseenter和mouseleave是IE所支持的事件,w3c所支持的对应事件是mousein和mouseout.如果特殊事件是mouseenter和mouseleave中的一个,并且当前浏览器
*就是IE,那么也由下面的if语句体来完成事件处理函数的绑定.如果当前浏览器不是IE但是又要求绑定这两个事件,那么"jQuery.event.special[type].setup.call(elem)"
* 的返回值不会是false,那么程序也就是不会用下面的代码进行事件的绑定, 而是在jQuery.event.special[type].setup 函数内部使用jQuery对象的
* bind函数, 绑定与 mouseenter和mouseleave相对应的w3c事件,即mouverover 和mouseout.
*
* 另外可以参考jQuery.event.special中的中文注释.
*/
if ( !jQuery.event.special[type] || jQuery.event.special[type].setup.call(elem) === false ) {//将setup作为elem的方法调用, 于是setup函数中的//this关键字就会被替换成elem的引用.
// Bind the global event handler to the element
if (elem.addEventListener)// FF
elem.addEventListener(type, handle, false);
else if (elem.attachEvent)// IE
elem.attachEvent("on" + type, handle);
}
}
// Add the function to the element's handler list
// 元素 elem 对每一种类型的 event 都有若干的 handler. 而handlers 就是这些 handler 的集合. 每一个handler使用它自己的guid来索引.
handlers[handler.guid] = handler;
// Keep track of which events have been used, for globaltriggering
// 记录下到底哪些事件被使用( 或者说被监听 )了,在trigger函数中需要用到这个属性
jQuery.event.global[type] = true;
});
// Nullify elem to prevent memory leaks in IE
// 将elem的引用设置为null,避免在IE中导致内存泄漏.
elem = null;
},
guid: 1,
global: {},
// Detach an event or set of events from an element
/**
* 卸载一个事件,或者一个事件集合.
*
* @param {HTMLDOMElement} elem
* @param {Object} types - 可能是字符串, 也可能是一个事件对象.
* @param {Function} handler
*/
remove: function(elem, types, handler) {
// don't do events on text and comment nodes
if ( elem.nodeType == 3/* Node.TEXT_NODE */ || elem.nodeType== 8/* Node.COMMENT_NODE */ )
return;//如果是文本节点和注释节点,就不用干活了,直接返回.
var events = jQuery.data(elem, "events"),//获取为elem所缓存的索引为"events"的数据.事实上这些数据就是为elem所注册的事件监听函数
ret, index;
//如果在elem元素上面是有events的，也即元素有对某些事件进行监听的,就可以继续进行事件监听函数的卸载工作;如果events值为空,则函数返回.
if ( events ) {
// Unbind all events for the element
// 如果types为undefined,或者说types这个字符串以"."开头,就卸载元素上的所有事件监听函数.
if ( types == undefined || (typeof types == "string" &&types.charAt(0) == ".") )
for ( var type in events )
this.remove( elem, type + (types || "") );
// 如果传入的不是字符串，并且不为 undefined (不是用字符串来表示要 remove 的操作 )
else {
// types is actually an event object here
// 如果传入的 types 就是一个事件对象( 就是 event ||window.event 这个对象 )，那么就把 handler 和 types的引用 " 矫正 " 过来
// 这样下面的代码就不用修改,还是照样能用了
if ( types.type ) {//通过检查types上有没有type属性来判断types是不是一个event对象
handler = types.handler;//types上的handler属性是在jQuery.event.handle函数中添加上的,目的就是为了方便我们在这里把它删//除.详细参见jQuery.event.handle函数
types = types.type;//让types真真正正指向一个事件类型.
}
// Handle multiple events seperated by a space
// jQuery(...).unbind("mouseover mouseout", fn);
/*
* 翻译:处理用空格隔开的卸载多个事件的事件监听器材的情况.如jQuery(...).unbind("mouseover mouseout", fn);
*/
jQuery.each(types.split(/\s+/), function(index, type){
// Namespaced event handlers
/*
* 如果你对" Namespaced event handlers"不了解,请到jQuery.event.add中查看相应的中文注释.
*/
var parts = type.split(".");
type = parts[0];//part[0]是事件类型
// 还记得前面jQuery.event.add函数中的 handlers吗? events[ type ] 就等于 handlers
if ( events[type] ) {//如果在type所指定的事件上有绑定事件监听函数,那就视情况而定删掉对应的监听函数.
// remove the given handler for the given type
//如果传入的handler是有引用的，表示仅仅需要删除绑定在type所指定事件上的handler所指向那个监听函数.那就只除去这个handler咯
if ( handler )
delete events[type][handler.guid];//使用函数的唯一id将函数删除
// remove all handlers for the given type
// 如果没有传入handler,而仅仅是传入了elem,types，说明要除去对应事件上所有 handler
else
for ( handler in events[type] )
// Handle the removal of namespacedevents
/* 删除的时候要注意啦:
*(1)如果parts[1]是空值,说明我们并没有使用命名空间对某种事件类型的监听函数进行进一步的划分.那么我也就可以放心地
* 删除type所指定事件下的所有监听函数.
*(2)如果parts[1]是有值的,那么就仅仅删除那些命名空间与parts[1]相同的handler. 注意,下列代码中的
* "events[type][handler].type"内的"type"属性是在jQuery.event.add时加上的.
*/
if ( !parts[1] || events[type][handler].type == parts[1] )
delete events[type][handler];
// remove generic event handler if no morehandlers exist
/*以下这个for循环不断地从events[type]取属性名出来,并放入到ret中.
*一旦name获得了一个可以转化为true的值,for的循环体就会被执行.执行之后
*居然是break...于是就起到了一个作用:检测元素是否还有自定义的属性.
* 注意,元素的继承属性不能被forin循环枚举.例如从Object中继承下来的
* toString函数就不能被for in访问到.
*/
for ( ret in events[type] ) break;
if ( !ret ) {//!ret为true时说明events[type]上已经没有了事件监听器了.
// 如果 type 表示的并不是特殊事件( 如ready ),或者是特殊事件,但teardown函数认为这个特殊事件可以使用下面的简便
// 方法来卸载事件处理函数,而没有必要让它来干这事情,那就是使用下面的代码(if语句体内代码)来直接卸载.如果有兴趣想知道
//为什么teardown函数会认为"没必要让我来卸载这个事件上的监听函数",请参考jQuery.event.special内的teardown函数的中文注释
if ( !jQuery.event.special[type] ||jQuery.event.special[type].teardown.call(elem) === false ) {
if (elem.removeEventListener)// FF
elem.removeEventListener(type,jQuery.data(elem, "handle"), false);
else if (elem.detachEvent) // IE
elem.detachEvent("on" + type,jQuery.data(elem, "handle"));
}
ret = null;
// 整个 type代表的事件下的所有事件handler都不要了, 因为前面 !ret成立表示该集合为空了
delete events[type];
}
}
});
}
// Remove the expando if it's no longer used
// 翻译:如果events不再被使用,那就删除那些expando(非继承的)属性.
for ( ret in events ) break;
if ( !ret ) {//如果ret仍然为undefined(定义变量的初始值),说明events是空的. events空了, 表示这个元素再也没有任何的监听事件.
var handle = jQuery.data( elem, "handle" );
if ( handle ) handle.elem = null;
jQuery.removeData( elem, "events" );//移除elem上的事件监听函数列表, 因为它是空的.
jQuery.removeData( elem, "handle" );//移除代理的事件处理函数.
}
}
},
/**
* trigger函数要分三步做三件事情:
* (1) 触发通过jQuery.event.add注册的监听函数
* (2) 执行用户传入的extra函数
* (3) 触发本地的事件处理函数(即直接写在HTML标签内的函数)
*
* trigger函数最后返回一个布尔值,浏览器可以根据这个布尔值来决定是否进行默认行为.而这个值到底是什么(true or false), 由上面所列的三步处理共
* 同决定. 此外, trigger函数返回undefined也是允许的.
*
* @param {string} type - 事件类型
* @param {Array} data - 需要传给事件监听函数的数据
* @param {HTMLElement} elem - 发生事件元素
* @param {boolean} donative - donative 其实为"do native",是否执行本地方法(即直接写在HTML标签中的事件处理函数)
* @param {Function} extra - 用户需要在触发事件处理函数之后,需要再运行的函数. 这个函数的执行能够影响trigger最终返回布尔值.
*/
trigger: function(type, data, elem, donative, extra) {
// Clone the incoming data, if any
data = jQuery.makeArray(data);//makeArray函数将data转换为一个真正的数组.
// 传入的事件类型 type 竟然会饱含有字符" ! " !?其实这表示的是一个 ! ( not ) 的操作. 如 !click 就是除了 click之外的事件
if ( type.indexOf("!") >= 0 ) {
type = type.slice(0, -1); // 相当于type = type.slice( 0,length+(-1) ); 去掉最后一个字符
var exclusive = true; // 设这个变量为true告诉程序type中含有 " ! "
}
// Handle a global trigger 翻译:处理有一个全局的触发器
// 如果elem是空的,那么就认为是要给触发所有元素上的绑定在type所指定事件上的所有监听函数.
if ( !elem ) {
// Only trigger if we've ever bound an event for it
// 在 add 函数中最后不是有一句 jQuery.event.global[type]= true 吗? 这时候派上用场了
// 如果if内的语句为true, 这说明 type表示的事件已经被监听,需要为这个事件加入触发器( trigger )
if ( this.global[type] )
//在jQuery对象的类数组中加入window,document对象
jQuery("*").add([window, document]).trigger(type,data);
//然后为这些对象添加触发器( trigger )
}
// Handle triggering a single element
// 如果不是空的,那就是要触发单个元素的绑定在type所指定的事件上的事件监听函数.
else {
// don't do events on text and comment nodes
if ( elem.nodeType == 3 /* Node.TEXT_NODE */|| elem.nodeType == 8 /* Node.COMMENT_NODE */ )// 3 是text node, 8 是commentnode
return undefined;
var val,
ret,
fn = jQuery.isFunction( elem[ type ] || null ),
// Check to see if we need to provide a fake event,or not
/* 由于最后的data需要传给事件监听函数,而标准事件模型中要求事件监听函数的第一个参数必须是event对象,即data[0]必须是event对象,
* 于是我们必须检测data的[0]是不是event对象. 是,那当然好; 如果不是, 我们则在data的头部加入一个伪造的(fake)event对象.
*/
event = !data[0] || !data[0].preventDefault;//preventDefalt是 w3c的标准方法,它是event对象的方法.
//如果不能检测data[0]有这个方法则证明data[0]不是event对象.
// Pass along a fake event
// OK, 如果不幸发生了(data[0]不是event对象),那我们自己给它加上一个.
if ( event ) {//data[0]并不是w3c标准的事件对象,那就新建立一个对象,把一个event对象该有的一些方法和属性都加入到这个对象中,并用
//unshift方法把对象加在data数组的头部.
data.unshift({
type: type,
target: elem,
preventDefault: function(){},
stopPropagation: function(){},
timeStamp: now()
});
//expando 只是一个由 " jQuery " + now()组成的字符串, 以此字符串作为一个属性名,是为了说明这是一个jQuery处理过的事件对象
data[0][expando] = true; // no need to fix fakeevent 好了,事件对象已经处理过了,它是我们自己加上去的, 作个标记. 以后
//data可能会被传入到jQuery.event.fix函数中,fix函数看到expando这个属性, 它就会略过一些工序.
//详细信息请参考jQuery.event.fix函数的中文注释.
}
// Enforce the right trigger type
// 将事件类型强制修改为正确的类型.
data[0].type = type;
// 上面设置的标志: 是否含有" ! " 字符
if ( exclusive )
data[0].exclusive = true;//在事件对象上加入属性exclusive.
// Trigger the event, it is assumed that "handle" is afunction
// 翻译: 触发事件, "handle"被假设是一个函数
// 好, 第一步:运行通过jQuery.event.add注册的函数.
var handle = jQuery.data(elem, "handle");//通过elem的数据缓存区, 获取elem的监听函数.
if ( handle )//如果在这个缓存区上有监听函数,那么就将这个监听函数作为elem的方法来运行.
/* 注意,elem的数据缓存区中缓存的这个handle并不是它传给jQuery.event.add注册的那个handle.
* 这个handle的类型是jQuery.event.handle.它的作用就是运行elem绑定在某个事件上的所有事件监听函数.
* 也就是说,当我们通过jQuery.event.add注册一个事件监听函数时,add函数内部将这个监听函数放进某个事件的监听函数列
* 表当中.比如说jQuery.event.add('click',function(){//do some thing}),函数将被加入到elem的click事件
* 监听函数列表, 即events['click'].而这个events列表被缓存在jQuery的数据缓存区中,可通过jQuery.data(elem,'events')
* 获取. 然后, 如果这是elem首次添加监听函数,add函数就再给elem 开辟一个数据缓存区, 并在这个缓存区上只存一个函数. 这
* 个函数就是现在我们在这里获取的这个handle.
*
* 任何一个事件被触发时,jQuery总是到元素的数据缓存区去获取这个handle,再由这个handle作为一个代理, 在解决事件模型的兼容性
*问题后,逐一触发elem绑定在该事件上的事件监听函数.
*/
val = handle.apply( elem, data );//好了,执行代理handle函数, 绑定再elem上的事件处理函数将会被执行.
/*
* 这里对上面的val再补充一些说明:
*由于jQuery.event.handle作为所有的监听函数的代理函数,因此除了要运行实际的事件监听函数之外, 还要代替原来的事件监听函数与浏览
* 器打交道.
*
* 在没有代理的时候,事件监听函数在函数执行完毕之后将返回一个布尔值来允许(true)或者取消(false)浏览器的默认行为. 那么当代理代替了
* 原来的监听函数之后,代理函数理所当然要返回同样的一个布尔值(val)来与浏览器产生互动.
*
* 下面的代码将围绕这个布尔值(val)展开工作.
*/
// Handle triggering native .onfoo handlers (and onlinks since we don't call .click() for links)
// 关于fn,上面有代码: fn = jQuery.isFunction( elem[ type] || null )
if ( (!fn || (jQuery.nodeName(elem, 'a') && type =="click")) && elem["on"+type] && elem["on"+type].apply( elem, data )=== false )
val = false;//如果没有本地函数, 那就返回false.
// Extra functions don't get the custom event object
// 翻译: Extra函数并不需要用户事件对象
// 由于Extra是用户自己提供的函数而不是一个事件监听函数,因此不需要事件对象,即不需要data[0].
if ( event )
data.shift();// 移除第一个元素data[0]
// Handle triggering of extra function
// 运行extra函数.
if ( extra && jQuery.isFunction( extra ) ) {//如果用户传入了这个extra函数并且extra真的是一个函数.
// call the extra function and tack the currentreturn value on the end for possible inspection
// 翻译:调用extra函数并且将当前的trigger返回值加入到extra函数的参数列表的后面
ret = extra.apply( elem, val == null ? data : data.concat( val ) );//运行这个extra函数
// if anything is returned, give it precedence andhave it overwrite the previous value
// 翻译: 如果有任何返回值,给予优先级让它覆盖掉原来的val的值.
if (ret !== undefined)
val = ret;
}
// Trigger the native events (except for clicks on links)
// 翻译: 触发本地事件(除了link的click事件)
/* 上面所说的 "native events"指的是直接写在HTML标签内的事件处理函数.
* 在执行完jQuery所注册的事件处理函数之后,如果有,那就再继续执行 "native events" 的函数.
* donative是一个开关, 它参与决定是否要执行触发本地事件.
*/
if ( fn && donative !== false && val !== false && !(jQuery.nodeName(elem, 'a') && type == "click") ) {
//this在这里指的是jQuery.event
this.triggered = true;
try {
// 执行elem 上的 [type] 方法
elem[ type ]();
// prevent IE from throwing an error for some hiddenelements
// 翻译:防止IE在一些隐藏的元素上执行本地事件处理函数会抛出错误的情况.
} catch (e) {}
}
this.triggered = false;
}//为单个元素触发监听函数结束
//返回 val 它是一个布尔值.浏览器可以根据这个值来决定自己是否执行默认行为.
return val;
},
/**
* 执行event所指定事件类型下的, 与触发元素有关的所有事件监听!
* jQuery的事件机制要求触发的所有事件必须首先运行这个函数,由它做一些与兼容性, 命名空间相关的工作之后,再由它来代理运行绑定在指定事件上的所有
* 应该运行的事件监听函数.
*
* 注意本函数的参数event对象, 它由jQuery传入,而不是由原生的JavaScript事件机制传入.
*
* @param {Event} event - 事件对象
*/
handle: function(event) {
// returned undefined or false
var val, ret, namespace, all, handlers;
//IE和w3c在事件对象模型上有比较大的差异.首先是两者的事件对象所处的作用范围的不同,其次就是事件对象本身的属性也不尽相同.
/* (1)作用范围的不同:在IE中,事件对象(event)是作为window的属性而存在的.即window.event可以获取到事件对象的引用.由于浏览器一次只处理
*一个事件,因此这种设计本身虽然奇怪但并不会引起什么问题.而在w3c中,事件对象则在事件句柄被调用时作为第一个参数传入.如click(e)中的参数'e'
* 实际上就是一个事件对象event的引用.
* (2)在两种事件模型中,event对象的属性也不尽相同.如经典的事件源对象在IE中使用event.srcElement引用,而w3c则采用event.target.其他的
* 就不一一列举.
*
*其实,w3c的事件模型是参考IE的事件模型制定出来的...唉,IE与w3c标准之间的'恩怨'真的是说不清理还乱...
*
*基于以上事实,为了让代码能够有一个统一的行为,以下这行代码就调用jQuery.event.fix来给event对象做个'修理'.具体fix里面做了什么修理,可以
* 参考jQuery.event.fix函数的中文注释部分.
*/
event = arguments[0] = jQuery.event.fix( event || window.event );
// Namespaced event handlers //关于"Namespaced eventhandlers" 请Ctrl + F, 在其他函数的中文注释中有说明.
namespace = event.type.split(".");
event.type = namespace[0];//namespace[0]就是真正的type,它的值可能是'click','load'等.
namespace = namespace[1];//在namespace[0]后面的'命名空间'
// Cache this now, all = true means, any handler
//如果没有命名空间并且这个事件并没有被设置为'排除(exclusive)',那么表示所有的监听器都被触发. 建议先了解"Namespaced event handlers",不然不明白此处的用意
all = !namespace && !event.exclusive;
/*调用jQuery.data获取对象缓冲的数据.这些数据有一个标签,就是'events'.很明显这些数据与时间处理有关.事实上,这些数据都是一些事件处理函数.
*在JavaScript中,"函数也是数据",因此它能够被保存和被修改,以及被传递.也许你对这一个事实并不感到新鲜.
*这个叫events的数据缓存区的具体位置为jQuery.cache['XXXXXX']['events'].'XXXXXX'表示的是元素的id.这个id由jQuery.data函数来分配
*并存储在一个叫名字很特别的属性里.这个属性的名称由jQuery.expando指定.具体可以Ctrl+F查找expando的中文注释.
* 如果考虑上event.type,那么下面这句代码的意思就是:
*到数据缓存区jQuery.cache['XXXXX']['events'][event.type]取出数据,并返回给handlers.如event.type == 'click'
* handlers标明,一个事件类型会有很多的handler,总之不只一个.
*/
handlers = ( jQuery.data(this, "events") || {} )[event.type];
//得到了这些事件监听器之后,逐个遍历并执行
for ( var j in handlers ) {
var handler = handlers[j];
// Filter the functions by class
// handler.type这里这个属性是表示这个handler是哪一个类型的.其实它就是namespace.在一个监听函数被注册时jQuery.event.add将
// 监听函数的命名空间赋予了监听函数的type属性上.也就说现在我们看到的handler.type其实就是那名个命名空间.
if ( all || handler.type == namespace ) {
// Pass in a reference to the handler function itself
// So that we can later remove it
//翻译:给event新建一个属性,这个属性是一个指向handler的引用,这样就方便我们在不需要它时可以删除它.
event.handler = handler;
event.data = handler.data;//保存hanlder缓存的数据,这些数据是在jQuery.event.add函数中被加入的.
//this所指的对象是jQuery.event.下面这段代码将hanler作为jQuery.event的方法调用,并将handler的返回值保存到ret中.
ret = handler.apply( this, arguments );//val在函数的开头被定义,一直到这里才使用.可见val的值一直都是undefined(JS中,变量刚刚比定义的时候值为undefined).
//于是undefined !==false.if内的赋值语句似乎并不会得到执行.我可没忽悠大家啊,大家仔细看好咯.
if ( val !== false )
val = ret;
// 如果函数执行之后的返回值是false,说明要制止浏览器的默认行为和事件冒泡,调用event中的两个函数完成任务.
//注意,event.prentDefault和event.stopPropagation是w3c定义的方法.IE中要干这两件事情并不是这样的.
//之所以能够统一地以这种方式来调用,这归功于jQuery.event.fix函数.这个函数重写了event.prventDefault和event.stopProgation
if ( ret === false ) {
event.preventDefault();
event.stopPropagation();
}
}
}
//返回处理结果,正如你在本函数中看到的,大部分时候这个val是undefined.
return val;
},
/**
*处理各种浏览器(主要是IE和w3c标准)在事件对象模型上的不同.让所有浏览器都能够以一种统一的方式来处理事件对象.
* @param {Event} event 事件对象.
*/
fix: function(event) {
//如果event已经有了一个特定的属性并且它的值是true,说明这个事件对象已经被处理过了,直接返回就可以了. 注意,这个属性的名称每刷新一次
//浏览器都会不一样.另外如果event对象没有被处理过(也可以说没有被标准化过),那event对象是不会有这个特定的属性的.
if ( event[expando] == true )
return event;
// store a copy of the original event object
// and "clone" to set read-only properties
var originalEvent = event;
event = { originalEvent: originalEvent };
// 以下这些字符串表示了一个标准的 event对象所应该具备的标准属性名
var props = "altKey attrChange attrName bubbles buttoncancelable charCode clientX clientY ctrlKey currentTarget datadetail eventPhase fromElement handler keyCode metaKey newValueoriginalTarget pageX pageY prevValue relatedNode relatedTargetscreenX screenY shiftKey srcElement target timeStamp toElement typeview wheelDelta which".split(" ");
for ( var i=props.length; i; i-- )
event[ props[i] ] = originalEvent[ props[i] ];
// Mark it as fixed
// 经过这么处理,event 该有的属性都有了,标记一下
event[expando] = true;
/*
* 属性是有了,但有些属性具体的值却没有啊.下面就把这些属性的值补上
*在以下的代码中,我们可以见识一下,在事件对象模型方面IE和w3c之间的差异.人家就用这些代码搞定了事件模型的不一致,很值得我们学习.
*/
// add preventDefault and stopPropagation since
// they will not work on the clone
/*添加preventDefault和stopPropagation两个函数.由于在本函数中让event指向了另外一个新建的对象,原本这两个函数是存在于w3c标准的event
*对象中的,现在没了.所以在这里补上,并且改写他们的内容,使得这些函数能够解决兼容性的问题.
*/
event.preventDefault = function() {
// if preventDefault exists run it on the original event
//w3c标准规定这样设置阻止浏览器默认行为.什么是默认行为?比如说我们按Ctrl+S的时候,是保存网页,点击一个链接的时候会把你导到另一页面等
// 这些都是浏览器的默认行为.
if (originalEvent.preventDefault)
originalEvent.preventDefault();
// otherwise set the returnValue property of theoriginal event to false (IE)
// IE则是用另外一种方式
originalEvent.returnValue = false;
};
/* 接下来是一个停止事件冒泡的函数.
*/
event.stopPropagation = function() {
// if stopPropagation exists run it on the original event
// w3c的浏览器这样设置阻止浏览器进行事件冒泡
if (originalEvent.stopPropagation)
originalEvent.stopPropagation();
// otherwise set the cancelBubble property of theoriginal event to true (IE)
//IE则是用另外一种方式
originalEvent.cancelBubble = true;
};
// Fix timeStamp
//在IE中是没有'时间戳(timeStamp)'这样东西的.如果没有则给它补上.
event.timeStamp = event.timeStamp || now();
// Fix target property, if necessary
//w3c规定事件的源对象使用target来引用.而在IE中则使用srcElement.
// 这里有一个Safari的bug,官方描述是这样的:"In Safari 2.0event.target is null for window load events..."有兴趣可以看:
// http://dev.jquery.com/ticket/1925所以为了解决这个问题,我们需要加上" || document"来防止event.target为undefined.
if ( !event.target )
event.target = event.srcElement || document; // Fixes#1925 where srcElement might not be defined either
// check if target is a textnode (safari)
//看样子,safari是允许文本节点捕捉事件的.为了统一行为,让捕捉事件的都是元素节点(即要有nodeName),让这些文本节点的容器节点来代替他们捕捉事件
if ( event.target.nodeType == 3/* Node.TEXT_NODE */ )
event.target = event.target.parentNode;
// Add relatedTarget, if necessary
/*relatedTarget在w3c事件对象模型中被定义.也就是说,在w3c的事件对象中,应该有relatedTarget属性.这个属性与mouseover和
*mouseout事件相关,而在其他的事件当中则没用.对于mouseover来说,它是鼠标移到目标上时所离开的那个节点.对于mouseout来说,
* 它是离开目标鼠标进入的节点.
*在IE中,与relatedTarget对应的就是fromElement和toElement.前者与mouseover有关而后者与mouseout有关.
*在以下的这语判断中,其实是想判断是不是当前浏览器是不是IE系的浏览器.如果是,那么他们是没有relatedTarget但是有fromElement的
*/
if ( !event.relatedTarget && event.fromElement )
event.relatedTarget = event.fromElement == event.target ?event.toElement : event.fromElement;
// Calculate pageX/Y if missing and clientX/Y available
// 以下这组调整与鼠标定位有关.
/* 事实上,IE与w3c在鼠标相对于视口(viewport)的定位来说,是兼容的.在这两者的中的事件对象并没有一对叫pageX/pageY的属性.
*在这里给event添加上这些属性,是为了日后使用的方便(在某些浏览器中似乎有这个属性).注意,pageX/pageY说的是鼠标事件发生时
* 鼠标相对于文档位置,他们可以由以下公式计算:
* pageX = clientX + (scrollLef - 边框宽度);
* pageY = clientY + (scrollTop - 边框高度);
*
* scrollLeft是窗口水平滚动量,scrollTop是窗口垂直滚动量.
*clientLeft返回边框的宽度clientTop返回边框的高度.真是奇怪怎么他们叫这个名字...
*/
if ( event.pageX == null && event.clientX != null ) {
var doc = document.documentElement, body = document.body;
event.pageX = event.clientX + (doc && doc.scrollLeft ||body && body.scrollLeft || 0) - (doc.clientLeft || 0);
event.pageY = event.clientY + (doc && doc.scrollTop ||body && body.scrollTop || 0) - (doc.clientTop || 0);
}
// Add which for key events
//添加一个在键盘事件中非常有用的属性:which.注意这个属性在IE和w3c标准中都没有定义.
if ( !event.which && ((event.charCode || event.charCode === 0) ? event.charCode : event.keyCode) )
event.which = event.charCode || event.keyCode;
// Add metaKey to non-Mac browsers (use ctrl for PC's andMeta for Macs)
// 在非Macs的机器上,让metaKey就是crtlKey.
if ( !event.metaKey && event.ctrlKey )
event.metaKey = event.ctrlKey;
// Add which for click: 1 == left; 2 == middle; 3 == right
// Note: button is not normalized, so don't use it
//COMP:挺恶心的一个问题,那就是鼠标事件中,左中右键键值,也就是button的值的问题.我先列个表:
/* browser left middle righ
* IE 1 4 2
* w3c 0 1 2
*你可以看到,这些不一致的鼠标键值的定义真的会让人抓狂...下面这段代码就是要统一这些定义:
* 1 == left; 2 == middle; 3 == right
*下面的嵌套'?:'运算符的确简洁,但是需要各位用心一点研究了.只能意会不能言传啊...
*/
if ( !event.which && event.button )//注意这里是一个'&'运算符,而不是'&&'
event.which = (event.button & 1 ? 1 : ( event.button & 2? 3 : ( event.button & 4 ? 2 : 0 ) ));
return event;
},
/**
* 将fn用proxy包装起来, 最后返回proxy.
* 从函数内容来看,这个函数的作用仅仅就是将fn的唯一编号(guid)赋给proxy而已
* @param {Function} fn - 元素的函数,它有一个guid
* @param {Function} proxy - 最后将返回这个函数,返回时它将具有fn的guid. 一般来说, proxy仅仅是fn的一层包裹.
*/
proxy: function( fn, proxy ){
// Set the guid of unique handler to the same of originalhandler, so it can be removed
//通过下面的这句代码确保proxy具有和fn一样的guid,从而它能够被移除.
proxy.guid = fn.guid = fn.guid || proxy.guid || this.guid++;
// So proxy can be declared as an argument
return proxy;
},
/**
* spacial 是一个键/值集合,它记录了所谓的 " 特殊事件 ".
* "特殊事件"有三个,分两类:
*第一类特殊事件并不是浏览器所支持的,在这里就是ready事件.也就是说并没有哪一个浏览器有onReady这样的事件.其实ready取DOM ready之意, 部分浏览器有
* DOMContentLoaded事件,但是并不是普及.jQuery通过使用自创的ready事件做为代理(delegate),根据当前浏览器进行区别对待:(1)如果是支持DOMContentLoaded
* 事件的浏览器, 就直接将其绑定. (2)如果是不支持该事件的浏览器,则通过模拟的方式来"绑定"事件. 具体参见jQuery.event.bindReady函数.
*
* 第二类是"异曲同工"的事件,在这里就是mouseenter和mouseleave.mouseenter和mouseleave是IE事件模型中的两个经典鼠标事件,w3c与之相对应的事件是我们更加
* 熟悉的mouseover与mouseout.如果程序员在非IE浏览器中要求绑定事件处理函数到mouseenter/mouseleave事件, 则jQuery会绑上与之相对应的w3c事件.
*/
special: {
ready: {
/**
* 经过上下文的分析, setup也是"绑定"之意, 下同.
* 此函数用来完成ready事件的响应函数的绑定. 再次提醒,浏览器中并没有ready事件, ready是jQuery "原创"的事件.
*/
setup: function() {
// Make sure the ready event is setup
bindReady();//其实是调用了bindReady函数进行绑定.
return;//函数就这么return了, 这个时候的返回值!==false, 注意啊.
},
/*
*卸载这个事件.由于ready事件并不是通过"正规"的途径(addEventListener/attachEvent)绑定的, 因此当然使用"非常"的方式来进行卸载.
*/
teardown: function() { return; }
},
mouseenter: {
/**
*如果是在IE中使用setup来绑定这个事件,则不使用setup来绑定,因为有更简便的方式(attachEvent).
* 如果在非IE的浏览器中要求绑定mouseenter事件, 那不管,统一给它绑定mouseover这个标准的事件.
*
* 注意本函数内的this关键字的指向,由于setup方法是在jQuery.event.add中这样被使用的:
* if ( !jQuery.event.special[type] ||jQuery.event.special[type].setup.call(elem) === false )//...othercodes
* 所以,setup方法中的this指的是就是上面那行代码中的elem.而elem就是一个普通的DOM 元素.
*/
setup: function() {
if ( jQuery.browser.msie ) return false;//这个this关键子指向是一个普通的DOM元素,也就是说我们要给这个元素绑定事件处理函数
jQuery(this).bind("mouseover", jQuery.event.special.mouseenter.handler);
return true;
},
/**
* mouseenter事件的卸载函数.
*/
teardown: function() {
if ( jQuery.browser.msie ) return false;//如果是IE浏览器有更好的卸载方法,返回false,这样调用teardown的函数就知道直接使用//IE的detachEvent来卸载mouseenter
jQuery(this).unbind("mouseover", jQuery.event.special.mouseenter.handler);
return true;
},
handler: function(event) {
// If we actually just moused on to a sub-element,ignore it
// 翻译:如果我们仅仅是移动到了元素的子元素上,忽略它(并不把这种情况当作是鼠标enter到了元素上).
if ( withinElement(event, this) ) return true;
// Execute the right handlers by setting the eventtype to mouseenter
// 将event的事件类型改为mouseenter
event.type = "mouseenter";//TODO:这个this指代的是一个什么对象?
return jQuery.event.handle.apply(this, arguments);
}
},
/**
* mouseleave的注释参见mouseenter的中文注释
*/
mouseleave: {
setup: function() {
if ( jQuery.browser.msie ) return false;
jQuery(this).bind("mouseout", jQuery.event.special.mouseleave.handler);
return true;
},
teardown: function() {
if ( jQuery.browser.msie ) return false;
jQuery(this).unbind("mouseout", jQuery.event.special.mouseleave.handler);
return true;
},
handler: function(event) {
// If we actually just moused on to a sub-element,ignore it
if ( withinElement(event, this) ) return true;
// Execute the right handlers by setting the eventtype to mouseleave
event.type = "mouseleave";
return jQuery.event.handle.apply(this, arguments);
}
}
}
};//完成静态事件方法的定义.
/*
*下面就给jQuery对象添加事件相关的方法.其实质是jQuery静态事件方法的
*封装.完成事件方面的任务时,'幕后黑手'主要仍然是上面定义的静态方法.
*/
// ------------------------------------------------下面给 jQuery对象添加事件方面的方法--------------------------------------------------------
/**
* 使用jQuery对象的extend函数还为jQuery对象扩展事件方面的方法.
*/
jQuery.fn.extend({
/**
* 为jQuery对象中的匹配元素集合绑定事件处理函数:
*如果是事件类型是unload就是调用jQuery对象自己的one函数来为匹配元素集合中的每一个元素在unload事件上绑定一个只执行一次的监听函数.
*
* 如果不是,就遍历jQuery对象匹配元素集合内的每一个元素,并为每一个元素绑定传入进来的事件处理函数.
* 请注意本函数内的this关键的具体含义,比较混乱,请保持清醒...
*
* @param {string} type - 事件类型, 如"click","mouseenter"等
* @param {Array} data - 需要绑定到事件处理函数上的数据.有时候bind方法只有两个参数, 即没有传入下面那个参数,那就把这个参数作为处理函数.
* @param {Function} fn - 事件处理函数
*/
bind: function( type, data, fn ) {
//这个this是jQuery对象//这个也是
return type == "unload" ? this.one(type, data, fn) : this.each(function(){//这个this指的是匹配元素集合内的每一个元素
jQuery.event.add( this, type, fn || data, fn && data );
});
},
/**
*为匹配元素集合中的每一个元素为type所指定的事件绑定个一次性的函数.这些函数只被执行一次.其使用方法同jQuery.fn.bind;
*
* @param {string} type - 事件类型, 如"click"
* @param {Array} data - 需要绑定到事件处理函数上的数据.有时候bind方法只有两个参数, 即没有传入下面那个参数,那就把这个参数作为处理函数.
* @param {Function} fn - 事件处理函数
*/
one: function( type, data, fn ) {//proxy函数将为匿名函数"安装"上一个guid属性.这个属性的值跟fn或data是一样的. proxy函数应用的场合一般是想扩展
//事件处理函数,在事件处理函数之前或之后再添加一些操作.这里定义了一个one函数,它的作用是把监听函数装起来,然后在//监听函数执行之前把这个函数从当前元素上卸载.
var one = jQuery.event.proxy( fn || data, function(event) {
//注意, this指的是当前正在处理的匹配元素集合中的元素.
jQuery(this).unbind(event, one);//首先卸载监听函数one
return (fn || data).apply( this, arguments );//然后执行真正的fn
});
return this.each(function(){//好,为匹配元素集合中的每一个元素绑定绑定one这个监听函数.
jQuery.event.add( this, type, one, fn && data);
});
},
/**
* 为jQuery对象卸载指定事件类型上的指定监听函数
* @param {string} type - 卸载的事件类型
* @param {Function} fn - 需要卸载的函数的引用
*/
unbind: function( type, fn ) {
return this.each(function(){//this指的是匹配元素集合中的每一个元素
jQuery.event.remove( this, type, fn );
});
},
/**
* 触发绑定在type所指定的事件上的监听函数.匹配元素集合中的每一个元素的事件监听函数都触发.
* @param {string} type - 所要触发的事件类型
* @param {Array} data - 需要传给事件监听函数的参数
* @param {Function} fn - 触发监听函数运行之后,你需要再执行的一些操作.
*/
trigger: function( type, data, fn ) {
return this.each(function(){
jQuery.event.trigger( type, data, this, true, fn );
});
},
/**
* 仅触发绑定在匹配元素集合第一个元素上,并且是type所指定的事件上的监听函数.
* @param {string} type - 所要触发的事件类型
* @param {Array} data - 需要传给事件监听函数的参数
* @param {Function} fn - 监听函数运行之后,你需要再执行的一些操作.
*/
triggerHandler: function( type, data, fn ) {
return this[0] && jQuery.event.trigger( type, data, this[0],false, fn );
},
/**
* 来自API文档的摘抄:
* 每次点击后依次调用函数。
*如果点击了一个匹配的元素，则触发指定的第一个函数，当再次点击同一元素时，则触发指定的第二个函数，如果有更多函数，则再次触发，直到最后一个。
* 随后的每次点击都重复对这几个函数的轮番调用。
* 可以使用unbind("click")来删除。
*
* 好,我来点说明:
* (1) 本函数需要接收两个以上的函数引用作为参数, 这里只有一个,请注意;
* (2) 第2个之后的所有函数拥有与第1个函数一样的函数ID.
*
* @param {Function} fn - 需要切换的函数, 可以传入多个Function.
*/
toggle: function( fn ) {
// Save reference to arguments for access in closure
// 翻译: 保存arguments的引用, 这样待会在闭包中还能访问到它.
var args = arguments, i = 1;
// link all the functions, so any of them can unbind thisclick handler
// 所有函数都使用给第1个函数一样的函数ID,这样可以在卸载时统一删除.
while( i < args.length )
jQuery.event.proxy( fn, args[i++] );//proxy函数仅仅为第二个参数添加一个与第一个参数一样的函数ID.
//添加click事件的监听函数.在监听事件里面轮流调用args内的每一个函数. 注意匿名函数中的i,它在上面那个函数运行完毕之后等于args的长度了.
return this.click( jQuery.event.proxy( fn, function(event) {
/*注意本匿名函数中的this指向的是当前正在处理的匹配元素集合中的那一个元素 */
// Figure out which function to execute
// 翻译: 计算出需要运行哪一个函数
this.lastToggle = ( this.lastToggle || 0 ) % i;
// Make sure that clicks stop
event.preventDefault();//取消浏览器的默认行为.
// and execute the function 翻译:运行这个函数
return args[ this.lastToggle++ ].apply( this, arguments )|| false;
}));
},
/**
* 分别注册两个监听函数到鼠标移入和移出两个事件上.
* @param {Function} fnOver
* @param {Function} fnOut
*/
hover: function(fnOver, fnOut) {
return this.bind('mouseenter', fnOver).bind('mouseleave',fnOut);
},
/**
* 将指定的一个fn绑定到DOM Ready事件发生时执行.
*
* @param {Function} fn - ready的监听事件.当DOM Ready时,此函数将会被调用
*/
ready: function(fn) {
// Attach the listeners
bindReady();//将jQuery.ready函数绑定到DOMReady(也即DOMContentLoaded)时执行.
// If the DOM is already ready
// 如果这个时候DOM已经ready了, 那事不宜迟,马上执行.将fn作为document的方法调用,并将jQuery的构造函数作为参数传入,方便fn进行处理.
if ( jQuery.isReady )
// Execute the function immediately
fn.call( document, jQuery );
// Otherwise, remember the function for later
// 否则,DOM 还没ready,那就把事件监听函数放入一个readyList当中,待到DOMReady事件真的发生了, 那么jQuery.ready函数将会被执行.jQuery.ready
// 函数则遍历readyList中的等待函数, 逐个执行它们.
else
// Add the function to the wait list 翻译:将函数加入到等待队列当中
/* 这里有一个问题值得思考,为什么不直接把fn放入readyList当中, 而是要在它外边再包裹多一层呢?
* 正如我前面所说的, 这种 "包裹方法"的做法在jQuery中是想改变fn的调用上下文以及传递参数.通过对jQuery.ready代码的分析,我们发现readyList
*中的每一个函数都会被这样调用:"this.call(document)",注意this在该环境中指的是当前正在处理的readyList中的函数. 这样下面的这个包裹的
* 函数就会被作为document的一个方法来执行,于是下面这个包裹函数体中的this指的就是document.
*/
jQuery.readyList.push( function() {
return fn.call(this, jQuery);
});
return this;
}
});
//--------------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------- jQuery DOM Ready方面的静态方法. 这也是事件模块的一部分--------------------------------------------------------
jQuery.extend({
isReady: false,// 让jQuery获得isReady这个属性,这个属性初始为false说明DOM结构还没建立.注意isReady表示的时机与window.onload是不一样的
// 具体参照bindReady的中文注释.
readyList: [],//等待DOM Ready事件的监听函数列表.
// Handle when the DOM is ready
/**
* 当DOM Ready之后, 这个函数马上就会被执行.而这个函数就会逐个执行readyList中的函数.readyList中函数就是绑定到DOM Ready事件上的函数.
* DOMReady是文档结构生成完毕,但是内容尚未加载完毕时(如HTML文档生产完毕,但是图片内容尚未加载完毕.)
*/
ready: function() {
// Make sure that the DOM is not already loaded
if ( !jQuery.isReady ) {
// Remember that the DOM is ready
jQuery.isReady = true;
// If there are functions bound, to execute
if ( jQuery.readyList ) {
// Execute all of them
// 执行所有绑定到DOM Ready事件上的函数,这些函数都被装在readyList当中.
//jQuery.each函数遍历readyList当中每一个函数,并用document作为这些函数的上下文而执行他们.
jQuery.each( jQuery.readyList, function(){
// 把 readyList里面的每一个函数都作为document的方法运行.注意this关键字指的是readyList中当前正在执行的监听函数
this.call( document );
});
// Reset the list of functions
// 执行完毕就将 readyList 清空
jQuery.readyList = null;
}
// Trigger any bound ready events
jQuery(document).triggerHandler("ready");
}
}
});
//-------------------------------------------------------------------------------------------------------------------------
var readyBound = false;//初始化的时候,我们认为还没有将事件监听函数绑定到DOM Ready事件当中.只要bindReady运行完毕, 这个变量就会变成true, 表示
//DOMReady事件已经模拟完毕(注意没有浏览器支持DOM Ready事件,有部分支持DOMContentLoaded),并且jQuery.ready函数已经
//绑定到该事件上.
/**
* 将jQuery.ready绑定到"DOMContentLoaded"事件中执行.
* "DOMContentLoaded"事件目前并没有得到普及,只有下面所述的Mozilla,Opera等浏览器实现这个事件.这个事件是指文档的HTML框架创建好的那一个时刻,
* 比如说HTML框架渲染完毕, 但是图片还没有load回来之前.
* 使用这个事件的好处是文档结构一建立,就马上可以执行JavaScript代码, 而不用等到大量的图片加载完毕才执行,增强了用户体验.
*/
function bindReady(){
if ( readyBound ) return;
readyBound = true;
// Mozilla, Opera (see further below for it) and webkitnightlies currently support this event
if ( document.addEventListener && !jQuery.browser.opera)
// Use the handy event callback
document.addEventListener( "DOMContentLoaded", jQuery.ready,false );
/*
* 由于IE 和 Safari不支持"DOMContentLoaded"事件,因此需要下面的代码来模拟这个事件.
* 而Opera虽然支持, 但是支持的方式比较特别,因此也需要另外的代码来绑定jQuery.ready到这个事件.
*
* COMP:
* 以下代码显示了各种浏览器检查DOMReady(即DOMContentLoaded)不同方式
*/
// If IE is used and is not in a frame
// Continually check to see if the document is ready
/*
* 翻译: 如果当前的浏览器是IE并且当前页面不在一个框架当中,就不断地检测文档是否准备就绪.
*/
if ( jQuery.browser.msie && window == top ) (function(){//如果一个页面的处在一个框架当中(in frame),那么它有一个全局的变量top指向
if (jQuery.isReady) return; //指向这个框架的顶层框架的windwo对象. 因此window == top 就为false.
try {
// If IE is used, use the trick by Diego Perini
// http://javascript.nwbox.com/IEContentLoaded/
document.documentElement.doScroll("left");//IE中使用这个方法检测DOM是否Ready,正如Resig所说的,这是一个trick(花招)有兴
//趣可深究没兴趣没时间记住了也可以.
} catch( error ) {//发生错误说明IE中DOM没Ready, 在catch中重试!
setTimeout( arguments.callee, 0 );//agruments.callee是一个函数本身的引用,而在0毫秒后重试是有一定的技巧的:
/*函数延迟0毫秒执行并不是立即执行,而是等浏览器运行完挂起的事件句柄和已经更新完文档状态之后才
*运行这个函数.详情见《JavaScript Definition Guide 5thEdition(JavaScript权威指南第5版)》
*/
return;//设置完定时器之后, 返回.
}
// and execute any waiting functions
jQuery.ready();//当首次测试到DOM Ready之后,马上运行jQuery.ready函数, 而jQuery.ready函数又会运行所有绑定到DOMReady事件上的函数//这些函数的引用被存储在jQuery.readyList当中.可以参考jQuery.ready的中文注释.
})();
// Opera浏览器支持"DOMContentLoaded"事件,但是这个DOMContentLoaded事件是不算上stylesheet的,即如果stylesheet文件没有链接完毕,但DOM OK了,
// Opera也算这个时刻为"DOMContentLoaded".我们的js代码有可能会需要获取stylesheet里面的值然后做出相应的动作,但是在stylesheet还没enable
// 之前做这些动作是不安全的. 因此,下面的代码将jQuery.ready函数再包装一层,在执行jQuery.ready之前确保stylesheet是enable的.
if ( jQuery.browser.opera )
document.addEventListener( "DOMContentLoaded", function () {
if (jQuery.isReady) return;//逐个检查stylesheet是不是enable的.注意,这个stylesheet包括link进来的和嵌入式(<style>标签里面)的.
for (var i = 0; i < document.styleSheets.length; i++)
if (document.styleSheets[i].disabled) {//一旦检测到有disabled的stylesheet,就需要重新执行这个(bindReady)函数了.
setTimeout( arguments.callee, 0 );//设置bindReady函数在0毫秒后执行.
return;
}
// and execute any waiting functions
// 如果上面的for循环顺利的话,即没有碰到disabled的stylesheet, 那就不会被return截断函数的执行,这个时候可以执行jQuery.ready了.
jQuery.ready();
}, false);//false表示不需要在事件的捕捉阶段处理事件.
// safari不支持"DOMContentLoaded"事件, 于是需要采取措施来模拟:
if ( jQuery.browser.safari ) {
var numStyles;//用来记录文档中链接的stylesheet的数目.Safari将用它来检测stylesheet是否全部加载完毕.
(function(){
if (jQuery.isReady) return;
/*
* 由于safari没有IE的"doScroll"的trick,因此就比较麻烦了,需要通过readyState来判断
*/
//"loaded" 和 "complete" 是我们想要的状态,如果不是这两个状态,则重新执行bindReady
if ( document.readyState != "loaded" && document.readyState != "complete" ) {
/*readyState有5种状态(下表只是一种解释,可以看到,还有不少其他的解释):
* 0 = uninitialized 未初始化,还没发送请求
* 1 = loading 正在发送请求
* 2 = loaded请求发送完毕,已经接收到全部的响应内容
* 3 = interactive 正在解析响应内容
* 4 = complete 响应内容解析完成
*/
setTimeout( arguments.callee, 0 );//延迟0微秒(具体作用可以看上面的注释)之后,再重新执行bindReady.
return;
}
/*
* 经过上面那个if,并不能保证就是我们所要的"DOMContentLoaded",因为这个时候也同样面临着跟Opera一样的stylesheet可能未加载完毕
* 的危险.下面的代码就是要解除这个危险.
*/
if ( numStyles === undefined )// 一个变量初始化的时候,如果没复制, 就是"undefined"
numStyles = jQuery("style, link[rel=stylesheet]").length;// 注意,这里有两个选择器
if ( document.styleSheets.length != numStyles ) {//数目不对表示stylesheet没有加载完成, 重新执行bindReady
setTimeout( arguments.callee, 0 );
return;
}
// and execute any waiting functions
// 好了, 代码如果能运行到这里, 那么一切就绪了,可以执行jQuery.ready!
jQuery.ready();
})();
}
// A fallback to window.onload, that will always work
// 将 jQuery.ready 方法绑定到load 事件.这样不管浏览器是否支持DOMReady, jQuery.ready内的代码总是被执行, 慢就慢点咯.
// 或许有人会问, 那jQuery.ready岂不是执行了两次?不会,因为jQuery.ready函数会检查标志变量的isReady的. 当jQuery.ready
// 函数被执行过一次之后, isReady就为true了.具体参见jQuery.ready的代码.
jQuery.event.add( window, "load", jQuery.ready );
}
//---------------------------------------------------------------------- jQuery 对象对各种事件的绑定函数------------------------------------
//为"blur,focus,load,resize,scroll,unload,click,dblclick..."等事件定义一个事件绑定函数.
jQuery.each( ("blur,focus,load,resize,scroll,unload,click,dblclick," +
"mousedown,mouseup,mousemove,mouseover,mouseout,change,select," +
"submit,keydown,keypress,keyup,error").split(","), function(i,name){
/*
* 为了说明问题,以下注释将举一个例子来说明到底这段代码干了些什么事情. 假设现在的name = 'click', 于是 i=6 (i是click在split产生的数组中的排序)
*/
// Handle event binding
// 经过上面的假设, 现在name = 'click', 于是你可看到,下面的代码在jQuery对象上定义了一个叫"click"的方法. 它有一个参数,这个参数就是你需要在
// HTML元素被click时的响应函数, 也即监听函数.如果这个函数没有被传入click方法,那么jQuery对象就会触发所有绑定在click事件上的所有监听函数.
jQuery.fn[name] = function(fn){
return fn ? this.bind(name, fn) : this.trigger(name);
};
});
// Checks if an event happened on an element within another element
// Used in jQuery.event.special.mouseenter and mouseleave handlers
/**
* 意译上面那段英文:检测鼠标mouseenter事件和mouseleave事件发生时,鼠标是不是真的在事发元素上, 而不是在它的子元素上.
* 这个函数在 Query.event.special.mouseenter 和 mouseleave的handler中被使用.当这个函数判断到鼠标处在元素的子元素上时,handler函数就
* 会return.
* @param {Event} event - 事件对象
* @param {HTMLElement} elem - 检测到底是不是在这个元素里面
*/
var withinElement = function(event, elem) {
// Check if mouse(over|out) are still within the same parentelement
/* relatedTarget对于mouseover来说,它是鼠标移动到目标元素上时所离开的那个元素; 而对于mouseout来说,它是离开目标时,鼠标进入的那个元素.
* 详情参见《JavaScript Definition Guide 5th Edition(JavaScript 权威指南 )》
*/
var parent = event.relatedTarget;
// Traverse up the tree
//一直往上查找看看鼠标的当前关联元素的父亲或者祖先是不是函数第二个参数所指定的那个元素(elem), 是就说明还在elem元素上.
while ( parent && parent != elem ) try { parent = parent.parentNode; } catch(error) { parent = elem; /*发生错误也认为鼠标仍在元素内 */}
// Return true if we actually just moused on to a sub-element
return parent == elem;
};
// Prevent memory leaks in IE
// And prevent errors on refresh with events like mouseover in otherbrowsers
// Window isn't included so as not to unbind existing unload events
// 翻译: 避免IE中内存泄漏.
// 并且避免在其他浏览器中像mouseover那样的事件刷新时所导致的错误
// Window对象并没有包括在内,以免将已经绑定在window.unload事件上的监听函数卸载掉(因为整个unload过程由window.unload触发, 你删了它, 那还怎么触发啊)
jQuery(window).bind("unload", function() {//所有包括document在内的文档元素在unload事件发生时卸载掉所有的事件监听函数.
jQuery("*").add(document).unbind();
});
//-------------------------------------------------------------------扩展 jQuery对象使其具有 ajax方面的能力 -------------------------
jQuery.fn.extend({
// Keep a copy of the old load
_load: jQuery.fn.load,//将原来老的load方法保存.
/**
* 让一个 jQuery对象获得加载远程文档并且将加载的内容放到自己里边.这个函数使用了jQuery 有关ajax 方面的静态那函数
*
* @param {string} url
* @param {Object} params
* @param {Function} callback
*/
load: function( url, params, callback ) {
if ( typeof url != 'string' )
return this._load( url );
// 看看url 里面是否含有selector, 有selector,说明并不想把请求页面的所有内容都load回来,只是想load selector指定的部分
var off = url.indexOf(" ");
// off >= 0, 说明含有selector, 分离出真正的url和selector
if ( off >= 0 ) {
var selector = url.slice(off, url.length);
url = url.slice(0, off);
}
//保证要有一个回调函数
callback = callback || function(){};
// Default to a GET request load缺省使用GET方法获取数据
var type = "GET";
// If the second parameter was provided
// 如果提供了第二个参数,那就根据这个参数的类型做出一些调整
if ( params )
// If it's a function
// 如果params是函数,那就对load函数的各个参数进行"矫正"处理:
if ( jQuery.isFunction( params ) ) {
// We assume that it's the callback
callback = params;
params = null;
// Otherwise, build a param string
// 否则,使用jQuery.param方法将params对象转化为一个字符串.这个过程叫做"参数串行化"
} else {
params = jQuery.param( params );//jQuery.param将params对象转化成为字符串,以便load方法使用POST方式将这些参数传输到服务器端
type = "POST";//如果有参数传入,那我们就使用POST方法传递参数并获取结果.
}
var self = this;//保存this的引用,因为接下来的函数定义中this的含义将会被改变.
// Request the remote document
//使用静态的ajax方法请求远程的文档.ajax函数接收一个对象作为参数,这个对象对本次ajax请求进行了设置:
jQuery.ajax({
url: url,//从这个url加载数据
type: type,//请求的类型,GET or POST or Others
dataType: "html",// 将请求到的数据当作HTML来解析
data: params,// 发送到服务器端的参数, 如果它有值,则type将会被改为POST, 因为GET方法不适宜发送大量数据
/**
* 当请求成功时所调用的函数,可以是它是jQuery的"系统级"回调,一般情况下jQuery的应用级程序员(也就是使用jQuery的程序员)不需要关注这个函数
* 他们只需要关注自己"应用级callback",即自己写的callback便可.
*
*也许你觉得为什么就是这两个参数而不是其他的参数?能不能修改?
* 要解决你这个问题,你必须查看OnComplete事件监听器的代码,是它决定了complete函数所能获得的参数.
*
* @param {Object} res - 服务器返回的内容
* @param {Object} status - 响应的状态
*/
complete: function(res, status){
// If successful, inject the HTML into all thematched elements
// 翻译: 如果请求成功, 将HTML注入到所有匹配元素当中去.
if ( status == "success" || status == "notmodified" )
// See if a selector was specified
// 如果请求url中有选择器,那么在请求结果中过滤出选择器所指定的部分, 然后再注入.如url为"info.php #news", 则仅将请求回来的页面
// 中#news里的HTML注入到目标元素当中.
self.html( selector ?
// Create a dummy div to hold the results
// 把请求回来的内容先注入到一个空壳div中
jQuery("<div/>")
// inject the contents of the documentin, removing the scripts
// to avoid any 'Permission Denied'errors in IE
/* 翻译: 注入整个文档的内容,与此同时去除调scripts标签以免在IE中导致 "Permission Denied" 的错误
*/
.append(res.responseText.replace(/<script(.|\s)*?\/script>/g, ""))
// Locate the specified elements
// 翻译: 定位指定的元素.其实就是过滤出selector所指定的内容最后作为selt.html的参数
.find(selector) :
// If not, just inject the full result
// 如果没有指定选择器, 那好办,直接把内容作为self.html的参数,直接注入到匹配元素集合中的每一个元素中去.
res.responseText );
// 在匹配元素集合中的每一个元素上调用callback函数,并以[res.responseText, status, res] 作为参数
self.each( callback, [res.responseText, status, res]);
}
});
return this;//返回jQuery对象的引用, 方便链式调用.
},
/**
* 串行化参数.将jQuery对象上的需要被串行化的参数对象转化为一个类似"a=value1&b=value2&c=value3"的字符串, 方便GET(参数不多时)或者POST使用.
* 可以看到, 这个serialize不过是一个Facade(门面),实际完成工作的是jQuery.param函数.具体可以参考jQuery.param函数的中文注释.
*/
serialize: function() {
return jQuery.param(this.serializeArray());
},
/**
*将jQuery对象中匹配元素集合中的元素转换成一个数组.数组中的每一个元素是一个对象, 每个对象的结果如下:
* {name:"name",value:"value"}
*/
serializeArray: function() {
//map函数对匹配元素集合内的每一个元素调用参数中的那个函数进行处理,并用这个处理结果新建一个jQuery对象, 并用这个新对象替换原来的
// 旧jQuery对象,最终map函数将返回这个新jQuery对象的引用, 从而方便方法的链式调用.
return this.map(function(){
//注意以下代码中的this指的是匹配元素集合中当前正在处理的的那个元素
// 看看当前这个元素是不是form,如果是就将form内的元素(elemsts)使用jQuery.makeArray转化为数组返回(因为form内的字段才是我们需要的);
// 如果不是那就直接元素返回.可见serializeArray函数中的map的作用主要是针对form元素的.
return jQuery.nodeName(this, "form") ?
jQuery.makeArray(this.elements) : this;
})
/*
* filter 函数筛选出符合条件的元素.而筛选条件就由传入filter的方法( fn )来决定.这个方法( fn ) retrun回来的元素就是要过滤出来的元素.
*/
.filter(function(){
//把表单中的有name属性的,可见的,能用的,被选上的,总之是要传到服务器端的参数全部留下. 注意这个过滤函数的返回值是true/false, true就是
// 将当前正在过滤的这个元素留下, false的话就是不要.
return this.name && !this.disabled &&
(this.checked || /select|textarea/i.test(this.nodeName) ||
/text|hidden|password/i.test(this.type));
})
/*
* 将筛选出来的元素最后map过一次之后重新组合成一个数组.这个最后一次的map主要是HTML元素转化为一个具有"name"和"value"的对象.
*/
.map(function(i, elem){
// 使用val()函数取得第一个匹配元素标签内的值(jQuery(this)也就一个匹配元素),有点innerText的味道...
var val = jQuery(this).val();
// "? :" 运算符总是那么简洁, 比较难用语言表述.
return val == null ? null :
val.constructor == Array ?//如果val.constructor是Array,则this就是一个类似Select那样的元素,能够选择多个值,所以valu()才会返回Array
jQuery.map( val, function(val, i){//如果val是数组, 那就将数组里面的每一个元素映射为{name: elem.name,value: val}.
//这个val是一个数组
return {name: elem.name, value: val};
}) :
// 这个val 是一个字符串
{name: elem.name, value: val};
})
.get();/*
* get()方法将jQuery对象的匹配元素集合"抽"出来,得到一个数组, 并将这个数组返回.
* 如果你不喜欢操作jQuery对象(这个对象里面包含选择器所选择到的所有元素 ), 那么调用jQuery 对象的get 函数将会获
* 得一个由匹配元素集合里元素所组成的数组,这样你就可以直接操作他们了.
*/
}
});
//------------------------------------------------------------------让每个jQuery 对象又具有了ajax 方面事件的监听能力------------------
/*
* 以下代码为"ajaxStart,ajaxStop,ajaxComplete,ajaxError,ajaxSuccess,ajaxSend"各定义一个事件绑定函数. 注意这些事件是自定义事件, 于是事件
* 的触发就需要自己来了.
*/
jQuery.each("ajaxStart,ajaxStop,ajaxComplete,ajaxError,ajaxSuccess,ajaxSend".split(","), function(i,o){
jQuery.fn[o] = function(f){
return this.bind(o, f);
};
});
//----------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------让jQuery 再具有ajax方面的静态函数 ---------------------------
// 这些函数都是jQuery在完成ajax任务时所真正使用的底层静态函数.jQuery对象的ajax方法全部是对这些方法的封装. 这些静态函数构成了jQueryajax的核心
//------------------------------------------------------------------------------------------------------------------------------
var jsc = now();//jsc被赋予当前的时间,作为一个时间戳.
jQuery.extend({
/**
* 使用GET方法发送请求
* @param {string } url - 请求地址
* @param {Object } data - 发送的数据
* @param {Function} callback - 请求成功后需要执行的函数
* @param {string} type - 请求的文档数据类型
*/
get: function( url, data, callback, type ) {
// shift arguments if data argument was ommited
//如果data是一个函数而不是一个字符串那么就要做一个"矫正"的操作
if ( jQuery.isFunction( data ) ) {
callback = data;
data = null;
}
//调用jQuery.ajax函数
return jQuery.ajax({
type: "GET",//使用GET方法发送请求
url: url,//路径
data: data,//需要发送的数据
success: callback,//成功响应后所要执行的函数
dataType: type//期望响应的数据类型, 如application/xml,text/xml,text/html等
});
},
/**
* 使用GET方法向url指定的地址请求一个脚本文件.
* @param {string} url - 请求地址
* @param {Function} callback - 请求成功后需要执行的函数
*/
getScript: function( url, callback ) {
return jQuery.get(url, null, callback, "script");
},
/**
* 使用GET方法向url指定的地址请求JSON格式的数据
* @param {string} 请求地址
* @param {string} 发送的数据
* @param {Function} 请求成功后需要执行的函数
*/
getJSON: function( url, data, callback ) {
return jQuery.get(url, data, callback, "json");
},
/**
* 使用POST方法向url指定的地址发送请求
* @param {string } url - 请求地址
* @param {Object } data - 发送的数据
* @param {Function} callback - 请求成功后需要执行的函数
* @param {string} type - 请求的文档数据类型
*/
post: function( url, data, callback, type ) {
//看看data是不是函数,如果是函数那就做一些"矫正"的工作.有的人喜欢这种简便的调用方式.
if ( jQuery.isFunction( data ) ) {
callback = data;
data = {};
}
//调用核心的ajax方法, 将发送方式设置为POST
return jQuery.ajax({
type: "POST",
url: url,
data: data,
success: callback,
dataType: type
});
},
/**
* 添加或者修改ajax默认参数设置.
* 可以看到使用了extend函数来达到这个目的.
*extend函数会看看jQuery.ajaxSettings有没有settings里面所列出的属性,没有就给它加上,有就用settings里的属性值代替jQuery.ajaxSettings
* 里的同名属性的值.
* @param {Object} settings
*/
ajaxSetup: function( settings ) {
jQuery.extend( jQuery.ajaxSettings, settings );
},
/**
* ajax的默认设置
*/
ajaxSettings: {
url: location.href,
global: true,// 设置本次请求的作用范围是否为全局.像ajaxStart, ajaxStop, click, blur, focus 等事件都是global全局事件.
// 比如说我们的页面上有一个id为'panel'的div.这个div在ajax请求发送时显示"request sending...",结束后显示
// "stop". 我们可能会写如下的代码:
/*
* $('#panel').ajaxStart(function(){//set text'request sending...'}).ajaxStop(function(){// set text 'stop'});
*
*
* 如果我们的global参数为false,那么这些事件发生时并不触发绑定在这些事件上的监听函数,而只是运行用户在参数设置时所设定的
* callback. 在默认情况之下global为true,也就是说我们在这些事件上绑定的事件监听函数都会得到运行.
*/
type: "GET",
timeout: 0,
contentType: "application/x-www-form-urlencoded",
processData: true,
async: true,
data: null,
username: null,
password: null,
accepts: {//请求所期望的(浏览能够接收的)数据类型,即MIME type
xml: "application/xml, text/xml",
html: "text/html",
script: "text/javascript, application/javascript",
json: "application/json, text/javascript",
text: "text/plain",
_default: "*/*"//默认情况下为所有的数据类型都能接收.
}
},
// Last-Modified header cache for next request
// 翻译:为下一次请求缓存的Last-Modified头部.
lastModified: {},
/**
* jQuery ajax的核心方法. 用于根据设置发送ajax请求.
* @param {Object} s - 发送设置.
*/
ajax: function( s ) {
// Extend the settings, but re-extend 's' so that it can be
// checked again later (in the test suite, specifically)
s = jQuery.extend(true, s, jQuery.extend(true, {}, jQuery.ajaxSettings, s));
var jsonp, /*JSONP是一个非官方的协议,它允许服务器端集成Script Tags返回给客户端,通过JavaScript callback的形式简单实现跨域访问.
* 这是一个简单的jQuery JSONPurl的例子:"http://www.linhuihua.com?info=latestNews&callback=?&date=2009-5-15", jQuery
* 使用下面那个正则表达式jsre将"=?"找出来,然后替换成一个你指定的函数名称. 假设你所请求的响应数据为[{2009_5_15,'No news today'}],
* 而你指定的callback名称为 displayNews,则服务器返回 "<script>displayNews([{2009_5_15, 'No newstoday'}])</script>".
*
*更多关于JSONP的信息请参考wikipedia:http://en.wikipedia.org/wiki/JSONP#JSONP. 如果你对JSONP没有兴趣,你仅需知道
* 认为这是一种实现JavaScript跨域访问的方式即可.
*/
jsre = /=\?(&|$)/g, // 解释看上面的中文注释
status, //此属性是用来判断请求/响应状态的.
data, //需要发送的数据.
type = s.type.toUpperCase();//HTTP请求发送类型,GET or POST
// convert data if not already a string
//如果数据还没有被转化成字符串,那就调用param把他们转化为字符串.
if ( s.data && s.processData && typeof s.data != "string" )
s.data = jQuery.param(s.data);
// Handle JSONP Parameter Callbacks
// 如果请求的数据类型是JSON,那么就要根据请求中的url中是否含有"=?"来判断这是不是一个 jQueryJSONP的请求, 然后做出相应的调整.
if ( s.dataType == "jsonp" ) {
if ( type == "GET" ) {
if ( !s.url.match(jsre) )//如果url不是一个jQueryJSONP格式的url,那就把这个url修改成一个带有类似"callback=?"的url
s.url += (s.url.match(/\?/) ? "&" : "?") + (s.jsonp || "callback") + "=?";
} else if ( !s.data || !s.data.match(jsre) )//没有要发送的data,或者有,不过data里面没有jsre所描述的那中url模式,都把这些url组装成为
//jQueryJSONP的格式.
s.data = (s.data ? s.data + "&" : "") + (s.jsonp ||"callback") + "=?";
s.dataType = "json";//把dataType改会json,因为jsonp不是标准来的.与此同时,将s.dataType修改成"json"之后, 代码才能进入下面那个
//if语句来执行.
}
// Build temporary JSONP function
// 翻译: 建立临时的 JSONP 函数
// 如果所请求的数据类型为json, 并且请求参数符合jQuery JSONP的模式
if ( s.dataType == "json" && (s.data && s.data.match(jsre) ||s.url.match(jsre)) ) {
jsonp = "jsonp" + jsc++;//jsc为当前时间的毫秒数,现在++了.现在jsonp将被用作jQuery自定义的JSONP的回调函数的名称.例如,假设那个毫秒
//数为145386355672(这个数字我随便安的别跟我较真啊),那么最终生成的JSONP所用的url长得可能是这个样子:
//http://www.linhuihua.com?show=newInfo&callback=jsonp145386355672&date=2009-5-15
// Replace the =? sequence both in the query string andthe data
// 将"=?"替换为jQuery在jsonp变量里面定义的callback名称,在url地址, 发送的参数上都进行这个替换.
if ( s.data )
s.data = (s.data + "").replace(jsre, "=" + jsonp +"$1");
s.url = s.url.replace(jsre, "=" + jsonp + "$1");
// We need to make sure
// that a JSONP style response is executed properly
s.dataType = "script";//将dataType最终改为"script",这样浏览器在接收到JSONP响应(那不过是一些JS代码)之后能够运行加载回来的JS代码.
// Handle JSONP-style loading
/*
* 上面完成了JSONP请求的构造,而我们也在url中指定了callback的名称,在上面的注释的例子中这个名称为jsonp145386355672.而下面的代码就
* 是真正定义一个jsonp145386355672函数.
*/
window[ jsonp ] = function(tmp){//tmp是服务器的返回结果中的数据部分.
data = tmp;
success();//触发success事件
complete();//触发complete事件
// Garbage collect 垃圾回收
window[ jsonp ] = undefined;
try{ delete window[ jsonp ]; } catch(e){}//运行完这个callback函数之后, 删除他的引用,然后等待垃圾回收器将其回收.
if ( head )// head 文档中<head>的引用
head.removeChild( script );//将服务器返回的JS代码插入到浏览器, 浏览器就会运行这些代码.
};
}
//如果请求的响应数据是script,并且在ajax参数设置上没有指定cache属性, 那就让cache为false,不用缓存这些JS数据
if ( s.dataType == "script" && s.cache == null )
s.cache = false;
if ( s.cache === false && type == "GET" ) {
var ts = now();//事件戳
// try replacing _= if it is there
// url中用"_="后边接一个日期或者毫秒数来表示时间戳,如果ur中含有"_=",那证明这里有一个时间戳,那么修改这个事件戳的值为ts的值
var ret = s.url.replace(/(\?|&)_=.*?(&|$)/, "$1_=" + ts +"$2");
// if nothing was replaced, add timestamp to the end
//如果在上面的replace中并没有发生任何的改变,那说明url里没有时间戳,那把ts这个时间戳放在url的后面.
s.url = ret + ((ret == s.url) ? (s.url.match(/\?/) ? "&": "?") + "_=" + ts : "");
}
// If data is available, append data to url for get requests
// 翻译:如果有提供传送的数据,把数据添加到请求url的后边(译者注:当然这个请求必须是GET请求)
if ( s.data && type == "GET" ) {
s.url += (s.url.match(/\?/) ? "&" : "?") + s.data;
// IE likes to send both get and post data, prevent this
// COMP: 翻译:IE喜欢一起发送get和post的数据,(采取措施)阻止它这样
s.data = null;
}
// Watch for a new set of requests
if ( s.global && ! jQuery.active++ )//jQuery.active为0时,才有可能运行下面的trigger代码.也就是说一个新的请求队列产生时, ajaxStart
jQuery.event.trigger( "ajaxStart" );//触发ajaxStart时间,fire!
// Matches an absolute URL, and saves the domain
// 翻译: 匹配一个绝对的网络地址(URL), 并保存它的域名
var remote = /^(?:\w+:)?\/\/([^\/?#]+)/;
// If we're requesting a remote document
// and trying to load JSON or Script with a GET
//对比本地域名与请求域名,如果不相同,则说明是一个远程请求,那就使用在<head>中动态添加<script>标签的做法来实现跨域请求
if ( s.dataType == "script" && type == "GET"
&& remote.test(s.url) && remote.exec(s.url)[1] !=location.host ){
var head = document.getElementsByTagName("head")[0];//获取<head>标签的引用
var script = document.createElement("script");//创建一个script标签
script.src = s.url;//设置这个script节点的src属性,当新建的script节点被插入<head>后, 浏览器将会根据这个地址加载脚本
if (s.scriptCharset)//如果指定了脚本的编码方式,那就设置编码方式
script.charset = s.scriptCharset;
// Handle Script loading
if ( !jsonp ) {// jsonp要有非undefined的值,必须要具备几个条件:(1)s.dataType必须是json/jsonp;(2)url必须符合jQueryJSONP
//的要格式要求.代码如果运行进这个if语句块,说明ajax函数调用者无意进行JSONP调用(设置了非json/jsonp的dataType或url
// 并不符合jQuery JSONP格式的要求),那好, 把刚才
var done = false;
// Attach handlers for all browsers
script.onload = script.onreadystatechange = function(){
if ( !done && (!this.readyState ||
this.readyState == "loaded" || this.readyState == "complete") ) {
done = true;//将done设置为true,onreadystatechange如果再被调用就再也不会触发下面的success,complete事件了
success();//触发ajax 请求 success事件
complete();//触发ajax 请求complete事件
head.removeChild( script );//把script标签移除, 因为它是为了实现跨域请求临时的生成的.
}
};
}
head.appendChild(script);//将新建的script节点加入到<head>标签中, 那浏览器就会加载这个脚本
// We handle everything using the script element injection
//注意整个if语句的条件:"如果使用GET方式请求一个远程script脚本".那么,代码运行到这里事情已经完成了,接下来的事情全部由加载回来的JS代码完成.
// 可以返回了. 返回值设置为undeined.
return undefined;
}
/*
* 在浏览器中有三种方式能够发送异步的HTTP请求:
* (1) iframe
* (2) script
* (3) XMLHTTPRequest
* 其中iframe由于安全性的问题, 一直遭人诟病.
*以本块注释为界,上面的代码使用了script的方式来发送一个请求脚本的异步请求;
* 而本注释块下方的代码, 则使用了XMLHTTPRequest来发送请求.
*/
var requestDone = false;
// Create the request object; Microsoft failed to properly
// implement the XMLHttpRequest in IE7, so we use theActiveXObject when it is available
/* 翻译: 创建请求对象;微软在IE7上并没有正确地实现XMLHttpRequest,所以(为了安全起见)在ActiveXObject可用的时候尽量使用ActiveXObject
* (来创建XMLHttpRequest).
*
* 出于以上(翻译)原因,jQuery创建一个XMLHTTPRequest(下成XHR)对象的方式是比较简单的:对IE统一采用ActiveXObject, 而其他浏览器则使用
*XMLRequest().其实我们随便google出来的创建XHR代码都比jQuery的复杂,"Microsoft.XMLHTTP"这个ActiveXObject是为了向后兼容最老版
* 本的IE(IE5)上的XHR.创建XHR的ActiveXObject其实还有更加新的版本:
* (1) Msxml2.XMLHTTP.6.0
* (2) Msxml2.XMLHTTP.3.0
* (3) Msxml2.XMLHTTP
* (4) Microsoft.XMLHTTP
*
* 在jQuery 1.3.2中,下面的这行代码被移入了ajaxSettings.xhr函数中,并且能够被重写.这样,在jQuery 1.3.2中如果你觉得jQuery的xhr创建
* 方法太过简陋, 或者说你想对XHR对象进行缓存,你可以自己调用ajaxSetup方法来自己定制.不过,在这一个版本(1.2.6)的jQuery中, 恐怕我们就只
* 能睁一只眼闭一只眼了.
*///IE//non-IE(XHR正处于标准化的过程中,但目前还不是标准)
var xhr = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
// Open the socket
// 翻译:打开socket
/* 对于Resig师父所说的"socket", 《Pro JavaScript Techniques(精通JavaScript)》的译者有话要说：
* "...open the socket(打开套接字), 这是错误的.考虑XHR对象完全不需要考虑到socket编程的细节, Microsoft, Apple 和Mozilla的文档
* 也无一提到过open和socket有任何关系,都只是说open用于初始化一个准备发起仍在'pending'状态中的请求..."
*
* so, 我只是列出一些不同的声音, 请聪明的读者自行甄别.
*/
//
// Passing null username, generates a login popup on Opera(#2865)
// comp: 在Opera 9.5(至少在这一个版本)中,如果我们使用XHR来发送一个请求, 并且s.username是一个null值时,浏览器会弹出一个prompt框要求
// 用户登录. 于是为了避免这个问题,我们对username进行区别对待, 有username, 就把他发过去; 没有就不要发,而不是发一个null到服务器端.
if( s.username )
xhr.open(type, s.url, s.async, s.username, s.password);
else
xhr.open(type, s.url, s.async);
// Need an extra try/catch for cross domain requests inFirefox 3
//翻译:在Firefox3中发送跨域请求需要一个额外的try/catch块(译者注:Firefox3中这些设置能会引发错误,故需要使用一个try/catch)
try {
// Set the correct header, if data is being sent
// 如果有要发送的data的话, 那要好好设置这些data的类型
if ( s.data )
xhr.setRequestHeader("Content-Type", s.contentType);
// Set the If-Modified-Since header, if ifModified mode.
// 如果需要一个过期头, 那就设置这个过期头.过期头所标识的日期一般用于浏览器的缓存设置.如果服务器端那边的页面的更新日期要晚于过期头内
// 标注的日期, 服务器端就返回这个最近更新的页面;否则返回304状态: not-modified, 浏览器就不用加载一样的页面,提升了用户体验.
if ( s.ifModified )
xhr.setRequestHeader("If-Modified-Since",
jQuery.lastModified[s.url] || "Thu, 01 Jan 197000:00:00 GMT" );
// Set header so the called script knows that it's anXMLHttpRequest
// 翻译:设置(相应的)头部,这样(服务器端)脚本便能知道这是一个通过XMLHttpRequest发送的请求.
xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
// Set the Accepts header for the server, depending onthe dataType
// 设置接收数据的类型,好让服务器知道该给你返回什么类型的数据; 置于具体是什么类型,这个由dataType参数来决定.
xhr.setRequestHeader("Accept", s.dataType && s.accepts[ s.dataType ] ?
s.accepts[ s.dataType ] + ", */*" :
s.accepts._default );//
} catch(e){}
// Allow custom headers/mimetypes
// beforeSend是用户自己在传入进来的参数中定义的一个方法,这样用户就可以在XHR请求发送之前做一些自己想做的事情, 干预请求
if ( s.beforeSend && s.beforeSend(xhr, s) === false /*如果beforedSend返回false则取消XHR请求 */ ) {
// cleanup active request counter
// XHR请求被取消, 活跃的XHR请求数当然要减1啦.
s.global && jQuery.active--;
// close opended socket
// 翻译:关闭已经打开的请求
xhr.abort();
return false;// 返回false说明ajax请求发送失败.
}
//global默认是true
if ( s.global )
jQuery.event.trigger("ajaxSend", [xhr, s]);// 好吧,一切准备就绪, 触发发送事件, 绑定在这个事件上的事件监听函数将会被运行
/*
* XMLHTTPRequest方式的异步请求发送部分设置完毕,下面进行响应接收部分的设置:
*/
// Wait for a response to come back
// 翻译: 等待返回的请求
var onreadystatechange = function(isTimeout){
// The transfer is complete and the data is available,or the request timed out
// 翻译: 传输完毕 并且数据可用,或者请求超时我们都认为本次请求完成(requestDone = true)
if ( !requestDone && xhr && (xhr.readyState == 4 ||isTimeout == "timeout") ) {
requestDone = true;
// clear poll interval
// ival是计时器的引用, 如果有这个引用,证明设置了计时器, 请求完成就当然要清除这个计时器啦,这样,请求就不会重试了.
if (ival) {
clearInterval(ival);//清除请求
ival = null;
}
//获取请求完成后的请求状态:
// 注意 "status = isTimeout == "timeout" &&"timeout" ||" 这句代码的执行顺序是
// "status = (isTimeout == "timeout") && "timeout"
status = isTimeout == "timeout" && "timeout" ||
!jQuery.httpSuccess( xhr ) && "error" ||
s.ifModified && jQuery.httpNotModified( xhr, s.url ) && "notmodified" ||
"success";//如果请求成功就调用jQuery.httpData函数来解析请求回来的数据.解析的过程中如果出错, 就设置status为:"parsererror"
if ( status == "success" ) {
// Watch for, and catch, XML document parse errors
try {
// process the data (runs the xml throughhttpData regardless of callback)
data = jQuery.httpData( xhr, s.dataType, s.dataFilter );
} catch(e) {
status = "parsererror";
}
}
// Make sure that the request was successful ornotmodified
if ( status == "success" ) {
// Cache Last-Modified header, if ifModified mode.
// 如果设置了ifModified为true,说明要对响应头进行缓存(这样下次请求相同url的时候可以看看请求的页面的修改日期是否晚过这个日期,
//从而决定是否加载那个页面).下面代码的主要工作就是要保存这个last-Modified
var modRes;
try {
modRes = xhr.getResponseHeader("Last-Modified");
} catch(e) {} // swallow exception thrown by FFif header is not available
if ( s.ifModified && modRes )
jQuery.lastModified[s.url] = modRes;//保存这个last-Modified的时间
// JSONP handles its own success callback
// JSONP 有自己的success callback,不需要运行下面这个success函数.
if ( !jsonp )
success();
} else//如果不是"success"那就认为是出错了,调用jQuery.handleError函数来处理这个情况.
jQuery.handleError(s, xhr, status);
// Fire the complete handlers
// 翻译: 触发complete事件,那么绑定在这个事件上事件监听函数就会被运行.
complete();
// Stop memory leaks
// 把xhr设为null, 让垃圾回收器对xhr进行回收,防止内存泄漏.
if ( s.async )//s.async在默认的情况之下是true,使用异步的方式发送请求.
xhr = null;
}
};
//如果是异步的请求, 设置请求重试, 一次不成功就再来一次,直到成功或者超时
if ( s.async ) {
// don't attach the handler to the request, just poll itinstead
var ival = setInterval(onreadystatechange, 13);
// Timeout checker
// 设置超时后的处理函数和超时的时间.
if ( s.timeout > 0 )
setTimeout(function(){
// Check to see if the request is still happening
// 如果xhr不为null, 说明请求正在进行,取消这次请求, 因为超时了
if ( xhr ) {
// Cancel the request
xhr.abort();
if( !requestDone )//如果请求还没完成,不管了,马上调用onreadystatechange并传入"timeout",这样requestDone就会==true
onreadystatechange( "timeout" );
}
}, s.timeout);
}
/*
* 好了,好了...发送的设置, 响应的设置总算完成了, 可以发送了.
*/
// Send the data
// 终于可以发送请求了
try {
xhr.send(s.data);
} catch(e) {
//出错就调用handleError进行处理
jQuery.handleError(s, xhr, null, e);
}
// firefox 1.5 doesn't fire statechange for sync requests
// COMP:翻译:在firefox 1.5中,同步请求并不能触发statechange事件. (好吧, 自己来... )
if ( !s.async )
onreadystatechange();//自己触发这个事件
/**
* 请求成功事件的触发函数
*/
function success(){
// If a local callback was specified, fire it and passit the data
// 翻译:如果用户提供了自己的callback函数,就在这里调用它, 并把数据传给它
if ( s.success )
s.success( data, status );
// Fire the global callback
// 翻译:触发全局的callback
//如果有其他的元素的处理事件绑定到了这个事件(ajaxSuccess)上,触发这些函数
if ( s.global )
jQuery.event.trigger( "ajaxSuccess", [xhr, s] );
}
/**
* 请求请求发送完成事件的触发函数
*/
function complete(){
// Process result
// 如果用户提供了自己的complete callback函数,就在这里调用它, 并把数据传给它
if ( s.complete )
s.complete(xhr, status);
// The request was completed
// 触发全局的callback, 触发其他绑定到这个事件上的函数.
if ( s.global )
jQuery.event.trigger( "ajaxComplete", [xhr, s] );
// Handle the global AJAX counter
// 如果全局的活跃请求数目为0, 触发ajaxStop事件,绑定在其上的事件监听函数得到运行.
if ( s.global && ! --jQuery.active )
jQuery.event.trigger( "ajaxStop" );
}
// return XMLHttpRequest to allow aborting the request etc.
// 意译: 返回xhr, 这样做的作用有很多,比如说可以随时取消这个请求等.
return xhr;
},
/**
* jQuery.ajax方法中出现的错误处理函数
* @param {Object} s - ajax设置
* @param {XMLHTTPRequest} xhr
* @param {string} status - ajax请求状态, 如success, timout等
* @param {Object} e - 错误出现时, JavaScript解析器抛出的错误对象
*/
handleError: function( s, xhr, status, e ) {
// If a local callback was specified, fire it
// 如果用户有提供错误发生时可以调用的回调函数, 那就调用它咯
if ( s.error ) s.error( xhr, status, e );
// Fire the global callback
// 如果ajax请求是全局的, 触发ajaxError事件.
if ( s.global )
jQuery.event.trigger( "ajaxError", [xhr, s, e] );
},
// Counter for holding the number of active queries
active: 0,//活跃的请求数, 以此来计数到底有多少个请求等待发送出去.
// Determines if an XMLHttpRequest was successful or not
/**
* 翻译: 判断当前这个请求是否是成功的.
* @param {XMLHTTPRequest} xhr
*/
httpSuccess: function( xhr ) {
try {
// IE error sometimes returns 1223 when it should be 204so treat it as success, see #1450
// IE有一个错误, 那就是有时候应该返回204(NoContent)但是它却返回1223, 好吧, 把这种情况也算作是请求成功
// 详细请看链接:http://dev.jquery.com/ticket/1450,似乎也没有很好地解决这个问题.
return !xhr.status && location.protocol == "file:" ||//如果本地文件的, 没有status也是成功的请求,这种情况返回true;
( xhr.status >= 200 && xhr.status < 300 ) || xhr.status == 304 || xhr.status == 1223 ||//这里列出了可以认为是成功的//safari在文档没有修改时(304)得到的status会等于undefined,所以把这种情况也当作是成功 //请求的状态码.
jQuery.browser.safari && xhr.status == undefined;
} catch(e){}
return false;//代码还能运行到这样里, 证明真的是失败了.
},
// Determines if an XMLHttpRequest returns NotModified
/**
* 判断请求回来的服务器响应是不是"NotModified".
* @param {XMLHTTPRequest} xhr
* @param {string} url
*/
httpNotModified: function( xhr, url ) {
try {
var xhrRes = xhr.getResponseHeader("Last-Modified");
// Firefox always returns 200. check Last-Modified date
// 翻译: Firefox 总是返回200.还是对比一下Last-Modified的日期稳妥一些.
return xhr.status == 304 || xhrRes == jQuery.lastModified[url] ||
jQuery.browser.safari && xhr.status == undefined;//safari在文档没有修改时(304)得到的status会等于undefined
} catch(e){}
return false;//代码还能运行到这样里,证明真的不是"NotModified".
},
/**
*获取XMLHTTPRequest的响应数据.允许对数据使用自定义的函数进行预处理.并根据用户提供的数据类型对响应数据做不同的处理. 最后将数据返回.
* @param {XMLHTTPRequest} xhr
* @param {String} type - 响应的数据类型名称,如json,xml等.不是MIME type
* @param {Function} filter - 预处理函数
*/
httpData: function( xhr, type, filter ) {
var ct = xhr.getResponseHeader("content-type"),
xml = type == "xml" || !type && ct && ct.indexOf("xml")>= 0,
data = xml ? xhr.responseXML : xhr.responseText;//如果响应不是XML就统一把数组当作普通文本.等下再根据用户提供的数据类型,将文
//本转化成为相应的数据类型.
//这个条件比较搞笑: 当出现请求响应错误的时候,有服务器会返回一个XML文档来描述这个错误.那么在这种情况之下我们当然不能认为这个请求成功啦,抛出一个错误
if ( xml && data.documentElement.tagName == "parsererror" )
throw "parsererror";
// Allow a pre-filtering function to sanitize the response
// 翻译: 允许一个预过滤函数对响应数据进行"消毒"...
if( filter )//如果有提供一个过滤函数,那就调用这个过滤函数首先对响应的数据进行预处理
data = filter( data, type );
// If the type is "script", eval it in global context
// 翻译: 如果类型是script, 那么在全局的上下文环境中运行它
if ( type == "script" )
jQuery.globalEval( data );
// Get the JavaScript object, if JSON is used.
// 翻译: 如果请求的是json数据, 用eval获取JavaScript object
if ( type == "json" )
data = eval("(" + data + ")");
return data;//把获得的数据返回
},
// Serialize an array of form elements or a set of
// key/values into a query string
//
//
/**
* 串行化一个装着表单元素的数组 或者 是一个键值对的集合.这里是一个串行化的例子:{'name':'auscar','university':'SYSU'}串行化之后变为一个字
* 符串:"name=auscar&university:SYSU".
* @param {Object} a - 需要串行化的对象
*/
param: function( a ) {
var s = [];//最终结果集
// If an array was passed in, assume that it is an array
// of form elements
// 翻译: 如果一个数组传进来了,那就假设它是一个有表单元素组成的数组.
if ( a.constructor == Array || a.jquery )//数组或者类数组(jQuery对象就是一个类数组)都需要遍历:
// Serialize the form elements 翻译: 串行化标点元素
jQuery.each( a, function(){
//对键名和键值进行编码后就存进了最终结果集,最后返回前会用"&"符号将他们连接起来.
s.push( encodeURIComponent(this.name) + "=" +encodeURIComponent( this.value ) );
});
// Otherwise, assume that it's an object of key/value pairs
// 如果不是数组, 那就假设这是一个由键/值对组成的对象.
else
// Serialize the key/values
// 翻译: 串行化键/值
for ( var j in a )
// If the value is an array then the key names needto be repeated
if ( a[j] && a[j].constructor == Array )//如果键/值里的值是一个数组, 那么就要再遍历这个数组,然后进行同上面数组一样的字符
// 串拼接.
jQuery.each( a[j], function(){
//从下面的代码可以看到类似{favourite:['JavaScript', 'tennis','guitar']}的对象会被转化成:
//"favourite=JavaScript&favourite=tennis&favourite=guitar"
s.push( encodeURIComponent(j) + "=" +encodeURIComponent( this ) );
});
else//从这里可以看到, 键/值中的值还可以是一个Function
s.push( encodeURIComponent(j) + "=" +encodeURIComponent( jQuery.isFunction(a[j]) ? a[j]() : a[j] ) );
// Return the resulting serialization
return s.join("&").replace(/%20/g, "+");//最后返回串行化后的字符串结果.
}
});
//---------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------给jQuery 对象添加基本动画方法-------------------------------
jQuery.fn.extend({
/**
* 以speed所指示的速度显示jQuery对象匹配元素集合中的对应元素.
* 如果函数被以无参的形式调用,那么jQuery对象中的匹配元素集合中隐藏的元素就会被"一下子"显示出来,没有渐变的过程.
* @param {Object} speed - 显示的速度,也就是说显示元素的过程持续多长时间.可以是Number也可以是"slow","normal","default"三者之一.
* @param {Function} callback
*/
show: function(speed,callback){//如果提供了speed参数,则使用animate函数设置本次show动画的时间长度,然后再进行动画
return speed ?
this.animate({
height: "show", width: "show", opacity: "show"
}, speed, callback) :
//如果没有传入speed, 也就是说不带参调用show,那就让所有的带有"hidden"样式的元素都show出来.
this.filter(":hidden").each(function(){
this.style.display = this.oldblock || "";
//经过上面一句的赋值之后,如果this(this指向的是一个HTML元素)的oldblock为none,那就赋予它一个非none的值. 那, 到底是
//什么值呢? 这需要经过一定处理才能确定,下面就是这个确定的过程:
if ( jQuery.css(this,"display") == "none" ) {
//好吧, 既然你是none,那我就看看元素所属的标签默认是使用什么display值的.于是新建一个与元素的标签名一样的临时元素,
//并把它插入到body里面.
var elem = jQuery("<" + this.tagName + " />").appendTo("body");
//然后就看看这种元素的display在默认情况之下是什么属性值,并把这个默认值赋予this.style.display
this.style.display = elem.css("display");
// handle an edge condition where css is - div {display:none; } or similar
// 哎呀, 如果还是none, 不行, 你至少要是block
if (this.style.display == "none")
this.style.display = "block";
elem.remove();//OK,在获取元素的display默认属性值之后, 将这个临时的元素删除.
}
})
.end();//因为filter函数对jQuery对象的匹配元素集合产生了"破坏性"的影响,即改变了jQuery对象的匹配元素集合的内容. 因此需要
//使用jQuery.fn.end函数将匹配元素集合恢复到filter之前的状态.
},
/**
* 顾名思义, 将jQuery对象匹配元素集合中的元素隐藏起来.
* @param {Object} speed - 显示的速度,也就是说显示元素的过程持续多长时间.可以是Number也可以是"slow","normal","default"三者之一.
* @param {Object} callback - 隐藏动作完成之后需要执行的函数.
*/
hide: function(speed,callback){
return speed ?
// 如果传入了speed 参数, 那就按照speed的速度要求,动画呈现隐藏的过程.
this.animate({
height: "hide", width: "hide", opacity: "hide"
}, speed, callback) :
this.filter(":visible").each(function(){
this.oldblock = this.oldblock || jQuery.css(this,"display");// 保存元素当前的blcok属性, 当需要再次显示时将这// 个属性设置回去.
this.style.display = "none";// 让元素隐藏起来,没有任何的渐变效果.
})
.end();//因为filter函数对jQuery对象的匹配元素集合产生了"破坏性"的影响,即改变了jQuery对象的匹配元素集合的内容. 因此需要
//使用jQuery.fn.end函数将匹配元素集合恢复到filter之前的状态.
},
// Save the old toggle function
// 翻译: 保存旧的toggle函数.
// 旧的toggle函数可以接收任意数量的函数作为参数.旧toggle函数的作用就是在传入的函数之间轮流调用它们. 详细情况,请参考jQuery.fn.toggle
// 的中文注释.
_toggle: jQuery.fn.toggle,
/**
* 这个函数只接收两个参数: fn 和 fh2;
*toggle函数的作用就是在fn和fn2之间切换运行(如果fn和fn2都是函数的话).
* 如果fn和fn2是两个对象,那么就把fn当作是animate函数的speed参数,把fn2当作是animate函数的easing参数, 然后调用animate函数进行动画.
* 如果fn和fn2都为undefined, 即toggle函数被以无参的形式调用,则让jQuery对象的匹配元素集合中元素在show和hide两种状态中切换.
* @param {Object} fn
* @param {Object} fn2
*/
toggle: function( fn, fn2 ){
//如果fn和fn2都是函数的话, 那调用旧的toggle方法,在fn和fn2之间切换着调用.
return jQuery.isFunction(fn) && jQuery.isFunction(fn2) ?
this._toggle.apply( this, arguments ) :
// 如果两个都不是函数, 看看fn是否有值.这主要是判断toggle函数是否是在以无参的形式调用
fn ?
this.animate({//有参数的情况,则把fn当作是animate函数的speed参数,把fn2当作是animate函数的easing参数, 然后调用animate函数进行动画
height: "toggle", width: "toggle", opacity:"toggle"
}, fn, fn2) :
this.each(function(){//无参的情况,则让jQuery对象的匹配元素集合中元素在show和hide两种状态中切换.
jQuery(this)[ jQuery(this).is(":hidden") ? "show": "hide" ]();
});
},
/**
* 让匹配元素集合中的元素以一个"滑动着出来"的效果呈现
* @param {Object} speed -三种预定速度的之一的字符串("slow","def","fast").
* @param {Function} callback - 动画完成时所需要调用的函数.
*/
slideDown: function(speed,callback){
return this.animate({height: "show"}, speed, callback);
},
/**
* 让匹配元素集合中的元素以一个"滑动着"的效果消失
* @param {Object} speed -三种预定速度的之一的字符串("slow","def","fast").
* @param {Function} callback - 动画完成时所需要调用的函数.
*/
slideUp: function(speed,callback){
return this.animate({height: "hide"}, speed, callback);
},
/**
* 让匹配元素集合中的元素如果原本是slideUp的现在旧slideDown,原本是slideDown的, 现在是slideUp.
* @param {Object} speed -三种预定速度的之一的字符串("slow","def","fast").
* @param {Function} callback - 动画完成时所需要调用的函数.
*/
slideToggle: function(speed, callback){
return this.animate({height: "toggle"}, speed, callback);
},
/**
* 淡进
* @param {Object} speed -三种预定速度的之一的字符串("slow","def","fast").
* @param {Function} callback - 动画完成时所需要调用的函数.
*/
fadeIn: function(speed, callback){
return this.animate({opacity: "show"}, speed, callback);
},
/**
* 淡出
* @param {Object} speed -三种预定速度的之一的字符串("slow","def","fast").
* @param {Function} callback - 动画完成时所需要调用的函数.
*/
fadeOut: function(speed, callback){
return this.animate({opacity: "hide"}, speed, callback);
},
/**
* 让匹配元素集合中的元素的透明度以动画的形式显示到to所指定的值.
* @param {Object} speed -三种预定速度的之一的字符串("slow","def","fast").
* @param {Object} to - opacity变化到to所指定的值.
* @param {Function} callback - 动画完成时所需要调用的函数.
*/
fadeTo: function(speed,to,callback){
return this.animate({opacity: to}, speed, callback);
},
/**
* 用于创建自定义动画的函数。
*这个函数的关键在于指定动画形式及结果样式属性对象(参数prop)。这个对象中每个属性都表示一个可以变化的样式属性（如"height"、"top"或"opacity"）。
*注意：所有指定的属性必须用骆驼形式，比如用marginLeft代替margin-left.
*
*而每个属性的值表示这个样式属性到多少时动画结束。如果是一个数值，样式属性就会从当前的值渐变到指定的值。如果使用的是"hide"、"show"
* 或"toggle"这样的字符串值，则会为该属性调用默认的动画形式。
* @param {Object} prop - 一个对象,它包含了当动画完成时动画对象所应当呈现的一组样式和这些样式的终值.
* @param {string} speed -三种预定速度的之一的字符串("slow","def","fast").
* @param {Object} easing - 动画擦除效果,目前jQuery只提供"liner"和"swing"两种效果.不过jQuery也支持第三方的动画效果, 不过需要插件支持.
* @param {Function} callback - 动画完成时所需要调用的函数.
*/
animate: function( prop, speed, easing, callback ) {
//将speed, easing,callback三个参数使用speed函数组合到一个对象中,这个对象由jQueury.speed返回. speed的细节请查看jQuery.speed的中文注释
var optall = jQuery.speed(speed, easing, callback);
// 执行 each 或者 queue函数
//这个this 指的是一个jQuery 对象
return this[ optall.queue === false ? "each" : "queue" ](function(){
//这个this 指的是一个普通的DOM元素
if ( this.nodeType != 1)
return false;
var opt = jQuery.extend({}, optall), //复制optall
p,
hidden = jQuery(this).is(":hidden"),
self = this;//这个this 指的是一个普通的DOM元素
// 对animate函数的第一个参数( 它是一个列表)内的几个特殊的属性进行处理
// 这些属性是:hide, show, height, width
for ( p in prop ) {
// 看看 hide属性,嗯,hidden了, 再看看show属性,也show( !hidden) 了,看来已经完成了动画,可以执行complete了
if ( prop[p] == "hide" && hidden || prop[p] == "show"&& !hidden )
return opt.complete.call(this);//这个complete最后会执行传进来的callback,不过在此之前它会进行一些额外操作
// 如果要进行动画的属性是height或者是width
if ( p == "height" || p == "width" ) {
// Store display property
opt.display = jQuery.css(this, "display");
// Make sure that nothing sneaks out
opt.overflow = this.style.overflow;
}
}
if ( opt.overflow != null )
this.style.overflow = "hidden";
//curAnim 装的是 用户设置那些要进行动画的属性
opt.curAnim = jQuery.extend({}, prop);
// 开始对prop 里面设置的每一个属性进行动画了
jQuery.each( prop, function(name, val){
// 新建一个 fx 动画对象, name 是prop 里面 键/值 的" 键 " ( 双引号表示强调... )
// 注意,第一参数self是一个HTML元素的引用
// 第二个参数是属性动画属性的设置集合,里面有类似"complete","duration","easing"之类的属性.还有一个属性的集合curAnim,其内装着用户设置的属性值
//第三个参数就是用户设置的属性集合中的一个属性的名称,表示接下来要为这个属性新建一个fx动画对象
//这里是为每一个要进行动画的属性都新建了一个fx对象
var e = new jQuery.fx( self, opt, name );//为当前name所指定的属性新建一个动画函数.
// 看看可不可以调用基本的动画函数
if ( /toggle|show|hide/.test(val) )
e[ val == "toggle" ? hidden ? "show" : "hide" :val ]( prop );//如果可以就直接调用这些基本的动画函数.
// 看来不需要调用基本动画函数
else {
// 看看属性值是不是类似 " left:+50px " ,在jQuery 1.2 中，你可以通过在属性值前面指定 "+=" 或 "-="来让元素做相对运动
var parts = val.toString().match(/^([+-]=)?([\d+-.]+)(.*)$/),
start = e.cur(true) || 0;//使用jQuery.fx对象的cur获取当前元素的样式. 注意cur的参数为true,这表示直接获取
//元素的内联样式.
// 如果parts不是null,说明要做动画,注意match返回值不是boolean 类型, 而是一个数组.数组里面装的是match到的字符串,下标由
// 正则表达式内的分组号决定
if ( parts ) {
var end = parseFloat(parts[2]),//样式动画的终值
unit = parts[3] || "px";//如果没有提供单位就使用"px"作为默认单位
// We need to compute starting value
// 翻译: 我们需要计算出开始值
if ( unit != "px" ) {
self.style[ name ] = (end || 1) + unit;
start = ((end || 1) / e.cur(true)) *start;
self.style[ name ] = start + unit;
}
// If a +=/-= token was provided, we'redoing a relative animation
// 如果val中含有"+=/-=", 那么就做一次相对动画.
if ( parts[1] )
end = ((parts[1] == "-=" ? -1 : 1) * end)+ start;//计算出最终的样式值.
e.custom( start, end, unit );//调用jQuery.fx对象的custom方法进行一个动画.
}
// 不是 left:+=5px这种类型,而是left:5px这种类型
else
e.custom( start, val, "" );
}
});
// For JS strict compliance
return true;
});
},
/**
* 功能有2:
* (1) 获取匹配元素集合中首元素的动画队列;
* (2) 设置匹配元素集合中每一个元素的动画队列.可能是整个队列的替换, 又可能是仅仅将某个函数加入到队列的尾部.
* @param {string} type - 动画的类型. 一般是"fx".在拥有其他的扩展动画库的情况下, 这个值将会有变.
* @param {Function or Array} fn - 如果是Function,那就把Function加入到每个匹配元素的动画队列的尾部; 如果是Array那就用fn
* 替换每个匹配元素的动画队列.
*/
queue: function(type, fn){
// 如果type是一个Function, 或者type不是function而是一个数组,那就要进行一些参数的" 矫正 "工作
if ( jQuery.isFunction(type) || ( type && type.constructor ==Array )) {
fn = type;// 让第二个参数fn依然是function,这样下面的程序逻辑就不用修改
type = "fx";// 动画的类型为fx.
}
// 如果没有传入type, 或者传入了type( 它是一个string),但没有第二个参数,那么说明queue函数的调用者想获得匹配元素集合中首元素的动画
// 队列. OK, 返回给他/她.
if ( !type || (typeof type == "string" && !fn) )
// 获得首个匹配元素的动画队列. this是一个jQuery对象,它含有好多的匹配元素(这些匹配元素都是通过selector匹配而来 ).那么这个queue函数返回的
// 就是第一个匹配元素this[ 0 ]的动画队列.
return queue( this[0], type );
// 函数如果能运行到这里,说明要设置动画队列的值. 注意 "return this.each(...) "的" this " 是一个 jQuery的引用,而下面的" this" 则是一个具体的
// 匹配元素的引用.
return this.each(function(){
// 如果传了一个数组进来( fn是一个数组),意思是要用这个数组代替元素原来的那个,成为新的动画函数队列
if ( fn.constructor == Array )
queue(this, type, fn);//设置新队列
//如果仅仅是传进一个函数的引用,就把这个引用追加到动画函数队列里面
else {
queue(this, type).push( fn );
// 如果元素原来并没有动画,现在有了( length == 1 ),那马上运行动画
if ( queue(this, type).length == 1 )
fn.call(this);
}
});
},
/**
*
* @param {Object} clearQueue
* @param {Object} gotoEnd
*/
stop: function(clearQueue, gotoEnd){
var timers = jQuery.timers;
// 清空jQeury对象内每一个元素上的动画函数队列.注意,每一个jQuery对象包含若干的元素,而每一元素都含有一个动画函数队列
// 还要值得注意的是,纵使你删除了元素上的动画队列,但是说不定队列上的某些动画函数已经进入的执行队列( jQuery.timers),正在等待执行.
if (clearQueue)
this.queue([]);//把匹配元素集合中的每一个元素的动画队列置空
this.each(function(){
// go in reverse order so anything added to the queueduring the loop is ignored
// 倒着来访问数组,从队列尾部开始删除属于this的动画函数,以防止后来加入队列的this的动画函数被执行-------> 这是一个好主意.
for ( var i = timers.length - 1; i >= 0; i-- )
if ( timers[i].elem == this ) {//在执行队列中发现有属于当前元素的动画, 删除这个动画.
if (gotoEnd)
// force the next step to be the last 翻译:让下一步成为最后步...
//马上执行队列中属于this的最后一个动画函数(因为我们是从队列的尾部开始删除this的动画函数的), 动画马上到停止在
// 执行队列的最后一个属于this的动画函数上.
//而传入true给动画函数,这个true最终会交到step()手上,做为它的输入参数
// step 接收到true,马上将属性设置成为末尾状态.动画函数最终将被移出运行队列:timers.splice(i, 1);
// 请详细参考jQuery.fx.step的中文注释.
timers[i](true);
timers.splice(i, 1);
}
});
// start the next in the queue if the last step wasn't forced
if (!gotoEnd)//如果没有强制要求停止,那就让匹配元素的动画队列出队(数据结构术语,即删除队列头部的那个元素),这样动画就能继续播放.
this.dequeue();
return this;
}
});
//-----------------------------------------------定义两个函数让jQuery对象来管理自己的 动画队列----------------------------
/**
*jQuery内部使用的queue函数,对外公开的queue函数实际上是使用了这个函数来完成任务的.
* 它的作用是取得/设置储存在元素上的动画函数队列, 并将该队列返回.
*
* @param {HTMLElement} elem -传入这个参数是想elem这个元素上的queue列表.
* @param {string} type - 动画函数队列的类型,如" fx ".
* @param {Array} array - 动画函数队列.它是一个数组,如果元素本身并没有动画函数队列的时候,这个数组就会被设置成为元素的动画函数队列
*/
var queue = function( elem, type, array ) {
if ( elem ){
type = type || "fx";
var q = jQuery.data( elem, type + "queue" );//获取jQuery对象的fx动画队列
if ( !q || array )// 如果没有动画队列,或者传入了第三个参数array, 那就用array代替原来的动画队列.
q = jQuery.data( elem, type + "queue", jQuery.makeArray(array) );
}
return q;//返回elem的动画队列.
};
//---------------------------------------------------为jQuery对象添加dequeue功能--------------------------------------
/**
* 从动画函数队列中删除第一个动画效果函数.
* @param {string} type - 动画函数类型
*/
jQuery.fn.dequeue = function(type){
// 默认删除 fx 类的动画队列
type = type || "fx";
return this.each(function(){
var q = queue(this, type);//获取元素的动画函数队列
// 移除动画函数队列中第一个元素
q.shift();
// 如果动画函数队列还有函数在里边,就以this作为该队列第一个元素( 它是一个函数 )的上下文来执行这个函数
// 通俗点说就在shift后把队列里第一个元素q[ 0]放到this里面执行.实际的效果就是删除第一个效果函数之后,继续执行下面的效果函数,不要让它停下来
if ( q.length )
q[0].call( this );
});
};
//-------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------让jQuery对象 具有动画的能力 ---------------------------------
jQuery.extend({
speed: function(speed, easing, fn) {
var opt = speed && speed.constructor == Object ? speed : {
complete: fn || !fn && easing ||jQuery.isFunction( speed) && speed,
duration: speed,
easing: fn && easing || easing && easing.constructor !=Function && easing
/* 对上面的代码进行一点说明:
* opt有三个属性:
* complete : 动画完成时所调用的函数
* duration : 动画持续的时长
* easing : 动画效果
*/
};
//动画的持续事件.如果传入的持续时间参数duration是一个Number,那么就用这个数字来设置动画的时长.
//如果传入的duration不是Number(这个时候就是string),那就到fx的动画时间类型(jQuery.fx.speeds)中查找到底这种duration的值
// 对应的是一个什么数字.如果有就用上这个数字(比如说"slow"对应的数字就是600),没有就用默认的jQUery.fx.def(400)来代替.
opt.duration = (opt.duration && opt.duration.constructor ==Number ?
opt.duration :
jQuery.fx.speeds[opt.duration]) || jQuery.fx.speeds.def;
// Queueing
opt.old = opt.complete;//保存opt.complete到opt.old中
opt.complete = function(){// 重新定义opt.complete,从新定义的函数相对于原来那个函数的一个"外壳"或"包裹". 可以看到重新定义
//的函数内部还是调用了原来的函数(opt.old.call(this)),只不过在调用老的函数之前检查一下是否需要
// dequeue.这种通过"包裹"或者"外壳"来扩展原函数的功能的方法在jQuery中十分常见.
if ( opt.queue !== false )//在调用old的函数之前先看看是否要dequeue.
jQuery(this).dequeue();
if ( jQuery.isFunction( opt.old ) )
opt.old.call( this );
};
return opt;
},
/*
*按照一定的方程产生下一个数字.其实是想模拟特定的函数增长规律,使动画呈现一定的效果( 线性增长[linear]或者余弦摆动[swing] )
* p - 变量每次输入进来的新值
* n - 目前还没有用
* firstNum - 常量
* diff - 系数
*/
easing: {
linear: function( p, n, firstNum, diff ) {
return firstNum + diff * p;
},
swing: function( p, n, firstNum, diff ) {
return ((-Math.cos(p*Math.PI)/2) + 0.5) * diff + firstNum;
}
},
timers: [],
timerId: null,
/*
* 这个就是fx的构造函数了
*
*/
/**
* 这个是fx的构造函数. 每一步的动画其实都是一个fx的对象.
* @param {HTMLElement} elem HTML元素的引用
* @param {Object} options - 动画的参数
* @param {Object} prop -
*/
fx: function( elem, options, prop ){
this.options = options;
this.elem = elem;//注意这里的elem是一个HTML元素的引用
this.prop = prop;
if ( !options.orig )
options.orig = {};
}
});
//---------------------------------------------------- fx动画模块----------------------------------------------------------
// 摘抄自网上的说明: jQuery FX，jQueryUI后的第二个子库，强调动画效果而非UI的外观模块，包括对象的消失、出现；颜色、大小、位置变换。而使用时是
// 扩展原jQuery的API，依旧那么华丽的简单。
//-------------------------------------------------------------------------------------------------------------------------
/**
* jQuery为每个元素的每个要进行的动画的属性都新建一个jQuery.fx对象.
*/
jQuery.fx.prototype = {
// Simple function for setting a style value
/*
* 更新fx的对象状态
*/
update: function(){
//哪里冒出来的options?答:options在fx的构造函数中被定义看上面的代码
if ( this.options.step )
this.options.step.call( this.elem, this.now, this );
//_default:function(fx){
//fx.elem.style[ fx.prop ] = fx.now + fx.unit;
//}
(jQuery.fx.step[this.prop] || jQuery.fx.step._default)( this);// this指的是一个jQuery.fx对象. update函数实际上是// 调用了step中的函数来完成update的功能的. step负责// 将计算出来的下一个属性值更新到HTML元素上. 可以说,// 举个例子: 设this.prop == "opacity", 这样update// 函数在这里就调用了jQuery.fx.step.opacity(this).// opacity函数就会将当前计算到的opacity值更新到fx对象上
// Set display property to block for height/width animations
// 如果要进行 height 或者 width的动画,那么要将它的display样式设置成为 block.
if ( this.prop == "height" || this.prop == "width" )
this.elem.style.display = "block";
},
// Get the current size
/**
*
* @param {boolean} force - 获取元素当前属性时, 是要内联的样式,还是要最终计算样式(最终叠加到元素上,元素所呈现的样式).
* 可用看到, 这个属性值,最终是传给jQuery.css函数的. 可以参考jQuery.css函数的中文注释.
*/
cur: function(force){
// 如果this.prop是一个HTML属性, 将这个属性的值返回
if ( this.elem[this.prop] != null && this.elem.style[this.prop] == null )
return this.elem[ this.prop ];
// 更多的时候, this.prop是一个style属性.使用jQuery.css函数来获取元素的css值.
var r = parseFloat(jQuery.css(this.elem, this.prop, force));
// 如果r有值, 并且r的值在一个可以接受的范围(>-10000),那就直接返回这个值; 若否, 那就调用更底层的curCSS函数来获取
// 所需元素的层叠样式值. css函数内部调用了curCSS,基本上所有的style属性都能从css函数手上传到curCSS函数中处理, 但
// 有一点例外,那就是当this.prop的值为"width"或"height"的时候,css函数自己处理过后就将结果返回, 而并没有经过curCSS
// 的处理. 下面的这行代码是处于对css函数处理结果的"不放心",当css处理结果不符合要求的时候, 调用更底层的curCSS 来尝试处理.
// 如果还不行, 那没有办法了,只能返回0.
return r && r > -10000 ? r : parseFloat(jQuery.curCSS(this.elem, this.prop)) || 0;
},
// Start an animation from one number to another
/**
* 将数组elems内的每一个元素使用callback进行处理,将处理过后的元素放到一个新的数组当中, 最后返回这个数组.
*
* 注意: 这个函数在功能上与jQuery.map重复, 因此在jQuery1.3.2版中已将其删除.
*
* @param {Array} elems - 需要处理的元素组成的数组
* @param {Function} callback - 处理函数
*/
map: function( elems, callback ) {
var ret = [];
// Go through the array, translating each of the items totheir
// new value (or values).
for ( var i = 0, length = elems.length; i < length; i++ ) {
var value = callback( elems[ i ], i );
// value不是 null，说明处理成功，把它加入新的数组里面去
if ( value != null )
ret[ ret.length ] = value;
}
//返回一个新的数组，这个数组中的每个元素都是由原来数组中的元素经callback处理后得来
return ret.concat.apply( [], ret );
},
//jQuery 对象的animate 函数就是调用这个方法来完成最后的动画的
/**
* 执行一个属性值从from到to的动画.
* 它是animate的底层实现.
*
* @param {Object} from - 属性开始值
* @param {Object} to - 属性中止值
* @param {Object} unit - 属性值的单位,如 " px "
*/
custom: function(from, to, unit){
this.startTime = now();
this.start = from;
this.end = to;
this.unit = unit || this.unit || "px";
this.now = this.start;
this.pos = this.state = 0;
//更新属性设置,应用上面的设置
this.update();
var self = this;//this指的是一个jQuery.fx动画对象.
//定义一个内部函数t, 这个t函数将会在执行队列里头排队等待执行.
function t(gotoEnd){//custom函数是使用setInterval不断地运行来达到动画的效果
return self.step(gotoEnd);
}
t.elem = this.elem;//注意,this.elem是一个jQuery对象
// 把动画函数放进动画执行队列里面了
jQuery.timers.push(t);
// 如果整个jQuery还没有建立起计时器, 那就新建一个,并且一个就够了.
if ( jQuery.timerId == null ) {
//获取interval的引用,在队列中没有了要执行的函数的时候,好销毁它.//另外使用setInterval来不断运行动画队列里面的动画函数,一直到队列里面没有了函数才停止
jQuery.timerId = setInterval(function(){
var timers = jQuery.timers;
//遍历动画运行队列里面的每一个动画函数,遍历的时候做以下动作:
// (1) 执行动画
// (2) 将不再需要循环执行的动画函数清出运行队列
// 那,什么是" 不再需要循环执行的动画函数 " 呢? 答:动画函数返回false, 以下" if(!timer[i]())timers.aplice(i--,1) "
// 就不会执行,动画函数执行完之后不会被清理出运行队列
// 那么在下一个interval里面,这个动画函数又被执行
for ( var i = 0; i < timers.length; i++ )
if ( !timers[i]() )//运行动画函数
timers.splice(i--, 1);//将动画函数清出运行队列//如果动画运行队里面没有要运行的动画函数了,清理interval
if ( !timers.length ) {
clearInterval( jQuery.timerId );
jQuery.timerId = null;
}
}, 13);
}
},
// Simple 'show' function
/**
* 简易的元素显示
*/
show: function(){
// Remember where we started, so that we can go back to itlater
// 翻译: 记下我们是从哪个属性值开始的,这样我们待会需要的时候就可以重设回这个值.
this.options.orig[this.prop] = jQuery.attr( this.elem.style,this.prop );
this.options.show = true;
// Begin the animation 翻译: 开始动画
this.custom(0, this.cur());
// Make sure that we start at a small width/height to avoidany
// flash of content
// 翻译: 确保我们从一个很小的width/height值开始动画,这样可以避免内容的闪烁.
if ( this.prop == "width" || this.prop == "height" )
this.elem.style[this.prop] = "1px";
// Start by showing the element
jQuery(this.elem).show();// 调用jQuery对象的show方法.
},
// Simple 'hide' function
/**
* 隐藏的动画
*/
hide: function(){
// Remember where we started, so that we can go back to itlater
// 翻译: 记下我们是从哪个属性值开始的,这样我们待会需要的时候就可以重设回这个值.
this.options.orig[this.prop] = jQuery.attr( this.elem.style,this.prop );
this.options.hide = true;
// Begin the animation 翻译: 开始动画
this.custom(this.cur(), 0);
},
// Each step of an animation
/**
* 一个动画的一步(也即每一个帧)都由这个函数来执行.
*
* @param {Object} gotoEnd
*/
step: function(gotoEnd){
var t = now();
// 如果动画过期了或者强制要求动画停止(gogoEnd == true)
if ( gotoEnd || t > this.options.duration + this.startTime ) {
//让现在的状态马上变成末状态, 动画已经过期
this.now = this.end;//this.end == custom( form, to, unit)中的 to
this.pos = this.state = 1;//在custom函数里面,他们都是0
this.update();//更新状态
//this.options.curAninm内装的是用户要设置的属性的集合
//把这个属性设置为true, 表示动画已经完成
this.options.curAnim[ this.prop ] = true;
var done = true;
for ( var i in this.options.curAnim )
if ( this.options.curAnim[i] !== true )//如果有一个属性的动画没有完成,都不算是全部完成,done = false;
done = false;//能运行到这里,表示curAnim[]数组里面全是true,那意味着用户设置的所有属性的动画都已经完成
if ( done ) {
if ( this.options.display != null ) {
// Reset the overflow
this.elem.style.overflow = this.options.overflow;
// Reset the display
this.elem.style.display = this.options.display;
if ( jQuery.css(this.elem, "display") == "none" )
this.elem.style.display = "block";
}
// Hide the element if the "hide" operation was done
// 如果这个时候hide了( 用户调用了fx对象的hide操作),那就hide 了它
if ( this.options.hide )
this.elem.style.display = "none";
// Reset the properties, if the item has been hiddenor shown
if ( this.options.hide || this.options.show )
for ( var p in this.options.curAnim )
jQuery.attr(this.elem.style, p, this.options.orig[p]);// reset操作, options里面的都是初始值
}
if ( done )
// Execute the complete function
// this指向的是一个jQuery.fx对象,而this.elem则是一个HTML元素.
this.options.complete.call( this.elem );//动画函数完成, 调用需要在这个时候执行的那个callback.
//注意step函数运行的时机,它在custom函数中被包裹在临时函数t内,然后被加入到jQuery.timers里面而得到运行的
//返回false,那么这个step就会在运行结束之后被清理出运行队列,在timers的下一个interval中,它( 这个step )将不会再被运行
return false;
}
//动画没有过期或者没有被强制停止
else {
var n = t - this.startTime;//算算动画开始多久了
this.state = n / this.options.duration;//算算完成了几分之几啊
// Perform the easing function, defaults toswing//参数n,this.options.duration传给easing
// 执行动画扰动函数,在默认情况//[...]没有效果的,因为函数体并没有使用到这些//变量
this.pos = jQuery.easing[this.options.easing || (jQuery.easing.swing ? "swing" : "linear")](this.state, n, 0, 1, this.options.duration);
//计算下一个step所使用属性值.留意一下this.pos这个值,就是这个值使得元素属性的变化呈现线性或者余弦摆动的特性.
this.now = this.start + ((this.end - this.start) * this.pos);
// Perform the next step of the animation
//在上面处理完下一step所有使用的属性之后,当然就是更新了.这样才有动画效果
this.update();
}
// 返回true,说明这个step完成,但是并不退出动画函数队列.
//注意step函数运行的时机,它是在custom函数中被包裹在临时函数函数t内,然后被加入到jQuery.timers里面而得到运行的.
//返回true,那么这个step就会在运行结束继续留在动画函数队列里头,等待下一个interval再次被执行.
return true;
}
};
//-----------------------设置 fx 的动画参数常量speeds 和定义4个基本的动画"步进(下一帧)"函数---------------------------------------------
jQuery.extend( jQuery.fx, {
/**
* 默认的动画速度类型
* 他们的单位是毫秒
*/
speeds:{
slow: 600,
fast: 200,
// Default speed
def: 400
},
/**
* 设置动画"步进"方法.
*设置元素(fx.elem)位置动画、透明度动画、或者其他属性动画的"下一帧"索要显示的值.
* 可以看到step支部是是一个命名空间, 其内的"scrollLeft","scrollTop"等才是真正设置"下一帧"所需属性值的"步进"函数.
* 如果你还是不明白我在讲什么, 没有关系, 代码并不复杂:
* @param {jQuery.fx} fx - 当前的动画对象.jQuery为每一个需要进行动画的属性都创建一个动画对象.
*/
step: {
/**
* 把元素定位到当前动画所需要的位置(水平方向)
* @param {jQuery.fx} fx - 当前的动画对象.jQuery为每一个需要进行动画的属性都创建一个动画对象.
*/
scrollLeft: function(fx){
fx.elem.scrollLeft = fx.now;
},
/**
* 把元素定位到当前动画所需要的位置(垂直方向)
* @param {jQuery.fx} fx - 当前的动画对象.jQuery为每一个需要进行动画的属性都创建一个动画对象.
*/
scrollTop: function(fx){
fx.elem.scrollTop = fx.now;
},
/**
* 把元素的opacity属性的值设置到当前动画所需要的值
* @param {jQuery.fx} fx - 当前的动画对象.jQuery为每一个需要进行动画的属性都创建一个动画对象.
*/
opacity: function(fx){
jQuery.attr(fx.elem.style, "opacity", fx.now);
},
/**
*把元素的属性(这个属性由fx.prop指定)值设置到当前动画所需的值.
* @param {jQuery.fx} fx - 当前的动画对象.jQuery为每一个需要进行动画的属性都创建一个动画对象.
*/
_default: function(fx){
fx.elem.style[ fx.prop ] = fx.now + fx.unit;
}
}
});
// The Offset Method
// Originally By Brandon Aaron, part of the Dimension Plugin
// http://jquery.com/plugins/project/dimensions
/**
* 获取匹配元素集合中首元素的offset.
* 所谓offset是元素在文档中的坐标.
*/
jQuery.fn.offset = function() {
//this[0]表示jQuery选择器匹配的所有元素中的第一个元素//可见这个函数只是对jQuery选择器选中的第一元素器作用
var left = 0, top = 0, elem = this[0], results;
// 如果这个元素存在, 在jQuery.browser 命名空间下做些事情
// with相当于using namespace, 是在某个命名空间下,这样就省得要在调用函数时写一大串的名字空间前缀.
if ( elem ) with ( jQuery.browser ) {
var parent = elem.parentNode,
offsetChild = elem,
offsetParent = elem.offsetParent,
doc = elem.ownerDocument,//取得某个节点的根元素( document对象 )
safari2 = safari && parseInt(version) < 522 && !/adobeair/i.test(userAgent),
css = jQuery.curCSS,
fixed = css(elem, "position") == "fixed"; //元素是否是fixed定位.
// Use getBoundingClientRect if available
// getBoundingClientRect 是IE 的方法
if ( elem.getBoundingClientRect ) {
var box = elem.getBoundingClientRect();//获得与元素绑定的客户区矩形,通过这个矩形就能获取元素相对与document的坐标.
// Add the document scroll offsets
// 可能document也发生了偏移,因此把document的offset也算上, 万无一失.
// 这里的add函数是一个内部定义的函数,它的功能主要将它的两个参数分别累加到left和top上.
add(box.left + Math.max(doc.documentElement.scrollLeft,doc.body.scrollLeft),
box.top + Math.max(doc.documentElement.scrollTop,doc.body.scrollTop));
// IE adds the HTML element's border, by default it ismedium which is 2px
// IE 6 and 7 quirks mode the border width isoverwritable by the following css html { border: 0; }
// IE 7 standards mode, the border is always 2px
// This border/offset is typically represented by theclientLeft and clientTop properties
// However, in IE6 and 7 quirks mode the clientLeft andclientTop properties are not updated when overwriting it via CSS
// Therefore this method will be off by 2px in IE whilein quirksmode
/* 翻译: IE会加上HTML元素的边框,在默认情况之下为medium也就是2px
* IE 6 和 7 的怪癖模式中这个HTML元素上的borderwidth可以用css规则"html{ border:0}"来重写
* 在IE7的标准模式中, 这个边框宽度总是2px
* 这个border/offset在一般情况下还可由clientLeft和clientTop属性表示(因为这个border导致了HTML元素的偏移——译者注)
* 然而,在IE6和7的怪癖模式中修改clientLeft和clientTop属性的值并不能修改这个border
*因此那这种方法(下面这行代码所用的方法——译者注)将会在IE的怪癖模式中失效.
*/
add( -doc.documentElement.clientLeft, -doc.documentElement.clientTop );//剪掉IE给HTML所添加的border
// Otherwise loop through the offsetParents and parentNodes
}
// 不是IE 浏览器的话...那就是其他符合w3c标准的浏览器
else {
// Initial element offsets 翻译:初始化元素的offsets
/* offsetLeft和offsetTop是元素相对于最近定位祖先的偏移量.
*最近定位祖先就是元素的祖先中最近的,并设置了postion为fixed/absolute/relative的元素.
* 如果没有这样的元素, "最近定位祖先"就是document.
*/
add( elem.offsetLeft, elem.offsetTop );
// Get parent offsets
// 获取parent的offset, 防止元素的parent也发生了偏移.
while ( offsetParent ) {
// Add offsetParent offsets翻译:把offsetParent的offset也加进来.
add( offsetParent.offsetLeft, offsetParent.offsetTop);
// Mozilla and Safari > 2 does not include theborder on offset parents
// However Mozilla adds the border for table ortable cells
/* 翻译: Mozilla和Safari2以上的浏览器在计算offsetParent的offsets的时候并没有把border也算进去,
* 不过 Mozilla会给table和table单元格(即td,th)算上border的宽度.
*/
if ( mozilla && !/^t(able|d|h)$/i.test(offsetParent.tagName) || safari && !safari2 )
border( offsetParent );//加上offsetParent 的border
// Add the document scroll offsets if position isfixed on any offsetParent
// 如果元素的offsetParent是position:fixed的,那么加上视窗的滚动量.
if ( !fixed && css(offsetParent, "position") =="fixed")
fixed = true;
/*
*下面的两行代码设置offetChild/offsetParent为新的值,这样在新一轮的循环中我们才能通过他们计算出正确的left和top的值.
*/
// Set offsetChild to previous offsetParent unlessit is the body element
// 翻译: 设置offsetChild为当前offsetParent,除非它(即当前的offestChild)就是body.
offsetChild = /^body$/i.test(offsetParent.tagName) ?offsetChild : offsetParent;
// Get next offsetParent
// 继续往上层看, 如果还有offetParent就继续加他们的offsetLeft和offsetTop和boerderWidth加进来
offsetParent = offsetParent.offsetParent;
}
// Get parent scroll offsets
// 如果浏览器窗口并没有产生滚动的时候,前面的代码已经能完成任务, 但是如果窗口发生了滚动,单单是前面的代码就不够用了.
//所以在获取完parent的offset之后,接下来就要获取parent的scroll了.
//
// scroll是在父元素出现滚动条的情况之下才会发挥作用
// parent存在并且这个parent不是body或者html,那么我们就一直向上遍历元素的祖先,并且在这个过程当中如果发现某个祖先出现了滚动条
// 就减去这个条所产生的滚动量.
while ( parent && parent.tagName && !/^body|html$/i.test(parent.tagName) ) {
/* Remove parent scroll UNLESS that parent is inlineor a table to work around Opera inline/table scrollLeft/Top bug
* COMP:删除 parent 的 scroll 除非parent是inline元素或者table. 这样做的目的是为了处理 Opera行内元素和table的scrollLeft/Top
* 的bug.
*
* 在两种情况之下会出现滚动条:
* (1) 窗口不足以显示整个document
* (2) 元素设置了overflow:auto或者overflow:scroll
*
* 因此,这样遍历一遍所有的parentNode并减去parent出现的scroll是必要的.不然的话,我们直接减去document的scroll就可以了.
*/
if ( !/^inline|table.*$/i.test(css(parent, "display")) )
// Subtract parent scroll offsets
add( -parent.scrollLeft, -parent.scrollTop );
// Mozilla does not add the border for a parent thathas overflow != visible
// COMP:翻译:Mozilla在计算设置了overflow!=visible的parent的offset的时候,并没有把border也算进去.
/* 解释一下:
* 使用scrollLeft/Top来获取一个元素的滚动量的时候,这个offset是相对border的外边缘计算的. 那么当元素具有了非0边框的时候,
*offsetLeft/Top就应该包含边框的宽度.但是Mozilla在计算overflow!=visible的元素的scrollLeft/Top的时候,并没有把这个
*border算进去,即相当于相对于边框的内边缘计算,而忽略了border的宽度,于是jQuery就使用以下的代码把这种情况下缺失的border
* 算进去.
*/
if ( mozilla && css(parent, "overflow") != "visible" )
border( parent );
// Get next parent
parent = parent.parentNode;//获取下一个parent.
}
// Safari <= 2 doubles body offsets with a fixedposition element/offsetParent or absolutely positioned offsetChild
// Mozilla doubles body offsets with a non-absolutelypositioned offsetChild
// COMP:safari 2 以下的浏览器的一个bug:
// 如果所求元素的position=="absolute"或者为"fixed",那么safari会把body的offsets(Left/Top)算多一倍.(要减掉这一倍)
// 另外Mozilla(Firefox)也有一个类似的bug:
// 当所求元素的position != "absolute" 时, body的offsets也会被算多一倍.(要减掉这一倍)
if ( (safari2 && (fixed || css(offsetChild, "position")== "absolute")) ||
(mozilla && css(offsetChild, "position") !="absolute") )
add( -doc.body.offsetLeft, -doc.body.offsetTop );
// Add the document scroll offsets if position is fixed
//翻译:当元素是postion:fixed的时候,就把document的scroll也添加上去
if ( fixed ) //doc = ownerDocument
add(Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft),
Math.max(doc.documentElement.scrollTop, doc.body.scrollTop));
}
// Return an object with top and left properties
// 用一个对象将offset计算结果保存,待会返回.
results = { top: top, left: left };
}
/**
*获取元素的borderLeftWidth和borderTopWidth并把他们分别叠加到left和top中去.
* @param {HTMLElement} elem - HTMLElement
*/
function border(elem) {
add( jQuery.curCSS(elem, "borderLeftWidth", true), jQuery.curCSS(elem, "borderTopWidth", true) );
}
/**
* 将l和t分别加入到left和top中
* @param {Number} l
* @param {Number} t
*/
function add(l, t) {
//10表示十进制
left += parseInt(l, 10) || 0;
top += parseInt(t, 10) || 0;
}
return results;
};//jQuery.fn.offset函数.
jQuery.fn.extend({
/**
*计算元素相对于自己的offsetParent的相对偏移.函数返回一个对象,对象内有left, top两个属性分别存储着元素相对于自己的offsetParent的偏移.
*
* 请注意,position函数使用了子元素的offset与父元素的offset作差的方式来获得一个元素相对于它的父亲元素的偏移.
* 在jQuery.fn.offset函数中我们可以看到,直接使用元素offsetLeft/Top来获取元素相对于最近定位祖先的偏移会存在风险.因为元素可能会处在一个
*产生了滚动条的容器当中.因此我们在这里统一使用jQuery.fn.offset方法来获取容器元素和子元素的offset,然后两个offset作差, 这样获得的offset
* 就是比较准确的偏移.
*
* 同时也注意,自己的offsetParent不一定是在Dom中将自己包含的容器元素.offsetParent应该是最近的已定位(设置了postion:fixed/absolute/relative)
* 祖先.
*/
position: function() {
var left = 0, top = 0, results;
// 注意哦,this指向的是一个jQuery对象.在这里可以看到jQuery.fn.position函数只获取匹配元素集合中首元素的position
if ( this[0] ) {
// Get *real* offsetParent
// 使用offsetParent()获取元素真正的offsetParent.
var offsetParent = this.offsetParent(),
// Get correct offsets
//offset是一个键/值对的集合:{left:someVlaue,top:someValue},jQuery对象的offset方法能够准确地,跨浏览器地获取元素的offset
offset = this.offset(),
//如果offsetParent是body或者是html就让它的偏移(parentOffset)为{top:0,left:0},因为他们都没有offsetParent了.
//如果是一般的元素(即非(body或html))否则就使用offset()来计算咯.
parentOffset = /^body|html$/i.test(offsetParent[0].tagName) ? { top: 0, left: 0 } : offsetParent.offset();
// Subtract element margins
// 接下来就要减去element的margins
// note: when an element has margin: auto the offsetLeftand marginLeft
// are the same in Safari causing offset.left toincorrectly be 0
// 在 Safari中,如果元素被设置成 margin:auto,那么元素的offsetLeft和marginLeft就会变成一样,并且会导致offset.left错误地变为0.
offset.top -= num( this, 'marginTop' );//函数获取this[0]元素的'marginTop'的属性值的数字部分,下同.
offset.left -= num( this, 'marginLeft' );
// Add offsetParent borders
//子元素的定位是相对于最近定位祖先border的内边缘来计算的,而parentOffset所获得的最近定位祖先的偏移并没有包括最近定位祖先的border
// 的宽度.大家可以画一个图就可以明白,如果直接使用两个offset相减得到的结果将会多了定位祖先border的宽度.因此在这里将这个border的宽度
// 将到parentOffset里面去,待会作差的时候(它是减数)就会将这个border的宽度减去.
parentOffset.top += num( offsetParent, 'borderTopWidth');
parentOffset.left += num( offsetParent, 'borderLeftWidth');
// Subtract the two offsets
//使用子元素的offset减去父亲元素的offset来获得子元素相对于父亲元素的偏移.
results = {
//子元素相对于当前视口的偏移
top: offset.top - parentOffset.top,
//父元素相对于当前视口的偏移
// 算出来的这个就是子元素相对于父元素的偏移
// 下同
left: offset.left - parentOffset.left
};
}
return results;//最后把结果返回.
},
/**
* 获取匹配元素集合中首元素的offsetParent,即最近定位元素
*/
offsetParent: function() {
var offsetParent = this[0].offsetParent;
//while循环作用是,只要元素的offsetParent不是body或者html,那么一直向上追溯它的最近定位祖先(即position为absolute/fixed/relative的祖先).
//offsetParent不是body或者html // offsetParent的position== 'static'
while ( offsetParent && (!/^body|html$/i.test(offsetParent.tagName) && jQuery.css(offsetParent, 'position') == 'static') )
offsetParent = offsetParent.offsetParent;
return jQuery(offsetParent);//用jQuery对象将结果返回
}
});
// Create scrollLeft and scrollTop methods
/*
* 下面定义两个函数scrollLeft和scrollTop:
* scrollLeft计算水平方向上的滚动量/或者将页面滚动到指定的位置
* scrollTop计算竖直方向上的滚动量/或者将页面滚动到指定的位置
*
*这些函数仅仅针对匹配元素集合中的首元素,并且这些首元素也是有条件的,即它必须是window或者是document.
*/
jQuery.each( ['Left', 'Top'], function(i, name) {
var method = 'scroll' + name;
jQuery.fn[ method ] = function(val) {
if (!this[0]) return;
return val != undefined ?
// Set the scroll offset
// 如果有给函数传入一个值val,那就scroll 到val这个位置上
this.each(function() {
this == window || this == document ?
// i 表示数组['Left','Top']中元素的下标.可以看到,这个下标不是0就是1
// 当 i 是 0 时,说明正在设置Left的值
// window将会scroll到这个坐标:(val,原来的Top值);
// 当 i 为 1 时,说明正在设置Top的值
// window将会scroll到这个坐标:(原来的Left,val);
window.scrollTo(
!i ? val : jQuery(window).scrollLeft(),
i ? val : jQuery(window).scrollTop()
) ://如果正在设置的元素不是window或者document,那么仅仅是把值设置上去,不用做出实际的行动
this[ method ] = val;
}) :
// Return the scroll offset
//如果没有给函数传入val这个值,那么表明是要获得这些属性的值(val !=undefined返回false)
this[0] == window || this[0] == document?
/* i 的作用跟上面一样, 0 就是scrollLeft; 1就是scrollTop
* self指向当前的window.
*下面三行代码首先尝试w3c标准的方法来获取窗口的滚动量,这一般是针对非IE的现代浏览器
*如果不行则尝试在document.documentElement上获取,这主要针对的是IE6在解析以<DOCTYPE>开头的文档时的情况.
* 如果还是不能获取,则使用document.body[methed]的方式来获取窗口的滚动量,这主要是针对IE4-5以及IE6的怪癖模式.
*/
self[ i ? 'pageYOffset' : 'pageXOffset' ]||//pageX/YOffset是netscape的方法.
jQuery.boxModel && document.documentElement[ method]||//documentElement是一个快捷方式,用在IE6/7的strict模式中// boxModel是一个boolean,表示是否在使用w3c的盒子模型
document.body[ method ]:
this[0][ method ];
};
});
// Create innerHeight, innerWidth, outerHeight and outerWidth methods
/*
* 创建innerHeight, innerWidth, outerHeight 和 outerWidth方法
* inner例解:innerWidth = width(内容宽度) + paddingLeft + paddingRight
* outer例解:outerWidth = innerWidth + borderLeftWidth +borderRightWidth + marginLeftWidth + marginRightWidth
* (innerHeight和outerHeight的算法同上)
* 下面的程序就是按照上述的方法计算的.
*/
jQuery.each([ "Height", "Width" ], function(i, name){
var tl = i ? "Left" : "Top", // top or left
br = i ? "Right" : "Bottom"; // bottom or right
// innerHeight and innerWidth
jQuery.fn["inner" + name] = function(){
//this是一个jQuery对象
//内容的Height/Width
return this[ name.toLowerCase() ]() +
//paddingLeft和paddingRight(padingTop和paddingBottom)
num(this, "padding" + tl) +
num(this, "padding" + br);
};
// outerHeight and outerWidth
// outer就是inner再加上border和margin
jQuery.fn["outer" + name] = function(margin) {//name要么是Height,要么是Width
return this["inner" + name]() +
num(this, "border" + tl + "Width") +//tl为"Left" or "Top"
num(this, "border" + br + "Width") +//br为"right" or"bottom"
(margin ?
num(this, "margin" + tl) + num(this, "margin" + br) :0);
};
});})();
