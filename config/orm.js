var connection = require("../config/connection.js");

function printQuestionMarksHelper(num) {
  var arr = [];

  for (var i = 0; i < num; i++) {
    arr.push("?");
  }

  return arr.toString();
}

function convertObjectsToSQLSyntax(ob) {
  var arr = [];

  // loop through the keys and push the key/value as a string int arr
  for (var key in ob) {
    var value = ob[key];
    // check to skip hidden properties
    if (Object.hasOwnProperty.call(ob, key)) {
      // if string with spaces, add quotations (Lana Del Grey => 'Lana Del Grey')
      if (typeof value === "string" && value.indexOf(" ") >= 0) {
        value = "'" + value + "'";
      }
      // e.g. {name: 'Lana Del Grey'} => ["name='Lana Del Grey'"]
      // e.g. {sleepy: true} => ["sleepy=true"]
      arr.push(key + "=" + value);
    }
  }

  // translate array of strings to a single comma-separated string
  return arr.toString();
}

var orm  = {

  all: function(tablevalue, callback) {
    var queryString = "SELECT * FROM " + tablevalue + ";";
    var k = connection.query(queryString, function(err, result) {
      if (err) {
        throw err;
      }
    
      callback(result);
    });
  },
  create: function(table, cols, vals, callback) {
     
    var queryString = "INSERT INTO " + table;

    queryString += " (";
    queryString += cols.toString();
    queryString += ") ";
    queryString += "VALUES (";
    queryString += printQuestionMarksHelper(vals.length);
    queryString += ") ";

    console.log(`${vals}`);

    connection.query(queryString, vals, function(err, result) {
      if (err) {
        throw err;
      }

      callback(result);
    });
  },
  update: function(table, objColVals, condition, callback) {
    var queryString = "UPDATE " + table;

    queryString += " SET ";
    queryString += convertObjectsToSQLSyntax(objColVals);
    queryString += " WHERE ";
    queryString += condition;

    console.log(queryString);
    connection.query(queryString, function(err, result) {
      if (err) {
        throw err;
      }
      callback(result);
    });
  }
};

module.exports = orm;