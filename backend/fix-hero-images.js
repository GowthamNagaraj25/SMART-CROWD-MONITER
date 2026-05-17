const fs = require('fs');

let code = fs.readFileSync('server.js', 'utf8');

// Using only the URLs that we KNOW work for sure based on the user's feedback
const imgs = [
    "https://unsplash.com/photos/a-view-of-a-body-of-water-from-a-beach-PprWtQ_DnWM", // 1 Marina Beach (WORKS)
    "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80", // 2 Kapaleeshwarar (WORKS)
    "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80", // 3 Mahabalipuram (REUSED TEMPLE)
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80", // 4 Ooty (WORKS)
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", // 5 Elliot's Beach (REUSED BEACH)
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80", // 6 Kodaikanal (REUSED NATURE)
    "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80", // 7 Meenakshi (REUSED TEMPLE 2)
    "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&q=80", // 8 Covelong (REUSED BEACH 2)
    "https://images.unsplash.com/photo-1444492417251-9c84a5fa18e0?w=800&q=80", // 9 Vedanthangal (WORKS)
    "https://images.unsplash.com/photo-1444492417251-9c84a5fa18e0?w=800&q=80", // 10 Yercaud (REUSED NATURE 2)
    "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80", // 11 Rameswaram (WORKS)
    "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&q=80", // 12 Pichavaram (WORKS)
];

let i = 0;
code = code.replace(/hero:\s*['"].*?['"],/g, () => {
    let img = imgs[i % imgs.length];
    i++;
    return `hero: '${img}',`;
});

fs.writeFileSync('server.js', code);
console.log('Fixed hero images again!');
