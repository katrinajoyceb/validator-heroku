const express = require('express');
const app = express();
const fdeRoutes = express.Router();
var fs = require('fs');
const d3 = require("d3");

fdeRoutes.route('/').get(function (req, res) {
    fs.readFile('sessions/September/session_2865/event_d2018-09-18_t16:43:35_s2865_g3.evt.csv', 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }

        const headers = ["col1","col2","col3","col4","col5"].join(",");
        const rows = d3.csvParse(headers + "\n" + data);
        const eventTime = rows.filter(r => r.col3 === "UTCTimeStamp");
        const fdeName = rows.filter(r => r.col4 === "FlightDeckEffectName");
        const transitionState = rows.filter(r => r.col4 === "TransitionState");
        const severity = rows.filter(r => r.col4 === "Severity");
        const ataChapter = rows.filter(r => r.col4 === "ATAChapter");
        const flightLeg = rows.filter(r => r.col4 === "FlightLeg");
        const flightPhase = rows.filter(r => r.col4 === "FlightPhase");

        let eventArray = [];

        let event = new Object();
        event.type = 'FDE';
        event.time = eventTime[0].col4;
        event.fdeName = fdeName[0].col5;
        event.transitionState = transitionState[0].col5;
        event.severity = severity[0].col5;
        event.ataChapter = ataChapter[0].col5;
        event.flightLeg = flightLeg[0].col5;
        event.flightPhase = flightPhase[0].col5;

        console.log(event);

        eventArray.push(event);

        res.json({ event: eventArray});

   
      });
});

module.exports = fdeRoutes;