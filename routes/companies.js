var { Router } = require('express');
var router = Router();

const COMPANIES = require('../data/companies');
const CONTACTS = require('../data/contacts');

let lastId = Math.max(...COMPANIES.map(c=>c.id));
const PROPERTIES = ["name","industry","sector","capital"];

router.get('/', (req,res)=>{
    res.json(COMPANIES);
});

router.get('/:id', (req,res)=>{
    let id = req.params.id;
    let company = COMPANIES.filter(c=>c.id==id)[0];
    if (company) {
        res.status(200).json(company);    
    } else {
        res.status(404).json({
            error: "Not found the company with id="+id
        });
    }
});

router.post('/', (req,res)=>{
    let company = req.body;
    if (company.name) {
        // Checking all properties in newData are in PROPERTIES
        if (Object.keys(company).every(property=>PROPERTIES.includes(property))) {
            company.id = ++lastId;
            COMPANIES.push(company);
            res.status(201).json(company);
        } else {
            res.status(422).json({
                error: "At least some property is wrong."
            });
        }
    } else {
        res.status(422).json({
            error: "'name' of company is required."
        });
    }
});

router.put('/:id', (req,res)=>{
    let id = req.params.id;
    let company = COMPANIES.filter(c=>c.id==id)[0];
    if (company) {
        let newData=req.body;        
        // Checking all properties in newData are in PROPERTIES
        if (Object.keys(newData).every(property=>PROPERTIES.includes(property))) {
            for (let property in newData) {
                company[property]=newData[property];
            }
            res.status(200).json(company);    
        } else {
            res.status(422).json({
                error: "At least some property is wrong."
            });
        }

    } else {
        res.status(404).json({
            error: "Not found the company with id="+id
        })
    }
});

router.delete('/:id', (req,res)=>{
    let id = req.params.id;
    let index = COMPANIES.map(c=>c.id).indexOf(parseInt(id));
    if (index>=0) {
        res.status(200).json(
            COMPANIES.splice(index,1)[0]
        )
    } else {
        res.status(404).json({
            error: "Not found the company with id="+id
        });
    }
});

router.get('/:id/contacts', (req,res)=>{
    let id = req.params.id;
    let index = COMPANIES.map(c=>c.id).indexOf(parseInt(id));
    if (index>=0) {
        let companyContacts = CONTACTS.filter(c=>c.company_id==id);
        res.json(companyContacts);
    } else {
        res.status(404).json({
            error: "Not found the company with id="+id
        });
    }
});

module.exports = router;