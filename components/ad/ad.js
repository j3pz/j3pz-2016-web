$(document).ready(function() {
  $('#custom-ad-1').click(function() {
    console.log(2);
    ga('send', 'event', 'Ad', 'click', 'building', 1);
  });
});