document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('checkAccountButton').addEventListener('click', () => {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const pwd = document.getElementById('password').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const responseDiv = document.getElementById('response');

        // Basic validation for email and phone number
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            responseDiv.innerHTML = '<p style="color:red;">Please enter a valid email address.</p>';
            return;
        }

        const phonePattern = /^\d{10}$/; 
        if (!phonePattern.test(phone)) {
            responseDiv.innerHTML = '<p style="color:red;">Please enter a valid 10-digit phone number.</p>';
            return;
        }

        // Clear previous response
        responseDiv.innerHTML = '';

        // If validation passes, send data to the server
        fetch('/check-account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, phone, pwd })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok. Status: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('Server response:', data);
            
            if (data && data.success) {
                const accountInfo = data.data; 
                localStorage.setItem("accInfo", accountInfo);
                responseDiv.innerHTML = `
                    <h2>Account Details</h2>
                    <p><strong>Customer ID:</strong> ${accountInfo.customer_id}</p>
                    <p><strong>Name:</strong> ${accountInfo.name}</p>
                    <p><strong>Phone Number:</strong> ${accountInfo.phone_number}</p>
                    <p><strong>Owed Balance:</strong> $${accountInfo.owed_balance}</p>
                    <p><strong>Payment Method:</strong> ${accountInfo.payment_method}</p>
                    <p><strong>Email:</strong> ${accountInfo.email}</p>
                    <p><strong>Plan Name:</strong> ${accountInfo.plan_name}</p>
                    <p><strong>Plan Type:</strong> ${accountInfo.plan_type}</p>
                    <p><strong>Price:</strong> $${accountInfo.price}/month</p>
                    <p><strong>Features:</strong> ${accountInfo.features}</p>
                    <button type="button" id="makePaymentButton" style="color: white; background-color: #007bff;">Make Payment</button>
                `;
                document.getElementById('makePaymentButton').addEventListener('click', () => {
                    window.location.href = "http://localhost:3000/payment.html";
                });
            } else {
                responseDiv.innerHTML = '<p style="color:red;">An error occurred: Invalid account information.</p>';
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            responseDiv.innerHTML = `<p style="color:red;">An error occurred: ${error.message}</p>`;
        });
    });
});
