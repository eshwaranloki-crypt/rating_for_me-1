document.addEventListener('DOMContentLoaded', () => {
      const form = document.getElementById('feedbackForm');
      const submitBtn = document.getElementById('submitBtn');
      const btnText = submitBtn.querySelector('span');
      const spinner = submitBtn.querySelector('.spinner');
      const statusMessage = document.getElementById('statusMessage');

                              form.addEventListener('submit', async (e) => {
                                        e.preventDefault();

                                                            // Basic validation check
                                                            const name = document.getElementById('name').value.trim();
                                        const email = document.getElementById('email').value.trim();
                                        const rating = document.querySelector('input[name="rating"]:checked');
                                        const experience = document.getElementById('experience').value.trim();

                                                            if (!name || !email || !rating) {
                                                                          showStatus('Please fill out all required fields.', 'error');
                                                                          return;
                                                            }

                                                            // Prepare data
                                                            const payload = {
                                                                          name,
                                                                          email,
                                                                          rating: parseInt(rating.value, 10),
                                                                          experience
                                                            };

                                                            // UI Loading State
                                                            submitBtn.disabled = true;
                                        btnText.textContent = 'Submitting...';
                                        spinner.classList.remove('hidden');
                                        statusMessage.classList.add('hidden');

                                                            try {
                                                                          // Make POST request to backend
                                            const response = await fetch('/submit-feedback', {
                                                              method: 'POST',
                                                              headers: {
                                                                                    'Content-Type': 'application/json'
                                                              },
                                                              body: JSON.stringify(payload)
                                            });

                                            const data = await response.json();

                                            if (response.ok) {
                                                              showStatus(data.message || 'Feedback submitted successfully!', 'success');
                                                              form.reset(); // Clear the form
                                            } else {
                                                              showStatus(data.error || 'Failed to submit feedback.', 'error');
                                            }
                                                            } catch (error) {
                                                                          console.error('Error:', error);
                                                                          showStatus('A network error occurred. Please try again.', 'error');
                                                            } finally {
                                                                          // Reset UI State
                                            submitBtn.disabled = false;
                                                                          btnText.textContent = 'Submit Feedback';
                                                                          spinner.classList.add('hidden');
                                                            }
                              });

                              function showStatus(message, type) {
                                        statusMessage.textContent = message;
                                        statusMessage.className = `status-message ${type}`;
                                        statusMessage.classList.remove('hidden');
                              }
});
