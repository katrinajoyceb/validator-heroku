const express = require('express');
const path = require("path")
const app = express();
const parameterRoutes = express.Router();
var fs = require('fs');
const d3 = require("d3");

const dirPath = 'sessions/September';

const getAllFiles = function(dirPath, arrayOfFiles) {
    files = fs.readdirSync(dirPath)
  
    arrayOfFiles = arrayOfFiles || []
  
    files.forEach(function(file) {
      if (fs.statSync(dirPath + "/" + file).isDirectory()) {
        arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
      } else {
        arrayOfFiles.push(path.join(dirPath, "/", file))
      }
    })
  
    return arrayOfFiles
  }

parameterRoutes.route('/').get(function (req, res) {
    
    
    const result = getAllFiles(dirPath);

    const pattern = 'record';

    const parameterFiles = result.filter(function (str) { return str.includes(pattern); })

    console.log(parameterFiles);
    

    // fs.readdir(testFolder, (err, files) => {
    //     files.forEach(file => {
    //         fs.readdir
    //       console.log(file);
    //     });
    //   });
    
    let parameterArray = [];

    parameterFiles.forEach(function(file) {
        console.log(file);
    })
    
    
    fs.readFile('sessions/September/session_2865/record_d2018-09-18_t16:43:35_s2865_g1.ahdb.csv', 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }

        const headers = ["type","header","value","col1","col2","col3","col4","col5","col6"].join(",");
        const rows = d3.csvParse(headers + "\n"  + data);
        
        const name = rows.filter(r => r.header === "ParameterName");
        const unit = rows.filter(r => r.header === "ParameterUnit");
        const rate = rows.filter(r => r.header === "ParameterRate");
        const startTime = rows.filter(r => r.header === "ParameterStartTime");
        const dataValues = rows.filter(r => r.header === "ParameterData");

        for(var i = 0; i < name.length; i++ ){
            let parameter = new Object();
            parameter.name = name[i].value;
            parameter.unit = unit[i].value;
            parameter.rate = rate[i].value;
            parameter.startTime = startTime[i].value;
            parameter.dataValues = [dataValues[i].value, dataValues[i].col1, dataValues[i].col2, dataValues[i].col3, dataValues[i].col4, dataValues[i].col5];
            
            parameterArray.push(parameter);
            
        }

       

        res.json({ parameter: parameterArray});
   
      });
});

module.exports = parameterRoutes;