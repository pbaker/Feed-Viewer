/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/*
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
*/

this.myFlashVarsPlaylist =  {
        //url           : 'http://www.archive.org/download/CoolHotRodB/CoolHotRodB_512kb.mp4',
        url           : 'http://www.archive.org/download/CoolHotRodB/CoolHotRodB_512kb.mp4',
        autoPlay      : true,
        accelerated   : true,
        scaling       : 'fit',
        provider      : 'h264streaming'
    };

        this.myFlashVarsPlugins = {
            pseudo : {
                url : 'flowplayer.pseudostreaming-3.1.3.swf'
            },
            controls : {
                backgroundColor     : '#000000',
                backgroundGradient  :'low',
                playlist : true,
                tooltips: {
                    buttons: true,
                    fullscreen: 'Enter Fullscreen mode'
                }
            },
            h264streaming : {
                url : 'http://www.archive.org/flow/flowplayer.h264streaming-3.0.5.swf'
            }
        };

        this.myFlashVarsClip = {
            autoPlay    : false,
            accelerated : true,
            scaling     : 'fit',
            provider    : 'h264streaming'
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
