$(document).ready(function() {
  $('h1').on('click', function(e) {
    $(document).scrollTop(0);
  });

  $('h1').on('mouseenter', function() {
    $(this).toggleClass('hovered');
  });

  $('h1').on('mouseleave', function() {
    $(this).toggleClass('hovered');
  });
});
