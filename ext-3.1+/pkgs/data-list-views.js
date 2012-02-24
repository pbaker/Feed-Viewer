/*
 * Ext JS Library 3.1+
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
/*
 * Ext JS Library 3.1+
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
/*
 * Ext JS Library 3.1.0
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
Ext.DataView=Ext.extend(Ext.BoxComponent,{selectedClass:"x-view-selected",emptyText:"",deferEmptyText:true,trackOver:false,last:false,initComponent:function(){Ext.DataView.superclass.initComponent.call(this);if(Ext.isString(this.tpl)||Ext.isArray(this.tpl)){this.tpl=new Ext.XTemplate(this.tpl)}this.addEvents("beforeclick","click","mouseenter","mouseleave","containerclick","dblclick","contextmenu","containercontextmenu","selectionchange","beforeselect");this.store=Ext.StoreMgr.lookup(this.store);this.all=new Ext.CompositeElementLite();this.selected=new Ext.CompositeElementLite()},afterRender:function(){Ext.DataView.superclass.afterRender.call(this);this.mon(this.getTemplateTarget(),{click:this.onClick,dblclick:this.onDblClick,contextmenu:this.onContextMenu,scope:this});if(this.overClass||this.trackOver){this.mon(this.getTemplateTarget(),{mouseover:this.onMouseOver,mouseout:this.onMouseOut,scope:this})}if(this.store){this.bindStore(this.store,true)}},refresh:function(){this.clearSelections(false,true);var b=this.getTemplateTarget();b.update("");var a=this.store.getRange();if(a.length<1){if(!this.deferEmptyText||this.hasSkippedEmptyText){b.update(this.emptyText)}this.all.clear()}else{this.tpl.overwrite(b,this.collectData(a,0));this.all.fill(Ext.query(this.itemSelector,b.dom));this.updateIndexes(0)}this.hasSkippedEmptyText=true},getTemplateTarget:function(){return this.el},prepareData:function(a){return a},collectData:function(b,e){var d=[];for(var c=0,a=b.length;c<a;c++){d[d.length]=this.prepareData(b[c].data,e+c,b[c])}return d},bufferRender:function(a){var b=document.createElement("div");this.tpl.overwrite(b,this.collectData(a));return Ext.query(this.itemSelector,b)},onUpdate:function(f,a){var b=this.store.indexOf(a);if(b>-1){var e=this.isSelected(b);var c=this.all.elements[b];var d=this.bufferRender([a],b)[0];this.all.replaceElement(b,d,true);if(e){this.selected.replaceElement(c,d);this.all.item(b).addClass(this.selectedClass)}this.updateIndexes(b,b)}},onAdd:function(f,d,e){if(this.all.getCount()===0){this.refresh();return}var c=this.bufferRender(d,e),g,b=this.all.elements;if(e<this.all.getCount()){g=this.all.item(e).insertSibling(c,"before",true);b.splice.apply(b,[e,0].concat(c))}else{g=this.all.last().insertSibling(c,"after",true);b.push.apply(b,c)}this.updateIndexes(e)},onRemove:function(c,a,b){this.deselect(b);this.all.removeElement(b,true);this.updateIndexes(b);if(this.store.getCount()===0){this.refresh()}},refreshNode:function(a){this.onUpdate(this.store,this.store.getAt(a))},updateIndexes:function(d,c){var b=this.all.elements;d=d||0;c=c||((c===0)?0:(b.length-1));for(var a=d;a<=c;a++){b[a].viewIndex=a}},getStore:function(){return this.store},bindStore:function(a,b){if(!b&&this.store){if(a!==this.store&&this.store.autoDestroy){this.store.destroy()}else{this.store.un("beforeload",this.onBeforeLoad,this);this.store.un("datachanged",this.refresh,this);this.store.un("add",this.onAdd,this);this.store.un("remove",this.onRemove,this);this.store.un("update",this.onUpdate,this);this.store.un("clear",this.refresh,this)}if(!a){this.store=null}}if(a){a=Ext.StoreMgr.lookup(a);a.on({scope:this,beforeload:this.onBeforeLoad,datachanged:this.refresh,add:this.onAdd,remove:this.onRemove,update:this.onUpdate,clear:this.refresh})}this.store=a;if(a){this.refresh()}},findItemFromChild:function(a){return Ext.fly(a).findParent(this.itemSelector,this.getTemplateTarget())},onClick:function(c){var b=c.getTarget(this.itemSelector,this.getTemplateTarget());if(b){var a=this.indexOf(b);if(this.onItemClick(b,a,c)!==false){this.fireEvent("click",this,a,b,c)}}else{if(this.fireEvent("containerclick",this,c)!==false){this.onContainerClick(c)}}},onContainerClick:function(a){this.clearSelections()},onContextMenu:function(b){var a=b.getTarget(this.itemSelector,this.getTemplateTarget());if(a){this.fireEvent("contextmenu",this,this.indexOf(a),a,b)}else{this.fireEvent("containercontextmenu",this,b)}},onDblClick:function(b){var a=b.getTarget(this.itemSelector,this.getTemplateTarget());if(a){this.fireEvent("dblclick",this,this.indexOf(a),a,b)}},onMouseOver:function(b){var a=b.getTarget(this.itemSelector,this.getTemplateTarget());if(a&&a!==this.lastItem){this.lastItem=a;Ext.fly(a).addClass(this.overClass);this.fireEvent("mouseenter",this,this.indexOf(a),a,b)}},onMouseOut:function(a){if(this.lastItem){if(!a.within(this.lastItem,true,true)){Ext.fly(this.lastItem).removeClass(this.overClass);this.fireEvent("mouseleave",this,this.indexOf(this.lastItem),this.lastItem,a);delete this.lastItem}}},onItemClick:function(b,a,c){if(this.fireEvent("beforeclick",this,a,b,c)===false){return false}if(this.multiSelect){this.doMultiSelection(b,a,c);c.preventDefault()}else{if(this.singleSelect){this.doSingleSelection(b,a,c);c.preventDefault()}}return true},doSingleSelection:function(b,a,c){if(c.ctrlKey&&this.isSelected(a)){this.deselect(a)}else{this.select(a,false)}},doMultiSelection:function(c,a,d){if(d.shiftKey&&this.last!==false){var b=this.last;this.selectRange(b,a,d.ctrlKey);this.last=b}else{if((d.ctrlKey||this.simpleSelect)&&this.isSelected(a)){this.deselect(a)}else{this.select(a,d.ctrlKey||d.shiftKey||this.simpleSelect)}}},getSelectionCount:function(){return this.selected.getCount()},getSelectedNodes:function(){return this.selected.elements},getSelectedIndexes:function(){var b=[],d=this.selected.elements;for(var c=0,a=d.length;c<a;c++){b.push(d[c].viewIndex)}return b},getSelectedRecords:function(){var d=[],c=this.selected.elements;for(var b=0,a=c.length;b<a;b++){d[d.length]=this.store.getAt(c[b].viewIndex)}return d},getRecords:function(b){var e=[],d=b;for(var c=0,a=d.length;c<a;c++){e[e.length]=this.store.getAt(d[c].viewIndex)}return e},getRecord:function(a){return this.store.getAt(a.viewIndex)},clearSelections:function(a,b){if((this.multiSelect||this.singleSelect)&&this.selected.getCount()>0){if(!b){this.selected.removeClass(this.selectedClass)}this.selected.clear();this.last=false;if(!a){this.fireEvent("selectionchange",this,this.selected.elements)}}},isSelected:function(a){return this.selected.contains(this.getNode(a))},deselect:function(a){if(this.isSelected(a)){a=this.getNode(a);this.selected.removeElement(a);if(this.last==a.viewIndex){this.last=false}Ext.fly(a).removeClass(this.selectedClass);this.fireEvent("selectionchange",this,this.selected.elements)}},select:function(d,f,b){if(Ext.isArray(d)){if(!f){this.clearSelections(true)}for(var c=0,a=d.length;c<a;c++){this.select(d[c],true,true)}if(!b){this.fireEvent("selectionchange",this,this.selected.elements)}}else{var e=this.getNode(d);if(!f){this.clearSelections(true)}if(e&&!this.isSelected(e)){if(this.fireEvent("beforeselect",this,e,this.selected.elements)!==false){Ext.fly(e).addClass(this.selectedClass);this.selected.add(e);this.last=e.viewIndex;if(!b){this.fireEvent("selectionchange",this,this.selected.elements)}}}}},selectRange:function(c,a,b){if(!b){this.clearSelections(true)}this.select(this.getNodes(c,a),true)},getNode:function(a){if(Ext.isString(a)){return document.getElementById(a)}else{if(Ext.isNumber(a)){return this.all.elements[a]}}return a},getNodes:function(e,a){var d=this.all.elements;e=e||0;a=!Ext.isDefined(a)?Math.max(d.length-1,0):a;var b=[],c;if(e<=a){for(c=e;c<=a&&d[c];c++){b.push(d[c])}}else{for(c=e;c>=a&&d[c];c--){b.push(d[c])}}return b},indexOf:function(a){a=this.getNode(a);if(Ext.isNumber(a.viewIndex)){return a.viewIndex}return this.all.indexOf(a)},onBeforeLoad:function(){if(this.loadingText){this.clearSelections(false,true);this.getTemplateTarget().update('<div class="loading-indicator">'+this.loadingText+"</div>");this.all.clear()}},onDestroy:function(){this.all.clear();this.selected.clear();Ext.DataView.superclass.onDestroy.call(this);this.bindStore(null)}});Ext.DataView.prototype.setStore=Ext.DataView.prototype.bindStore;Ext.reg("dataview",Ext.DataView);
/*
 * Ext JS Library 3.1+
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
/*
 * Ext JS Library 3.1.0
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
Ext.list.ListView=Ext.extend(Ext.DataView,{itemSelector:"dl",selectedClass:"x-list-selected",overClass:"x-list-over",scrollOffset:undefined,columnResize:true,columnSort:true,maxWidth:Ext.isIE?99:100,initComponent:function(){if(this.columnResize){this.colResizer=new Ext.list.ColumnResizer(this.colResizer);this.colResizer.init(this)}if(this.columnSort){this.colSorter=new Ext.list.Sorter(this.columnSort);this.colSorter.init(this)}if(!this.internalTpl){this.internalTpl=new Ext.XTemplate('<div class="x-list-header"><div class="x-list-header-inner">','<tpl for="columns">','<div style="width:{[values.width*100]}%;text-align:{align};"><em unselectable="on" id="',this.id,'-xlhd-{#}">',"{header}","</em></div>","</tpl>",'<div class="x-clear"></div>',"</div></div>",'<div class="x-list-body"><div class="x-list-body-inner">',"</div></div>")}if(!this.tpl){this.tpl=new Ext.XTemplate('<tpl for="rows">',"<dl>",'<tpl for="parent.columns">','<dt style="width:{[values.width*100]}%;text-align:{align};">','<em unselectable="on"<tpl if="cls"> class="{cls}</tpl>">',"{[values.tpl.apply(parent)]}","</em></dt>","</tpl>",'<div class="x-clear"></div>',"</dl>","</tpl>")}var k=this.columns,g=0,h=0,l=k.length,b=[];for(var f=0;f<l;f++){var m=k[f];if(!m.isColumn){m.xtype=m.xtype?(/^lv/.test(m.xtype)?m.xtype:"lv"+m.xtype):"lvcolumn";m=Ext.create(m)}if(m.width){g+=m.width*100;h++}b.push(m)}k=this.columns=b;if(h<l){var d=l-h;if(g<this.maxWidth){var a=((this.maxWidth-g)/d)/100;for(var e=0;e<l;e++){var m=k[e];if(!m.width){m.width=a}}}}Ext.list.ListView.superclass.initComponent.call(this)},onRender:function(){this.autoEl={cls:"x-list-wrap"};Ext.list.ListView.superclass.onRender.apply(this,arguments);this.internalTpl.overwrite(this.el,{columns:this.columns});this.innerBody=Ext.get(this.el.dom.childNodes[1].firstChild);this.innerHd=Ext.get(this.el.dom.firstChild.firstChild);if(this.hideHeaders){this.el.dom.firstChild.style.display="none"}},getTemplateTarget:function(){return this.innerBody},collectData:function(){var a=Ext.list.ListView.superclass.collectData.apply(this,arguments);return{columns:this.columns,rows:a}},verifyInternalSize:function(){if(this.lastSize){this.onResize(this.lastSize.width,this.lastSize.height)}},onResize:function(b,d){var e=this.innerBody.dom;var f=this.innerHd.dom;if(!e){return}var c=e.parentNode;if(Ext.isNumber(b)){var a=b-Ext.num(this.scrollOffset,Ext.getScrollBarWidth());if(this.reserveScrollOffset||((c.offsetWidth-c.clientWidth)>10)){e.style.width=a+"px";f.style.width=a+"px"}else{e.style.width=b+"px";f.style.width=b+"px";setTimeout(function(){if((c.offsetWidth-c.clientWidth)>10){e.style.width=a+"px";f.style.width=a+"px"}},10)}}if(Ext.isNumber(d)){c.style.height=(d-f.parentNode.offsetHeight)+"px"}},updateIndexes:function(){Ext.list.ListView.superclass.updateIndexes.apply(this,arguments);this.verifyInternalSize()},findHeaderIndex:function(e){e=e.dom||e;var a=e.parentNode,d=a.parentNode.childNodes;for(var b=0,f;f=d[b];b++){if(f==a){return b}}return -1},setHdWidths:function(){var c=this.innerHd.dom.getElementsByTagName("div");for(var b=0,d=this.columns,a=d.length;b<a;b++){c[b].style.width=(d[b].width*100)+"%"}}});Ext.reg("listview",Ext.list.ListView);Ext.ListView=Ext.list.ListView;
/*
 * Ext JS Library 3.1+
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
/*
 * Ext JS Library 3.1.0
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
Ext.list.Column=Ext.extend(Object,{isColumn:true,align:"left",header:"",width:null,cls:"",constructor:function(a){if(!a.tpl){a.tpl=new Ext.XTemplate("{"+a.dataIndex+"}")}else{if(Ext.isString(a.tpl)){a.tpl=new Ext.XTemplate(a.tpl)}}Ext.apply(this,a)}});Ext.reg("lvcolumn",Ext.list.Column);Ext.list.NumberColumn=Ext.extend(Ext.list.Column,{format:"0,000.00",constructor:function(a){a.tpl=a.tpl||new Ext.XTemplate("{"+a.dataIndex+':number("'+(a.format||this.format)+'")}');Ext.list.NumberColumn.superclass.constructor.call(this,a)}});Ext.reg("lvnumbercolumn",Ext.list.NumberColumn);Ext.list.DateColumn=Ext.extend(Ext.list.Column,{format:"m/d/Y",constructor:function(a){a.tpl=a.tpl||new Ext.XTemplate("{"+a.dataIndex+':date("'+(a.format||this.format)+'")}');Ext.list.DateColumn.superclass.constructor.call(this,a)}});Ext.reg("lvdatecolumn",Ext.list.DateColumn);Ext.list.BooleanColumn=Ext.extend(Ext.list.Column,{trueText:"true",falseText:"false",undefinedText:"&#160;",constructor:function(e){e.tpl=e.tpl||new Ext.XTemplate("{"+e.dataIndex+":this.format}");var b=this.trueText,d=this.falseText,a=this.undefinedText;e.tpl.format=function(c){if(c===undefined){return a}if(!c||c==="false"){return d}return b};Ext.list.DateColumn.superclass.constructor.call(this,e)}});Ext.reg("lvbooleancolumn",Ext.list.BooleanColumn);
/*
 * Ext JS Library 3.1+
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
/*
 * Ext JS Library 3.1.0
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
Ext.list.ColumnResizer=Ext.extend(Ext.util.Observable,{minPct:0.05,constructor:function(a){Ext.apply(this,a);Ext.list.ColumnResizer.superclass.constructor.call(this)},init:function(a){this.view=a;a.on("render",this.initEvents,this)},initEvents:function(a){a.mon(a.innerHd,"mousemove",this.handleHdMove,this);this.tracker=new Ext.dd.DragTracker({onBeforeStart:this.onBeforeStart.createDelegate(this),onStart:this.onStart.createDelegate(this),onDrag:this.onDrag.createDelegate(this),onEnd:this.onEnd.createDelegate(this),tolerance:3,autoStart:300});this.tracker.initEl(a.innerHd);a.on("beforedestroy",this.tracker.destroy,this.tracker)},handleHdMove:function(i,f){var b=5,a=i.getPageX(),h=i.getTarget("em",3,true);if(h){var g=h.getRegion(),d=h.dom.style,c=h.dom.parentNode;if(a-g.left<=b&&c!=c.parentNode.firstChild){this.activeHd=Ext.get(c.previousSibling.firstChild);d.cursor=Ext.isWebKit?"e-resize":"col-resize"}else{if(g.right-a<=b&&c!=c.parentNode.lastChild.previousSibling){this.activeHd=h;d.cursor=Ext.isWebKit?"w-resize":"col-resize"}else{delete this.activeHd;d.cursor=""}}}},onBeforeStart:function(a){this.dragHd=this.activeHd;return !!this.dragHd},onStart:function(c){this.view.disableHeaders=true;this.proxy=this.view.el.createChild({cls:"x-list-resizer"});this.proxy.setHeight(this.view.el.getHeight());var a=this.tracker.getXY()[0],b=this.view.innerHd.getWidth();this.hdX=this.dragHd.getX();this.hdIndex=this.view.findHeaderIndex(this.dragHd);this.proxy.setX(this.hdX);this.proxy.setWidth(a-this.hdX);this.minWidth=b*this.minPct;this.maxWidth=b-(this.minWidth*(this.view.columns.length-1-this.hdIndex))},onDrag:function(b){var a=this.tracker.getXY()[0];this.proxy.setWidth((a-this.hdX).constrain(this.minWidth,this.maxWidth))},onEnd:function(k){var h=this.proxy.getWidth();this.proxy.remove();var g=this.hdIndex,n=this.view,f=n.columns,j=f.length,p=this.view.innerHd.getWidth(),d=this.minPct*100,q=Math.ceil((h*n.maxWidth)/p),o=(f[g].width*100)-q,m=Math.floor(o/(j-1-g)),l=o-(m*(j-1-g));for(var c=g+1;c<j;c++){var b=(f[c].width*100)+m,a=Math.max(d,b);if(b!=a){l+=b-a}f[c].width=a/100}f[g].width=q/100;f[g+1].width+=(l/100);delete this.dragHd;n.setHdWidths();n.refresh();setTimeout(function(){n.disableHeaders=false},100)}});Ext.ListView.ColumnResizer=Ext.list.ColumnResizer;
/*
 * Ext JS Library 3.1+
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
/*
 * Ext JS Library 3.1.0
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
Ext.list.Sorter=Ext.extend(Ext.util.Observable,{sortClasses:["sort-asc","sort-desc"],constructor:function(a){Ext.apply(this,a);Ext.list.Sorter.superclass.constructor.call(this)},init:function(a){this.view=a;a.on("render",this.initEvents,this)},initEvents:function(a){a.mon(a.innerHd,"click",this.onHdClick,this);a.innerHd.setStyle("cursor","pointer");a.mon(a.store,"datachanged",this.updateSortState,this);this.updateSortState.defer(10,this,[a.store])},updateSortState:function(c){var f=c.getSortState();if(!f){return}this.sortState=f;var e=this.view.columns,g=-1;for(var d=0,a=e.length;d<a;d++){if(e[d].dataIndex==f.field){g=d;break}}if(g!=-1){var b=f.direction;this.updateSortIcon(g,b)}},updateSortIcon:function(b,a){var d=this.sortClasses;var c=this.view.innerHd.select("em").removeClass(d);c.item(b).addClass(d[a=="DESC"?1:0])},onHdClick:function(c){var b=c.getTarget("em",3);if(b&&!this.view.disableHeaders){var a=this.view.findHeaderIndex(b);this.view.store.sort(this.view.columns[a].dataIndex)}}});Ext.ListView.Sorter=Ext.list.Sorter;