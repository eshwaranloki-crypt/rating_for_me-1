document.getElementById('rating-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const characterName = document.getElementById('character-name').value;
  const rating = document.getElementById('rating').value;
  const feedback = document.getElementById('feedback').value;
  const response = await fetch('/submit-rating', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ characterName, rating, feedbck })
  });
  if (response.ok) {
    alert('Rating submitted successfully!');
    document.getElementById('rating-form').reset();
  } else {
    alert('Failed to submit rating.');
  }
});
