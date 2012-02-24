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
   
   JW Player Links:
      
     Download: http://www.longtailvideo.com/players/jw-flv-player/
     
     Supported flashVars : http://developer.longtailvideo.com/trac/wiki/FlashVars
     
     API Documentation: http://developer.longtailvideo.com/trac/wiki/FlashApi
     
 */

   
 
 (function(){
        
    var F = Ext.util.Format;
    
    var vizPlugin = Ext.ux.plugin && Ext.ux.plugin.VisibilityMode // && !Ext.isIE
       ? new Ext.ux.plugin.VisibilityMode({hideMode:'nosize'}) 
       : {init: Ext.emptyFn};

    //JWV Player sends notifications through a global 'playerReady' function handler.
    //This will be mapped to each player instance.
    window.playerReady= function(obj) {
        //Search for a ux.Flash-managed player.
        var mediaComp, el = Ext.get(obj['id']);
        if(mediaComp = (el?el.ownerCt:null)){
             mediaComp.onFlashInit();
        }
    };
    
    window.JWPtrace = function(){console.log(arguments);};

    

Demo.JWPlayer ||

  (Demo.JWPlayer = Ext.extend( Demo.Window, {

      title     : 'JWPlayer with ux.Media.Flash',
      width     : 445,
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
               ref    : '../../demoTabs',
               plugins : [vizPlugin],
               require : '@uxflash',  /* $JIT Load the ux.Media.Flash classes and their dependencies. */
               defaults : {
                   closable: true,
                   plugins : [vizPlugin] //Give ALL tabs the visibilityMode plugin
               },
               items : {
                    xtype   : 'flashpanel',
                    id      : 'jwplaything',
                    title   : 'LongTail (JWPlayer 4.4)',
                    autoMask : true,  //set true here because this player provides feedback when ready
                    autoScroll : false,
                    externalsNamespace : 'player',
                    listeners:{
                        /*
                         * we MUST wait until the Flash object renders fully
                         * and reports ready
                         */
                        
                        flashinit: function(C, playerObj){
                            //construct a global status callback for this instance
                            var cbName = 'recorder_'+playerObj.id;
                            window[cbName] = function(state){
                               Demo.balloon(null,'Player Reports:',state.newstate);
                               }.createDelegate(this);
                            
                            Demo.balloon(null,'Player Reports:','Ready');
                            
                            //Use the externalsNamespace 'player' binding we defined earlier
                            with(C.player){
                               addModelListener("STATE",cbName);
                            }
                            //Or, use the direct <object> tag reference instead
                            playerObj.sendEvent('PLAY','true');
                        },
                        scope: this,
                        delay : 100
                    },
                    mediaCfg:{
                        url        : 'demos/media/JWP/player-viral.swf',
                        autoSize   : true,
                        volume     : 25,
                        start      :false,
                        loop       :false,
                        scripting  :'always',
                        
                        //ExternalInterface bindings
                        boundExternals : ['sendEvent' ,
                                           {name:'addModelListener',returnType:'xml'},
                                           'addControllerListener',
                                           'addViewListener',
                                           'getConfig',
                                           'getPlaylist'
                                          ],
                        params:{
                             wmode             :'opaque',
                             allowfullscreen   : true,
                             flashVars: {
                                     autostart  :'@start',
                                     file       :'http://content.bitsontherun.com/videos/6AJT5nbx.m4v',
                                     duration   : 30,
                                     stretching :'fill',
                                     fullscreen : true,
                                     shuffle    : false,
                                     repeat     : false,
                                     volume     :'@volume' //(0-100)
                                 // ,tracecall  : 'JWPtrace' //debug aid
                                  }
    
                                }
                       }
                
                    }
           }];
          

          Demo.JWPlayer.superclass.initComponent.apply(this,arguments);
        },

        sourceModule : Demo.resolveURL( 'media', 'jwplayer.js')

  }));

})();

$JIT.provide('jwplayer');  //logical module registration

//Source Formatting provided by the CodeLife Worker

