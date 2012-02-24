/*!
 * Ext JS Library 3.1+
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
/*!
 * Ext JS Library 3.1+
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 *
 * Build Date: 22-Feb-2010
 * Base Revision: 3.1.0
 * Contains modifications to support xml namespaces
 * By Paul Baker, theoriginalpaulbaker@gmail.com
 * 
 */

/*

 * This is code is also distributed under MIT license for use

 * with jQuery and prototype JavaScript libraries.

 */

/**

 * @class Ext.DomQuery

Provides high performance selector/xpath processing by compiling queries into reusable functions. New pseudo classes and matchers can be plugged. It works on HTML and XML documents (if a content node is passed in).

<p>

DomQuery supports most of the <a href="http://www.w3.org/TR/2005/WD-css3-selectors-20051215/#selectors">CSS3 selectors spec</a>, along with some custom selectors and basic XPath.</p>



<p>

All selectors, attribute filters and pseudos below can be combined infinitely in any order. For example "div.foo:nth-child(odd)[@foo=bar].bar:first" would be a perfectly valid selector. Node filters are processed in the order in which they appear, which allows you to optimize your queries for your document structure.

</p>

<h4>Element Selectors:</h4>

<ul class="list">

    <li> <b>*</b> any element</li>

    <li> <b>E</b> an element with the tag E</li>

    <li> <b>E F</b> All descendent elements of E that have the tag F</li>

    <li> <b>E > F</b> or <b>E/F</b> all direct children elements of E that have the tag F</li>

    <li> <b>E + F</b> all elements with the tag F that are immediately preceded by an element with the tag E</li>

    <li> <b>E ~ F</b> all elements with the tag F that are preceded by a sibling element with the tag E</li>

</ul>

<h4>Attribute Selectors:</h4>

<p>The use of &#64; and quotes are optional. For example, div[&#64;foo='bar'] is also a valid attribute selector.</p>

<ul class="list">

    <li> <b>E[foo]</b> has an attribute "foo"</li>

    <li> <b>E[foo=bar]</b> has an attribute "foo" that equals "bar"</li>

    <li> <b>E[foo^=bar]</b> has an attribute "foo" that starts with "bar"</li>

    <li> <b>E[foo$=bar]</b> has an attribute "foo" that ends with "bar"</li>

    <li> <b>E[foo*=bar]</b> has an attribute "foo" that contains the substring "bar"</li>

    <li> <b>E[foo%=2]</b> has an attribute "foo" that is evenly divisible by 2</li>

    <li> <b>E[foo!=bar]</b> has an attribute "foo" that does not equal "bar"</li>

</ul>

<h4>Pseudo Classes:</h4>

<ul class="list">

    <li> <b>E:first-child</b> E is the first child of its parent</li>

    <li> <b>E:last-child</b> E is the last child of its parent</li>

    <li> <b>E:nth-child(<i>n</i>)</b> E is the <i>n</i>th child of its parent (1 based as per the spec)</li>

    <li> <b>E:nth-child(odd)</b> E is an odd child of its parent</li>

    <li> <b>E:nth-child(even)</b> E is an even child of its parent</li>

    <li> <b>E:only-child</b> E is the only child of its parent</li>

    <li> <b>E:checked</b> E is an element that is has a checked attribute that is true (e.g. a radio or checkbox) </li>

    <li> <b>E:first</b> the first E in the resultset</li>

    <li> <b>E:last</b> the last E in the resultset</li>

    <li> <b>E:nth(<i>n</i>)</b> the <i>n</i>th E in the resultset (1 based)</li>

    <li> <b>E:odd</b> shortcut for :nth-child(odd)</li>

    <li> <b>E:even</b> shortcut for :nth-child(even)</li>

    <li> <b>E:contains(foo)</b> E's innerHTML contains the substring "foo"</li>

    <li> <b>E:nodeValue(foo)</b> E contains a textNode with a nodeValue that equals "foo"</li>

    <li> <b>E:not(S)</b> an E element that does not match simple selector S</li>

    <li> <b>E:has(S)</b> an E element that has a descendent that matches simple selector S</li>

    <li> <b>E:next(S)</b> an E element whose next sibling matches simple selector S</li>

    <li> <b>E:prev(S)</b> an E element whose previous sibling matches simple selector S</li>

</ul>

<h4>CSS Value Selectors:</h4>

<ul class="list">

    <li> <b>E{display=none}</b> css value "display" that equals "none"</li>

    <li> <b>E{display^=none}</b> css value "display" that starts with "none"</li>

    <li> <b>E{display$=none}</b> css value "display" that ends with "none"</li>

    <li> <b>E{display*=none}</b> css value "display" that contains the substring "none"</li>

    <li> <b>E{display%=2}</b> css value "display" that is evenly divisible by 2</li>

    <li> <b>E{display!=none}</b> css value "display" that does not equal "none"</li>

</ul>

 * @singleton

 */

/**********************************************************
 * MODIFIED DomQuery 
 *  10-Feb-2010 PPB
 **********************************************************/

Ext.DomQuery = function(){
    var cache = {},
    	simpleCache = {},
    	valueCache = {},
    	nonSpace = /\S/,
    	trimRe = /^\s+|\s+$/g,
    	tplRe = /\{(\d+)\}/g,
    	modeRe = /^(\s?[\/>+~]\s?|\s|$)/,

/**********************************************************
 * 10-Feb-2010 PPB
 * Modfify Regex to allow namespaced tags, i.e., <ns:tag>
 * old => tagTokenRe = /^(#)?([\w-\*]+)/,
 * new => tagTokenRe = /^(#)?([\w-\*]*([:][:])?[\w-\*]+)/,
 **********************************************************/

// now using double colon as a substitute for the single colon in <prefix:tag>
// the :: is replaced with : when it becomes 'tagName'

	tagTokenRe = /^(#)?([\w-\*]*([:][:])?[\w-\*]+)/,

/*
Test Data (http://regexlib.com/RETester.aspx)
	a href="abc"
	div id="def"
	node:first-child
	xmlprefix::xmltag
------------------+-----+--------------------+------+-----------
Match             | $1	| $2				 | $3	| $4
------------------+-----+--------------------+------+-----------					
a				  |		|  a		         |		|
------------------+-----+--------------------+------+-----------
div				  |		|  div		         |		|
------------------+-----+--------------------+------+-----------
node			  |		|  node 		     |		|
------------------+-----+--------------------+------+-----------
nsprefix::nstag	  |		|  nsprefix::nstag   | ::	| nstag
------------------+-----+--------------------+------+-----------
*/

    	nthRe = /(\d*)n\+?(\d*)/,
    	nthRe2 = /\D/,

	isIE = window.ActiveXObject ? true : false,
	key = 30803;

/**********************************************************
 * 10-Feb-2010 PPB
 * init global htmlNamespaces array - not used in current state
 * will find <html xmlns:some_name_space="www.some_domain.com">
 * note: document.xmlNamespaces defined by xmlReader
 **********************************************************/
 
	if ('undefined' == typeof(document.htmlNamespaces)) {
      document.htmlNamespaces = new Array();
      myAttributes=document.documentElement.attributes;
      i = 0;
      for (x = 0; x < myAttributes.length; x++) {
         attr = myAttributes[x];
         if (/xmlns:/.test(attr.nodeName)) {
            var matches = attr.nodeName.split(':');
            var namespace = {
            name: matches[1],
            urn: attr.value};
            document.htmlNamespaces[i++] = namespace;
         }
      }
    }	
/* ------------------------------------------------------- */
	eval("var batch = 30803;");

    function child(p, index){
        var i = 0,
        	n = p.firstChild;
        while(n){
            if(n.nodeType == 1){
               if(++i == index){
                   return n;
               }
            }
            n = n.nextSibling;
        }
        return null;
    };

    function next(n){
        while((n = n.nextSibling) && n.nodeType != 1);
        return n;
    };

    function prev(n){
        while((n = n.previousSibling) && n.nodeType != 1);
        return n;
    };

    function children(d){
        var n = d.firstChild, ni = -1,
        	nx;
 	    while(n){
 	        nx = n.nextSibling;
 	        if(n.nodeType == 3 && !nonSpace.test(n.nodeValue)){
 	            d.removeChild(n);
 	        }else{
 	            n.nodeIndex = ++ni;
 	        }
 	        n = nx;
 	    }
 	    return this;
 	};

    function byClassName(c, a, v){
        if(!v){
            return c;
        }
        var r = [], ri = -1, cn;
        for(var i = 0, ci; ci = c[i]; i++){
            if((' '+ci.className+' ').indexOf(v) != -1){
                r[++ri] = ci;
            }
        }
        return r;
    };

    function attrValue(n, attr){
        if(!n.tagName && typeof n.length != "undefined"){
            n = n[0];
        }
        if(!n){
            return null;
        }
        if(attr == "for"){
            return n.htmlFor;
        }
        if(attr == "class" || attr == "className"){
            return n.className;
        }
        return n.getAttribute(attr) || n[attr];

    };

    function getNodes(ns, mode, tagName){
	
/**********************************************************
 * 04-Feb-2010 PPB
 * per sekaijin
 * 
 * Replace double color (::) with singe colon (:) 
 * changes <prefix::tag> (passed from XmlReader) to <prefix:tag>...
 * which is the correct syntax in the XML doc
 * 
 *********************************************************/
        // debugger; 
		tagName = tagName.replace('::',':');

/**********************************************************
 * 04-Feb-2010 PPB
 * per sekaijin
 * 
 * Builds an array of namespaces from /xmlns:/
 * not working
 *********************************************************/
// init global namespaces array if undefined

/*
// debugger;
if (ns.nodeName == 'xml') {
	if ('undefined' == typeof(document.namespaces)) {
      document.namespaces = new Array();
      //attributes = document.documentElement.attributes; // NOT WORKING 
	  var attributes = ns.attributes;
	  	if (attributes != null) {
		  i = 0;
		  // PPB alert('attributes length: ' + attributes.length);
		  for (x = 0; x < attributes.length; x++) {
			 attr = attributes[x];
			 if (/xmlns:/.test(attr.nodeName)) {
				var matches = attr.nodeName.split(/:/);
				var namespace = {
					name: matches[1],
					urn: attr.value
				};
				document.namespaces[i++] = namespace;
			 }
		  }
		}
    }
}
/* ------------------------------------------------------ 

        // compare with namespace array

		// seikens orig regex - why?
        // var am = tagName.match (/(\((.*)\)):(.*)/);  
		// Matches => (anything in parens):followed by a colon
		// $2 anything in parens
		// $3 followed by a colon
		
		var am = tagName.match (/^(\w+)?:(\w+)/); // my regex
        if (am){
            var namespace = Ext.DomQuery.getNS(am[2]); 
            if (namespace) {
                tagName = namespace.name + ':'+ am[3];  
            }
        }
/* -------------------------------------------------------- */

        var result = [], ri = -1, cs;
        if(!ns){
            return result;
        }
        tagName = tagName || "*";
        if(typeof ns.getElementsByTagName != "undefined"){
            ns = [ns];
        }
        if(!mode){
            for(var i = 0, ni; ni = ns[i]; i++){


                cs = ni.getElementsByTagName(tagName);
                for(var j = 0, ci; ci = cs[j]; j++){
                    result[++ri] = ci;
                }
            }
        }else if(mode == "/" || mode == ">"){
            var utag = tagName.toUpperCase();
            for(var i = 0, ni, cn; ni = ns[i]; i++){
                cn = ni.childNodes;
                for(var j = 0, cj; cj = cn[j]; j++){
                    if(cj.nodeName == utag || cj.nodeName == tagName  || tagName == '*'){
                        result[++ri] = cj;
                    }
                }
            }
        }else if(mode == "+"){
            var utag = tagName.toUpperCase();
            for(var i = 0, n; n = ns[i]; i++){
                while((n = n.nextSibling) && n.nodeType != 1);
                if(n && (n.nodeName == utag || n.nodeName == tagName || tagName == '*')){
                    result[++ri] = n;
                }
            }
        }else if(mode == "~"){
            var utag = tagName.toUpperCase();
            for(var i = 0, n; n = ns[i]; i++){
                while((n = n.nextSibling)){
                    if (n.nodeName == utag || n.nodeName == tagName || tagName == '*'){
                        result[++ri] = n;
                    }
                }
            }
        }
        return result;
    };

    function concat(a, b){
        if(b.slice){
            return a.concat(b);
        }
        for(var i = 0, l = b.length; i < l; i++){
            a[a.length] = b[i];
        }
        return a;
    }

    function byTag(cs, tagName){
        if(cs.tagName || cs == document){
            cs = [cs];
        }
        if(!tagName){
            return cs;
        }
        var r = [], ri = -1;
        tagName = tagName.toLowerCase();
        for(var i = 0, ci; ci = cs[i]; i++){
            if(ci.nodeType == 1 && ci.tagName.toLowerCase()==tagName){
                r[++ri] = ci;
            }
        }
        return r;
    };

    function byId(cs, attr, id){
        if(cs.tagName || cs == document){
            cs = [cs];
        }
        if(!id){
            return cs;
        }
        var r = [], ri = -1;
        for(var i = 0,ci; ci = cs[i]; i++){
            if(ci && ci.id == id){
                r[++ri] = ci;
                return r;
            }
        }
        return r;
    };





    function byAttribute(cs, attr, value, op, custom){
        var r = [],
        	ri = -1,
        	st = custom=="{",
        	f = Ext.DomQuery.operators[op];
        	
/********** PPB may not be needed with change below    ***  	
		//debugger; 
        var am = attr.match (/(\((.*)\)):(.*)/);
        if (am){
            var namespace = Ext.DomQuery.getNS(am[2]);
	    if (namespace) {
                attr = namespace.name+':'+ am[3];
            }
        }
*/ 
        	
        for(var i = 0, ci; ci = cs[i]; i++){
            if(ci.nodeType != 1){
                continue;
            }
            var a;
            if(st){
                a = Ext.DomQuery.getStyle(ci, attr);
            }      
            else if(attr == "class" || attr == "className"){
                a = ci.className;
            }else if(attr == "for"){
                a = ci.htmlFor;
            }else if(attr == "href"){
                a = ci.getAttribute("href", 2);
            }else{
				a = ci.getAttribute(attr); // original code line
/**********************************************************
 * 04-Feb-2010 PPB
 * per sekaijin
 * 
 * used for namespaced attributes, i.e., 
 * <prefix:tag prefix:attribute="something">some data</prefix:tag>
 * 
 ********************************************************    				
				// debugger; 
				// matches anything with a colon
				// not very good, it allows trailing spaces
				var sp = attr.match (/(.*):(.*)/);
                if (sp) {
                    a= Ext.get(ci).getAttributeNS(sp[1],sp[2])
                } else {
                    a = ci.getAttribute(attr);  // original code line
                }				
/* ----------------------------------------------------------*/
            }
            if((f && f(a, value)) || (!f && a)){
                r[++ri] = ci;
            }
        }
        return r;
    };

    function byPseudo(cs, name, value){
        return Ext.DomQuery.pseudos[name](cs, value); 
    };

    function nodupIEXml(cs){
        var d = ++key,
        	r;
        cs[0].setAttribute("_nodup", d);
        r = [cs[0]];
        for(var i = 1, len = cs.length; i < len; i++){
            var c = cs[i];
            if(!c.getAttribute("_nodup") != d){
                c.setAttribute("_nodup", d);
                r[r.length] = c;
            }
        }
        for(var i = 0, len = cs.length; i < len; i++){
            cs[i].removeAttribute("_nodup");
        }
        return r;
    }

    function nodup(cs){
        if(!cs){
            return [];
        }
        var len = cs.length, c, i, r = cs, cj, ri = -1;
        if(!len || typeof cs.nodeType != "undefined" || len == 1){
            return cs;
        }
        if(isIE && typeof cs[0].selectSingleNode != "undefined"){
            return nodupIEXml(cs);
        }
        var d = ++key;
        cs[0]._nodup = d;
        for(i = 1; c = cs[i]; i++){
            if(c._nodup != d){
                c._nodup = d;
            }else{
                r = [];
                for(var j = 0; j < i; j++){
                    r[++ri] = cs[j];
                }
                for(j = i+1; cj = cs[j]; j++){
                    if(cj._nodup != d){
                        cj._nodup = d;
                        r[++ri] = cj;
                    }
                }
                return r;
            }
        }
        return r;
    }

    function quickDiffIEXml(c1, c2){
        var d = ++key,
        	r = [];
        for(var i = 0, len = c1.length; i < len; i++){
            c1[i].setAttribute("_qdiff", d);
        }
        for(var i = 0, len = c2.length; i < len; i++){
            if(c2[i].getAttribute("_qdiff") != d){
                r[r.length] = c2[i];
            }
        }
        for(var i = 0, len = c1.length; i < len; i++){
           c1[i].removeAttribute("_qdiff");
        }
        return r;
    }

    function quickDiff(c1, c2){
        var len1 = c1.length,
        	d = ++key,
        	r = [];
        if(!len1){
            return c2;
        }
        if(isIE && typeof c1[0].selectSingleNode != "undefined"){
            return quickDiffIEXml(c1, c2);
        }
        for(var i = 0; i < len1; i++){
            c1[i]._qdiff = d;
        }
        for(var i = 0, len = c2.length; i < len; i++){
            if(c2[i]._qdiff != d){
                r[r.length] = c2[i];
            }
        }
        return r;
    }

    function quickId(ns, mode, root, id){
        if(ns == root){
           var d = root.ownerDocument || root;
           return d.getElementById(id);
        }
        ns = getNodes(ns, mode, "*");
        return byId(ns, null, id);
    }

    return {

/**********************************************************
 * 04-Feb-2010 PPB
 * per sekaijin
 * 
 * Added getNS: function(){};
 * 
 *********************************************************/ 
       getNS: function(urn) { //get namespaces definition
	   // debugger;
          for (x = 0; x < document.xmlNamespaces.length; x++) { // was namespaces
             eval ('ns = document.xmlNamespaces['+ x +'];');
             if ((ns)&&(urn == ns.urn)) {
				 return ns;
			 }
          }
       },
	   
        getStyle : function(el, name){
            return Ext.fly(el).getStyle(name);
        },

        compile : function(path, type){
            type = type || "select";

            var fn = ["var f = function(root){\n var mode; ++batch; var n = root || document;\n"],
            	q = path, mode, lq,
            	tk = Ext.DomQuery.matchers,
            	tklen = tk.length,
            	mm,

            	lmode = q.match(modeRe);

            if(lmode && lmode[1]){
                fn[fn.length] = 'mode="'+lmode[1].replace(trimRe, "")+'";';
                q = q.replace(lmode[1], "");
            }

            while(path.substr(0, 1)=="/"){
                path = path.substr(1);
            }

            while(q && lq != q){
                lq = q;
                var tm = q.match(tagTokenRe);
                
/************************* PPB *******************************/
//// PPB alert('var tm = q.match(tagTokenRe)\n\ntm= ' + tm);
                
                if(type == "select"){
                    if(tm){
                        if(tm[1] == "#"){
                            fn[fn.length] = 'n = quickId(n, mode, root, "'+tm[2]+'");';
                        }else{
                            fn[fn.length] = 'n = getNodes(n, mode, "'+tm[2]+'");';
                        }
                        q = q.replace(tm[0], "");
                    }else if(q.substr(0, 1) != '@'){
                        fn[fn.length] = 'n = getNodes(n, mode, "*");';
                    }
                }else{
                    if(tm){
                        if(tm[1] == "#"){                     
                            fn[fn.length] = 'n = byId(n, null, "'+tm[2]+'");';
                        }else{                    
                            fn[fn.length] = 'n = byTag(n, "'+tm[2]+'");';
                        }
                        q = q.replace(tm[0], "");
                    }
                }
                while(!(mm = q.match(modeRe))){
                    var matched = false;
                    for(var j = 0; j < tklen; j++){
                        var t = tk[j];
                        var m = q.match(t.re);
                        if(m){
                            fn[fn.length] = t.select.replace(tplRe, function(x, i){
                                                    return m[i];
                                                });
                            q = q.replace(m[0], "");
                            matched = true;
                            break;
                        }
                    }

                    if(!matched){
                        throw 'Error parsing selector, parsing failed at "' + q + '"';
                    }
                }
                if(mm[1]){
                    fn[fn.length] = 'mode="'+mm[1].replace(trimRe, "")+'";';
                    q = q.replace(mm[1], "");
                }
            }
            fn[fn.length] = "return nodup(n);\n}";
            eval(fn.join(""));
            return f;
        },


// PPB DomQuery Select
        select : function(path, root, type){
			// debugger;
			myRegex = tagTokenRe;
			
            if(!root || root == document){
                root = document;
            }
            if(typeof root == "string"){
                root = document.getElementById(root);
            }
			
            var paths = path.split(","),
            	results = [];
            for(var i = 0, len = paths.length; i < len; i++){
                var p = paths[i].replace(trimRe, "");
                if(!cache[p]){
                    cache[p] = Ext.DomQuery.compile(p);
                    if(!cache[p]){
                        throw p + " is not a valid selector";
                    }
                }
                var result = cache[p](root);
                if(result && result != document){
                    results = results.concat(result);
                }
            }
            if(paths.length > 1){
                return nodup(results);
            }
            return results;
        },


        selectNode : function(path, root){
			// debugger;
            return Ext.DomQuery.select(path, root)[0];
        },


        selectValue : function(path, root, defaultValue){
            path = path.replace(trimRe, "");
            if(!valueCache[path]){
                valueCache[path] = Ext.DomQuery.compile(path, "select");
            }
            var n = valueCache[path](root), v;
            n = n[0] ? n[0] : n;

            if (typeof n.normalize == 'function') n.normalize();

            v = (n && n.firstChild ? n.firstChild.nodeValue : null);
            return ((v === null||v === undefined||v==='') ? defaultValue : v);
        },


        selectNumber : function(path, root, defaultValue){
            var v = Ext.DomQuery.selectValue(path, root, defaultValue || 0);
            return parseFloat(v);
        },


        is : function(el, ss){
            if(typeof el == "string"){
                el = document.getElementById(el);
            }
            var isArray = Ext.isArray(el),
            	result = Ext.DomQuery.filter(isArray ? el : [el], ss);
            return isArray ? (result.length == el.length) : (result.length > 0);
        },


        filter : function(els, ss, nonMatches){
            ss = ss.replace(trimRe, "");
            if(!simpleCache[ss]){
                simpleCache[ss] = Ext.DomQuery.compile(ss, "simple");
            }
            var result = simpleCache[ss](els);
            return nonMatches ? quickDiff(result, els) : result;
        },

/************************ PPB - NEW MATCHERS SECTION per sekaijin ***********************/
sekaijinmatchers : [{
                re: /^\.([\w-]+)/,
                select: 'n = byClassName(n, null, " {1} ");'
            }, {
                re: /^\:([\w-]+)(?:\(((?:[^\s>\/]*|.*?))\))?/,
                select: 'n = byPseudo(n, "{1}", "{2}");'
            },{
				// matches stuff in braces and brackets
                re: /^(?:([\[\{])(?:@)?((((\([\w-\/\:\.]+\))|([\w-]+)):)?([\w-]+))\s?(?:(=|.=)\s?['"]?(.*?)["']?)?[\]\}])/,
                select: 'n = byAttribute(n, "{2}", "{9}", "{8}", "{1}");'
            }, {
                re: /^#([\w-]+)/,
                select: 'n = byId(n, null, "{1}");'
            },{
                re: /^@([\w-]+)/,
                select: 'return {firstChild:{nodeValue:attrValue(n, "{1}")}};'
            }
        ],

/* ----------------------------------------------------------------------------------- */
        matchers : [{
                re: /^\.([\w-]+)/,
                select: 'n = byClassName(n, null, " {1} ");'
            }, {
                re: /^\:([\w-]+)(?:\(((?:[^\s>\/]*|.*?))\))?/,
                select: 'n = byPseudo(n, "{1}", "{2}");'
            },{
            
/*************************************************************************************
* 04-Feb-2010 PPB Regex modification - NOT USED - NOT USED - NOT USED - NOT USED
* To allow XML namespaced attributes,
* Change from forum, does not seem to be necessary
* old => re: /^(?:([\[\{])(?:@)?([\w-]+)\s?(?:(=|.=)\s?['"]?(.*?)["']?)?[\]\}])/,
* new => re: /^(?:([\[\{])(?:@)?([\w-:]+)\s?(?:(=|.=)\s?['"]?(.*?)["']?)?[\]\}])/,
*************************************************************************************/

                re: /^(?:([\[\{])(?:@)?([\w-]+)\s?(?:(=|.=)\s?['"]?(.*?)["']?)?[\]\}])/,
                select: 'n = byAttribute(n, "{2}", "{4}", "{3}", "{1}");'
            },{
                re: /^#([\w-]+)/,
                select: 'n = byId(n, null, "{1}");'
            },{
            
/*************************************************************************************
* 04-Feb-2010 PPB Regex modification
* To allow XML namespaced attributes, i.e. <tag ns:attr='123'>
* old => re: /^@([\w-]+)/,
* new => re: /^@([\w-]+:?[\w-]+)/,
*************************************************************************************/
                re: /^@([\w-]+:?[\w-]+)/,
                select: 'return {firstChild:{nodeValue:attrValue(n, "{1}")}};'
            }
        ],


        operators : {
            "=" : function(a, v){
                return a == v;
            },
            "!=" : function(a, v){
                return a != v;
            },
            "^=" : function(a, v){
                return a && a.substr(0, v.length) == v;
            },
            "$=" : function(a, v){
                return a && a.substr(a.length-v.length) == v;
            },
            "*=" : function(a, v){
                return a && a.indexOf(v) !== -1;
            },
            "%=" : function(a, v){
                return (a % v) == 0;
            },
            "|=" : function(a, v){
                return a && (a == v || a.substr(0, v.length+1) == v+'-');
            },
            "~=" : function(a, v){
                return a && (' '+a+' ').indexOf(' '+v+' ') != -1;
            }
        },


        pseudos : {
            "first-child" : function(c){
                var r = [], ri = -1, n;
                for(var i = 0, ci; ci = n = c[i]; i++){
                    while((n = n.previousSibling) && n.nodeType != 1);
                    if(!n){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "last-child" : function(c){
                var r = [], ri = -1, n;
                for(var i = 0, ci; ci = n = c[i]; i++){
                    while((n = n.nextSibling) && n.nodeType != 1);
                    if(!n){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "nth-child" : function(c, a) {
                var r = [], ri = -1,
                	m = nthRe.exec(a == "even" && "2n" || a == "odd" && "2n+1" || !nthRe2.test(a) && "n+" + a || a),
                	f = (m[1] || 1) - 0, l = m[2] - 0;
                for(var i = 0, n; n = c[i]; i++){
                    var pn = n.parentNode;
                    if (batch != pn._batch) {
                        var j = 0;
                        for(var cn = pn.firstChild; cn; cn = cn.nextSibling){
                            if(cn.nodeType == 1){
                               cn.nodeIndex = ++j;
                            }
                        }
                        pn._batch = batch;
                    }
                    if (f == 1) {
                        if (l == 0 || n.nodeIndex == l){
                            r[++ri] = n;
                        }
                    } else if ((n.nodeIndex + l) % f == 0){
                        r[++ri] = n;
                    }
                }

                return r;
            },

            "only-child" : function(c){
                var r = [], ri = -1;;
                for(var i = 0, ci; ci = c[i]; i++){
                    if(!prev(ci) && !next(ci)){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "empty" : function(c){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    var cns = ci.childNodes, j = 0, cn, empty = true;
                    while(cn = cns[j]){
                        ++j;
                        if(cn.nodeType == 1 || cn.nodeType == 3){
                            empty = false;
                            break;
                        }
                    }
                    if(empty){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "contains" : function(c, v){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if((ci.textContent||ci.innerText||'').indexOf(v) != -1){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "nodeValue" : function(c, v){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if(ci.firstChild && ci.firstChild.nodeValue == v){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "checked" : function(c){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if(ci.checked == true){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "not" : function(c, ss){
                return Ext.DomQuery.filter(c, ss, true);
            },

            "any" : function(c, selectors){
                var ss = selectors.split('|'),
                	r = [], ri = -1, s;
                for(var i = 0, ci; ci = c[i]; i++){
                    for(var j = 0; s = ss[j]; j++){
                        if(Ext.DomQuery.is(ci, s)){
                            r[++ri] = ci;
                            break;
                        }
                    }
                }
                return r;
            },

            "odd" : function(c){
                return this["nth-child"](c, "odd");
            },

            "even" : function(c){
                return this["nth-child"](c, "even");
            },

            "nth" : function(c, a){
                return c[a-1] || [];
            },

            "first" : function(c){
                return c[0] || [];
            },

            "last" : function(c){
                return c[c.length-1] || [];
            },

            "has" : function(c, ss){
                var s = Ext.DomQuery.select,
                	r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if(s(ss, ci).length > 0){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "next" : function(c, ss){
                var is = Ext.DomQuery.is,
                	r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    var n = next(ci);
                    if(n && is(n, ss)){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "prev" : function(c, ss){
                var is = Ext.DomQuery.is,
                	r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    var n = prev(ci);
                    if(n && is(n, ss)){
                        r[++ri] = ci;
                    }
                }
                return r;
            }
        }
    };
}();

/* PPB */
 	/**
     * Returns the value of a namespaced attribute from the element's underlying DOM node.
     * @param {String} namespace The namespace in which to look for the attribute
     * @param {String} name The attribute name
     * @return {String} The attribute value
     */
	 
	/* 
    Ext.Element.prototype.getAttrNS = Ext.isIE ? function(ns, name){
        var d = this.dom;
        return d[ns+":"+name];
    } : function(ns, name){
        var d = this.dom;
        return d.getAttributeNS(ns, name) || d.getAttribute(ns+":"+name);
    };
	*/
/* ----------------------------------------------------------------------------------------- */

Ext.query = Ext.DomQuery.select;

