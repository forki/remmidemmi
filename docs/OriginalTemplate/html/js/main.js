function getScrollBarDimensions(){
    var elm = document.documentElement.offsetHeight ? document.documentElement : document.body,

        curX = elm.clientWidth,
        curY = elm.clientHeight,

        hasScrollX = elm.scrollWidth > curX,
        hasScrollY = elm.scrollHeight > curY,

        prev = elm.style.overflow,

        r = {
            vertical: 0,
            horizontal: 0
        };


    if( !hasScrollY && !hasScrollX ) {
        return r;
    }

    elm.style.overflow = "hidden";

    if( hasScrollY ) {
        r.vertical = elm.clientWidth - curX;
    }

    if( hasScrollX ) {
        r.horizontal = elm.clientHeight - curY;
    }
    elm.style.overflow = prev;


    return r;
}
$(document).ready(function(){
    "use strict";
    // Notes slider
    var e = 1;
    var HH = 0;
    $(".content-rotator > div").each(function(){
        var H = $(this).height();
        if(H > HH){
            HH = H;
        }
    });
    $(".content-rotator > div").each(function(){
        $(this).height(HH);
    });
    $(".content-rotator").height(HH);
    var c = $(".content-rotator").children().length;
    var f = $(".content-rotator div:nth-child(1)");
    setInterval(function () {
        var h = e * -HH;
        f.css("margin-top", h + "px");
        if (e === c) {
            f.css("margin-top", "0px");
            e = 1;
        } else {
            e++;
        }
    }, 2000);

    // set preview screen sizes

    var psw = $(window).width();
    var psh = $(window).height();
    $('header').height(psh).width(psw);
    $(window).bind('orientationchange throttledresize',function(){
        var psw = $(window).width();
        var psh = $(window).height();
        $('header').height(psh).width(psw);
    });

    // set nav boxes
    var cw = $('.container').width();
    var bc = $('#nav-boxes div a').length;
    var bw = 100 / bc;
    $('#nav-boxes div a').css('width', bw +'%');

    // nav box hover
    $('#nav-boxes a').hover(function(){
        $(this).find('i').addClass('animated flipInY');
    },function(){
        $(this).find('i').removeClass('animated flipInY');
    });

    //nav scroll
    $('#nav-boxes a, .logo a, #nav a, #navmobile ul a').scrollTo({ duration: 'slow' });
    $('#nav a').click(function(){
        var links = $('#nav a');
        if(!$(this).hasClass('clicked')){
            links.removeClass('clicked');
            $(this).addClass('clicked');
        }
    });

    $('.menutrigger').click(function(){
        if($(this).hasClass('open')){
            $(this).removeClass('open');
            $(this).next().slideUp('normal');
        }
        else {
            $(this).next().slideDown('normal');
            $(this).addClass('open');
        }
    });

    //a tooltip
    $('.social a').tooltip();

    //lazy loading
    $('.ll').lazyload({
            effect : "fadeIn"
    });
    $('.lp').lazyload({
        effect : "fadeIn",
        event: 'getit'
    });
    $(window).bind("load", function() {
        var timeout = setTimeout(function() {$("img.lp").trigger("getit")}, 1000);
    });

    //sticky header
    $('.stickybox, #pages, #mob-header').affix({
        offset: {
            top: function() {
                return $(window).height()-1;
            }
        }
    });

    // portfolio
    $('#trigger_portfolio').click(function(){
        if($(this).hasClass('active')){
            $('#filters li').removeClass('animated fadeInRight');
            $('#filters li').addClass('animated fadeOutLeft');
            $('#filters').fadeOut('normal');
            $(this).removeClass('active');
        }
        else {
            $(this).addClass('active');
            $('#filters').fadeIn('normal');
            $('#filters li').removeClass('animated fadeOutLeft');
            $('#filters li').addClass('animated fadeInRight');
        }
        return false;
    });

    $('.mix').hover(function(){
        $(this).addClass('flip');
        $(this).find('.zoom').addClass('animated fadeInDown');
        $(this).find('h2').addClass('animated fadeInDown');
    }, function(){
        $(this).removeClass('flip');
        $(this).find('.zoom').removeClass('animated fadeInDown');
        $(this).find('h2').removeClass('animated fadeInDown');
    });
    $('.zoom').hover(function(){
        $(this).animate({top: -10},300);
    },function(){
        $(this).animate({top: 0},300);

    });
    $(window).load(function(){
        var $container = jQuery('#container');
        $container.isotope('reLayout');
    });
    $(window).bind('orientationchange debouncedresize', function(){
        var $container = jQuery('#container');
        $container.isotope('reLayout');
    });

    // form
    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    $('#cfmailer').submit(function() {
        var a = $(this).find('input[name="name"]').val();
        var b = $(this).find('input[name="email"]').val();
        var c = $(this).find('textarea[name="msg"]').val();
        if (a == "") {
            alert("Type your name please!");
            return false;
        }
        if (validateEmail(b)) {
        } else {
            alert("Type your email correctly please!");
            return false;
        }
        if (c == "") {
            alert("Type your message please!");
            return false;
        }
        else {
            $.ajax({
                type: $(this).attr('method'),
                url: $(this).attr('action'),
                data: $(this).serialize(),
                success: function (data) {
                    alert(data);
                }
            });

            return false;
        }
    });
});
$(function(){

    var $container = $('#container');

    $container.isotope({
        itemSelector : '.mix',
        masonry: {
            columnWidth: $container.width/12
        }
    });


    var $optionSets = $('#options .option-set'),
        $optionLinks = $optionSets.find('a');

    $optionLinks.click(function(){
        var $this = $(this);
        // don't proceed if already selected
        if ( $this.hasClass('selected') ) {
            return false;
        }
        var $optionSet = $this.parents('.option-set');
        $optionSet.find('.selected').removeClass('selected');
        $this.addClass('selected');

        // make option object dynamically, i.e. { filter: '.my-filter-class' }
        var options = {},
            key = $optionSet.attr('data-option-key'),
            value = $this.attr('data-option-value');
        // parse 'false' as false boolean
        value = value === 'false' ? false : value;
        options[ key ] = value;
        if ( key === 'layoutMode' && typeof changeLayoutMode === 'function' ) {
            // changes in layout modes need extra logic
            changeLayoutMode( $this, options )
        } else {
            // otherwise, apply new options
            $container.isotope( options );
        }

        return false;
    });


});
