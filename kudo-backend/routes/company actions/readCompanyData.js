const express = require('express');

const Company = require('../../models/Company.model');
const Contact = require('../../models/Contact.model');
const Leads = require('../../models/Leads.model');

module.exports = async (req, res, next) => {

  try {
    const { companyId } = req.params;
    console.log(companyId)
    // Find the company with the given ID and populate its contacts and leads
    const company = await Company.findById(companyId)
      .populate('contacts')
      .populate('leads');
    // console.log(company)
    if (!company) {
      return res.status(201).json({ status: 'error', message: 'Company not found' });
    }

    // Return the company object with its contacts and leads in the response
    res.status(200).json({ status: 'success', data: company });
  } catch (err) {
    // Handle any errors that might occur during data retrieval
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}