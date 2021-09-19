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




module.exports = router;