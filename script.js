// Store bookings in localStorage
let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

// Show active section and hide others
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    showSection('bookings');
    displayBookings();
    updateReports();
});

// Handle form submission
document.getElementById('bookingForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const booking = {
        id: Date.now(),
        buyerName: document.getElementById('buyerName').value,
        date: document.getElementById('bookingDate').value,
        ticketName: document.getElementById('ticketName').value,
        airlineName: document.getElementById('airlineName').value,
        originalPrice: parseFloat(document.getElementById('originalPrice').value),
        interestRate: parseFloat(document.getElementById('interestRate').value),
        hotelName: document.getElementById('hotelName').value,
        hotelPrice: parseFloat(document.getElementById('hotelPrice').value),
        finalPrice: calculateFinalPrice(
            parseFloat(document.getElementById('originalPrice').value),
            parseFloat(document.getElementById('interestRate').value)
        )
    };

    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    e.target.reset();
    showSection('bookings');
    displayBookings();
    updateReports();
});

// Calculate final price with interest
function calculateFinalPrice(originalPrice, interestRate) {
    return originalPrice * (1 + interestRate / 100);
}

// Display bookings
function displayBookings(filteredBookings = null) {
    const bookingsList = document.getElementById('bookingsList');
    const displayData = filteredBookings || bookings;

    bookingsList.innerHTML = displayData.map(booking => `
        <div class="booking-card">
            <h3>${booking.buyerName}</h3>
            <p>Date: ${new Date(booking.date).toLocaleDateString()}</p>
            <p>Ticket: ${booking.ticketName}</p>
            <p>Airline: ${booking.airlineName}</p>
            <p>Original Price: $${booking.originalPrice.toFixed(2)}</p>
            <p>Final Price: $${booking.finalPrice.toFixed(2)}</p>
            <p>Hotel: ${booking.hotelName}</p>
            <p>Hotel Price: $${booking.hotelPrice.toFixed(2)}</p>
            <button onclick="deleteBooking(${booking.id})">Delete</button>
        </div>
    `).join('');
}

// Delete booking
function deleteBooking(id) {
    if (confirm('Are you sure you want to delete this booking?')) {
        bookings = bookings.filter(booking => booking.id !== id);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        displayBookings();
        updateReports();
    }
}

// Search functionality
document.getElementById('searchInput').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredBookings = bookings.filter(booking =>
        booking.buyerName.toLowerCase().includes(searchTerm)
    );
    displayBookings(filteredBookings);
});

// Sorting functionality
document.getElementById('dateFilter').addEventListener('change', (e) => {
    const sortedBookings = [...bookings].sort((a, b) => {
        return e.target.value === 'newest'
            ? new Date(b.date) - new Date(a.date)
            : new Date(a.date) - new Date(b.date);
    });
    displayBookings(sortedBookings);
});

document.getElementById('priceFilter').addEventListener('change', (e) => {
    const sortedBookings = [...bookings].sort((a, b) => {
        return e.target.value === 'highest'
            ? b.finalPrice - a.finalPrice
            : a.finalPrice - b.finalPrice;
    });
    displayBookings(sortedBookings);
});

// Update reports
function updateReports() {
    const totalRevenue = bookings.reduce((sum, booking) =>
        sum + booking.finalPrice + booking.hotelPrice, 0);

    const totalProfit = bookings.reduce((sum, booking) =>
        sum + (booking.finalPrice - booking.originalPrice), 0);

    document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
    document.getElementById('totalProfit').textContent = `$${totalProfit.toFixed(2)}`;
    document.getElementById('totalBookings').textContent = bookings.length;
}

// Generate report for specific date range
function generateReport() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    const filteredBookings = bookings.filter(booking =>
        booking.date >= startDate && booking.date <= endDate
    );

    const totalRevenue = filteredBookings.reduce((sum, booking) =>
        sum + booking.finalPrice + booking.hotelPrice, 0);

    const totalProfit = filteredBookings.reduce((sum, booking) =>
        sum + (booking.finalPrice - booking.originalPrice), 0);

    document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
    document.getElementById('totalProfit').textContent = `$${totalProfit.toFixed(2)}`;
    document.getElementById('totalBookings').textContent = filteredBookings.length;
}

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
        // Add your logout logic here
        window.location.href = 'login.html'; // Redirect to login page
    }
});
