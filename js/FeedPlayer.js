/*
 * **********************************************************************************
 * Author: Paul Baker. theoriginalpaulbaker@gmail.com
 * Copyright 2009-2010, Channelvision.tv  All rights reserved.
 ************************************************************************************

  License: This demonstration is licensed under the terms of
  GNU Open Source GPL 3.0 license:

  Commercial use is prohibited.

   This program is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.
   see < http://www.gnu.org/licenses/gpl.html>

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

    myFlowPlayer = Ext.extend( Ext.Window, {

        id              : 'myFloPlayerWindow',  // default to prevent more than 1 window
        title           : 'Media Player',
        width           : 645,
        height          : 469,
        maximizable     : true,
        collapsible     : true,
        layout          : 'fit',
        plugins         : [vizPlugin],
        playerTabTitle  : 'Sample Video',

        urlMediaPlayer      : 'http://releases.flowplayer.org/swf/flowplayer-3.1.5.swf',
        urlPseudostreaming  : 'flowplayer.pseudostreaming-3.1.3.swf',

        myFlashVarsPlaylist : {
            duration : 10,
            url      : 'http://e1p1.simplecdn.net/flowplayer/flowplayer-700.flv'
        },

        myFlashVarsClip : {
            provider : 'pseudo',
            duration : 30
        },

        initComponent: function(){

        this.myFlashVarsPseudo = {
                url : this.urlPseudostreaming
            };
        
            this.myFlashVarsPlugins = {
                old_pseudo : {
                    url  : 'flowplayer.pseudostreaming-3.1.3.swf'
                },
                pseudo : this.myFlashVarsPseudo,
                controls : {
                    backgroundColor     : '#000000',
                    backgroundGradient  :'low',
                    playlist            : true,
                    tooltips: {
                        buttons: true,
                        fullscreen: 'Enter Fullscreen mode'
                    }
                }
            };
            this.myMediaCfgParams = {
                wmode             :'opaque',
                allowfullscreen   : true,
                cachebusting      : true,
                flashVars         : ('config='+ Ext.encode({
                    plugins     :  this.myFlashVarsPlugins,
                    clip        :  this.myFlashVarsClip,
                    playlist    :  this.myFlashVarsPlaylist
                })).replace(/\"/g,"\'")
            };

            this.myMediaCfg = {
                //url           : 'http://releases.flowplayer.org/swf/flowplayer-3.1.5.swf',
                //url        	: 'http://www.channelvision.tv/media/flowplayer-3.1.5.swf',
                //url           : 'http://www.archive.org/flow/flowplayer.commercial-3.0.5.swf',
                url             :  this.urlMediaPlayer,
                autoSize  	:  true,
                volume     	:  25,
                start      	:  false,
                loop       	:  false,
                scripting  	: 'always',
                encodeParams 	:  false,
                params          :  this.myMediaCfgParams
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
            
            myFlowPlayer.superclass.initComponent.apply(this,arguments);
        }
    });
})();
