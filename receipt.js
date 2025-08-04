document.addEventListener("DOMContentLoaded", () => {
    const receiptDataString = localStorage.getItem('purchaseReceipt');
    const receiptContainer = document.querySelector('.receipt-container');

    if (!receiptDataString) {
        receiptContainer.innerHTML = `
            <h1>No Receipt Found</h1>
            <p>We couldn't find any purchase data. Please return to the homepage.</p>
            <a href="index.html" class="button-link">Back to Home</a>
        `;
        return;
    }

    const receiptData = JSON.parse(receiptDataString);

    // Populate Order Details
    document.getElementById('receipt-order-number').textContent = receiptData.orderNumber;
    document.getElementById('receipt-order-date').textContent = receiptData.orderDate;

    // Populate Customer Info
    document.getElementById('receipt-customer-name').textContent = receiptData.user.name;
    document.getElementById('receipt-customer-email').textContent = receiptData.user.email;
    document.getElementById('receipt-customer-phone').textContent = receiptData.user.phone;

    // Populate Vehicle Details
    const car = receiptData.car;
    document.getElementById('receipt-car-details').innerHTML = `
        <p><strong>Model:</strong> ${car.name || 'N/A'}</p>
        <p><strong>Price:</strong> $${car.price || 'N/A'}</p>
    `;

    // Populate Payment Summary
    document.getElementById('receipt-subtotal').textContent = receiptData.summary.subtotal;
    document.getElementById('receipt-tax').textContent = receiptData.summary.tax;
    document.getElementById('receipt-total').textContent = receiptData.summary.total;

    // Populate Payment Method
    document.getElementById('receipt-payment-method').textContent = receiptData.paymentMethod;

    // Handle Print Button
    const printBtn = document.getElementById('print-receipt-btn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // Clear the data from localStorage after displaying it
    localStorage.removeItem('purchaseReceipt');
});