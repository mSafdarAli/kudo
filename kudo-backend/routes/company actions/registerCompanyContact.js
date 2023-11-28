const express = require('express');

const Company = require('../../models/Company.model');
const Contact = require('../../models/Contact.model');

module.exports = async (req, res, next) => {

  try {


    const { name, email, title, companyId } = req.body;

    // Check if the provided company ID exists in the database
    const existingCompany = await Company.findById(companyId);
    if (!existingCompany) {
      return res.status(201).json({ status: 'error', message: 'Company not found' });
    }

    // Create a new contact instance
    const newContact = new Contact({
      name,
      email,
      title,
      company: companyId, // Set the reference to the company
    });

    // Save the contact to the database
    const savedContact = await newContact.save();

    // Update the contacts array of the company
    existingCompany.contacts.push(savedContact._id);
    await existingCompany.save();

    // Return the created contact in the response
    res.status(200).json({ status: 'success', message: 'Contact created successfully', data: savedContact });
  } catch (err) {
    // Handle any errors that might occur during contact creation
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}