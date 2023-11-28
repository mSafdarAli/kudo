const { google } = require('googleapis');
// const { JWT } = require('google-auth-library');
// const { GoogleSpreadsheet } = require('google-spreadsheet');
const keys = require('../kudo-erp-b011d8a02978.json'); // Path to the JSON file with your credentials
const express = require('express');
const router = express.Router();


// Set up Google Sheets API client


const client = new google.auth.JWT(
  keys.client_email,
  null,
  keys.private_key,
  ['https://www.googleapis.com/auth/spreadsheets']
);

const sheets = google.sheets({ version: 'v4', client });

router.post('/readsheet', (req, res) => {

  // console.log(req.body)
  let spreadsheetId = null;
  const regex = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
  const match = req.body.googleSheetLink.match(regex);

  if (match && match[1]) {
    spreadsheetId = match[1];
    // console.log(spreadsheetId)
  } else {
    console.log('error')
  }

  
  let range = req.body.sheetName;
  // console.log(range)

  sheets.spreadsheets.values.get(
    {
      auth: client,
      spreadsheetId: spreadsheetId,
      range: range,
    },
    (err, result) => {
      if (err) {
        console.error('The API returned an error: ' + err);
        return res.status(500).send('Error fetching data from Google Sheet');
      }
      const rows = result.data.values;
      const { first16Columns, remainingColumns } = processData(rows);
      // console.log("First 15 Columns:", first15Columns);
      // console.log("Last Row Data (Remaining Columns):", remainingColumns);

      if (rows.length) {
        // console.log(rows)
        res.json({ data: {first16Columns, remainingColumns} });
      } else {
        res.json({ data: 'No data found.' });
      }
    }
  );
});



// router.post('/updatesheet', (req, res) => {
//   const { newData } = req.body;
//   console.log(newData)
//   const spreadsheetId = '1rpQm3I6cDInKJDkPAE4-a4A0_MeGR6-ax7AnE0uGF84';
//   const range = 'Sheet1';

//   sheets.spreadsheets.values.update(
//     {
//       auth: client,
//       spreadsheetId: spreadsheetId,
//       range: range,
//       valueInputOption: 'RAW',
//       resource: { values: [newData] },
//     },
//     (err, result) => {
//       if (err) {
//         console.error('The API returned an error: ' + err);
//         return res.status(500).send('Error updating data in Google Sheet');
//       }
//       res.json(result);
//     }
//   );
// });


function processData(data) {
  // Remove the first two rows from the data
  const rows = data.slice(2);
  
  const first16Columns = [];
  const remainingColumns = [];

  let emptyRowCount = 0;

  for (const row of rows) {
    // Check if the row is empty
    const isEmptyRow = row.every(cell => cell === "");

    if (isEmptyRow) {
      emptyRowCount++;
      if (emptyRowCount >= 2) {
        // Stop processing when two empty rows are encountered
        break;
      }
    } else {
      // Reset empty row count if a non-empty row is encountered
      emptyRowCount = 0;

      // Separate the first 15 columns and the remaining columns
      const first16 = row.slice(0, 16);
      const remaining = row.slice(16);

      // Process the row data (you can add your logic here)
      first16Columns.push(first16);
      remainingColumns.push(remaining);
    }
  }

  return { first16Columns, remainingColumns };
}

// function extractColumnsData(data, headers) {
//   const rows = data.slice(2);
//   const headerRow = rows[0];
//   const headerIndices = {};

//   // Find indices of the specified headers in the header row
//   headers.forEach(header => {
//     const index = headerRow.findIndex(cell => cell.trim() === header.trim());
//     if (index !== -1) {
//       headerIndices[header] = index;
//     }
//   });

//   console.log("Header Indices:", headerIndices); // Log header indices for debugging

//   // Extract data based on header indices
//   const extractedData = data.slice(1).map(row => {
//     const rowData = {};
//     Object.entries(headerIndices).forEach(([header, index]) => {
//       rowData[header] = row[index];
//     });
//     return rowData;
//   });

//   return extractedData;
// }







module.exports = router;