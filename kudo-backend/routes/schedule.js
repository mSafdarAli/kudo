// routes/schedules.js
const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule_CRM.model');
const Company = require('../models/Company.model');

// Route to create a new schedule
router.post('/schedules', async (req, res) => {
  try {
    const { date, time, typeOfLead, notes, companyId } = req.body;
    // console.log(req.body)
    const existingCompany = await Company.findById(companyId);
    if (!existingCompany) {
      return res.status(201).json({ status: 'error', message: 'Company not found' });
    }

    // Create a new schedule instance
    const newSchedule = new Schedule({
      date,
      time,
      typeOfLead,
      notes,
      company: companyId,
    });

    // Save the schedule to the database
    const savedSchedule = await newSchedule.save();

    existingCompany.schedules.push(savedSchedule._id);
    await existingCompany.save();
    // Return the created schedule in the response
    res.status(200).json({ status: 'success', message: 'Schedule created successfully', data: savedSchedule });
  } catch (err) {
    // Handle any errors that might occur during schedule creation
    console.log(err.message)
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Route to get all schedules
router.get('/schedules', async (req, res) => {
  try {
    // Find all schedules from the database
    const schedules = await Schedule.find();

    // Return the schedules in the response
    res.status(200).json({ status: 'success', data: schedules });
  } catch (err) {
    // Handle any errors that might occur during schedule retrieval
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Route to get a single schedule by ID
router.get('/schedules/:scheduleId', async (req, res) => {
  try {
    const scheduleId = req.params.scheduleId;

    // Find the schedule with the given ID in the database
    const schedule = await Schedule.findById(scheduleId);

    // Check if the schedule was found
    if (!schedule) {
      return res.status(201).json({ status: 'error', message: 'Schedule not found' });
    }

    // Return the schedule in the response
    res.status(200).json({ status: 'success', data: schedule });
  } catch (err) {
    // Handle any errors that might occur during schedule retrieval
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Route to update a schedule by ID
router.put('/schedules/:scheduleId', async (req, res) => {
  try {
    const scheduleId = req.params.scheduleId;
    const { date, time, typeOfLead, notes, companyId } = req.body;

    // Find the schedule with the given ID in the database
    const schedule = await Schedule.findById(scheduleId);

    // Check if the schedule was found
    if (!schedule) {
      return res.status(201).json({ status: 'error', message: 'Schedule not found' });
    }

    // Update the schedule fields
    schedule.date = date;
    schedule.time = time;
    schedule.typeOfLead = typeOfLead;
    schedule.notes = notes;
    schedule.company = companyId;

    // Save the updated schedule to the database
    await schedule.save();

    const schedules = await Schedule.find({ company: companyId });
    // Return the updated schedule in the response
    res.status(200).json({ status: 'success', message: 'Schedule updated successfully', data: schedules });
  } catch (err) {
    // Handle any errors that might occur during schedule update
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Route to delete a schedule by ID
router.delete('/schedules/:scheduleId', async (req, res) => {
  try {
    const scheduleId = req.params.scheduleId;

    // Find the schedule with the given ID in the database
    const schedule = await Schedule.findById(scheduleId);

    // Check if the schedule was found
    if (!schedule) {
      return res.status(201).json({ status: 'error', message: 'Schedule not found' });
    }

    // Get the associated company's ID from the schedule
    const companyId = schedule.company;

    // Find the company with the given ID in the database
    const company = await Company.findById(companyId);

    // Check if the company was found
    if (!company) {
      return res.status(201).json({ status: 'error', message: 'Company not found' });
    }

    // Remove the schedule ID from the company's schedules array
    company.schedules = company.schedules.filter((id) => id.toString() !== scheduleId);
    await company.save();

    // Delete the schedule from the database
    await Schedule.findByIdAndDelete(scheduleId);

    // Return a success message in the response
    res.status(200).json({ status: 'success', message: 'Schedule deleted successfully' });
  } catch (err) {
    // Handle any errors that might occur during schedule deletion
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});


// Route to get all schedules associated with a specific company
router.get('/schedules/company/:companyId', async (req, res) => {
  try {
    const companyId = req.params.companyId;

    // Find all schedules that are linked to the given company ID in the database
    const schedules = await Schedule.find({ company: companyId });

    // Return the schedules associated with the company in the response
    res.status(200).json({ status: 'success', data: schedules });
  } catch (err) {
    // Handle any errors that might occur during schedule retrieval
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

router.post('/schedules/date', async (req, res) => {
  try {
    const { date } = req.body;
    
    const schedules = await Schedule.aggregate([
      {
        $match: {
          date: new Date(date),
        },
      },
      {
        $lookup: {
          from: 'companies',
          localField: 'company',
          foreignField: '_id',
          as: 'company',
        },
      },
      {
        $unwind: '$company',
      },
      {
        $project: {
          _id: 1,
          date: 1,
          time: 1,
          typeOfLead: 1,
          notes: 1,
          'company.companyName': 1,
        },
      },
    ]);

    res.json(schedules);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
