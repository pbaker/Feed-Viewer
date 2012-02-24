/*!
 * Ext JS Library 3.1.0
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */

FeedViewer = {};

// try this for desktop app?

//FeedViewer = function () {
//function FeedViewer() {

// was });

// Some sample html for the top panel
var html = [
"<div style='margin-left:10; margin-top:5;'>",
"<h2>:: channelvision.tv</h2>",
"<p>08-Feb-2010 - Our new site is being built using the <a href='http://www.extjs.com' target='_new'>EXT javascript framework</a>.</p><p> When finished, this application will provide an administrative dashboard to a <a href='http://www.boxee.tv' target='_new'>Boxee</a> channel repository hosted by <a href='http://blog.channelvision.tv' target='_new'>channelvision.tv</a></p><p> Please feel free to <a href='mailto:theoriginalpaulbaker@gmail.com'>contact me by email</a> with any questions.</p>",
"</div>"
];

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

