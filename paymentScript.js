document.addEventListener('DOMContentLoaded', () => {
    // Retrieve account info from localStorage
    const accountInfo = JSON.parse(localStorage.getItem("accInfo"));
    console.log('Account Info:', accountInfo);

    // Handle form submission
    document.getElementById('paymentForm').addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent form from submitting traditionally

        // Gather payment details
        const cardNumber = document.getElementById('cardNumber').value.trim();
        const expiryDate = document.getElementById('expiryDate').value.trim();
        const cvc = document.getElementById('cvc').value.trim();
        const paymentAmount = parseFloat(document.getElementById('paymentAmount').value.trim());

        // Basic client-side validation
        if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
            alert("Please enter a valid 16-digit card number.");
            return;
        }
        console.log("Card:", cardNumber);

        if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiryDate)) {
            alert("Please enter a valid expiration date (MM/YY).");
            return;
        }
        console.log("Exp date:", expiryDate);

        if (!/^\d{3}$/.test(cvc)) {
            alert("Please enter a valid 3-digit CVC.");
            return;
        }
        console.log("CVC: ", cvc);

        // Check if payment amount exceeds the owed balance
        // Display successful submission message in a styled manner
        document.getElementById('paymentResponse').innerHTML = `
            <div class="response-message">
                <h2>Payment Successful</h2>
                <p>Your payment of <strong>$${paymentAmount.toFixed(2)}</strong> has been submitted successfully.</p>
            </div>
        `;

        // Optionally clear the form
        document.getElementById('paymentForm').reset();
    });
});

// Function to format card number with spaces
function formatCardNumber(input) {
    const value = input.value.replace(/\D/g, '');
    const formattedValue = value.match(/.{1,4}/g) ? value.match(/.{1,4}/g).join(' ') : '';
    input.value = formattedValue;
}

// Function to update account balance on page load

// Function to update account balance on page load
function updateAccountBalance() {
    // Retrieve account info from localStorage
    const accountInfo = JSON.parse(localStorage.getItem("accInfo"));

    // Check if accountInfo exists
    if (accountInfo && accountInfo.owed_balance) {
        // Update the owedBalance span with the owed balance from local storage
        document.getElementById('owedBalance').innerText = accountInfo.owed_balance.toFixed(2); // Format to 2 decimal places
        
        // Set the max attribute of the payment amount input
        document.getElementById('paymentAmount').max = accountInfo.owed_balance;
    } else {
        console.error("Account information not found in localStorage.");
    }
}

// Call the function to update balance when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', updateAccountBalance);

// Call the function to update balance when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', updateAccountBalance);
