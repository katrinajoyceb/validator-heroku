const express = require('express');
const app = express();
const fdeCorrelationRoutes = express.Router();
var fs = require('fs');
const d3 = require("d3");

fdeCorrelationRoutes.route('/').get(function (req, res) {
    fs.readFile('sessions/September/session_2865/event_d2018-09-18_t16:43:35_s2865_g4.evt.csv', 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }

        const headers = ["col1","col2","col3","col4","col5"].join(",");
        const rows = d3.csvParse(headers + "\n" + data);
        const eventTime = rows.filter(r => r.col3 === "UTCTimeStamp");
        const memberSystemName = rows.filter(r => r.col4 === "MemberSystemName");
        const fdeName = rows.filter(r => r.col4 === "FlightDeckEffectName");
        const failureName = rows.filter(r => r.col4 === "FailureName");
        const ataChapter = rows.filter(r => r.col4 === "ATAChapter");
        const flightLeg = rows.filter(r => r.col4 === "FlightLeg");
        const flightPhase = rows.filter(r => r.col4 === "FlightPhase");


        let eventArray = [];

       

        for(var i = 0; i < fdeName.length; i++ ){
            let event = new Object();
            event.type = 'FDECORRELATION';
            event.time = eventTime[i].col4;
            event.memberSystemName = memberSystemName[i].col5,
            event.fdeName = fdeName[i].col5;
            event.failureName = failureName[i].col5;
            event.ataChapter = ataChapter[i].col5;
            event.flightLeg = flightLeg[i].col5;
            event.flightPhase = flightPhase[i].col5;
           console.log(event);
           eventArray.push(event);
            
        }

       
        // eventArray.push(event);

        res.json({ event: eventArray});
   
      });
});

module.exports = fdeCorrelationRoutes;