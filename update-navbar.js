const fs = require('fs');

const files = [
    'public/index.html',
    'public/products.html',
    'public/product-detail.html',
    'public/cart.html',
    'public/checkout.html',
    'public/order-success.html'
];

const newLogoTag = '<img src="/images/logo.png" alt="Nadhi Traders" style="height:54px;width:auto;object-fit:contain;">';
const adminBtn = '\n        <li><a href="/admin/login.html" class="admin-nav-btn">&#128274; Admin</a></li>';

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Replace emoji logo-icon + nav-logo-text div with real img tag
    content = content.replace(/<span class="logo-icon">[\s\S]*?<\/span>\s*<div class="nav-logo-text">[\s\S]*?<\/div>/g, newLogoTag);

    // 2. Inject admin button before closing </ul> of nav-links (if not already there)
    if (!content.includes('admin-nav-btn')) {
        // Find the nav-links closing </ul>
        content = content.replace(/(<\/ul>\s*<\/div>\s*<\/nav>)/, adminBtn + '\n      </ul>\n    </div>\n  </nav>');
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated: ' + file);
});

console.log('\nAll done!');
