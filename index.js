import http from 'http';
import path from "path";
import express from "express";
import { Server } from "socket.io";
import bodyParser from 'body-parser';
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";

import createRoutes from "./Server/routes.js";
import socketHandler from './Server/socket.js';
import db from "./Server/db.js";


const app = express();
const dir = path.resolve();
const jsonParser = bodyParser.json();
const server = http.createServer(app);
const port = process.env.PORT || 2000 || 2001;
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const sessionMiddleware = session({
    secret: "WAHOOOO",
    resave: false,
    saveUninitialized: true,
    cookie: {},
    store: MongoStore.create({ mongoUrl: `mongodb+srv://saste-nashe-main:${process.env.MONGO_PASSWORD}@saste-nashe-db.xlhdm.mongodb.net/?retryWrites=true&w=majority&appName=saste-nashe-db` })
});

app.use(jsonParser);
app.use(urlencodedParser);
app.use(cookieParser());
app.use(sessionMiddleware);

const io = new Server(server);

io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res || {}, next);
});

io.on('connection', (socket) => {
    socketHandler(socket, io, dir);
});

createRoutes(app, dir);

server.listen(port, async () => {
    console.clear();
    console.log(`Listening on port:\x1b[33m ${port}\x1b[0m`);

    return

    await db.collection("cars").insertMany([
        {
            "id": "chiron",
            "name": "Bugatti Chiron RC",
            "price": "19500",
            "thumbnail": "https://i.ibb.co/23mLVdSM/chiron.jpg",
            "category": "Hypercars",
            "content": [
                "1x Bugatti Chiron RC 16x4.2inch",
                "1x Dual-Mode Speed Controller",
                "1x 100W Turbo USB-C Charger",
                "1x Wind Tunnel Aero Diffuser Kit",
                "1x CZNE display-grade polish cloth",
                "1x CZNE branding sticker sheet"
            ],
            "description": "Introducing the Bugatti Chiron RC — a hypercar reborn in precision RC form. Hand-assembled and engineered for unmatched performance, the Chiron RC captures the spirit of the original beast with a smooth matte body, aggressive stance, and lightning-fast internals.\n\nFrom the quad-LED headlights to the sculpted diffuser, every detail screams luxury and velocity. The RC version is tuned to perfection, delivering elite-tier control, blazing speed, and head-turning aesthetics. Whether you're carving up your driveway or showcasing it on your desk, the Chiron RC makes a bold statement: you're playing in the big leagues now.\n\nA true marvel for collectors and thrill-seekers alike.",
            "reviews": [
                {
                    "author": "Rayan S.",
                    "stars": 5,
                    "content": "I knew it would be good, but wow. It’s like the real Chiron shrunk and came to life. Fast, clean, and crazy fun to control."
                },
                {
                    "author": "Zoya I.",
                    "stars": 5,
                    "content": "The most premium RC I’ve ever owned. The detail is wild and the power is unreal. It’s not cheap, but it’s worth every rupee."
                },
                {
                    "author": "Omar H.",
                    "stars": 4,
                    "content": "Looks like a dream, drives like a rocket. Only wish it had an included display stand — this thing deserves to be shown off!"
                },
                {
                    "author": "Emaan F.",
                    "stars": 5,
                    "content": "Absolutely flawless. You feel the craftsmanship instantly. I've raced a lot of RCs, but this one just feels different. In a good way."
                },
                {
                    "author": "Saad T.",
                    "stars": 4,
                    "content": "No complaints on performance or looks, but I’d love more controller customization. Still — this thing flies."
                }
            ],
            "url": "/products/chiron"
        },
        {
            "id": "jesko",
            "name": "Koenigsegg Jesko RC",
            "price": "21500",
            "thumbnail": "https://prestigemodelcars.com/cdn/shop/files/20250110092331.png?v=1736573190",
            "category": "Hypercars",
            "content": [
                "1x Koenigsegg Jesko RC 16x4.5inch",
                "1x Adaptive Launch Controller",
                "1x Liquid-Cooled 120W USB-C Charger",
                "1x Track-Grade Aero Wing Set",
                "1x CZNE carbon fiber decal pack",
                "1x CZNE branding sticker sheet"
            ],
            "description": "Meet the Koenigsegg Jesko RC — a hypercar like no other, reborn in RC scale with brutal performance and hand-assembled precision. Engineered for those who crave the extreme, this model blends cutting-edge design with featherlight materials and crazy top speeds.\n\nWith its aerodynamic sculpting, active spoiler, and a chassis tuned for control at high velocity, the Jesko RC dominates any surface you throw it on. It’s not just an RC car, it’s a statement. A flex. A track monster in the palm of your hand.\n\nDesigned for collectors and speed demons who want the best. Period.",
            "reviews": [
                {
                    "author": "Faizan A.",
                    "stars": 5,
                    "content": "This thing is a bullet on wheels. Never had an RC car that felt so balanced at such high speeds. Absolute perfection."
                },
                {
                    "author": "Maria J.",
                    "stars": 4,
                    "content": "Looks like it came out of a sci-fi movie. It’s fast, stable, and beautifully made. A bit pricey but it delivers where it matters."
                },
                {
                    "author": "Talha M.",
                    "stars": 5,
                    "content": "Koenigsegg fanboy here. This RC Jesko is everything I hoped it would be. From spoiler to chassis — 10/10 craftsmanship."
                },
                {
                    "author": "Ayaan Q.",
                    "stars": 4,
                    "content": "The finish is gorgeous and it handles like it’s on rails. Controller response is tight too. Just wish it came with a hard case."
                },
                {
                    "author": "Yusra K.",
                    "stars": 5,
                    "content": "Genuinely one of the coolest RC cars I’ve seen or owned. I use it for casual races and it always draws a crowd. Well done CZNE!"
                }
            ],
            "url": "/products/jesko"
        },
        {
            "id": "cyberkino",
            "name": "CZNE Cyberkino",
            "price": "15900",
            "thumbnail": "https://i.ibb.co/C3FrsRB9/cyberkino.jpg",
            "category": "Off-Road",
            "content": [
                "1x CZNE Cyberkino Off-Road Unit",
                "1x Rugged Terrain Controller",
                "1x 85W USB-C Charger",
                "1x Shock-Resist Suspension Kit",
                "1x Spare Deep-Tread Tyre Set",
                "1x CZNE branding sticker sheet"
            ],
            "description": "Built like a beast and dressed like it came from the future — the CZNE Cyberkino is your ultimate off-road machine. With oversized tires, a lifted chassis, and angular armored panels, this truck-like RC monster doesn’t just go over rough terrain — it *devours* it.\n\nCrafted for extreme durability and unmatched shock resistance, the Cyberkino is made to crash, climb, and conquer. Its aggressive geometry, rugged detailing, and matte finish make it an instant standout in the field or on the shelf. Whether you're plowing through dirt trails or urban obstacles, the Cyberkino takes it all in stride — with style.",
            "reviews": [
                {
                    "author": "Kamil H.",
                    "stars": 5,
                    "content": "Massive, loud, and impossible to ignore. Took it to the hills last weekend — it handled mud, rocks, and water like a champ."
                },
                {
                    "author": "Sarah L.",
                    "stars": 4,
                    "content": "Super fun to drive. The grip is solid and it feels really stable even when hitting jumps. Battery life could be longer though."
                },
                {
                    "author": "Daniyal R.",
                    "stars": 5,
                    "content": "The design is so cool — it looks like something out of a dystopian movie. Performs just as well as it looks!"
                },
                {
                    "author": "Iqra B.",
                    "stars": 4,
                    "content": "Very tough and responsive. It's heavier than I expected, but that actually makes it feel more premium."
                },
                {
                    "author": "Zarar N.",
                    "stars": 5,
                    "content": "Absolute unit. I’ve thrown everything at it — sand, gravel, stairs — and it keeps rolling. Great buy if you want something wild."
                }
            ],
            "url": "/products/cyberkino"
        },
        {
            "id": "minicooper",
            "name": "Mini Cooper Roadster",
            "price": "8200",
            "thumbnail": "https://i.ibb.co/mCPSDCbg/mini-cooper.jpg",
            "category": "Sports Cars",
            "content": [
                "1x Mini Cooper Roadster 13x4inch RC Car",
                "1x Ergonomic Stick Controller",
                "1x 60W USB-C Charger",
                "1x CZNE mirror sticker set",
                "1x CZNE branding sticker sheet"
            ],
            "description": "Cute but not to be underestimated — the Mini Cooper Roadster RC delivers that British roadster charm with serious street performance. Built compact but solid, it zips through corners with razor-sharp handling and a punchy throttle response.\n\nFinished with a smooth matte coat and hand-assembled detailing, it’s a perfect blend of style and function. Whether you’re racing indoors or cruising down a makeshift city track, this RC Mini promises a drive that’s nimble, responsive, and way more fun than it has any right to be.",
            "reviews": [
                {
                    "author": "Areeba F.",
                    "stars": 5,
                    "content": "Such a fun little car! It’s quick, it’s agile, and it looks so good on my shelf. Definitely my go-to for indoor racing."
                },
                {
                    "author": "Bilal T.",
                    "stars": 4,
                    "content": "Really well-built for the price. Great battery life and smooth control. Could use slightly more torque but still a great buy."
                },
                {
                    "author": "Hamza Y.",
                    "stars": 5,
                    "content": "Bought it for my younger brother and ended up using it more myself. Super satisfying to drive, and it handles like a dream."
                },
                {
                    "author": "Meher S.",
                    "stars": 4,
                    "content": "Love the attention to detail. The matte finish is clean and classy. Great RC car for casual play or collection."
                },
                {
                    "author": "Zayan J.",
                    "stars": 5,
                    "content": "This thing zooms! Very responsive, great build quality, and looks adorable. Highly recommend for Mini lovers."
                }
            ],
            "url": "/products/minicooper"
        },
        {
            "id": "am-db11",
            "name": "Aston Martin DB11 RC",
            "price": "13400",
            "thumbnail": "https://i.ibb.co/cpwgT85/huracan.jpg",
            "category": "Luxury Sports",
            "content": [
                "1x Aston Martin DB11 15x4inch RC Car",
                "1x Premium Curve Controller",
                "1x 90W Fast USB-C Charger",
                "1x Luxury Finish Detailing Cloth",
                "1x CZNE branding sticker sheet"
            ],
            "description": "Grace meets pace — the Aston Martin DB11 RC is for those who crave performance wrapped in sophistication. Hand-assembled with fine detailing and finished in a deep matte coat, this RC model mirrors the prestige of its full-size counterpart.\n\nFrom its aerodynamic curves to its low-slung stance, the DB11 glides with purpose and roars with control. High-speed capable and butter-smooth to maneuver, it’s equally at home on slick indoor surfaces and polished asphalt tracks. A collector’s dream. A driver’s delight.",
            "reviews": [
                {
                    "author": "Ayan S.",
                    "stars": 5,
                    "content": "Absolutely stunning. It looks and feels like a premium RC. The matte finish is flawless and the driving response is top-notch."
                },
                {
                    "author": "Hafsa M.",
                    "stars": 4,
                    "content": "Got this as a gift and I’m obsessed! It’s fast, elegant, and feels very precise. Just wish it came with a case or display stand."
                },
                {
                    "author": "Usman R.",
                    "stars": 5,
                    "content": "The craftsmanship is insane. Easily one of the best-looking RC cars I own. Drives like a luxury sports car should."
                },
                {
                    "author": "Emaan J.",
                    "stars": 5,
                    "content": "Every detail is on point. From the headlights to the spoiler, it feels authentic. Performance is smooth and powerful."
                },
                {
                    "author": "Furqan K.",
                    "stars": 4,
                    "content": "Very refined and fast. The hand-assembled touch makes it feel special. Just a bit delicate for off-road fun — it’s a gentleman’s racer."
                }
            ],
            "url": "/products/am-db11"
        },
        {
            "id": "huracan",
            "name": "Lamborghini Huracán RC",
            "price": "13900",
            "thumbnail": "https://i.ibb.co/cpwgT85/huracan.jpg",
            "category": "Supercars",
            "content": [
                "1x Lamborghini Huracán 15x4inch RC Car",
                "1x High-Grip Precision Controller",
                "1x 100W Ultra-Fast USB-C Charger",
                "1x Low-Profile Spoiler Kit (attachable)",
                "1x CZNE branding sticker sheet"
            ],
            "description": "Raw power in a compact frame — the Lamborghini Huracán RC captures the fierce soul of the Italian bull with jaw-dropping speed and a sleek matte finish. Hand-assembled with high attention to detail, this RC supercar is built to dominate every straightaway and corner.\n\nIts wide stance and aerodynamic design make it a monster on both indoor tracks and smooth tarmac. Whether you're racing or just showing off, the Huracán makes a bold, aggressive statement in every drift and dash.",
            "reviews": [
                {
                    "author": "Rameen A.",
                    "stars": 5,
                    "content": "Hands down the fastest RC I’ve ever used. It corners like a dream and sounds like it means business — absolutely worth it!"
                },
                {
                    "author": "Ibrahim Q.",
                    "stars": 4,
                    "content": "The design is sick and the build feels premium. Just wish the controller had a grip texture — but performance is flawless."
                },
                {
                    "author": "Kiran F.",
                    "stars": 5,
                    "content": "Such a stunner. Got compliments from everyone who saw it. It’s not just fast — it looks like it belongs in a showroom."
                },
                {
                    "author": "Shahmeer Z.",
                    "stars": 5,
                    "content": "Bought this for races with my cousins. Safe to say I’m undefeated now. This car is a rocket with control."
                },
                {
                    "author": "Nashit J.",
                    "stars": 4,
                    "content": "Incredible detailing and amazing acceleration. Just needs a bit more ground clearance for rougher surfaces."
                }
            ],
            "url": "/products/huracan"
        }
        
        
        
        
        
        
        
    ]);
});

// https://i.ibb.co/WNDScwj4/911.png
// https://i.ibb.co/6hhFzdg/off-road.png
// https://i.ibb.co/27h6PBLq/truck.png
// https://i.ibb.co/XrQ7hpDj/hellcat.png
// https://i.ibb.co/4Z35HWXB/stingray.png
/**
 *  https://i.ibb.co/3YG39fpZ/vantage.jpg
    https://i.ibb.co/cpwgT85/huracan.jpg
    https://i.ibb.co/VcjQy88K/db11.jpg
    https://i.ibb.co/mCPSDCbg/mini-cooper.jpg
    https://i.ibb.co/C3FrsRB9/cyberkino.jpg
    https://i.ibb.co/23mLVdSM/chiron.jpg
    https://i.ibb.co/93qZ3ttc/roma.jpg
 * 
 * 
 */