var learnMore = document.getElementById('learn-more');
var what = document.getElementById('what');
learnMore.addEventListener('click', function() {
  window.scroll(0, what.offsetTop);
});
