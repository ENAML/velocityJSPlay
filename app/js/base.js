var jq = jQuery.noConflict();

////////////////////////////////////
//         SETUP
////////////////////////////////////

jq(document).on('ready',function(){


window.CONF = CONF || {};

var jqwindow = jq(window);

var jqel = {
    topFrame: jq('#top-frame'),

    slideshowContainer: jq('.slideshow-container'),
    slideshowBody: jq('.slideshow-body'),
    slideshowItem: jq('.slideshow-item'),
    leftButton: jq('.left-button'),
    rightButton: jq('.right-button'),
    content : jq('#content'),
    scrollText: jq('#scroll-text'),
    arrow: jq('#arrow')
}


var windowWidth = jqwindow[0].innerWidth;
var windowHeight = jqwindow[0].innerHeight;

var filterArray=[];

jqel.topFrame.css({height: windowHeight});



bindEvents();
resize();
resetTop();
// checkScroll();

function bindEvents(){
    jqel.content.find('.filter-button').on('click',function(e){updateFilter(e)});

    jq( window ).resize(function() {
        resetTop();
    });
    jq( window ).resize(function() {
        resize();
    });
    jq(window).load(function(){
        resize();
        resetTop();
    });


}

function scrollDown(){
    jq('html, body').animate({
        scrollTop: (jqel.content.offset().top)
    },500);
}

jqel.scrollText.on('click', function() {
    scrollDown();
})

jqel.arrow.on('click', function() {
    scrollDown();
})


//////////////////////////////////////////////
//////////////////////////////////////////////
//
//            FILTERS
//
//////////////////////////////////////////////
//////////////////////////////////////////////

    function updateFilter(event){

        var currentItem =  jq(event.currentTarget);
        

        var currentFilter = currentItem.data("filter");
        
        if(currentItem.hasClass('active')){

            if(currentFilter==="home") return;

            currentItem.removeClass('active');
            filterArray.remove(currentFilter);
            if(filterArray.length===0) jqel.content.find('.filter-button.all').addClass("active");   
        }else{

            if(currentFilter==="all"){
                filterArray=[];
                jqel.content.find('.filter-button').removeClass('active');
            }else{
                filterArray=[];
                jqel.content.find('.filter-button').removeClass('active');
                filterArray.push(currentFilter);
            }

            currentItem.addClass('active');
        }


      
        animateFilter();

    }

    function animateFilter(){


        jqel.content.find('.content-el').addClass("disabled");

        if(filterArray.length==0) jqel.content.find('.content-el').removeClass("disabled");

        for (var i = filterArray.length - 1; i >= 0; i--) {
            var currentFilter = filterArray[i];
            var elements = jqel.content.find('[data-category="'+currentFilter+'"]');
            elements.removeClass("disabled");
        };

    }


    // function checkScroll(){

    //     if(jq(window).scrollTop() > jq(".filter-container").offset().top + jq(".filter-container").height()){
    //         jq(".filter-container").css({'position':'fixed'});
    //     }

    //     window.requestAnimationFrame(function(/* time */ time){
    //      checkScroll();
    //     });
    // }


//////////////////////////////////////////////
//////////////////////////////////////////////
//
//            SLIDESHOW APP UPDATE
//
//////////////////////////////////////////////
//////////////////////////////////////////////

var MySlideshow = (function(slideshow) { 

    function MySlideshow(slideshow){ 

        // JQ Selectiors
        this.jqslideshowContainer = slideshow;
        this.jqleftButton = this.jqslideshowContainer.find('.left-button');
        this.jqrightButton = this.jqslideshowContainer.find('.right-button');
        this.jqslideshowBody = this.jqslideshowContainer.find('.slideshow-body');
        this.jqslideshowItem = this.jqslideshowContainer.find('.slideshow-item');

        // console.log(this.jqslideshowItem);
        
        // Vars
        this.index = 0;
        this.items = this.jqslideshowItem.length;
        this.itemsDouble = this.items * 2; // needed for infinite scroll
        this.itemsArray = jq(slideshow).find('.slideshow-item');
        this.itemsDoubleArray = [];
        this.cloneItems = this.itemsArray;
        this.itemWidth = 0;
        this.bodyWidth = 0;

        this.bindEvents();

    } 

    MySlideshow.prototype.calculateSize = function () {
        var wrapperWidth = jq('.content-wrapper').width(); // get width of container for content
        // console.log(wrapperWidth);
        // console.log(jqwindow[0].innerWidth);
        if (jqwindow[0].innerWidth <= wrapperWidth) {
            this.itemWidth = jqwindow[0].innerWidth;
        } else {
            this.itemWidth = wrapperWidth;
        }
        
        this.bodyWidth = this.itemsDouble * this.itemWidth;
        // console.log('item width:', itemWidth);
        // console.log('body width:', bodyWidth);
    };

    MySlideshow.prototype.setSize = function() {
        this.jqslideshowBody.css({
            width: this.bodyWidth,
        });

        this.jqslideshowItem.css({
            width: this.itemWidth,
        });
    };


    MySlideshow.prototype.animate = function() {
        var position = -(this.index * this.itemWidth);
        this.jqslideshowBody.css({left: position})
    };


    MySlideshow.prototype.moveForward = function() {

        this.index++;

        if (this.index > this.itemsDouble - 1) {
            this.jqslideshowBody.addClass('no-transition');
            this.index--;
            this.index = this.index - this.items;
            this.animate();

            this.jqslideshowBody[0].offsetHeight; // Trigger a reflow, flushing the CSS changes
            this.jqslideshowBody.removeClass('no-transition');
            this.index++;
        }
        this.animate();
        this.setHeight();
    };

    MySlideshow.prototype.moveBack = function() {
        this.index--;

        if (this.index < 0) {
            this.jqslideshowBody.addClass('no-transition');
            this.index++;
            this.index = this.index + this.items;
            this.animate();
            this.jqslideshowBody[0].offsetHeight; // Trigger a reflow, flushing the CSS changes
            this.jqslideshowBody.removeClass('no-transition');
            this.index--;
        }
        this.animate();
        this.setHeight();
    };

    MySlideshow.prototype.resetSlides = function() {
        this.index = 0;
        this.animate();
        // console.log('reset');
    };

    MySlideshow.prototype.setHeight = function() {

        var that = this;

        setTimeout(function(){
            var innerHeight = jq(that.jqslideshowItem[that.index]).height();
            // console.log(index)
            // console.log(jq(jqel.slideshowItem[index]).height())
            // var innerHeight = jqel.slideshowBody.height() + 30;
            // console.log(innerHeight);
            that.jqslideshowContainer.css({height: innerHeight});
        },550)

    };

    MySlideshow.prototype.init = function() {

        // console.log(itemsArray);
        this.itemsArray.clone().appendTo(this.jqslideshowBody);
        this.jqslideshowItem = this.jqslideshowContainer.find('.slideshow-item'); // need to recalculate after clone
        this.calculateSize();
        this.setSize();
        
        this.animate();

        var that = this; // FIX THIS LATER

        setTimeout(function(){ that.setHeight(); },600);
        // console.log(jqel.slideshowItem);
        // console.log(jqel.slideshowBody[0].scrollHeight);
    };

    MySlideshow.prototype.reset = function() {
        windowWidth = jqwindow[0].innerWidth;
        windowHeight = jqwindow[0].innerHeight;


        // NEED 300ms SETTIMEOUT FOR PHONE TO FINISH GETTING ORIENTATION
        // SOMETIMES THIS DOES NOT HAPPEN AUTOMATICALLY

        var that = this;

        setTimeout(function(){

            var orientation = 90;

            if("matchMedia" in window){
                var mql = window.matchMedia("(orientation: portrait)");
                if(!mql.matches) orientation = 90;
                else orientation = 0;
            }

            windowWidth = window.innerWidth;
            windowHeight = window.innerHeight;

            that.resetSlides();
            that.calculateSize();
            that.setSize();

        }, 200);

        this.setHeight();
    };

    ////////////////////////////
    // bind interactions here
    ////////////////////////////
    MySlideshow.prototype.bindEvents = function() {
        // body...
        // console.log('stuff', this.jqslideshowItem);

        jq(window).load(function(){
            this.init();
        }.bind(this));

        var that = this;

        this.jqrightButton.on("click",function(){
            this.moveForward();
        }.bind(this));

        this.jqleftButton.on("click",function(){
            this.moveBack();
        }.bind(this));


        var hammertime = new Hammer(this.jqslideshowContainer[0]);

        hammertime.get('swipe').set({ threshold: .1, velocity: .1 });

        var that = this; // needed for hammer?

        hammertime.on('swipeleft swiperight', function(event){

            if (event.type == 'swipeleft') {
                that.moveForward();
            } else if (event.type == 'swiperight') {
                that.moveBack();
            }


            //runs onorientationchange when orientation changes or resizes as fallback
            if("onorientationchange" in window) {
                // console.log('me')
                window.addEventListener("orientationchange", this.reset, false);
            }  else if ("matchMedia" in window) {
            // Listen for resize changes
                // console.log('same')
                window.addEventListener("resize", this.reset, false);
            }
        });

        // this.jqslideshowContainer.on("click",function(){
        //     console.log("click");
        // }.bind(this));



        jq( window ).resize(function() {
            that.reset();
        });


    };

    return MySlideshow; 

})();

var slideShow1 = new MySlideshow(jq(".slideshow-one"));
var slideShow2 = new MySlideshow(jq(".slideshow-two"));
var slideShow3 = new MySlideshow(jq(".slideshow-three"));


///////////////////////
//    ORIENTATION 
///////////////////////

//runs onorientationchange when orientation changes or resizes as fallback
if("onorientationchange" in window) {
    window.addEventListener("orientationchange", resetTop, false);
}  else if ("matchMedia" in window) {
// Listen for resize changes
    // console.log('same')
    window.addEventListener("resize", resetTop, false);
}


function resize(){
    windowWidth = jqwindow[0].innerWidth;
    windowHeight = jqwindow[0].innerHeight;

    //jqel.topFrame.css({height: windowHeight-106});
    //jqel.content.css({marginTop: windowHeight-106});

    jqel.content.find('.cat-images-title').each(function(index,value){
        var imgHeight = jq(value).find('img').height();
        var captionHeight = jq(value).find('.caption').outerHeight();
        jq(value).height(imgHeight+captionHeight);
    });

    jqel.content.find('.cat-images-grid').each(function(index,value){
        var imgHeight = jq(value).find('img').height();
        jq(value).height(imgHeight);
    });
    
    jqel.content.find('.cat-caption').each(function(index,value){
        var textHeight = jq(value).find('.big-text').innerHeight();
        jq(value).height(textHeight);
    });
    
    jqel.content.find('.cat-images-big').each(function(index,value){
       
        var imgHeight = jq(value).find('img').height();
        var captionHeight = jq(value).find('.caption').outerHeight();
        jq(value).height(imgHeight+captionHeight);

    });

}

function resetTop() {

    windowWidth = jqwindow[0].innerWidth;
    windowHeight = jqwindow[0].innerHeight;

    //jqel.content.css({top: windowHeight});

    // NEED 300ms SETTIMEOUT FOR PHONE TO FINISH GETTING ORIENTATION
    // SOMETIMES THIS DOES NOT HAPPEN AUTOMATICALLY
    setTimeout(function(){

        var orientation = 90;

        if("matchMedia" in window){
            var mql = window.matchMedia("(orientation: portrait)");
            if(!mql.matches) orientation = 90;
            else orientation = 0;
        }

        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;

        jqel.topFrame.css({height: jqwindow.innerHeight()-100});
        // jqel.slideshowContainer.css({'min-height': windowHeight});
    }, 200);

};

    Array.prototype.remove = function() {
        var what, a = arguments, L = a.length, ax;
        while (L && this.length) {
            what = a[--L];
            while ((ax = this.indexOf(what)) !== -1) {
                this.splice(ax, 1);
            }
        }
        return this;
    };

});

    (function() {
        var lastTime = 0;
        var vendors = ['webkit', 'moz'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame =
              window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                  timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
    }());