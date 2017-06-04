$(document).ready(function() {
  addListeners();
});

function addListeners() {
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
  return $(document).scrollTop() == 0;
}
