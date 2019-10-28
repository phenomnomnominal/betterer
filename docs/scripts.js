document.addEventListener('DOMContentLoaded', () => { 
  const learnMore = document.getElementById('learn-more');
  const what = document.getElementById('what');
  learnMore.addEventListener('click', () => {
    window.scroll(0, what.offsetTop);
  });
});

