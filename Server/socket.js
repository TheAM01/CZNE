import db from "./db.js";

let print = (...args) => {
    console.log(args);
}

function socketHandler(socket, io, dir) {

    // socket functions below

    socket.on("log", print);

    socket.on("home_products", async (data) => {

        const products = await makeProducts();
        io.to(socket.id).emit("home_products", products);

    });

    socket.on("product", async (pr) => {

        const product = await db.collection('cars')
            .findOne({id: pr.toLowerCase()});

        if (!product) return io.to(socket.id).emit("product", 404);
        io.to(socket.id).emit("product", {data: product, authenticated: !!socket.request.session.authenticated});

    });

    socket.on("get_categories", async (data) => {

        const products = await makeProducts();
        let categories = [];
        products.forEach(p => {
            if (categories.includes(p.category.toLowerCase())) return;
            categories.push(p.category.toLowerCase())
        });
        io.to(socket.id).emit("get_categories", categories);

    });

    socket.on('log', async (data) => {
        const logger = (logData => console.log)();
        logger(data);
    })

    socket.on("get_category", async (data) => {

        const matches = await db.collection('cars')
            .find({category: data})
            .toArray();

        io.to(socket.id).emit("get_category", matches);

    });

    socket.on("products_list", async (data) => {
        const products = await makeProducts();
        const arr = [];
        products.forEach(p => {
            arr.push(p.id);
        });
        io.to(socket.id).emit("products_list", arr);

    });

    socket.on("get_ad", async (data) => {

        const ads = await db.collection("ads").find({}).toArray();
        const random = ads[Math.floor(Math.random() * ads.length)];
        io.to(socket.id).emit("get_ad", random)

    });

    socket.on('recents', async () => {
        const recents = await db.collection('transactions').find({}).toArray();
        recents.reverse();
        for (const recent of recents) {
            recent.data = await db.collection('cars').findOne({id: recent.id});
        }
        io.to(socket.id).emit('recents', recents);
    });

    socket.on('account_details', async () => {
        const recentPurchases = await db.collection('transactions').find({user: socket.request.session.user.username}).toArray();
        recentPurchases.reverse();
        for (const recent of recentPurchases) {
            recent.data = await db.collection('cars').findOne({id: recent.id});
        }
        io.to(socket.id).emit('account_details', {profile: socket.request.session.user, recentPurchases});
    });

    socket.on('check_authentication', () => {
        console.log(!!socket.request.session.authenticated)
        io.to(socket.id).emit('check_authentication', !!socket.request.session.authenticated);
    });

    socket.on('cart', async (cart) => {
        for (const item of cart) {
            const matched = await db.collection('cars').findOne({id: item.id});
            if (!matched) return cart.splice(cart.indexOf(item)-1, 1);
            item.details = matched;
        }
        io.to(socket.id).emit('cart', {authenticated: !!socket.request.session.authenticated, cart});
    });

    socket.on('search_results', async searchQuery => {
        const collection = db.collection('cars');

        const results = await collection.find({name: {$regex: new RegExp(searchQuery, 'i')}}).toArray();
        io.to(socket.id).emit('search_results', {authenticated: !!socket.request.session.authenticated, results});

    });

}

function sorter(a, b) {
    return b.reviews.length - a.reviews.length
}

async function makeProducts() {

    const productsRaw = await db.collection('cars').find({}).toArray();

    return productsRaw.sort(sorter);

}

export default socketHandler