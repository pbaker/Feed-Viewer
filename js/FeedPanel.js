/*!
 * Ext JS Library 3.1.0
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
 
var localDev = false;
if (localDev) {
    var rssProxyUrl = '../rss/test.xml';
    var rssProxyMethod = 'get';
}
else {
    rssProxyUrl = '../feed-viewer/php/feed-proxy.php';
    rssProxyMethod = 'post';
}

FeedPanel = function() {
    FeedPanel.superclass.constructor.call(this, {
        id:'feed-tree',
        region:'west',
        title:'Feeds',
        split:true,
        width: 225,
        minSize: 175,
        maxSize: 400,
        collapsible: true,
        margins:'0 0 5 5',
        cmargins:'0 5 5 5',
        rootVisible:false,
        lines:false,
        autoScroll:true,
        root: new Ext.tree.TreeNode('My Feeds'),
        collapseFirst:false,
        tbar: [{
            iconCls:'add-feed',
            text:'Add Feed',
            handler: this.showWindow,
            scope: this
        },{
            id:'delete',
            iconCls:'delete-icon',
            text:'Remove',
            handler: function(){
                var s = this.getSelectionModel().getSelectedNode();
                if(s){
                    this.removeFeed(s.attributes.url);
                }
            },
            scope: this
        }]
    });

    this.feeds = this.root.appendChild(
        new Ext.tree.TreeNode({
            text:'My Feeds',
            cls:'feeds-node',
            expanded:true
        })
        );

    this.getSelectionModel().on({
        'beforeselect' : function(sm, node){
            return node.isLeaf();
        },
        'selectionchange' : function(sm, node){
            if(node){
                this.fireEvent('feedselect', node.attributes);
            }
            this.getTopToolbar().items.get('delete').setDisabled(!node);
        },
        scope:this
    });

    this.addEvents({
        feedselect:true
    });

    this.on('contextmenu', this.onContextMenu, this);
};

Ext.extend(FeedPanel, Ext.tree.TreePanel, {

    onContextMenu : function(node, e){
        if(!this.menu){ // create context menu on first right click
            this.menu = new Ext.menu.Menu({
                id:'feeds-ctx',
                items: [{
                    id:'load',
                    iconCls:'load-icon',
                    text:'Load Feed',
                    scope: this,
                    handler:function(){
                        this.ctxNode.select();
                    }
                },{
                    text:'Remove',
                    iconCls:'delete-icon',
                    scope: this,
                    handler:function(){
                        this.ctxNode.ui.removeClass('x-node-ctx');
                        this.removeFeed(this.ctxNode.attributes.url);
                        this.ctxNode = null;
                    }
                },'-',{
                    iconCls:'add-feed',
                    text:'Add Feed',
                    handler: this.showWindow,
                    scope: this
                }]
            });
            this.menu.on('hide', this.onContextHide, this);
        }
        if(this.ctxNode){
            this.ctxNode.ui.removeClass('x-node-ctx');
            this.ctxNode = null;
        }
        if(node.isLeaf()){
            this.ctxNode = node;
            this.ctxNode.ui.addClass('x-node-ctx');
            this.menu.items.get('load').setDisabled(node.isSelected());
            this.menu.showAt(e.getXY());
        }
    },

    onContextHide : function(){
        if(this.ctxNode){
            this.ctxNode.ui.removeClass('x-node-ctx');
            this.ctxNode = null;
        }
    },

    showWindow : function(btn){
        if(!this.win){
            this.win = new FeedWindow();
            this.win.on('validfeed', this.addFeed, this);
        }
        this.win.show(btn);
    },

    selectFeed: function(url){
        this.getNodeById(url).select();
    },

    removeFeed: function(url){
        var node = this.getNodeById(url);
        if(node){
            node.unselect();
            Ext.fly(node.ui.elNode).ghost('l', {
                callback: node.remove, 
                scope: node,
                duration: .4
            });
        }
    },

    // all feeds are added here
    // attrs has url and text for label
    addFeed : function(attrs, inactive, preventAnim){

        var exists = this.getNodeById(attrs.url);
        if(exists){
            if(!inactive){
                exists.select();
                exists.ui.highlight();
            }
            return;
        }
        // could set boxee icon here IF we validate the feed AND set xmlns
        // see validate code used by FeedWindow
        Ext.apply(attrs, {
            iconCls: 'feed-icon', // could spec icon at load time
            leaf:true,
            cls:'feed',
            id: attrs.url
        });
		
        // create the tree node
        // uses the full url as the node name/id
        var node = new Ext.tree.TreeNode(attrs);
        
        this.feeds.appendChild(node);
        if(!inactive){
            if(!preventAnim){
                Ext.fly(node.ui.elNode).slideIn('l', {
                    callback: node.select, 
                    scope: node,
                    duration: .4
                });
            }else{
                node.select();
            }
        }
        return node;
    },

    // prevent the default context menu when you miss the node
    afterRender : function(){
        FeedPanel.superclass.afterRender.call(this);
        this.el.on('contextmenu', function(e){
            e.preventDefault();
        });
    }
});

Ext.reg('appfeedpanel', FeedPanel); 