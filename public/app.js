const listingsGrid = document.getElementById('listings-grid');
const donationForm = document.getElementById('donation-form');
const refreshBtn = document.getElementById('refresh-btn');

async function fetchListings() {
  try {
    const res = await fetch('/api/listings');
    const listings = await res.json();
    renderListings(listings);
  } catch (err) {
    console.error('Failed to fetch listings:', err);
  }
}

function renderListings(listings) {
  listingsGrid.innerHTML = '';
  if (!listings || listings.length === 0) {
    listingsGrid.innerHTML = '<p style="color: var(--muted);">No active food donations right now.</p>';
    return;
  }

  listings.forEach((item) => {
    const card = document.createElement('div');
    const isClaimed = item.status === 'claimed';
    card.className = `card item-card ${isClaimed ? 'claimed' : ''}`;
    
    card.innerHTML = `
      <div>
        <span class="tag">${item.category}</span>
        <h3 style="margin-bottom:0.4rem;">${item.food_name}</h3>
        <p><strong>Donor:</strong> ${item.donor_name}</p>
        <p><strong>Quantity:</strong> ${item.quantity}</p>
        <p><strong>Address:</strong> ${item.pickup_address}</p>
        <p><strong>Expires in:</strong> ${item.expires_in_hours} hours</p>
      </div>
      <div>
        ${isClaimed 
          ? `<button class="btn" style="background:#cbd5e1; width:100%; margin-top:1rem; cursor:not-allowed;" disabled>Claimed</button>`
          : `<button class="btn btn-claim" onclick="claimItem(${item.id})">Claim for Shelter</button>`
        }
      </div>
    `;
    listingsGrid.appendChild(card);
  });
}

async function claimItem(id) {
  try {
    const res = await fetch(`/api/listings/${id}/claim`, { method: 'PATCH' });
    if (res.ok) fetchListings();
  } catch (err) {
    console.error('Error claiming listing:', err);
  }
}

donationForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    food_name: document.getElementById('food_name').value,
    donor_name: document.getElementById('donor_name').value,
    category: document.getElementById('category').value,
    quantity: document.getElementById('quantity').value,
    pickup_address: document.getElementById('pickup_address').value,
    expires_in_hours: parseInt(document.getElementById('expires_in_hours').value, 10),
  };

  const res = await fetch('/api/listings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    donationForm.reset();
    fetchListings();
  }
});

refreshBtn.addEventListener('click', fetchListings);
window.onload = fetchListings;