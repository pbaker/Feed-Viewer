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



(function(){

    var F = Ext.util.Format;

    var vizPlugin = Ext.ux.plugin && Ext.ux.plugin.VisibilityMode // && !Ext.isIE
    ? new Ext.ux.plugin.VisibilityMode({
        hideMode:'nosize'
    })
    : {
        init: Ext.emptyFn
    };

    debugger;
    // sections extracted from initComponent...
    this.myPlayList = [
    // playlist entry as a string means the url
    {
        //url  :'http://blip.tv/file/get/KimAronson-TwentySeconds59483.flv'
        url  :'http://mmgi.tv/data/18MMGigraphicsv7.flv'
    },
    {
        duration : 25,
        url      : 'http://e1p1.simplecdn.net/flowplayer/flowplayer-700.flv'
    //url  :'http://mmgi.tv/data/07SB_A&H_MagicCat.flv'
    }
    ];

    this.myParams = {
        wmode             :'opaque',
        allowfullscreen   : true,
        cachebusting      : true,
        flashVars: ('config = ' + Ext.encode({
            plugins : {
                pseudo : {
                    url : 'flowplayer.pseudostreaming-3.1.3.swf'
                },
                controls : {
                    backgroundColor : '#000000',
                    backgroundGradient :'low',
                    playlist : true,
                    tooltips: {   // this plugin object exposes a 'tooltips' object
                        buttons: true,
                        fullscreen: 'Enter Fullscreen mode'
                    }
                }
            },
            clip : {  //playlist defualts
                provider : 'pseudo',
                duration : 30
            },
            playlist : '' //this.myPlayList

        })).replace(/\"/g,"\'")//Convert to single-quote for inclusion in <PARAM> markup
    };

    this.myMediaCfg = {
        //url        : 'http://releases.flowplayer.org/swf/flowplayer-3.1.5.swf',
        url        : 'http://www.channelvision.tv/media/flowplayer-3.1.5.swf',
        autoSize   : true,
        volume     : 25,
        start      : false,
        loop       : false,
        scripting  : 'always',
        encodeParams : false,
        params: this.myParams
    };

    this.myConfig = {
        xtype   : 'flashpanel',
        id      : 'flowplaything',
        title   : 'Flowplayer',
        autoMask : false,
        autoScroll : false,
        mediaCfg    : this.myMediaCfg
    };

    myFlowPlayer = Ext.extend( Ext.Window, {

        title     : 'Flowplayer with ux.Media.Flash',
        width     : 645,
        height    : 469,
        maximizable  : true,
        collapsible  : true,
        layout    : 'fit',
        plugins : [vizPlugin],

        initComponent: function(){

            this.items = [{
                xtype  : 'tabpanel',
                id     : this.getId() + '-center',
                activeTab : 0,
                ref    : 'demoTabs',
                plugins : [vizPlugin],
                //require : '@uxflash',  /* $JIT Load the ux.Media.Flash classes and their dependencies. */
                defaults : {
                    closable: true,
                    plugins : [vizPlugin] //Give ALL tabs the visibilityMode plugin
                },
                items : this.myConfig
            }];
            myFlowPlayer.superclass.initComponent.apply(this,arguments);
        }
    //,sourceModule : Demo.resolveURL( 'media', 'flowplayer.js')
    });
})();
//$JIT.provide('flowplayer');  //logical module registration