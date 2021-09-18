const router = require('express').Router();
const sequelize = require('../config/connection');
const { Cars, User } = require('../models');

router.get('/', (req, res) => {
    console.log('======================');
    Cars.findAll({
        include: [
            {
                model: User,
                attributes: ['id', 'username', 'email']
            }
            
        ]
    }).then(dbCarData => {
        //const cars = dbCarData.map(car => car.get({ plain: true }));
        //console.log(dbCarData);
        res.render('buyCars', {dbCarData})
       // res.json(dbCarData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
    console.log('======================');
    
    Cars.findOne({
        
        where: {
            
            id:req.params.id
        },
        include: [
            {
                model: User,
                attributes: ['id', 'username', 'email']
            }
        
        ]
    }).then(dbCarData => {
        //console.log(dbCarData);
        //console.log(dbCarData.dataValues.tags[0].dataValues.tag_name)
        //console.log(dbCarData.dataValues.tags.tag[0].dataValues.tag_name)
        res.render('single-car', dbCarData.dataValues);
       
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


router.get('/add', (req, res) => res.render('addCar'));


// Add a gig
router.post('/add', (req, res) => {
  let { model, make, year, miles, price, color, tags } = req.body;
  let errors = [];
  let user_id=1;

  // Validate Fields
  if(!model) {
    errors.push({ text: 'Please add your vehicle model' });
  }
  if(!make) {
    errors.push({ text: 'Please add your vehicle make' });
  }
  if(!year) {
    errors.push({ text: 'Please add your vehicle year' });
  }
  if(!miles) {
    errors.push({ text: 'Please add your vehicles number of miles' });
  }
  if(!price) {
    errors.push({ text: 'Please add a price for your vehicle' });
  }
  if(!color) {
    errors.push({ text: 'Please add your vehicle color' });
  }


  // Check for errors
  if(errors.length > 0) {
    res.render('addCar', {
      errors,
      make, 
      model,
      year, 
      miles, 
      price, 
      color,
      tags
    });
  } 

    // Make lowercase and remove space after comma
    tags = tags.toLowerCase().replace(/,[ ]+/g, ',');

    // Insert into table
    Cars.create({
        make, 
        model,
        year, 
        miles, 
        price,
        user_id, 
        color,
        tags
    })
      .then(addCarData => res.redirect('/buy'))
      .catch(err => res.render('error', {error:err.message}))
  
});

module.exports = router;