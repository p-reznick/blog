$(function() {
  var $copyLinks = $('.copy_link');

  $copyLinks.on('click', function(e) {
    e.preventDefault();
    document.getSelection().removeAllRanges()

    var range = document.createRange();
    var url = $(this).prev('.cdn')[0];
    var selection = document.getSelection();

    range.selectNode(url);
    selection.addRange(range);

    document.execCommand('copy');
  });
});
