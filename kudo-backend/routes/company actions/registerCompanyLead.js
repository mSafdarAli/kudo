const express = require('express');

const Company = require('../../models/Company.model');
const Lead = require('../../models/Leads.model');


module.exports = async (req, res, next) => {

  try {

    const { type, notes, companyId } = req.body;

    // Check if the provided company ID exists in the database
    const existingCompany = await Company.findById(companyId);
    if (!existingCompany) {
      return res.status(201).json({ status: 'error', message: 'Company not found' });
    }

    // Create a new lead instance
    const newLead = new Lead({
      type,
      notes,
      company: companyId, // Set the reference to the company
    });

    // Save the lead to the database
    const savedLead = await newLead.save();

    // Update the leads array of the company
    existingCompany.leads.push(savedLead._id);
    await existingCompany.save();

    // Return the created lead in the response
    res.status(200).json({ status: 'success', message: 'Lead created successfully', data: savedLead });
  } catch (err) {
    // Handle any errors that might occur during lead creation
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }

}