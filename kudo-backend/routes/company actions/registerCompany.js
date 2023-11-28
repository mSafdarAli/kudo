const express = require('express');

const Company = require('../../models/Company.model');

module.exports = async (req, res, next) => {

  try {
    const { companyName, category, contact, websiteLink, instagramLink, user } = req.body;
    // console.log(req.body)

    // Create a new company instance
    const newCompany = new Company({
      companyName,
      industry: category,
      contact,
      websiteLink,
      instagramLink,
      user
    });

    // Save the company to the database
    const savedCompany = await newCompany.save();

    // Return the created company in the response
    res.status(200).json({ status: 'success', message: 'Company created successfully', data: savedCompany });
  } catch (err) {
    console.log(err.message)
    // Handle any errors that might occur during company creation
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}