const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const { ObjectId } = require('mongodb');


// Actions 
const registerCompany = require('./company actions/registerCompany');
const companyContact = require('./company actions/registerCompanyContact');
const companyLead = require('./company actions/registerCompanyLead');
const readCompanyData = require('./company actions/readCompanyData');

const Company = require('../models/Company.model');
const Contact = require('../models/Contact.model');
const Lead = require('../models/Leads.model');
const Schedule = require('../models/Schedule_CRM.model')
//Middleware
const verifyToken = require('../middlewares/verifyUserToken');

//Register a new company
router
  .route('/registerCompany')
  .post(registerCompany)


//Register contact
router
  .route('/registerContact')
  .post(companyContact)


//Register Lead
router
  .route('/registerLead')
  .post(companyLead)

// Read Data
router
  .route('/Read/:companyId')
  .get(readCompanyData)

router.get('/firstContact/all/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const companiesWithFirstContact = await Company.aggregate([
      {
        $match: {
          user: userId,
        },
      },
      {
        $lookup: {
          from: 'contacts',
          localField: 'contacts',
          foreignField: '_id',
          as: 'contacts',
        },
      },
      {
        $project: {
          companyName: 1,
          websiteLink: 1,
          instagramLink: 1,
          companyClassification: 1,
          industry: 1,
          contact: 1,
          leadSource: 1,
          companyClassification: 1,
          notes: 1,
          initialContactDiscussion: 1,
          initialContactDate: 1,
          howItLeftOff: 1,
          targetValue: 1,
          products: 1,
          firstContact: {
            $arrayElemAt: ['$contacts', 0], // Select the first element from the 'contacts' array
          },
        },
      },
      {
        $lookup: {
          from: 'leads',
          localField: '_id',
          foreignField: 'company',
          as: 'firstLead',
        },
      },
      {
        $project: {
          companyName: 1,
          websiteLink: 1,
          instagramLink: 1,
          companyClassification: 1,
          contact: 1,
          industry: 1,
          leadSource: 1,
          companyClassification: 1,
          notes: 1,
          initialContactDiscussion: 1,
          initialContactDate: 1,
          howItLeftOff: 1,
          targetValue: 1,
          products: 1,
          firstContact: {
            name: '$firstContact.name',
            email: '$firstContact.email',
            title: '$firstContact.title',
          },
          firstLead: {
            $arrayElemAt: ['$firstLead', 0],
          },
        },
      },
    ]);

    res.status(200).json({ status: 'success', data: companiesWithFirstContact });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});


router.get('/firstContact/:id', async (req, res) => {
  const companyId = req.params.id;
  try {
    // Fetch company data with first contact
    const companyWithFirstContact = await Company.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(companyId),
        },
      },
      {
        $lookup: {
          from: 'contacts',
          localField: 'contacts',
          foreignField: '_id',
          as: 'firstContact',
        },
      },
      {
        $unwind: '$firstContact',
      },
      {
        $project: {
          companyName: 1,
          contact: 1,
          websiteLink: 1,
          instagramLink: 1,
          companyClassification: 1,
          industry: 1,
          leadSource: 1,
          companyClassification: 1,
          notes: 1,
          initialContactDiscussion: 1,
          initialContactDate: 1,
          howItLeftOff: 1,
          targetValue: 1,
          products: 1,
          firstContact: {
            name: '$firstContact.name',
            email: '$firstContact.email',
            title: '$firstContact.title',
          },
        },
      },
    ]);

    // Fetch leads data for the specific company
    const leadData = await Lead.findOne({ company: companyId });

    // If lead data exists, add it to the companyWithFirstContact object
    // console.log(leadData)
    if (leadData) {
      companyWithFirstContact[0].firstLead = {
        type: leadData.type,
        notes: leadData.notes,
      };
    } else {
      companyWithFirstContact[0].firstLead = null;
    }

    // Return the result in the response
    res.status(200).json({ status: 'success', data: companyWithFirstContact[0] });
  } catch (err) {
    // Handle any errors that might occur during retrieval
    res.status(500).json({ status: 'error', message: err.message });
  }


});

router.post('/:companyId/products', async (req, res) => {
  const companyId = req.params.companyId;
  const productData = req.body;

  try {
    // Find the company by ID
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({ status: 'error', message: 'Company not found' });
    }

    // Add the product data to the 'products' array in the company
    company.products.push(productData);

    // Save the updated company
    const updatedCompany = await company.save();

    return res.status(200).json({ status: 'success', data: updatedCompany });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

router.put('/update/crm/:id', async (req, res) => {
  const companyId = req.params.id;

  // console.log(req.body)
  const productsData = req.body.products;
  const products = productsData.map(product => ({
    productName: product.Pname,
    amount: product.price,
  }));
  try {
    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      {
        $set: {
          ...req.body, // Update other fields from req.body
          products, // Update products field
        },
      },
      { new: true } // Set to true to return the updated company object
    );

    if (!updatedCompany) {
      return res.status(404).json({ status: 'error', message: 'Company not found' });
    }

    return res.status(200).json({ status: 'success', data: updatedCompany });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// dropdowns
router.get('/dropdown', async (req, res) => {

  try {

    // Fetch all dropdown options from the database
    const dropdownOptions = [
      'Small PI',
      'Large PI',
      'Small Mass Tort',
      'Large Mass Tort',
      'Lead Buyer',
      'Small Agency',
      'Large Agency',
      'Small Auto',
      'Large Auto',
    ];

    // Return the dropdown options in the response
    res.status(200).json({ status: 'success', data: dropdownOptions });
  } catch (error) {
    // Handle any errors that might occur during data retrieval
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

router.get('/read', async (req, res) => {
  try {
    // Find all companies from the database
    const companies = await Company.find();

    // Return the companies in the response
    res.status(200).json({ status: 'success', data: companies });
  } catch (err) {
    // Handle any errors that might occur during company retrieval
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Route to get a single company by ID
router.get('/read/:companyId', async (req, res) => {
  try {
    const companyId = req.params.companyId;

    // Find the company with the given ID in the database
    const company = await Company.findById(companyId);

    // Check if the company was found
    if (!company) {
      return res.status(201).json({ status: 'error', message: 'Company not found' });
    }

    // Return the company in the response
    res.status(200).json({ status: 'success', data: company });
  } catch (err) {
    // Handle any errors that might occur during company retrieval
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Route to update a company by ID
router.put('/update/:companyId', async (req, res) => {
  try {
    const companyId = req.params.companyId;
    // console.log(req.body)
    const { companyName, category, contact, websiteLink, instagramLink } = req.body;

    // Find the company with the given ID in the database
    const company = await Company.findById(companyId);

    // Check if the company was found
    if (!company) {
      return res.status(201).json({ status: 'error', message: 'Company not found' });
    }

    // Update the company fields
    company.companyName = companyName;
    company.contact = contact;
    company.industry = category;
    company.websiteLink = websiteLink;
    company.instagramLink = instagramLink;

    // Save the updated company to the database
    const updatedCompany = await company.save();

    // Return the updated company in the response
    res.status(200).json({ status: 'success', message: 'Company updated successfully', data: updatedCompany });
  } catch (err) {
    // Handle any errors that might occur during company update
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Route to delete a company by ID
router.delete('/delete/:companyId', async (req, res) => {
  try {
    const companyId = req.params.companyId;

    const companyObjectId = new ObjectId(Number(companyId));
    // Delete contacts associated with the company
    await Contact.deleteMany({ company: companyObjectId });

    console.log(companyId)
    // Delete leads associated with the company
    await Lead.findOneAndDelete({ company: companyId });

    // Delete schedules associated with the company
    await Schedule.deleteMany({ company: companyObjectId });

    // Delete the company from the database
    await Company.findByIdAndDelete(companyId);

    // Return a success message in the response
    res.status(200).json({ status: 'success', message: 'Company and associated data deleted successfully' });
  } catch (err) {
    // Handle any errors that might occur during company deletion
    console.log(err.message)
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// contact routes

router.get('/contacts/read', async (req, res) => {
  try {
    // Find all contacts from the database
    const contacts = await Contact.find();

    // Return the contacts in the response
    res.status(200).json({ status: 'success', data: contacts });
  } catch (err) {
    // Handle any errors that might occur during contact retrieval
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Route to get a single contact by ID
router.get('/contacts/:contactId', async (req, res) => {
  try {
    const contactId = req.params.contactId;

    // Find the contact with the given ID in the database
    const contact = await Contact.findById(contactId);

    // Check if the contact was found
    if (!contact) {
      return res.status(201).json({ status: 'error', message: 'Contact not found' });
    }

    // Return the contact in the response
    res.status(200).json({ status: 'success', data: contact });
  } catch (err) {
    // Handle any errors that might occur during contact retrieval
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Route to update a contact by ID
router.put('/contacts/:contactId', async (req, res) => {
  try {
    console.log(req.params)
    const contactId = req.params.contactId;
    console.log(req.body)
    const { name, email, title } = req.body;

    // Find the contact with the given ID in the database
    const contact = await Contact.findById(contactId);

    // Check if the contact was found
    if (!contact) {
      return res.status(201).json({ status: 'error', message: 'Contact not found' });
    }

    // Update the contact fields
    contact.name = name;
    contact.email = email;
    contact.title = title;

    // Save the updated contact to the database
    const updatedContact = await contact.save();

    // Return the updated contact in the response
    res.status(200).json({ status: 'success', message: 'Contact updated successfully', data: updatedContact });
  } catch (err) {
    // Handle any errors that might occur during contact update
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Route to delete a contact by ID
router.delete('/contacts/:contactId', async (req, res) => {
  try {
    const contactId = req.params.contactId;

    // Find the contact with the given ID in the database
    const contact = await Contact.findById(contactId);

    // Check if the contact was found
    if (!contact) {
      return res.status(201).json({ status: 'error', message: 'Contact not found' });
    }

    // Get the associated company's ID from the contact
    const companyId = contact.company;

    // Find the company with the given ID in the database
    const company = await Company.findById(companyId);

    // Check if the company was found
    if (!company) {
      return res.status(201).json({ status: 'error', message: 'Company not found' });
    }

    // Remove the contact ID from the company's contacts array
    company.contacts = company.contacts.filter((id) => id.toString() !== contactId);
    await company.save();

    // Delete the contact from the database
    await Contact.findByIdAndDelete(contactId);

    // Return a success message in the response
    res.status(200).json({ status: 'success', message: 'Contact deleted successfully' });
  } catch (err) {
    // Handle any errors that might occur during contact deletion
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});


router.post('/all/contacts', async (req, res) => {
  try {
    //   console.log(req.body.companyId)
    // Find all contacts with the given company ID in the database
    const contacts = await Contact.find({ company: req.body.companyId });
    // console.log(contacts)
    // Return the contacts in the response as an array
    res.status(200).json({ status: 'success', data: contacts });
  } catch (err) {
    // Handle any errors that might occur during contact retrieval
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

router.post('/updatelead', async (req, res) => {
  try {
    const { type, notes, companyId } = req.body;

    // Check if the provided company ID exists in the database
    const existingCompany = await Company.findById(companyId);

    // Check if the provided lead ID exists in the database
    const existingLead = await Lead.findOne({ company: companyId });

    if (existingCompany) {
      // If the company exists
      if (existingLead) {
        // If the lead exists, update its data
        existingLead.type = type;
        existingLead.notes = notes;
        await existingLead.save();

        res.status(200).json({ status: 'success', message: 'Lead updated successfully', data: existingLead });
      } else {
        // If the lead does not exist, create a new lead
        const newLead = new Lead({
          type,
          notes,
          company: companyId,
        });

        // Save the lead to the database
        const savedLead = await newLead.save();

        // Update the leads array of the company
        existingCompany.leads.push(savedLead._id);
        await existingCompany.save();

        res.status(200).json({ status: 'success', message: 'Lead created successfully', data: savedLead });
      }
    } else {
      res.status(404).json({ status: 'error', message: 'Company not found' });
    }
  } catch (err) {
    // Handle any errors that might occur during lead creation or update
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});



module.exports = router;