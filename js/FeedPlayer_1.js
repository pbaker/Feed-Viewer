/*
 ************************************************************************************
 * Author: Doug Hendricks. doug@theactivegroup.com
 * Copyright 2007-2009, Active Group, Inc.  All rights reserved.
 ************************************************************************************

  License: This demonstration is licensed under the terms of
  GNU Open Source GPL 3.0 license:

  Commercial use is prohibited without contacting licensing@theactivegroup.com.

   This program is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.
   see < http://www.gnu.org/licenses/gpl.html>

   Donations are welcomed : http://donate.theactivegroup.com
   Commercial Licensing : http://licensing.theactivegroup.com

   Direct API Documentation:
      http://uxdocs.theactivegroup.com/index.html?class=Ext.ux.Media.Flash.Component

   FlowPlayer Links:

     Download: http://flowplayer.org/download/index.html

     API Documentation: http://flowplayer.org/documentation/configuration/index.html

 */




embed type="application/x-shockwave-flash" 
width="640" 	
height="504" 	
allowfullscreen="true" 	
allowscriptaccess="always" 	
src="http://www.archive.org/flow/flowplayer.commercial-3.0.5.swf" 	
w3c="true" 	
flashvars='config={"key":"#$b6eb72a0f2f1e29f3d4",

"playlist":[
    {
        "url":"http://www.archive.org/download/CoolHotRodB/format=Thumbnail?.jpg",
        "autoPlay":true,
        "scaling":"fit"
    },
    {
        "url":"http://www.archive.org/download/CoolHotRodB/CoolHotRodB_512kb.mp4",
        "autoPlay":false,
        "accelerated":true,
        "scaling":"fit",
        "provider":"h264streaming"
    }
],
"clip":
    {
    "autoPlay":false,
    "accelerated":true,
    "scaling":"fit",
    "provider":"h264streaming"
},
"canvas":
    {
    "backgroundColor":"0x000000",
    "backgroundGradient":"none"
},
"plugins":
    {
    "audio":
        {
        "url":"http://www.archive.org/flow/flowplayer.audio-3.0.3-dev.swf"
    },
    "controls":
        {
        "playlist":false,
        "fullscreen":true,
        "gloss":"high",
        "backgroundColor":"0x000000",
        "backgroundGradient":"medium",
        "sliderColor":"0x777777",
        "progressColor":"0x777777",
        "timeColor":"0xeeeeee",
        "durationColor":"0x01DAFF",
        "buttonColor":"0x333333",
        "buttonOverColor":"0x505050"
    },
    "h264streaming":
        {
        "url":"http://www.archive.org/flow/flowplayer.h264streaming-3.0.5.swf"}
},
"contextMenu":
    [
    {
        "View+CoolHotRodB+at+archive.org":"function()"
    },
    "-",
    "Flowplayer 3.0.5"
]
}'> 
embed


(function(){

var F = Ext.util.Format;

var vizPlugin = Ext.ux.plugin && Ext.ux.plugin.VisibilityMode // && !Ext.isIE
    ? new Ext.ux.plugin.VisibilityMode({
    hideMode:'nosize'
})
: {
    init: Ext.emptyFn
};

myFlowPlayer = Ext.extend( Ext.Window, {

    title           : 'Media Player',
    width           : 645,
    height          : 469,
    maximizable     : true,
    collapsible     : true,
    layout          : 'fit',
    plugins         : [vizPlugin],
    playerTabTitle  : 'Sample Video',
    myFlashVarsPlaylist : {
                        duration : 0,
                        url      : 'http://e1p1.simplecdn.net/flowplayer/flowplayer-700.flv'
                      },

    initComponent: function(){

        this.myFlashVarsPlaylist = {
            duration : 0,
            url      : 'http://e1p1.simplecdn.net/flowplayer/flowplayer-700.flv'
        };

        this.myFlashVarsPlugins = {
            pseudo : {
                url : 'flowplayer.pseudostreaming-3.1.3.swf'
            },
            controls : {
                backgroundColor : '#000000',
                backgroundGradient :'low',
                playlist : true,
                tooltips: {
                    buttons: true,
                    fullscreen: 'Enter Fullscreen mode'
                }
            }
        };

        this.myFlashVarsClip = {  //playlist defualts
            provider : 'pseudo',
            duration : 30
        };

        this.myParams = {
            wmode             :'opaque',
            allowfullscreen   : true,
            cachebusting      : true,
            flashVars: ('config='+Ext.encode({
                plugins     :  this.myFlashVarsPlugins,
                clip        :  this.myFlashVarsClip,
                playlist    : [this.myFlashVarsPlaylist]
            })).replace(/\"/g,"\'")//Convert to single-quote for inclusion in <PARAM> markup
        };

        this.myMediaCfg = {
            url        		: 'http://releases.flowplayer.org/swf/flowplayer-3.1.5.swf',
            //url        	: 'http://www.channelvision.tv/media/flowplayer-3.1.5.swf',
            autoSize  		:  true,
            volume     		:  25,
            start      		:  false,
            loop       		:  false,
            scripting  		: 'always',
            encodeParams 	:  false,
            params: this.myParams
        };

        this.myPlayer = {
            xtype       : 'flashpanel',
            id          : 'flowplaything',
            title       :  this.playerTabTitle ||'Flowplayer',
            autoMask    :  false,
            autoScroll  :  false,
            mediaCfg    :  this.myMediaCfg
        };

        this.myTabPanel = {
            xtype       : 'tabpanel',
            id          :  this.getId() + '-center',
            activeTab   :  0,
            ref         : 'demoTabs',
            plugins     : [vizPlugin],
            //require : '@uxflash',  /* $JIT Load the ux.Media.Flash classes and their dependencies. */
            defaults : {
                closable: true,
                plugins : [vizPlugin] //Give ALL tabs the visibilityMode plugin
            },
            items : this.myPlayer
        };

        this.items = [this.myTabPanel];

        /*
            debugger
            var mMediaCfg   = this.myMediaCfg;
            var mParams     = this.myParams;
            var mPlayList   = this.myPlayList;
            var mArguments  = arguments;
         */
            
        myFlowPlayer.superclass.initComponent.apply(this,arguments);
    }
});
})();
