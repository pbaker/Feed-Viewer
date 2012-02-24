// vim: ts=4:sw=4:nu:fdc=4:nospell
/**
 * Ext.ux.ThemeCombo - Combo pre-configured for themes selection
 *
 * @author    Ing. Jozef Sakáloš <jsakalos@aariadne.com>
 * @copyright (c) 2008, by Ing. Jozef Sakáloš
 * @date      30. January 2008
 * @version   $Id: Ext.ux.ThemeCombo.js 472 2009-01-22 23:24:56Z jozo $
 *
 * @license Ext.ux.ThemeCombo is licensed under the terms of
 * the Open Source LGPL 3.0 license.  Commercial use is permitted to the extent
 * that the code/component(s) do NOT become part of another Open Source or Commercially
 * licensed development library or toolkit without explicit permission.
 *
 * License details: http://www.gnu.org/licenses/lgpl.html
 */
 
/**
 *
 * 24-FEB-2012 PPB - Changed CSS path to support migration to github
 *
 */
 
/*global Ext */

/**
 * Theme selector combo that doesn't reload page on theme change
 * and that keeps state if the state management is available.
 * You need to give id="theme" to your css link in the header:
 * <link href="/extjs-2.0/resources/css/xtheme-default.css" rel="stylesheet" type="text/css" id="theme">
 */


Ext.ux.ThemeCombo = Ext.extend(Ext.form.ComboBox, {
    // configurables
     themeBlueText: 'Ext Blue Theme'
	,themeAeroText: 'Aero Theme'
	,themeVistaText: 'Vista Theme'
	,themeLunaText: 'XP Theme'
    ,themeGrayText: 'Gray Theme'
    ,themeBlackText: 'Black Theme'
    ,themeOliveText: 'Olive Theme'
    ,themePurpleText: 'Purple Theme'
    ,themeDarkGrayText: 'Dark Gray Theme'
    ,themeSlateText: 'Slate Theme'
    ,themeVistaText: 'Vista Theme'
    ,themePeppermintText: 'Peppermint Theme'
    ,themePinkText: 'Pink Theme'
    ,themeChocolateText: 'Chocolate Theme'
    ,themeGreenText: 'Green Theme'
    ,themeIndigoText: 'Indigo Theme'
    ,themeMidnightText: 'Midnight Theme'
    ,themeSilverCherryText: 'Silver Cherry Theme'
    ,themeSlicknessText: 'Slickness Theme'
    ,themeVar:'theme'
    ,selectThemeText: 'Select Theme'
    ,themeGrayExtndText:'Gray-Extended Theme'
    ,lazyRender:true
    ,lazyInit:true
    ,cssPath:'ext-3.1+/resources/css/' // mind the trailing slash

    // {{{
    ,initComponent:function() {

        Ext.apply(this, {
            store: new Ext.data.SimpleStore({
                fields: ['themeFile', {name:'themeName', type:'string'}]
                ,data: [
                     ['xtheme-default.css', this.themeBlueText]					//
                    ,['xtheme-gray.css', this.themeGrayText]					//
                    ,['xtheme-darkgray.css', this.themeDarkGrayText]			//
                    ,['xtheme-black.css', this.themeBlackText]					//
                    ,['xtheme-olive.css', this.themeOliveText]					//
                    ,['xtheme-purple.css', this.themePurpleText]				//
                    ,['xtheme-slate.css', this.themeSlateText]					//
                    ,['xtheme-peppermint.css', this.themePeppermintText]		//
                    ,['xtheme-chocolate.css', this.themeChocolateText]			//
                    ,['xtheme-indigo.css', this.themeIndigoText]				//
                    ,['xtheme-slickness.css', this.themeSlicknessText]			//			
                    ,['xtheme-pink.css', this.themePinkText]					//
					,['xtheme-aero.css', this.themeAeroText]					//
					,['xtheme-luna.css', this.themeLunaText]					//
					//,['xtheme-vista.css', this.themeVistaText]					//
                    //,['xtheme-gray-extend.css', this.themeGrayExtndText]						
                    //,['xtheme-green.css', this.themeGreenText]					
               		//,['xtheme-midnight.css', this.themeMidnightText]
                    //,['xtheme-silverCherry.css', this.themeSilverCherryText]					
                ]
            })
            ,valueField: 'themeFile'
            ,displayField: 'themeName'
            ,triggerAction:'all'
            ,mode: 'local'
            ,forceSelection:true
            ,editable:false
            ,fieldLabel: this.selectThemeText
        }); // end of apply

        this.store.sort('themeName');

        // call parent
        Ext.ux.ThemeCombo.superclass.initComponent.apply(this, arguments);

        if(false !== this.stateful && Ext.state.Manager.getProvider()) {
            this.setValue(Ext.state.Manager.get(this.themeVar) || 'xtheme-default.css');
        }
        else {
            this.setValue('xtheme-default.css');
        }

    } // end of function initComponent
    // }}}
    // {{{
    ,setValue:function(val) {
        Ext.ux.ThemeCombo.superclass.setValue.apply(this, arguments);

        // set theme
        Ext.util.CSS.swapStyleSheet(this.themeVar, this.cssPath + val);

        if(false !== this.stateful && Ext.state.Manager.getProvider()) {
            Ext.state.Manager.set(this.themeVar, val);
        }
    } // eo function setValue
    // }}}

}); // end of extend

// register xtype
Ext.reg('themecombo', Ext.ux.ThemeCombo);

// eof



