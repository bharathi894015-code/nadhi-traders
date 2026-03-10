const fs = require('fs');

const files = [
    'public/index.html',
    'public/products.html',
    'public/product-detail.html',
    'public/cart.html',
    'public/checkout.html',
    'public/order-success.html'
];

const newHtml = `<img src="/images/logo.png" alt="Nadhi Traders Logo" style="height:54px;width:auto;object-fit:contain;">
        <div class="nav-logo-text">
          <h2>NADHI TRADERS</h2>
          <span>Premium Dry Fruits & Seeds</span>
        </div>`;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    // Replace the image tag with the image + text container
    content = content.replace(/<img src="\/images\/logo\.png".*?>/, newHtml);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed: ' + file);
});
