// JavaScript Document
//

MyDesktop.FeedViewerWindow = Ext.extend(Ext.app.Module, {
    id: 'feedviewer-win',

    init: function () {
        this.launcher = {
            text: 'Feed Viewer',
            iconCls: 'icon-grid',
            handler: this.createWindow,
            scope: this
        };
    },

    createWindow: function () {

        var desktop = this.app.getDesktop();
        var win = desktop.getWindow('myFeedViewerWindow');
        if(!win){

            Ext.QuickTips.init();

            /*
    Ext.state.Manager.setProvider(new Ext.state.SessionProvider({
        state: Ext.appState
        }));
         */

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

            var feeds       = new FeedPanel();
            var mainPanel   = new MainPanel();

/**
//var viewport = new Ext.Viewport({
            var viewport = new Ext.Panel({
				id: 'myFeedViewerPanel',
                layout:'border',
                items:[feeds, mainPanel]
            });
*/
       
            /* createWindow uses renderTo, so it is immediately rendered */

            win = desktop.createWindow({
                id: 'myFeedViewerWindow',
                animCollapse: false,
                constrainHeader: true,
                title: 'Feed Viewer',
                width: 740,
                height: 480,
                iconCls: 'icon-grid',
                shim: false,
                border: false,
                layout: 'border',
                items: [feeds, mainPanel ]
            });

            win.show(); // render the window

            // show window before adding feeds!
            // or errors!!!
            feeds.on('feedselect', function(feed){
                mainPanel.loadFeed(feed);
            });

            // add some default feeds
            feeds.addFeed({
            url: 'http://www.channelvision.tv/rss/test.xml',
            text: 'Boxee Test Feed'
        }, false, true);
  
        feeds.addFeed({
            url: 'http://www.channelvision.tv/rss/test2.rss',
            text: 'Old Hot Rod Films'
        }, false, true);  
  
	feeds.addFeed({
        url:'http://blog.channelvision.tv/?feed=rss2',
        text: 'Channelvision.tv Blog'
    }, true);	
	
	feeds.addFeed({
        url:'http://feeds.feedburner.com/extblog',
        text: 'ExtJS.com Blog'
    }, true);

    feeds.addFeed({
        url:'http://extjs.com/forum/external.php?type=RSS2',
        text: 'ExtJS.com Forums'
    }, true);

    feeds.addFeed({
        url:'http://feeds.feedburner.com/ajaxian',
        text: 'Ajaxian'
    }, true);
	
    feeds.addFeed({
        url:'http://beettv.blip.tv/rss',
        text: 'Beet.tv'
    }, true);

            feeds.focus();
        
        } 
        else {
            win.show();
        }
    }
});