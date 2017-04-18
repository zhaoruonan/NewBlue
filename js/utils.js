//utils这个库：主要提供一些公有的工具方法；
var utils=(function(){
    /**
     * 将类数组转化为数组
     * @param arg：传的类数组(arguments/元素集合)
     * @returns {Array}：返回转化后的数组
     */
    function listToArray(arg){
        var ary=[];
        try{
            ary=[].slice.call(arg);
        }catch (e){
            for(var i=0; i<arg.length; i++){
                ary.push(arg[i]);
            }
        }
        return ary;
    }
    /**
     * 将JSON格式的字符串转化为JSON格式的对象
     * @param str：传参，JSON格式的字符串
     * @returns {Object}：返回值，JSON格式的数据对象
     */
    function jsonParse(str){
        return "JSON" in window ? JSON.parse(str) : eval("("+str+")");
    }
    /**
     * 在一定的范围内，通过className来获取元素
     * @param curEle：元素
     * @param strClass：字符串的class名
     * @returns {*}：返回符合传的这个class名的元素
     */
    function getByClass(curEle,strClass){
        curEle=curEle||document;
        if("getComputedStyle" in window){
            return this.listToArray(curEle.getElementsByClassName(strClass));
        }
        var nodeList=curEle.getElementsByTagName("*");
        var aryClass=strClass.replace(/(^ +)|( +$)/g,"").split(/\s+/g);
        var ary=[];
        for(var i=0; i<nodeList.length; i++){
            var curNode=nodeList[i];
            var bOk=true;
            for(var k=0; k<aryClass.length; k++){
                var curClass=aryClass[k];
                var reg=new RegExp("\\b"+curClass+"\\b");
                if(!reg.test(curNode.className)){
                    bOk=false;
                    break;
                }
            }
            if(bOk){
                ary.push(curNode);
            }
        }
        return ary;
    }
    /**
     * 验证这个元素上是否有某个class名
     * @param curEle：元素
     * @param strClass：字符串的class名
     * @returns {boolean}：返回一个布尔值（这个class名存在这个元素上就返回true,不存在就返回false）
     */
    function hasClass(curEle,strClass){
        strClass=strClass.replace(/(^ +)|( +$)/g,"");
        var reg=new RegExp("\\b"+strClass+"\\b");
        return reg.test(curEle.className);
    }
    /**
     * 如果元素身上没有这个class名，我们才会添加，没有返回值
     * @param curEle：元素
     * @param strClass：字符串class名
     */
    function addClass(curEle,strClass){
        var aryClass=strClass.replace(/(^ +)|( +$)/g,"").split(/\s+/g);
        for(var i=0; i<aryClass.length; i++){
            var curClass=aryClass[i];
            if(!this.hasClass(curEle,curClass)){
                curEle.className+=" "+curClass;
            }
        }
    }
    /**
     *删除某个元素下的class名
     * @param curEle：元素
     * @param strclass：传进来的class名
     */
    function removeClass(curEle,strclass){
        var aryClass=strclass.replace(/(^ +)|( +$)/g,"").split(/\s+/g);
        for(var i=0; i<aryClass.length; i++){
            var curClass=aryClass[i];
            var reg=new RegExp("\\b"+curClass+"\\b");
            if(reg.test(curEle.className)){
                curEle.className=curEle.className.replace(reg," ").replace(/\s+/g," ").replace(/(^ +)|( +$)/g,"");
            }
        }
    }
    /**
     *getCss获取经过浏览器计算过的样式（包括行间样式和非行间样式）
     * @param curEle：要获取的元素
     * @param attr：元素的样式名
     * @returns {*}：返回值，该元素的样式名的值
     */
    function getCss(curEle,attr){
        var val,reg;
        if("getComputedStyle" in window){
            val=getComputedStyle(curEle,null)[attr];
        }else {
            if(attr==="opacity"){
                val=curEle.currentStyle["filter"];
                reg=/^alpha\(opacity[=:](\d+(\.\d+)?)\)$/g;
                return reg.test(val) ? RegExp.$1/100 : 1;
            }
            val=curEle.currentStyle[attr];
        }
        reg=/^([+-])?\d+(\.\d+)?(px|pt|rem|em)$/g;
        return reg.test(val) ? parseFloat(val) : val;
    }
    /**
     * 给一个元素设置样式（float,透明度,单位）
     * @param curEle：元素
     * @param attr：传的形参的样式名
     * @param value：传的形参的样式值
     */
    function setCss(curEle,attr,value){
        if(attr==="float"){
            curEle.style.styleFloat=value;
            curEle.style.cssFloat=value;
            return;
        }
        if(attr==="opacity"){
            curEle.style.opacity=value;
            curEle.style.filter="alpha(opacity="+value*100+")";
            return;
        }
        var reg=/(width|height|top|right|bottom|left|((margin|padding)(top|right|bottom|left)?))/;
        if(reg.test(attr)){
            value=parseFloat(value)+"px";
        }
        curEle.style[attr]=value;
    }
    /**
     *给一个元素添加多个样式名
     * @param curEle：元素
     * @param options：以对象的方法传参，可以传多个样式名跟值
     */
    function setGroupCss(curEle,options){
        for(var attr in options){
            this.setCss(curEle,attr,options[attr]);
        }
    }
    /**
     * 给一个元素添加、设置、获取样式（）
     * @param curEle：元素
     * @returns {*}：返回值，如果是获取，就返回要获取的那个元素身上的样式名所对应的样式值
     */
    function css(curEle){
        var arg2=arguments[1];
        if(typeof arg2==="string"){
            var arg3=arguments[2];
            if(typeof arg3==="undefined"){
                return this.getCss(curEle,arg2);
            }else {
                this.setCss(curEle,arg2,arg3);
            }
        }
        if(arg2.toString()==="[object Object]"){
            this.setGroupCss(curEle,arg2);
        }
    }
    /**
     * 判断浏览器兼容性问题用win有两个功能：获取和设置
     * @param attr：获取，
     * @param value：设置
     * @returns {*}
     */
    function win(attr,value){
        if(typeof value==="undefined"){
            return document.documentElement[attr] || document.body[attr];
        }
        document.documentElement[attr]=document.body[attr]=value;
    }
    /**
     * 当前元素到body的距离：{left:l,top:t};
     * @param curEle：当前元素
     * @returns {{left: (Number|number), top: (Number|number)}}
     */
    function offset(curEle){
        var l=curEle.offsetLeft;
        var t=curEle.offsetTop;
        var par=curEle.offsetParent;
        while (par){
            if(navigator.userAgent.indexOf("MSIE 8.0")===-1){
                l+=par.clientLeft;
                t+=par.clientTop;
            }
            l+=par.offsetLeft;
            t+=par.offsetTop;
            par=par.offsetParent;
        }
        return {left:l,top:t}
    }
    /**
     * 获取当前元素下的所有子元素
     * @param curEle：传参，获取某个元素下的
     * @returns {Array}：返回一个数组(获取到的所有子元素标签)
     */
    function getChildren(curEle,tag){
        //if("getComputedStyle" in window){
        //    return this.listToArray(curEle.children);
        //}
        //var ary=[];
        //var nodeList=curEle.childNodes;
        //for(var i=0; i<nodeList.length; i++){
        //    ary.push(nodeList[i]);
        //}
        //return ary;
        var ary;
        var nodeList=curEle.childNodes;
        for (var i=0; i<nodeList.length; i++){
            var curNode=nodeList[i];
            if (curNode.nodeType===1){
                if (typeof tag !== "undefined"){
                    if (curNode.tagName.toLocaleLowerCase()===tag){
                        ary.push(curNode);
                        break;
                    }
                }else {
                    ary.push(curNode);
                }
            }
        }
        return ary;
    }
    /**
     * 获取当前元素的上一个哥哥元素节点
     * @param curEle：传参，某个元素下的
     * @returns {*}：返回上一个哥哥元素节点标签
     */
    function prev(curEle){
        if("previousElementSibling" in curEle){
            return curEle.previousElementSibling;
        }
        var pre=curEle.previousSibling;
        while (pre && pre.nodeType !==1){
            pre=pre.previousSibling;
        }
        return pre;
    }
    /**
     * 获取当前元素所有的哥哥元素节点
     * @param curEle：元素
     * @returns {Array}：以数组的形式返回
     */
    function prevAll(curEle){
        var pre=this.prev(curEle);
        var ary=[];
        while (pre){
            ary.unshift(pre);
            pre=this.prev(pre);
        }
        return ary;
    }
    /**
     * 获取当前元素的下一个弟弟元素节点
     * @param curEle：元素
     * @returns {*}：返回传的元素的下一个弟弟元素
     */
    function next(curEle){
            if("nextElementSibling" in window){
            return curEle.nextElementSibling;
        }
        var nex=curEle.nextSibling;
        while (nex && nex.nodeType !==1){
            nex=nex.nextSibling;
        }
        return nex;
    }
    /**
     * 获取当前元素下所有的弟弟元素节点
     * @param curEle：元素
     * @returns {Array}：以数组的形式返回传的参数的下面所有弟弟元素
     */
    function nextAll(curEle){
        var nex=this.next(curEle);
        var ary=[];
        while (nex){
            ary.push(nex);
            nex=this.next(nex);
        }
        return ary;
    }
    /**
     * 获取当前元素的相邻元素：上一个哥哥元素节点+下一个弟弟元素节点
     * @param curEle
     * @returns {Array}
     */
    function sibling(curEle){
        var pre=this.prev(curEle);
        var nex=this.next(curEle);
        var ary=[];
        if (pre) ary.push(pre);
        if (nex) ary.push(nex);
        return ary;
    }
    /**
     * 获取当前元素的所有兄弟元素：所有的哥哥元素节点+所有的弟弟元素节点
     * @param curEle
     * @returns {Array.<T>}
     */
    function siblings(curEle){
        return this.prevAll(curEle).concat(this.nextAll(curEle));
    }
    /**
     * 获取当前元素的第一个子元素
     * @param curEle
     * @returns {*}
     */
    function firstChild(curEle){
        return this.getChildren(curEle)[0];
    }
    /**
     * 获取当前元素的最后一个子元素
     * @param curEle
     * @returns {*}
     */
    function lastChild(curEle){
        var aChs=this.getChildren(curEle);
        return aChs[aChs.length-1];
    }
    /**
     * 获取当前元素的索引
     * @param curEle
     * @returns {Number}
     */
    function index(curEle){
        return this.prevAll(curEle).length;
    }
    /**
     * 把新元素插入到当前元素的最末尾
     * @param parent
     * @param newEle
     */
    function appendChild(parent,newEle){
        parent.appendChild(newEle);
    }
    /**
     * 把新元素插入到当前元素的最开始
     * @param parent
     * @param newEle
     */
    function prependChild(parent,newEle){
        var first=this.firstChild(parent);
        if(first){
            parent.insertBefore(newEle,first);
        }else {
            parent.appendChild(newEle);
        }
    }
    /**
     * 把新元素插入到当前元素的前面
     * @param newEle
     * @param oldEle
     */
    function insertBefore(newEle,oldEle){
        oldEle.parentNode.insertBefore(newEle,oldEle);
    }
    /**
     * 把新元素插入到指定元素的弟弟元素的前面
     * @param newEle
     * @param oldEle
     */
    function insertAfter(newEle,oldEle){
        var nex=this.next(oldEle);
        if (nex){
            oldEle.parentNode.insertBefore(newEle,nex)
        }else {
            oldEle.parentNode.appendChild(newEle);
        }
    }
    /**
     * 获取随机数
     * @param n：从n到m之间的随机数字
     * @param m
     * @returns {number}：返回计算后的随机数
     */
    function rnd(n,m){
        n=Number(n);
        m=Number(m);
        if(isNaN(n) || isNaN(m)){
            return Math.random();
        }
        if(n>m){
            var tmp=n;
            n=m;
            m=tmp;
        }
        return Math.round(Math.random()*(m-n)+n);
    }
    return{
        listToArray:listToArray,
        jsonParse:jsonParse,
        getByClass:getByClass,
        hasClass:hasClass,
        addClass:addClass,
        removeClass:removeClass,
        getCss:getCss,
        setCss:setCss,
        setGroupCss:setGroupCss,
        css:css,
        win:win,
        offset:offset,
        getChildren:getChildren,
        prev:prev,
        prevAll:prevAll,
        next:next,
        nextAll:nextAll,
        sibling:sibling,
        siblings:siblings,
        firstChild:firstChild,
        lastChild:lastChild,
        index:index,
        prependChild:prependChild,
        insertBefore:insertBefore,
        insertAfter:insertAfter,
        rnd:rnd
    }
})();

