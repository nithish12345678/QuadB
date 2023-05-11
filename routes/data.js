
const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
require("../model/model")

const router=express.Router();
const user = mongoose.model('user');

// to store top 10 data from https://api.wazirx.com/api/v2/tickers
router.get('/saveData', async (req, res) => {
    try {
      const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
      const data = response.data;
      console.log("data:",data)
      
      // Save data to the MongoDB database
      await user.insertMany(Object.values(data).slice(0, 10));
  
      // Respond with the saved data
      const savedData = await user.find().limit(10);
      res.json(savedData);
      console.log("saved data:",savedData)
    } catch (error) {
      console.error('Error fetching and saving data', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  router.get('/getData', async (req, res) => {
    try {
      
      //getting data from database
      const savedData = await user.find().limit(10);
      res.json(savedData);
      console.log("saved data:",savedData)
    } catch (error) {
      console.error('Error fetching data', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });


module.exports=router;