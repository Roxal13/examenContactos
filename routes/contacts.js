var { Router } = require('express');
var router = Router();

const CONTACTS = require('../data/contacts');

let lastId = Math.max(...CONTACTS.map(c=>c.id));
const PROPERTIES = ["first_name","last_name","email","image","department","company_id"];

router.get('/', (req,res)=>{
    res.json(CONTACTS);
});

router.get('/:id', (req,res)=>{
    let id = req.params.id;
    let contact = CONTACTS.filter(c=>c.id==id)[0];
    if (contact) {
        res.status(200).json(contact);    
    } else {
        res.status(404).json({
            error: "Not found the contact with id="+id
        });
    }
});

router.post('/', (req,res)=>{
    let contact = req.body;
    if (contact.first_name && contact.last_name && contact.email) {
        // Checking all properties in newData are in PROPERTIES
        if (Object.keys(contact).every(property=>PROPERTIES.includes(property))) {
            contact.id = ++lastId;
            CONTACTS.push(contact);
            res.status(201).json(contact);
        } else {
            res.status(422).json({
                error: "At least some property is wrong."
            });
        }
    } else {
        res.status(422).json({
            error: "'first_name', 'last_name' and 'email' are required."
        });
    }
});

router.put('/:id', (req,res)=>{
    let id = req.params.id;
    let contact = CONTACTS.filter(c=>c.id==id)[0];
    if (contact) {
        let newData=req.body;        
        // Checking all properties in newData are in PROPERTIES
        if (Object.keys(newData).every(property=>PROPERTIES.includes(property))) {
            for (let property in newData) {
                contact[property]=newData[property];
            }
            res.status(200).json(contact);    
        } else {
            res.status(422).json({
                error: "At least some property is wrong."
            });
        }

    } else {
        res.status(404).json({
            error: "Not found the contact with id="+id
        })
    }
});

router.delete('/:id', (req,res)=>{
    let id = req.params.id;
    let index = CONTACTS.map(c=>c.id).indexOf(parseInt(id));
    if (index>=0) {
        res.status(200).json(
            CONTACTS.splice(index,1)[0]
        )
    } else {
        res.status(404).json({
            error: "Not found the contact with id="+id
        });
    }
});

module.exports = router;