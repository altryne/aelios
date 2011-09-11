/**
 *
 * Find more about the rotating function at
 * http://cubiq.org/rotating-wheel-for-your-iphone-webapps/14
 *
 * Copyright (c) 2009 Matteo Spinelli, http://cubiq.org/
 * Released under MIT license
 * http://cubiq.org/dropbox/mit-license.txt
 *
 * Version 0.1 - Last updated: 2009.04.12
 * Edited by Altryne (alexw.me) at 17.08.11
 * ported to support jquery with jquery.transform to have cross browser support
 * Added click to rotate and removed all zodiac refrences
 */
var zodiac = {
	el: null,
	controller: null,
	angle: 0,
	startAngle: 0,
    slicesCount : 4,
    stepsCount : 48,
    slices: Math.PI/ 2,	// 8 slices
    steps: Math.PI/ 24,	// 48 steps
    track_position : false,
    curStep : 0,
    initialShutter : 26,
    shutterDirection : -1,
    chokeFactor : 0,
    
	handleEvent: function (e) {
        
        switch(e.type){
            case 'touchstart':
                e.preventDefault();
                zodiac.rotateStart({x:e.originalEvent.touches[0].pageX,y:e.originalEvent.touches[0].pageY},e);
            break;
            case 'touchmove':
                zodiac.rotateMove({x:e.originalEvent.touches[0].pageX,y:e.originalEvent.touches[0].pageY},e);
            break;
            case 'mousedown':
                zodiac.rotateStart({x:e.pageX,y:e.pageY},e);
            break;
            case 'mousemove':
                zodiac.rotateMove({x:e.pageX,y:e.pageY},e);
            break;
            case 'touchend':
            case 'mouseup':
                zodiac.rotateStop(e);
            break;
        }
	},

	init: function(controller,el,shutter) {
		this.el = el;
		this.controller = controller;
        this.shutter = shutter;
        this.width      = this.controller.width() / 2;
        this.height     = this.controller.height() / 2;
        //center points
		this.originX    = this.controller.position().left + this.width / 2;
	    this.originY    = this.controller.position().left / 2;
        
        this.el[0].style.webkitTransitionDuration = '0';
//        this.el.bind('touchstart touchmove touchend mousedown mousemove', this.handleEvent);
        this.controller.bind('touchstart touchmove touchend mousedown mousemove', this.handleEvent);
        $(document).bind('mouseup mousemove', zodiac.handleEvent);

	},

	rotateStart: function(e,evt) {
        evt.preventDefault();
        this.track_position = true;
        this.el[0].style.webkitTransitionDuration = '0';

		var startX = e.x - this.originX;
		var startY = e.y - this.originY;
		this.startAngle = Math.atan2(startY, startX) - this.angle;
		this.startStep = 0;

        zodiac.starDir = ((parseFloat(this.el.css('rotate')) * 180 / Math.PI) > 80)? -1 : 1;
        zodiac.initialShutter = 25;
	},

	rotateMove: function(e,evt) {
        if(!this.track_position) {return false};

        if(zodiac.curStep != this.getSegment('steps')){
            CAAT.AudioManager.play('click');
        }


//        zodiac.shutter.find('.shutterInner').css('backgroundPosition',zodiac.initialShutter);


        zodiac.curStep = this.getSegment('steps');


		var dx = e.x - this.originX;
		var dy = e.y - this.originY;

		this.angle = Math.atan2(dy, dx) - this.startAngle;

        this.angleDeg = this.angle * 180 / Math.PI;
        this.prevangleDeg = parseFloat(this.el.css('rotate')) * 180 / Math.PI;

        
        if(this.prevangleDeg < this.angleDeg){
            this.scrollDir = this.starDir;
        }

        if(this.prevangleDeg > this.angleDeg){
            this.scrollDir = -1 * this.starDir
        }
        //prevent rotating more then nessesary
        if(this.angleDeg > -20 && this.angleDeg < 120){
            this.el.css('rotate',this.angle + 'rad');
        }else{
            this.chokeFactor += 0.01;
            this.angle = parseFloat(this.el.css('rotate'));
        }

        if(this.angleDeg > 0 && this.angleDeg <90){
            this.shutter.css('display','block');
            if(zodiac.initialShutter == -5 || zodiac.initialShutter == 26){
            zodiac.shutterDirection *= -1;
            }

            zodiac.initialShutter += zodiac.shutterDirection * this.scrollDir;
            if(zodiac.initialShutter >= 0){
                zodiac.shutter.find('.shutterInner').css('rotate',zodiac.initialShutter +'deg');
            }
        }else{
            this.shutter.css('display','none');
        }
	},
	rotateStop: function(e) {
        this.track_position = false;
        zodiac.chokeFactor = 0;
        this.shutter.find('.shutterInner').animate({'rotate':'26deg'},250,function(){
                zodiac.shutter.hide();
        });
        zodiac.initialShutter = 25;
        zodiac.shutterDirection = -1;
        zodiac.startStep = zodiac.curStep;
		if( this.angle%this.slices ) {
			this.angle = Math.round(this.angle/this.slices) * this.slices;
//			this.el[0].style.webkitTransitionDuration = '550ms';
//			this.el[0].style.webkitTransform = 'rotateZ(' + this.angle + 'rad)';
            this.el.animate({'rotate':this.angle + 'rad'},550);
            CAAT.AudioManager.play('click');
            setTimeout("CAAT.AudioManager.play('click')",250);
		}
	},
    getSegment: function(segment) {
        segment = segment || 'slices';

        count = this[segment+'Count'];
        
		var selected = Math.floor(Math.abs(this.angle) / this[segment] / count);
		if (this.angle < 0)
			selected = -selected;

		selected = Math.round(this.angle/this[segment]) - selected * count;
		if (selected < 0)
			selected = count + selected;

		return selected;
	}
};


//custom jquery easing functions
$.extend($.easing,
{
    def: 'easeOutQuad',
    swing: function (x, t, b, c, d) {
        //alert($.easing.default);
        return $.easing[$.easing.def](x, t, b, c, d);
    },
    easeOutQuad: function (x, t, b, c, d) {
        return -c *(t/=d)*(t-2) + b;
    },
    easeInBack: function (x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c*(t/=d)*t*((s+1)*t - s) + b;
    },
    easeOutBack: function (x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    },
    easeInOutBack: function (x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    }
});