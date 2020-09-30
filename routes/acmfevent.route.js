const express = require('express');
const app = express();
const acmfeventRoutes = express.Router();
var fs = require('fs');
const d3 = require("d3");

acmfeventRoutes.route('/').get(function (req, res) {
    fs.readFile('sessions/September/session_2865/event_d2018-09-18_t16:43:35_s2865_g1.evt.csv', 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }

        const headers = ["col1","col2","col3","col4","col5","col6", "col7", "col8", "col9", "col10"].join(",");
        const rows = d3.csvParse(headers + "\n" + data);
        const name = rows.filter(r => r.col4 === "ParameterName");
        const unit = rows.filter(r => r.col4 === "ParameterUnit");
        const startTime = rows.filter(r => r.col4 === "ParameterStartTime");
        const results = rows.filter(r => r.col4 === "ParameterData");

        let eventArray = [];
        for(var e in name){
          console.log(name[e].col5);
          let event = new Object();
          event.type = 'ACMF';
          event.name = name[e].col5;
          event.unit = unit[e].col5;
          event.time = startTime[e].col5;
          event.results = [results[e].col5, results[e].col6, results[e].col7, results[e].col8];

          eventArray.push(event);
         
        }
        
        console.log(eventArray);
        res.json({ event: eventArray});

   
      });
});

module.exports = acmfeventRoutes;