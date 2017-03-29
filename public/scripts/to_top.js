$(document).ready(function() {
  scrollToTop();
});

function scrollToTop() {
  $('h1').on('click', function(e) {
    if (!atTop()) {
      $(document).scrollTop(0);
    }
  });

  $('h1').on('mouseenter', function() {
    if (!atTop()) {
      $(this).addClass('hovered');
    }
  });

  $('h1').on('mouseleave', function() {
      $(this).removeClass('hovered');
  });
}

function atTop() {
  console.log('at top');
  return $(document).scrollTop() == 0;
}