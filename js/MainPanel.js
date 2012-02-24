/*!
 * Ext JS Library 3.1.0
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */

MainPanel = function(){
    this.preview = new Ext.Panel({
        id: 'preview',
        region: 'south',
        cls:'preview',
        autoScroll: true,
        listeners: FeedViewer.LinkInterceptor,

        tbar: [{
            id:'tab',
            text: 'View in New Tab',
            iconCls: 'new-tab',
            disabled:true,
            scope: this,
            handler : function (){
                this.openTab(this.gsm.getSelected().data);
            }
        },
        '-',
        {
            id:'win',
            text: 'Go to Post',
            iconCls: 'new-win',
            disabled:true,
            scope: this,
            handler : function(){
                window.open(this.gsm.getSelected().data.link);
            }
        },
        '-',
        {
            id:'video',
            text: 'Watch Video',
            iconCls: 'icon-video',
            disabled:true,
            scope: this,
            handler : function(){
                this.playMedia(this.gsm.getSelected().data)
            }
        }],

        clear: function(){
            this.body.update('');
            var items = this.topToolbar.items;
            items.get('tab').disable();
            items.get('win').disable();
            items.get('video').disable();
        }

    });

    this.grid = new FeedGrid(this, {
        // id: 'myGrid',  hardcoded as 'topic-grid''
        tbar:[{
            text:'Open All',
            tooltip: {
                title:'Open All',
                text:'Opens all item in tabs'
            },
            iconCls: 'tabs',
            handler: this.openAll,
            scope:this
        },
        '-',
        {
            split:true,
            text:'Reading Pane',
            tooltip: {
                title:'Reading Pane',
                text:'Show, move or hide the Reading Pane'
            },
            iconCls: 'preview-bottom',
            handler: this.movePreview.createDelegate(this, []),
            menu:{
                id:'reading-menu',
                cls:'reading-menu',
                width:100,
                items: [{
                    text:'Bottom',
                    checked:true,
                    group:'rp-group',
                    checkHandler:this.movePreview,
                    scope:this,
                    iconCls:'preview-bottom'
                },{
                    text:'Right',
                    checked:false,
                    group:'rp-group',
                    checkHandler:this.movePreview,
                    scope:this,
                    iconCls:'preview-right'
                },{
                    text:'Hide',
                    checked:false,
                    group:'rp-group',
                    checkHandler:this.movePreview,
                    scope:this,
                    iconCls:'preview-hide'
                }]
            }
        },
        '-',
        {
            pressed: true,
            enableToggle:true,
            text:'Summary',
            tooltip: {
                title:'Post Summary',
                text:'View a short summary of each item in the list'
            },
            iconCls: 'summary',
            scope:this,
            toggleHandler: function(btn, pressed){
                this.grid.togglePreview(pressed);
            }
        },
        '-',
        {
            split:true,
            text:'XML',
            tooltip: {
                title:'XML Viewer',
                text:'View the XML file for this feed.'
            },
            //iconCls: 'preview-bottom',
            handler: this.xmlPrettyWindow.createDelegate(this, []),
            menu:{
                id:'xml-menu',
                cls:'reading-menu',
                width:100,
                items: [{
                    text:'Raw XML',
                    handler:this.xmlWindow,
                    scope:this
                //iconCls:'preview-bottom'
                },{
                    text:'Pretty XML',
                    handler: this.xmlPrettyWindow,
                    scope:this
                //iconCls:'preview-right'
                }] // end items
            } // end menu
        }] //  end tbar
    });

    MainPanel.superclass.constructor.call(this, {
        id:'main-tabs',
        activeTab:0,
        region:'center',
        margins:'0 5 5 0',
        resizeTabs:true,
        tabWidth:150,
        minTabWidth: 120,
        enableTabScroll: true,
        plugins: new Ext.ux.TabCloseMenu(),
        items: {
            id:'main-view',
            layout:'border',
            title:'Loading...',
            hideMode:'offsets',
            items:[
            this.grid, {
                id:'bottom-preview',
                layout:'fit',
                items:this.preview,
                height: 250,
                split: true,
                border:false,
                region:'south'
            }, {
                id:'right-preview',
                layout:'fit',
                border:false,
                region:'east',
                width:350,
                split: true,
                hidden:true
            }]
        }
    });

    this.gsm = this.grid.getSelectionModel();

    this.gsm.on('rowselect', function(sm, index, record){
        // record.data has all info returned from xmlReader
        var a = record.data;
        FeedViewer.getTemplate().overwrite(this.preview.body, record.data);
        var items = this.preview.topToolbar.items;
        items.get('tab').enable();
        items.get('win').enable();
		
        // enable video button/link if record contains video content
        // see store to grid mappings
        if (this.grid.selModel.selections.items[0].data.contentUrl){
            items.get('video').enable();
        } else {
            items.get('video').disable();
        }
		
    }, this, {
        buffer:250
    });

    this.grid.store.on('beforeload', this.preview.clear, this.preview);
    
    // code to enable automatic reconfig
    //this.grid.store.on('load',this.reconfig, this);

    // code to skip auto reconfig; still allows other method of invocation
    this.grid.store.on('load',function(){
        // store was loaded
        // use xmlns properties to change tree icon for boxee feeds
        var myXmlnsProperty 		= this.grid.store.reader.meta.xmlnsProperty;
        var myXmlnsBoxeeProperty 	= this.grid.store.reader.meta.xmlnsBoxeeProperty;
        var myNodeID                = this.grid.store.baseParams.feed;
        if (myXmlnsBoxeeProperty){
            Ext.getCmp('feed-tree').getNodeById(myNodeID).getUI().getIconEl().className = 'x-tree-node-icon icon-boxee';
        }
        this.grid.getSelectionModel().selectFirstRow();
		
    },this);
         
    this.grid.on('rowdblclick', this.openTab, this);

    this.grid.on('reconfigure', function(){
        this.grid.store.reload();
    },this);
}; //end MainPanel

//  iFrame needed for BrightCove Player Window
Ext.IframeWindow = Ext.extend(Ext.Window, {
    onRender: function() {
        this.bodyCfg = {
            tag: 'iframe',
            src: this.src,
            cls: this.bodyCls,
            style: {
                border: '0px none'
            }
        };
        Ext.IframeWindow.superclass.onRender.apply(this, arguments);
    }
});

Ext.extend(MainPanel, Ext.TabPanel, {

    playMedia: function (record){

        // get media data for current selection
        var d = record;
        var contentUrlProperty          = d.contentUrl;
        var contentTypeProperty         = d.contentType;
        var contentDurationProperty     = d.contentDuration;
        var contentTitleProperty        = d.title;

        if (contentDurationProperty == 'undefined' || contentDurationProperty == null){
            contentDurationProperty = 0;
        }

        var contentWindowTitleProperty  = 'Channelvision Media Player - ' + contentTitleProperty;

        // handle brighcove player
        // <media:content url="http://dir.boxee.tv/apps/brightcove/play/wired/68476903001" type="application/x-shockwave-flash" />
        brightcoveRegex = /^(http:\/\/)\S+(boxee)\S+(brightcove)\S+(play)/;
        if(contentTypeProperty == 'application/x-shockwave-flash' &&
            contentUrlProperty.match(brightcoveRegex)){
            var win = Ext.getCmp('myHtmlWindow');
            if (!win) {
                htmlWin = new Ext.IframeWindow({
                    id              : 'myHtmlWindow',
                    title           : contentWindowTitleProperty,
                    //width           : 700,
                    //height          : 350,
                    maximizable     : true,
                    collapsible     : false,
                    layout          : 'fit',
                    constrainHeader : true,
                    autoScroll      : true,
                    src             : contentUrlProperty
                }) // end new window
                htmlWin.show();
            } // end if
            return;
        }; // end if brightcove
	
        // temporarily restrict to .flv 
        // until mp4 pseudo streaming is worked out
        var a = contentUrlProperty.match(/.flv/) || 
        contentUrlProperty.match(/.swf/) ||
        contentUrlProperty.match(/.mp4/) ||
        contentUrlProperty.match(/.m4v/);
        if (!a){
            Ext.MessageBox.alert('Alert', 'Media Format Not Supported: ' + contentTypeProperty);
        }
        else {

            // Allows only a single window
            // there are problems with multiple instances; fixes needed
            // could prompt to close and open new ??
            var win = Ext.getCmp('myFloPlayerWindow');
            if(!win){

                newMediaWindow = new myFlowPlayer({
                    id                  : 'myFloPlayerWindow',
                    title               : contentWindowTitleProperty,
                    width               : 645,
                    height              : 469,
                    maximizable         : true,
                    collapsible         : false,
                    layout              : 'fit',
                    playerTabTitle      : contentTypeProperty,
                    constrainHeader	: true,
                    myFlashVarsPlaylist : [{
                        duration : contentDurationProperty,
                        url      : contentUrlProperty
                    }]
                // also supports changing the floplayer location...
                //,urlMediaPlayer      : 'http://releases.flowplayer.org/swf/flowplayer-3.1.5.swf'
                //,urlPseudostreaming  : 'flowplayer.pseudostreaming-3.1.3.swf'
                });
            }
            // Display the window - loads and starts the video
            newMediaWindow.show();
        }
    },
	
    xmlWindow : function () {
        var win = Ext.getCmp('myXmlWindow');
        if (!win) {
            xmlWin = new Ext.Window({
                id : 'myXmlWindow',
                title: 'Feed XML',
                width: 920,
                height: 500,
                maximizable         : true,
                collapsible         : true,
                layout              : 'fit',				
                constrainHeader		: true,
                bodyCfg: {
                    tag: 'textarea',
                    readonly: true
                },
                bodyStyle: {
                    backgroundColor: 'white',
                    margin: '0px',
                    border: '0px none'
                },
                listeners: {
                    render: function(w) {
                        var myFeed = Ext.getCmp('topic-grid').store.baseParams.feed;
                        Ext.Ajax.request({
                            url: rssProxyUrl,
                            method: rssProxyMethod,
                            params: {
                                feed: myFeed
                            },
                            success: function(r) {
                                w.body.dom.value = r.responseText;
                            },
                            failure: function(r) {
                                Ext.MessageBox.alert('Alert', 'Could not obtain XML source');
                            }
                        });
                    }
                } // end listeners
            }) // end new window
            xmlWin.show();
        } // end if
    }, // end function
	
    xmlPrettyWindow : function () {
        var win = Ext.getCmp('myXmlPrettyWindow');
        if (!win) {
            xmlWin = new Ext.Window({
                id : 'myXmlPrettyWindow',
                title: 'Feed XML',
                width: 920,
                height: 500,
                maximizable         : true,
                collapsible         : false,
                layout              : 'fit',				
                constrainHeader     : true,
                autoScroll          : true,
                bodyStyle: {
                    backgroundColor: 'white',
                    margin: '0px',
                    border: '0px none'
                },
                listeners: {
                    render: function(w) {
                        var myFeed = Ext.getCmp('topic-grid').store.baseParams.feed;
                        Ext.getCmp('myXmlPrettyWindow').load({
                            url: rssProxyUrl,
                            method: rssProxyMethod,
                            params: {
                                feed: myFeed,
                                highlight: true
                            },
                            failure: function(r) {
                                Ext.MessageBox.alert('Alert', 'Could not generate the "prettified" XML ');
                            }
                        });
                    } // end render function
                } // end listeners
            }) // end new window
            xmlWin.show();
        } // end if
    }, // end function
		
    reconfig : function(){

        // validate scope during testing
        if (!(Ext.getCmp('topic-grid') === this.grid)) {
            alert('Invalid scope on reconfiguration!');
        }
        //debugger;
        var a = this.grid.store.reader.meta.xmlnsProperty;
        var b = this.grid.store.reader.meta.xmlnsBoxeeProperty;
        var c = this.grid.getSelectionModel();
        
        if (!b) {
            this.grid.getSelectionModel().selectFirstRow();
            return;
        }

        // Use all original records
        this.xRecords = this.grid.feedRecords;
        // Add new ones by pushing onto the array
        this.xRecords.push({
            name:'content-type',
            mapping:'media::content@type'
        });

        // define a new store
        this.xStore = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
                method: rssProxyMethod,
                url: rssProxyUrl
            }),
            reader: new Ext.ux.nsXmlReader(
            {
                record: 'item',
                xmlnsProperty: false
            },
            this.xRecords
            )
        });

        // define a new column model
        this.xColumns = new Ext.grid.ColumnModel([{
            id: 'title',
            header: "Title",
            dataIndex: 'title',
            sortable:true,
            width: 300,
            renderer: this.grid.formatTitle
        },{
            header: "Media Type",
            id: 'media-type',
            dataIndex: 'content-type',
            width: 150,
            sortable: true
        },{
            id: 'last',
            header: "Date",
            dataIndex: 'pubDate',
            width: 150,
            renderer:  this.grid.formatDate,
            sortable: true
        }]);

        // added this, but don't know if it works
        this.viewConfig = [{
            forceFit:true,
            enableRowBody:true,
            showPreview:true,
            getRowClass : this.applyRowClass
        }];

        // must execute prior to reconfigure,
        // but record does not match row
        this.grid.getSelectionModel().selectFirstRow();
        this.grid.reconfigure(this.xStore, this.xColumns, this.viewConfig);
    },

    afterReconfig : function(){
        this.grid.store.reload();
    },

    loadFeed : function(feed){
        // WAS this.grid.loadFeed(feed.url);
        // let's pass the feed, not JUST the url
        // so we can locate the node more easily
        // modify grid.loadFeed as needed
        this.grid.loadFeed(feed);
        Ext.getCmp('main-view').setTitle(feed.text);
    },

    movePreview : function(m, pressed){
        if(!m){ // cycle if not a menu item click
            var items = Ext.menu.MenuMgr.get('reading-menu').items.items;
            var b = items[0], r = items[1], h = items[2];
            if(b.checked){
                r.setChecked(true);
            }else if(r.checked){
                h.setChecked(true);
            }else if(h.checked){
                b.setChecked(true);
            }
            return;
        }
        if(pressed){
            var preview = this.preview;
            var right = Ext.getCmp('right-preview');
            var bot = Ext.getCmp('bottom-preview');
            var btn = this.grid.getTopToolbar().items.get(2);
            switch(m.text){
                case 'Bottom':
                    right.hide();
                    bot.add(preview);
                    bot.show();
                    bot.ownerCt.doLayout();
                    btn.setIconClass('preview-bottom');
                    break;
                case 'Right':
                    bot.hide();
                    right.add(preview);
                    right.show();
                    right.ownerCt.doLayout();
                    btn.setIconClass('preview-right');
                    break;
                case 'Hide':
                    preview.ownerCt.hide();
                    preview.ownerCt.ownerCt.doLayout();
                    btn.setIconClass('preview-hide');
                    break;
            }
        }
    },

    openTab : function(record){
        // this check should no longer be necessary
        // all callers changed to be consistent (passing the record)
        record = (record && record.data) ? record : this.gsm.getSelected();
        var d = record.data;
        var id = !d.link ? Ext.id() : d.link.replace(/[^A-Z0-9-_]/gi, '');
        var tab;
        if(!(tab = this.getItem(id))){
            tab = new Ext.Panel({
                id: id,
                cls:'preview single-preview',
                title: d.title,
                tabTip: d.title,
                html: FeedViewer.getTemplate().apply(d),
                closable:true,
                listeners: FeedViewer.LinkInterceptor,
                autoScroll:true,
                border:true,
                tbar: [{
                    text: 'Go to Post',
                    iconCls: 'new-win',
                    handler : function(){
                        window.open(d.link);
                    }
                },
                '-',
                {
                    // id:'video2', cannot reuse id;
                    text: 'Watch Video',
                    iconCls: 'icon-video',
                    disabled:true,
                    scope: this,
                    handler : function (){
                        this.playMedia(d);
                    }
                }]
            });
            // enable video button/link if record contains video content
            // see store to grid mappings
            //debugger;
            if (d.contentUrl){
                tab.getTopToolbar().items.get(2).enable();
            } else {
                tab.getTopToolbar().items.get(2).disable();
            }
            this.add(tab);
        }
        this.setActiveTab(tab);
    },

    openAll : function(){
        this.beginUpdate(); 
        var myRecord = this.grid.store.data.each(this.openTab, this);
        this.endUpdate();
    }
});
Ext.reg('appmainpanel', MainPanel);
