/*!
 * Ext JS Library 3.1.0
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
FeedWindow = function() {
    this.feedUrl = new Ext.form.ComboBox({
        id: 'feed-url',
        fieldLabel: 'Enter the URL of the feed to add',
        emptyText: 'http://example.com/blog/feed',
        width: 450,
        validationEvent: false,
        validateOnBlur: false,
        msgTarget: 'under',
        triggerAction: 'all',
        displayField: 'url',
        mode: 'local',

        listeners:{
            valid: this.syncShadow,
            invalid: this.syncShadow,
            scope: this
        },
        tpl: new Ext.XTemplate(
                '<tpl for="."><div class="x-combo-list-item">',
                '<em>{url}</em><strong>{text}</strong>',
                '<div class="x-clear"></div>',
                '</div></tpl>'),
        store: new Ext.data.ArrayStore({
            fields: ['url', 'text'],
            data : this.defaultFeeds
        })
    });

    this.form = new Ext.FormPanel({
        labelAlign:'top',
        items:this.feedUrl,
        border: false,
        bodyStyle:'background:transparent;padding:10px;'
    });

    FeedWindow.superclass.constructor.call(this, {
        title: 'Add Feed',
        iconCls: 'feed-icon',
        id: 'add-feed-win',
        autoHeight: true,
        width: 500,
        resizable: false,
        plain:true,
        modal: true,
        y: 100,
        autoScroll: true,
        closeAction: 'hide',

        buttons:[{
            text: 'Add Feed!',
            handler: this.onFeedAdd,
            scope: this
        },{
            text: 'Cancel',
            handler: this.hide.createDelegate(this, [])
        }],

        items: this.form
    });

    this.addEvents({add:true});
}

Ext.extend(FeedWindow, Ext.Window, {
    defaultFeeds : [
        ['http://abclocal.go.com/kgo/xml?id=7095531&param1=mrss', 'ABC 7 News'],
        ['http://feeds.yuiblog.com/YahooUserInterfaceBlog',  'Yahoo! UI Blog'],
        ['http://feeds.feedburner.com/jquery/', 'jQuery Blog'],
        ['http://sports.yahoo.com/nba/rss.xml', 'NBA News'],
        ['http://feeds.dzone.com/dzone/frontpage', 'DZone.com'],
		['http://feeds.feedburner.com/ajaxian', 'Ajaxian']
    ],

    show : function(){
        if(this.rendered){
            this.feedUrl.setValue('');
        }
        FeedWindow.superclass.show.apply(this, arguments);
    },

    onFeedAdd: function() {
        this.el.mask('Validating Feed...', 'x-mask-loading');
        var url = this.feedUrl.getValue();
        Ext.Ajax.request({
            url: rssProxyUrl,
            method: rssProxyMethod,
            params: {feed: url},
            success: this.validateFeed,
            failure: this.markInvalid,
            scope: this,
            feedUrl: url
        });
    },

    markInvalid : function(){
        this.feedUrl.markInvalid('The URL specified is not a valid RSS 2 feed.');
        this.el.unmask();
    },

    validateFeed : function(response, options){
        var dq = Ext.DomQuery;
        var url = options.feedUrl;

        try{
			//debugger;  // validate feed by getting the xml file and looking for tagnames!
					   // this could also check for xmlns:
            var xml = response.responseXML;
            var channel = xml.getElementsByTagName('channel')[0];
            if(channel){
                var text = dq.selectValue('title', channel, url);
                var description = dq.selectValue('description', channel, 'No description available.');
                this.el.unmask();
                this.hide();

                return this.fireEvent('validfeed', {
                    url: url,
                    text: text,
                    description: description
                });
            }
        }catch(e){
        }
        this.markInvalid();
    }
});
