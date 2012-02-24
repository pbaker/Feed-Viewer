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
      http://uxdocs.theactivegroup.com/index.html?class=Ext.ux.Media.Component

 */

 (function(){

  var F = Ext.util.Format;

  Ext.useShims = true;   //enable IFRAME shims
  Demo.Acrobat ||
      (Demo.Acrobat = Ext.extend( Demo.Window, {

      title     : 'PDF with ux.Media',
      width     : 645,
      height    : 469,
      maximizable  : true,
      collapsible  : true,
      animCollapse : false,

      layout    : 'fit',
      shim      : false,
      plugins     :  {ptype: 'uxvismode', elements:['bwrap']},

      initComponent: function(){

          this.items = [{
               xtype  : 'tabpanel',
               id     : this.getId() + '-center',
               ref    : 'demoTabs',
               activeTab : 0,
               plugins   :  {ptype: 'uxvismode', elements:['bwrap']},
               require   :  '@uxmedia',
               defaults : {
                   hideMode : 'nosize',
                   closable: true,
                   iconCls : 'media-pdf',
                   disableCaching : true,
                   autoScroll : false,
                   autoMask : false,
                   plugins     :  {ptype: 'uxvismode', elements:['bwrap']} //Give ALL tabs the visibilityMode plugin
               },
               items : [{
                    xtype   : 'mediapanel',
                    id      : 'pdfplaything',
                    title   : 'Acrobat',
                    mediaCfg:{
                        mediaType  : 'PDF',
                        url        : 'http://partners.adobe.com/public/developer/en/acrobat/PDFOpenParameters.pdf',
                        autoSize   : true
                    },

                    tbar : Ext.isIE ? [  //available for IE-only ActiveX plugin interface only
                      {text    :'Print All',
                        handler: function(){
                           var O= Ext.getCmp('pdfplaything').getInterface();
                           O && O.printAll();  //noprompt, just first warning
                         }
                       },
                       {
                        text :'Previous Page',
                        handler: function(){
                           var O= Ext.getCmp('pdfplaything').getInterface();
                           O && O.gotoPreviousPage();
                         }
                       },
                       {
                        text :'Next Page',
                        handler: function(){
                           var O= Ext.getCmp('pdfplaything').getInterface();
                           O && O.gotoNextPage();
                         }
                       }
                       ] : null
               },
                   {
                    xtype   : 'mediapanel',
                    id      : 'pdfplayframed',
                    title   : 'Acrobat (IFRAMED)',
                    mediaCfg:{
                        mediaType  : 'PDFFRAME',
                        url        : 'demos/media/ex1.pdf#toolbar=0', //turn off the toolBar
                        autoSize   : true
                    }
                   },
                   {
                    title: 'More..',
                    iconCls : 'demo-action',
                    html: 'For more on submiting Forms for PDF output, see the <a href="http://demos.theactivegroup.com/?demo=mif&script=mifsubmit">ManagedIframe demonstration</a>.'
                   }
                ]

           }];

           this.tbar = [{
                 text : 'Show Shimmed Popup Window',
                 scope : this,
                 handler : function(button){
                    Ext.useShims = true;   //enable IFRAME shims
                    var shimmedWindow = Ext.getCmp('shimWin') ||
                        new Ext.Window({
                            id: 'shimWin',
                            width : 200,
                            height: 200,
                            title : 'Shimmed Window',
                            html: 'test',
                            manager : this.manager,
                            closeAction: 'hide',
                            shadow : true,
                            shim : true, //IFRAME-shim the window
                            plugins : {ptype: 'toolstips'}
                        });

                    shimmedWindow.isVisible() ? shimmedWindow.toFront() :
                        //shimmedWindow.manager.bringToFront(shimmedWindow):
                            shimmedWindow.show(button.el.dom);
                 }
              }];


          Demo.Acrobat.superclass.initComponent.apply(this,arguments);
        },

        sourceModule : Demo.resolveURL( 'media', 'acrobat.js')

  }));

})();
$JIT.provide('acrobat');  //logical module registration




