$(document).ready(function() {
  var roll = Math.random();
  if (roll < 50) {
    $('#google-ad').hide();
    $('#custom-ad-1').show();
    $('#custom-ad-1').click(function() {
      ga('send', 'event', 'Ad', 'click', 'building', 1);
    });
  }
});