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
      http://uxdocs.theactivegroup.com/index.html?class=Ext.ux.Chart.Fusion.Component

   Fusion Charts Links:

     Download: http://www.fusioncharts.com/Download.asp

     Documentation: http://www.fusioncharts.com/docs/

     Forum: http://www.fusioncharts.com/forum/Forum3-1.aspx
 */

 (function(){

    //A simple store for chart binding
    Demo.store ||
    (Demo.store = new Ext.data.JsonStore({
        fields:['name', 'visits', 'views'],
        data: [
            {name:'Jul 07', visits: 245000, views: 3000000},
            {name:'Aug 07', visits: 240000, views: 3500000},
            {name:'Sep 07', visits: 355000, views: 4000000},
            {name:'Oct 07', visits: 375000, views: 4200000},
            {name:'Nov 07', visits: 490000, views: 4500000},
            {name:'Dec 07', visits: 495000, views: 5800000},
            {name:'Jan 08', visits: 520000, views: 6000000},
            {name:'Feb 08', visits: 620000, views: 7500000}
        ],
        autoDestroy : false
    }));

    var F = Ext.util.Format;

    var vizPlugin = Ext.ux.plugin && Ext.ux.plugin.VisibilityMode
       ? new Ext.ux.plugin.VisibilityMode({hideMode:'nosize'})
       : {init: Ext.emptyFn};

    //Common Toolbar config for each chart.
    var getToolBar = function(context){
          return [{
                   iconCls:'chart-refresh',
                   scope : context,
                   text : 'Render again',
                   handler:function(){ this.refreshMedia(); },
                   tooltip: {text:'Re-render the Chart'}
                   },
                  {
                   iconCls:'chart-print',
                   text : 'Print',
                   scope : context,
                   handler: function(){
                     this.chart.print();
                     },
                   tooltip: {text:'Print the Chart'}
                   },

                  {
                  iconCls:'demo-action',
                  text : 'Reload Data',
                  scope : context,
                  handler:function(){

                    if(this.store) this.refreshChart();
                    else this.setChartDataURL(this.dataURL);
                    },
                  tooltip: 'Reload the last data source.'
                  },

                  {
                  iconCls: 'source-icon',    //save as image support
                  text : 'See the Data',
                  scope : context,
                  handler:function(){

                        this.ownerCt.add({
                          html : String.format('<pre class="pre {1}">{0}<\/pre>',
                                F.htmlEncode(this.chart.getXML()),'xml'),
                          title : 'Chart Data',
                          closable : true
                        }).show();
                        return;

                    this.dataURL && this.ownerCt.setActiveTab(
                        Demo.loadRemoteSource(this.dataURL, this.ownerCt, {closable:true})
                        );
                    },
                  tooltip: 'See the Chart Data/script'
                 },
                 {
                  iconCls: 'demo-action',    //save as image support
                  text : 'Bind to a store',
                  scope : context,
                  handler:function(){
                    this.bindStore(Demo.store);
                    },
                  tooltip: 'Bind a simple store to the chart.'
                 }
            ];
    };

    var addChart = function(type, container, klass, config){
        var classCfg, chart;
        var id = Ext.id(null, 'fusionChart');

        klass = (klass || 'Panel');

        switch(type){
            case  'pie':
                classCfg = Ext.apply({

                   title       : 'Fusion Pie Chart:',
                   id          : id ,
                   autoScroll  : false,
                   disableCaching : true,
                   plugins     : [Demo.audioPlugin],
                   chartCfg   :{ id   : 'flash-' + id,
                                 autoScale : false, //prevent Fusion font scaling
                                 params : {
                                    flashVars: {
                                       debugMode : 0
                                       }
                                  }
                              },
                   mediaMask  : 'Loading Fusion Chart Object',
                   loadMask  : {msg:'Loading Chart Data...'},
                   autoMask  : true,
                   initComponent : function(){

                       //bind toolbar handlers to this instance
                       this.tbar = getToolBar(this);

                       this.store && this.bindStore(this.store);

                       Ext.ux.Chart.Fusion[klass].prototype.initComponent.call(this);
                   },
                   listeners :{

                       beforedestroy : function(comp){
                           comp.bindStore(null); //release any bound stores
                       },
                       chartload : function(comp, obj){
                           comp.setTitle(comp.title.split(":")[0]+': Chart Object Loaded.');
                           Demo.balloon(null,'Tab: "'+comp.title.split(":")[0]+'" reports:','chartload');
                           },

                       chartrender : function(comp,obj){
                           comp.setTitle(comp.title.split(":")[0]+': Rendered.');
                           Demo.balloon(null,'Tab: "'+comp.title.split(":")[0]+'" reports:','chartrender');

                           },

                       dataloaded : function(comp, obj){
                           comp.setTitle(comp.title.split(":")[0]+': Data Loaded.');
                           Demo.balloon(null,'Tab: "'+comp.title.split(":")[0]+'" reports:','dataloaded');
                           },
                       exported : function(comp, obj){
                           comp.setTitle(comp.title.split(":")[0]+': Exported to Server.');
                           },
                       exportready : function(comp, obj){
                           comp.setTitle(comp.title.split(":")[0]+': Exported is Ready on Client.');
                           }

                   },

                   //Bind a store to chart (using an XTemplate for create the necessary XML structure)
                   bindStore : function(store){
                        if(this.store){
                            this.store.un("datachanged", this.refreshChart, this);
                            this.store.un("add", this.delayRefresh, this);
                            this.store.un("remove", this.delayRefresh, this);
                            this.store.un("update", this.delayRefresh, this);
                            this.store.un("clear", this.refreshChart, this);
                            if(store !== this.store && this.store.autoDestroy){
                                this.store.destroy();
                            }
                        }
                        if(store && (store = Ext.StoreMgr.lookup(store))){
                            store.on({
                                scope: this,
                                datachanged: this.refreshChart,
                                add: this.delayRefresh,
                                remove: this.delayRefresh,
                                update: this.delayRefresh,
                                clear: this.refreshChart
                            });
                            this.dataURL = null;
                        }
                        this.store = store;
                        this.store && this.refreshChart();
                   },

                   /*
                    * Template for store -> chart XML construction
                    */
                   pieTpl : new Ext.XTemplate(
                     '<chart caption="Site Statistics" xAxisName="Month" yAxisName="Views" showToolTip="1" '  +
                     'showShadow="1" showToolTipShadow="1" use3DLighting="1" enableRotation="1" showValues="1" ' +
                     'decimals="0" formatNumberScale="0" >\n',
                      '<tpl for=".">',  //for the array of records
                        '<tpl for="data">', //for the data object of each record
                        '<set label="{name}" value="{views}" />\n',
                      '</tpl></tpl>',
                     '</chart>'
                   ).compile(),

                   /**
                    * Refresh the chart from the store using a XML Template.
                    * Note: the advanced Intellimask show call configuration
                    */
                   refreshChart : function(){

                        this.loadMask.show({
                            msg : 'Loading from Store...',
                            //fnDelay : 100,
                            scope : this,
                            fn : function(){
                               //Dump the entire store to chart
                               this.store && this.setChartData(
                                  this.pieTpl.apply(this.store.getRange())
                                )
                            },
                            autoHide : 1200  // 1.2 seconds
                          });
                   },

                   delayRefresh : function(){}

              }, config || {});

            default:
          }

      if(chart = (classCfg ? container.add( new Ext.ux.Chart.Fusion[klass](classCfg)) : null)){
          container.doLayout();
          container.setActiveTab && container.setActiveTab(chart);
      }

      return chart;

    };


Demo.FusionWindow ||

  (Demo.FusionWindow = Ext.extend( Demo.Window, {

      title     : 'Fusion 3.1 Charts with ux.Media.Charts',
      width     : 745,
      height    : 469,
      maximizable  : true,
      collapsible  : true,
      layout    : 'fit',
     // plugins : [vizPlugin],

      initComponent: function(){

          this.items = [{
               xtype  : 'tabpanel',
               id     : this.getId() + '-center',
               activeTab : 0,
               plugins : [vizPlugin],
               require : '@uxfusion',  //Load the Fusion classes and their dependencies.
               defaults : {
                   closable: true,
                   //Give ALL tabs the visibilityMode and Audio plugin
                   plugins : [vizPlugin, Demo.audioPlugin ]
               }
           }];

          this.tbar = [{
             text   :'Add Chart...',
             iconCls:'demo-chart',
             scope:   this,
             handler : function(button){
                  addChart('pie', this.items.first(), 'Panel',
                      { chartURL : 'demos/charts/Fusion/Pie3D.swf',
                        dataURL  : 'demos/charts/data-files/Fusion/Column3D.xml',
                        closable : true
                      });
              }
          }]

          Demo.FusionWindow.superclass.initComponent.apply(this,arguments);
        },

        sourceModule : Demo.resolveURL( 'charts', 'fusion.js')

  }));

})();

$JIT.provide('fusion');  //logical module registration


