const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, query, where, doc, deleteDoc } = require('firebase/firestore');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static ফোল্ডার যুক্ত করুন (CSS এবং JS ফাইল লোড করার জন্য)
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');

// --- Firebase Connection ---
const firebaseConfig = {
  apiKey: "AIzaSyApS9a6cxv7O0LMARD7IKOr-WEQAtlq9fI",
  authDomain: "mydata-81da6.firebaseapp.com",
  projectId: "mydata-81da6",
  storageBucket: "mydata-81da6.firebasestorage.app",
  messagingSenderId: "577099961634",
  appId: "1:577099961634:web:a9cdae78c496a57346417b",
  measurementId: "G-JQDDF73BYH"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
console.log("Firebase Connected Successfully! 🔥");

// --- Sorting Logic (Priority & Date) ---
const sortVideos = (videos) => {
    return videos.sort((a, b) => {
        let orderA = a.order || 0;
        let orderB = b.order || 0;
        if (orderB !== orderA) return orderB - orderA; // Priority বেশি হলে ওপরে
        return b.createdAt - a.createdAt; // Priority সেম হলে নতুনটা ওপরে
    });
};

// --- Routes ---
app.get('/', (req, res) => res.render('index'));
app.get('/index', (req, res) => res.render('index'));
app.get('/game', (req, res) => res.render('game'));
app.get('/pagecontact', (req, res) => res.render('pagecontact'));

// Page 1 (YouTube Videos)
app.get('/page1', async (req, res) => {
    try {
        const q = query(collection(db, "videos"), where("pageType", "==", "page1"));
        const snapshot = await getDocs(q);
        let videos = [];
        snapshot.forEach((doc) => videos.push({ id: doc.id, ...doc.data() }));
        res.render('page1', { videos: sortVideos(videos) });
    } catch (error) {
        res.render('page1', { videos: [] });
    }
});

// Page 2 (Drive Links)
app.get('/page2', async (req, res) => {
    try {
        const q = query(collection(db, "videos"), where("pageType", "==", "page2"));
        const snapshot = await getDocs(q);
        let videos = [];
        snapshot.forEach((doc) => videos.push({ id: doc.id, ...doc.data() }));
        res.render('page2', { videos: sortVideos(videos) });
    } catch (error) {
        res.render('page2', { videos: [] });
    }
});

// Page 3 (HVid Custom Player)
app.get('/page3', async (req, res) => {
    try {
        const q = query(collection(db, "videos"), where("pageType", "==", "page3"));
        const snapshot = await getDocs(q);
        let videos = [];
        snapshot.forEach((doc) => videos.push({ id: doc.id, ...doc.data() }));
        res.render('page3', { videos: sortVideos(videos) });
    } catch (error) {
        res.render('page3', { videos: [] });
    }
});

// Admin Panel (ভিডিও লিস্ট সহ)
app.get('/admin', async (req, res) => {
    try {
        const snapshot = await getDocs(collection(db, "videos"));
        let videos = [];
        snapshot.forEach((doc) => videos.push({ id: doc.id, ...doc.data() }));
        res.render('admin', { videos: sortVideos(videos) });
    } catch (error) {
        res.render('admin', { videos: [] });
    }
});

// Upload Route
app.post('/upload-video', async (req, res) => {
    const { title, embedUrl, description, pageType, order, pass } = req.body;
    if (pass !== "12345") return res.send("<h3>Wrong Password! ❌ <a href='/admin'>Go Back</a></h3>");

    try {
        await addDoc(collection(db, "videos"), {
            title, embedUrl, description, pageType,
            order: Number(order) || 0, // Priority Number সেভ হচ্ছে
            createdAt: Date.now()
        });
        res.redirect(`/${pageType}`);
    } catch (error) {
        res.send("<h3>Error uploading. ❌</h3>");
    }
});

// Delete Route
app.post('/delete-video/:id', async (req, res) => {
    const { pass } = req.body;
    if (pass !== "12345") return res.send("<h3>Wrong Password! ❌ <a href='/admin'>Go Back</a></h3>");

    try {
        await deleteDoc(doc(db, "videos", req.params.id));
        res.redirect('/admin');
    } catch (error) {
        res.send("<h3>Error deleting. ❌</h3>");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} 🚀`);
});
