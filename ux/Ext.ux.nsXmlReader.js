/**
 * Ext.ux.nsXmlReader - XmlReader with support for xml namespaces (xmlns:some_space)
 *
 * @author    Paul Baker <theoriginalpaulbaker@gmail.com>
 * @copyright (c) 2010, by Paul Baker
 * @date      10 Feb 2010
 * @version   $Id: Ext.ux.nsXmlReader.js 
 *
 * @license Ext.ux.nsXmlReader is licensed under the terms of
 * the Open Source LGPL 3.0 license.  Commercial use is permitted to the extent
 * that the code/component(s) do NOT become part of another Open Source or Commercially
 * licensed development library or toolkit without explicit permission.
 *
 * License details: http://www.gnu.org/licenses/lgpl.html
 */

/*global Ext */

/* IMPORTANT: Requires modified source version of DomQuery with regex change */

Ext.ux.nsXmlReader = function(meta, recordType){
    meta = meta || {};
    Ext.applyIf(meta, {
        idProperty: meta.idProperty || meta.idPath || meta.id,
        successProperty: meta.successProperty || meta.success,
        xmlnsProperty: meta.xmlnsProperty
    });

    Ext.ux.nsXmlReader.superclass.constructor.call(this, meta, recordType || meta.fields);
};

Ext.extend(Ext.ux.nsXmlReader, Ext.data.XmlReader, {

    readRecords: function(doc) {
	  
        //debugger; //Ext.ux.nsXmlReader.js
        this.xmlData = doc;

        //get local references to frequently used variables
        var root    = doc.documentElement || doc,
        records = [],
        nodes   = Ext.DomQuery.select(this.meta.record, root);

        //build an Ext.data.Record instance for each node
        Ext.each(nodes, function(node) {
            records.push(this.buildRecordForNode(node));
        }, this);

        return {
            records             : records,
            successProperty     : this.wasSuccessful(root),
            totalRecords        : this.getTotalRecords(root),
            xmlnsProperty       : this.xmlnsProperty(doc),          // call 1st
            xmlnsBoxeeProperty  : this.xmlnsBoxeeProperty(doc)     // call 2nd

        }
    },

    // search for xmlns attributes and save {name, urn} to array, for reference
    xmlnsProperty: function(doc){
        //if ('undefined' == typeof(document.xmlNamespaces)) {};
        this.xmlNamespaces = new Array();
        var attributeList = doc.documentElement.attributes;
        if (attributeList != null) {
            i = 0;
            for (x = 0; x < attributeList.length; x++) {
                attributeString = attributeList[x];
                if (/xmlns:/.test(attributeString.nodeName)) {
                    var matches = attributeString.nodeName.split(/:/);
                    var namespace = {
                        name: matches[1],
                        urn: attributeString.value
                    };
                    this.xmlNamespaces[i++] = namespace;
                    this.meta.xmlnsProperty = true;
                }
            }
        }
        return this.meta.xmlnsProperty;
    },

    xmlnsBoxeeProperty: function(doc) {
        var bflag = false;
        if (!('undefined' == typeof(this.xmlNamespaces))) {
            var xmlList = this.xmlNamespaces;
            if (xmlList != null) {
                i = 0;
                for (x = 0; x < xmlList.length; x++) {
                    xmlString = xmlList[x];
                    if (/boxee/.test(xmlString.name)) {
                        bflag =  true;
                    }
                    i++;
                }
            }
        }
        this.meta.xmlnsBoxeeProperty = bflag;  // set reader meta data
        return bflag; // return true/false
    },
  
    /**
   * Returns a new Ext.data.Record instance using data from a given XML node
   * @param {Element} node The XML node to extract Record values from
   * @return {Ext.data.Record} The record instance
   */
    buildRecordForNode: function(node) {
        var domQuery = Ext.DomQuery,
        idPath   = this.meta.idPath || this.meta.id,
        id       = idPath ? domQuery.selectValue(idPath, node) : undefined;

        var record  = new this.recordType({}, id);
        record.node = node;

        //iterate over each field in our record, find it in the XML node and convert it
	
        record.fields.each(function(field) {
            var mapping  = Ext.value(field.mapping, field.name, true),
            rawValue = domQuery.selectValue(mapping, node, field.defaultValue),
            value    = field.convert(rawValue, node);

            record.set(field.name, value);
        });

        return record;
    },

    /*
   * Returns the total number of records indicated by the server response
   * @param {XMLDocument} root The XML response root node
   * @return {Number} total records
  */
   
    getTotalRecords: function(root) {
        var metaTotal = this.meta.totalRecords;
        return metaTotal == undefined
        ? 0
        : Ext.DomQuery.selectNumber(metaTotal, root, 0);
    },

    /**
   * Returns true if the response document includes the expected success property
   * @param {XMLDocument} root The XML document root node
   * @return {Boolean} True if the XML response was successful
  */
   
    wasSuccessful: function(root) {
        var metaSuccess  = this.meta.success;

        //return true for any response except 'false'
        if (metaSuccess == undefined) {
            return true;
        } else {
            var successValue = Ext.DomQuery.selectValue(metaSuccess, root, true);
            return successValue !== false && successValue !== 'false';
        }
    }
});


