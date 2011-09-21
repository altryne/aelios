/*!
 * jQuery loader plugin
 * Version BETA 3 (03-AUGUST-2011)
 * Copyright (c) 2011 Guilherme Mori {guilherme.danna.mori}@gmail.com
 * Edited by : alex volkov | alexw.me
 */

;
(function($) {
    var o = {
        'bgColor':'#000000',
        'bgOpacity':0.85,
        'load':[],
        'fadeOutSpeed':'fast',
        'count':0,
        'loaded': 0,
        'step' : function(){},
        'complete' : function(){}
        };
    var loader = {
        init:function(options) {
        if (options) {
            $.extend(o, options)
        }
        if (!$.isArray(o.load)) {
            return $.error('Options must have at least load contents array on jQuery.preLoadGUI().')
        }
        o.count = o.load.length;
        
        loader.show(o.load)
    },show:function(l) {
        for (var el in l) {
            if ($.isArray(l[el])) {
                
                switch (l[el][1]) {
                    case'js':
                        $.getScript(l[el][0], function() {
                            loader.show(l)
                        });
                        break;
                    case'img':
                        $("<img />").css({visibility:'hidden'}).attr("src", l[el][0]).load(function() {
                            loader.show(l)
                        });
                        break;
                    case'css':
                        $("<style></style>").attr({type:"text/css"}).load(l[el][0], function() {
                            $(this).appendTo('head');
                            loader.show(l)
                        });
                        break;
                    case'html':
                        $('<div></div>').attr('rel', l[el][2]).load(l[el][0], function() {
                            $($(this).attr('rel')).append($(this).html());
                            loader.show(l)
                        });
                        break;
                    case'run':
                        $.getScript(l[el][0], function() {
                            loader.show(l)
                        });
                        break;
                    default:
                        delete l[el];
                        loader.show(l);
                        return;
                        break
                }
                loader.update(l[el][0]);
                delete l[el];
                return
            }
        }

        o.complete();
            
    },update:function(f) {
        o.loaded += 1;
        var loadedPercentage = o.loaded / o.count * 100;
        o.step(loadedPercentage);

    }};
    $.preLoadGUI = function(options) {
        if (typeof options === 'object') {
            return loader.init(options)
        } else {
            $.error('Options must have at least load contents array on jQuery.preLoadGUI().')
        }
    }
})(jQuery);