/*!
 * Ext JS Library 3.1.0
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */

FeedViewer = {};

Ext.onReady(function(){

    Ext.QuickTips.init();

    if (!localDev) {
        Ext.state.Manager.setProvider(new Ext.state.SessionProvider({
            state: Ext.appState
        }));
    }

    var tpl = Ext.Template.from('preview-tpl', {
        compiled:true,
        getBody : function(v, all){
            //return Ext.util.Format.stripScripts(v);
            // PPB this returns description if "v" is blank
            return Ext.util.Format.stripScripts(v || all.description);
        }
    });
    FeedViewer.getTemplate = function(){
        return tpl;
    }

    var feeds = new FeedPanel();
    var mainPanel = new MainPanel();

    feeds.on('feedselect', function(feed){
        mainPanel.loadFeed(feed);
    });
	
    var topTabPanel = new Ext.TabPanel({
        id : 'topTabPanel',
        preventBodyReset: true,
        //resetBodyCss: true,
        activeTab:0,
        enableTabScroll: true,
        border:false,
        layoutOnTabChange:true,
        bodyStyle:'padding:10px;',
        autoHeight: true,
        items: [{
            title: 'About',
            id: 'about-tab',
            //contentEl: 'north-content',
            autoHeight: true,	// must be true to enable height resize
            autoLoad: 'about_tab.html'
        },{
            title: 'Tools',
            id: 'tools-tab',
            autoHeight: true,	// must be true to enable height resize
            autoLoad: 'tools_tab.html'
        },{
            title: 'Links',
            id: 'links-tab',
            autoHeight: true,	// must be true to enable height resize
            autoLoad: 'links_tab.html'
        },{
            title: 'Development',
            id: 'dev-tab',
            autoHeight: true,	// must be true to enable height resize
            autoLoad: 'dev_tab.html',
            disabled: true
        },{
            title: 'Themes',
            id: 'theme-tab',
			xtype: 'themecombo',
            autoHeight: true,	// must be true to enable height resize
            disabled: false
        }]
    });


    function myGetUrl(){
        //debugger;
        var feedUrl = Ext.getCmp('topic-grid').store.baseParams.feed
        return feedUrl;
    };

    function handleActivate(tab){
        //debugger;
        //var feedUrl1 = Ext.getCmp('feed-tree').getNodeById(myNodeID).attributes.url;
        //var feedUrl2 = Ext.getCmp('feed-tree').selModel.selNode.attributes.url;
        var feedUrl = Ext.getCmp('topic-grid').store.baseParams.feed;
        //var myTabPanel = Ext.getCmp('topTabPanel').getItem('linkstab')
        tab.getUpdater().update(feedUrl);
        // this is not always getting the feed url!
        //var feedUrl = Ext.getCmp('feed-tree').selModel.selNode.attributes.url
        //tab.getUpdater().update(feedUrl);
    };
	
    var topPanel = new Ext.Panel({
        region:'north',
        title:'channelvision.tv',
        id: 'guide',
        layout:'fit',
        forceLayout:true,
        height:300,
        autoScroll: true,
        collapsible: true,
        collapsed : true,
        //collapseMode: 'mini',
        split: true,
        minSize: 200,
        maxSize: 600,
        border:true,
        items: topTabPanel
    });
	
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[
        topPanel,
        feeds,
        mainPanel
        ]
    });

    // add some default feeds

    if (localDev) {
        feeds.addFeed({
            url: rssProxyUrl,
            text: 'Local Test Feed'
        }, false, true);
    }
    else {
        feeds.addFeed({
            url: 'http://www.channelvision.tv/rss/test.xml',
            text: 'Channelvision Test Feed'
        }, false, true);
  
        feeds.addFeed({
            url: 'http://www.channelvision.tv/rss/test2.rss',
            text: 'Old Hot Rod Films'
        }, true);  
  
        feeds.addFeed({
            url:'http://channelvision.tv/paulbaker/feed',
            text: "Paul Baker's Awesome RSS Feed"
        }, true);

        feeds.addFeed({
            url:'http://dir.boxee.tv/apps/brightcove/client/wired',
            text: 'Wired (Brightcove)'
        }, true);
	
        feeds.addFeed({
            url:'http://feeds2.feedburner.com/cnet/cartechvideo',
            text: 'CNN Car Tech Videos'
        }, true);	
	
        feeds.addFeed({
            url:'http://beettv.blip.tv/rss',
            text: 'Beet.tv'
        }, true);

        feeds.addFeed({
            url:'http://feeds.feedburner.com/extblog',
            text: 'ExtJS.com Blog'
        }, true);

        feeds.addFeed({
            url:'http://extjs.com/forum/external.php?type=RSS2',
            text: 'ExtJS.com Forums'
        }, true);
    }

    Ext.get('header').on('click', function() {
        viewport.focus();
    });
    
    feeds.focus();
	
});

// This is a custom event handler passed to preview panels so link opens in a new window
FeedViewer.LinkInterceptor = {
    render: function(p){
        p.body.on({
            'mousedown': function(e, t){ // try to intercept the easy way
                t.target = '_blank';
            },
            'click': function(e, t){ // if they tab + enter a link, need to do it old fashioned way
                if(String(t.target).toLowerCase() != '_blank'){
                    e.stopEvent();
                    window.open(t.href);
                }
            },
            delegate:'a'
        });
    }
};

