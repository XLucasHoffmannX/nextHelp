const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

const db = new sqlite3.Database(
    './db/artiC.db',
    sqlite3.OPEN_READWRITE,
    err=>{
        if(err){
            console.log(err.message);
            return
        }
        console.log('succes, connect in artiC.db')
    }
)

// route index
router.get('/', (req, res, next)=>{
    const query = /*sql*/`
        SELECT id, title, city, image, info, email, phone, ddd
        FROM articles
        ORDER BY id DESC
        LIMIT 5
    `;

    db.all(query, (err, adverts)=>{
        if(err){
            console.log(err.message);
            return next(err)
        }
        res.render('index', { adverts });
    })
})

// route register get
router.get('/register', (req, res)=>{
    return res.render('register')
})

// route register post
router.post('/register', (req, res, next)=>{
    const query = /*sql*/`
        INSERT INTO articles (title, city, image, info, email, ddd, phone)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.run(query, [req.body.title, req.body.city, req.body.image, req.body.info, req.body.email, req.body.ddd, req.body.phone], err=>{
        if(err){
            console.log(err.message);
            return next(err)
        }
        res.redirect('/');
    })
});

// route search get
router.get('/search', (req, res, next)=>{
    const query = /*sql*/`
        SELECT id, title, city, image, info, email, phone, ddd
        FROM articles
        WHERE LIKE (?, LOWER(city || title || info))
        ORDER BY id DESC; 
    `;
    if(req.query.key){
        db.all(query, [ `%${req.query.key}%`], (err, adverts)=>{
            if(err){
                console.log(err.message);
                return next(err)
            }
            res.render('search', { adverts, key:req.query.key })
        })
    }else{
        return res.render('search')
    }
});

// route advert
router.get('/ad/:id', (req, res, next)=>{
    const query = /*sql*/`
        SELECT id, title, city, image, info, email, phone, ddd
        FROM articles
        WHERE id = ?
    `;
    if(req.params.id){
        db.get(query, [req.params.id], (err, advert)=>{
            if(err){
                console.log(err.message);
                return next(err);
            }
            return res.render('advert', { advert })
        })
    }
})
module.exports = router