/*!
 * Start Bootstrap - Creative Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

(function($) {
  "use strict"; // Start of use strict

  // jQuery for page scrolling feature - requires jQuery Easing plugin
  $('a.page-scroll').bind('click', function(event) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top - 50)
    }, 1250, 'easeInOutExpo');
    event.preventDefault();
  });

  // Highlight the top nav as scrolling occurs
  $('body').scrollspy({
    target: '.navbar-fixed-top',
    offset: 51
  })

  // Closes the Responsive Menu on Menu Item Click
  $('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
  });

  // Fit Text Plugin for Main Header
  $("h1").fitText(
    1.2, {
      minFontSize: '35px',
      maxFontSize: '50px'
    }
  );

  // Offset for Main Navigation
  $('#mainNav').affix({
    offset: {
      top: 100
    }
  })

  // Initialize WOW.js Scrolling Animations
  new WOW().init();

  var clipboard = new Clipboard('[data-clipboard-target="#urlinput"]');
  clipboard.on('success', function(e) {
    console.log(e);
    $(e.trigger).text('Copied!');
});

  $('input[name=url]').focus();

  $('input[name=url]').on('keyup', function(e){
    var hash = ($(this).val().match(/https:\/\/docs\.google\.com\/document\/d\/(.+)\/pub/) || $(this).val().match(/http:\/\/gdoc\.pub\/(.+)/) || [])[1];
    if (hash) {
      $(this).val('http://gdoc.pub/'+hash);
      $(this).select();
      $('.docview').addClass('unrolled').find('a').attr('href', '/'+hash);
      $('.wrongurl').removeClass('unrolled');
      $(this).addClass('success');
    } else {
      $(this).removeClass('success');
      $('.docview').removeClass('unrolled');
      if ($(this).val().length > 3) {
        $('.wrongurl').addClass('unrolled');
      } else {
        $('.wrongurl').removeClass('unrolled');
      }
    }
  });

  $('.img-loop').each(function(i, el){

    var toggleFade = function() {
      if ($(el).find('.before').is(":visible")) {
        $(el).find('.before').fadeOut();
        $(el).find('.after').fadeIn();
        $(el).find('.btn-before').removeClass('btn-primary');
        $(el).find('.btn-after').addClass('btn-primary');
      } else {
        $(el).find('.before').fadeIn();
        $(el).find('.after').fadeOut();        
        $(el).find('.btn-after').removeClass('btn-primary');
        $(el).find('.btn-before').addClass('btn-primary');
      }
    };
    setTimeout(function(){
      toggleFade();
      setInterval(toggleFade, 4500);
    }, i*1500);
  });

})(jQuery); // End of use strict
