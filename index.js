var con = require('./connection');
var express = require('express');
var app = express();
var bp = require('body-parser');   //parsing the incoming request bodies in a middleware
var cors = require('cors');  //Cross-Origin Resource Sharing i   , front-end client can make requests for resources to an external back-end server. 
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

app.use(cors());

app.set('view engine', 'ejs');    //allow us to render web pages using template files. These templates are filled with actual data and served to the client
//.................................................for all links................................................

app.get('/', function (req, res) {
    res.render(__dirname+'/link');
});

//.................................................for donation{EJS:-}.................................................


app.post('/donation_done', function (req, res) {
    var {firstName,lastName,phoneNumber,donationAmount,donationItem,donationAddress,city,state,postalCode,country} = req.body;

    var sql = "INSERT INTO donation (firstName, lastName, phoneNumber, donationAmount,  donationItem, donationAddress, city, state, postalCode, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    con.query(sql, [firstName, lastName, phoneNumber, donationAmount,  donationItem, donationAddress, city, state, postalCode, country], function (err, result) {
        if (err) {
            console.error("Error in donation_done:", err);
            return res.status(500).send("Internal Server Error");
        }
        res.redirect('/data');
    });
});
 


app.get('/data', function (req, res) {
    var sql = "SELECT * FROM donation";
    con.query(sql, function (err, result) {
        if (err) {
            console.error("Error in data:", err);
            return res.status(500).send("Internal Server Error");
        }
        res.render(__dirname + "/data", { data: result });
    });
});

app.get('/delete-data', function (req, res) {
    var sql = "DELETE FROM donation WHERE dId=?";
    var dId = req.query.dId;
    con.query(sql, [dId], function (err, result) {
        if (err) {
            console.error("Error in delete-data:", err);
           
        }
        res.redirect('/data');
    });
});

app.get('/updateData', function (req, res) {
    var sql = "SELECT * FROM donation WHERE dId=?";
    var dId = req.query.dId;
    con.query(sql, [dId], function (err, result) {
        if (err) {
            console.error("Error in update-data:", err);
        }
        res.render(__dirname+"/update",{student:result});
    });
});


app.post('/updateData_done',function(req,res){
    var {firstName,lastName,phoneNumber,donationAmount,donationItem,donationAddress,city,state,postalCode,country,dId} = req.body;
    var sql="UPDATE donation SET firstName=? ,lastName=? ,phoneNumber=? ,donationAmount=? ,donationItem=? ,donationAddress=? ,city=? ,state=? ,postalCode=? ,country=? where dId=? ";
    con.query(sql, [firstName,lastName,phoneNumber,donationAmount,donationItem,donationAddress,city,state,postalCode,country,dId] ,function(err,result){
        if(err) throw err;

        res.redirect('/data');
    });
});
  
// ***************************************postman***********************************************************

app.get('/donationget',(req,res)=>{
    var sql = 'select * from donation';
    con.query(sql,(err,results)=>{
        if (err) {
            console.error('Error retrieving data from database: ', err);
            res.status(500).json({ success: false, error: err.message });
          } else {
            console.log('Data retrieved successfully');
            res.json({ success: true, data: results });
          }

    });
})


app.get('/donationget/:id', (req, res) => {
    const donationId = req.params.id;
    const sql = 'SELECT * FROM donation WHERE id = ?';
  
    con.query(sql, [donationId], (err, results) => {
      if (err) {
        console.error('Error retrieving data from the database: ', err);
        res.status(500).json({ success: false, error: err.message });
      } else {
        if (results.length === 0) {
          // No data found for the given ID
          res.status(404).json({ success: false, message: 'Donation not found' });
        } else {
          console.log('Data retrieved successfully');
          res.json({ success: true, data: results[0] });
        }
      }
    });
  });
  


app.post('/donation_done', function (req, res) {
    var { firstName, lastName, phoneNumber, donationAmount, donationItem, donationAddress, city, state, postalCode, country } = req.body;

    var sql = "INSERT INTO donation (firstName, lastName, phoneNumber, donationAmount,  donationItem, donationAddress, city, state, postalCode, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    con.query(sql, [firstName, lastName, phoneNumber, donationAmount, donationItem, donationAddress, city, state, postalCode, country], function (err, result) {
        if (err) {
            console.error("Error in donation_done:", err);
            return res.status(500).json({ success: false, error: "Internal Server Error" });
        }
        res.status(201).json({ success: true, message: "Donation added successfully" });
    });
});



app.delete('/donation/:donationId', function (req, res) {
    const donationId = req.params.dId;

    if (!donationId) {
        return res.status(400).json({ success: false, error: "Invalid donation ID" });
    }

    var sql = "DELETE FROM donation WHERE dId = ?";

    con.query(sql, [donationId], function (err, result) {
        if (err) {
            console.error("Error in deleting donation:", err);
            return res.status(500).json({ success: false, error: "Internal Server Error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Donation not found" });
        }

        res.json({ success: true, message: "Donation deleted successfully" });
    });
});


app.put('/donation/:id', (req, res) => {
    const donationId = req.params.id;
    const { firstName, lastName, phoneNumber, donationAmount, donationItem, donationAddress, city, state, postalCode, country } = req.body;
    const data = [firstName, lastName, phoneNumber, donationAmount, donationItem, donationAddress, city, state, postalCode, country, donationId];
  
    const sql = `
      UPDATE donation
      SET firstName=?, lastName=?, phoneNumber=?, donationAmount=?, donationItem=?, donationAddress=?, city=?, state=?, postalCode=?, country=?
      WHERE did=?
    `;
  
    con.query(sql, data, (err, result) => {
      if (err) {
        console.error('Error updating data in the database: ', err);
        res.status(500).json({ success: false, error: err.message });
      } else {
        if (result.affectedRows === 0) {
          // No rows were affected, indicating that the donation with the given ID was not found
          res.status(404).json({ success: false, message: 'Donation not found' });
        } else {
          console.log('Data updated successfully');
          res.json({ success: true, message: 'Donation updated successfully' });
        }
      }
    });
  });
  











//....................................Contact us form {for POST MAN:-}................................................

app.get('/Contactget', (req, res) => {
    // Retrieve data from the MySQL database
    var sql = 'SELECT * FROM contact';
    con.query(sql, (err, results) => {
      if (err) {
        console.error('Error retrieving data from database: ', err);
        res.status(500).json({ success: false, error: err.message });
      } else {
        console.log('Data retrieved successfully');
        res.json({ success: true, data: results });
      }
    });
  });


  app.get('/Contactget/:id', (req, res) => {
    // Retrieve data from the MySQL database for a specific ID
    const contactId = req.params.id;
    const sql = 'SELECT * FROM contact WHERE id = ?';
  
    con.query(sql, [contactId], (err, results) => {
      if (err) {
        console.error('Error retrieving data from database: ', err);
        res.status(500).json({ success: false, error: err.message });
      } else {
        if (results.length === 0) {
          // No data found for the given ID
          res.status(404).json({ success: false, message: 'Contact not found' });
        } else {
          console.log('Data retrieved successfully');
          res.json({ success: true, data: results[0] });
        }
      }
    });
  });
  

  app.delete('/Contact/:id', (req, res) => {
    const contactId = parseInt(req.params.id, 10);

  
    // Delete data from the MySQL database based on contact ID
    const sql = 'DELETE FROM contact WHERE id = ?';
    con.query(sql, [contactId], (err, result) => {
      if (err) {
        console.error('Error deleting data from database: ', err);
        res.status(500).json({ success: false, error: err.message });
      } else {
        if (result.affectedRows > 0) {
          console.log('Data deleted successfully');
          res.json({ success: true, message: 'Data deleted successfully' });
        } else {
          console.log('No matching data found for deletion');
          res.status(404).json({ success: false, message: 'No matching data found for deletion' });
        }
      }
    });
  });
  
  






app.post('/Contact', (req, res) => {
    var { name, email, message } = req.body;
  
    // Insert data into the MySQL database
    var sql = 'INSERT INTO contact (name, email, message) VALUES (?, ?, ?)';
    con.query(sql, [name, email, message], (err, result) => {
      if (err) {
        console.error('Error inserting data into database: ', err);
        res.status(500).json({ success: false, error: err.message });
      } else {
        console.log('Data inserted successfully');
        res.json({ success: true });
      }
    });
  });
 

app.put('/Contact/:id', (req, res) => {
    const data = [req.body.name, req.body.email, req.body.message, req.params.id];
    const sql = "UPDATE contact SET name=?, email=?, message=? WHERE id=?";
    
    con.query(sql, data, (err, result) => {
      if (err) {
        console.error('Error updating data in the database: ', err);
        res.status(500).json({ success: false, error: err.message });
      } else {
        if (result.affectedRows === 0) {
          // No rows were affected, indicating that the contact with the given ID was not found
          res.status(404).json({ success: false, message: 'Contact not found' });
        } else {
          console.log('Data updated successfully');
          res.json({ success: true, message: 'Contact updated successfully' });
        }
      }
    });
  });
  


  //...........for Contactus {ejs}.......................................

 
  app.get('/contact',function(req,res){
    var sql = "SELECT * FROM contact";
    con.query(sql,function(err,result){
        if(err){
            console.error("Error in data:", err);
            return res.status(500).send("Internal Server Error");
        }
        res.render(__dirname + "/contact",{contact: result});
    }); 
  });

  app.get('/delete-contact', function (req, res) {
    var sql = "DELETE FROM contact WHERE id=?";
    var id= req.query.id;
    con.query(sql, [id], function (err, result) {
        if (err) {
            console.error("Error in delete-data:", err);
           
        }
        res.redirect('/contact');
    });
});

app.get('/update-contact', function (req, res) {
    var sql = "SELECT * FROM contact WHERE id=?";
    var id = req.query.id;
    con.query(sql, [id], function (err, result) {
        if (err) {
            console.error("Error in update-data:", err);
        }
        res.render(__dirname+"/contactUpdate",{con:result});
    });
});


app.post('/update-contact',function(req,res){
    var {name,email,message,id} = req.body;
    var sql="UPDATE contact SET name=? ,email=?, message=? where id=? ";
    con.query(sql, [name,email,message,id] ,function(err,result){
        if(err) throw err;

        res.redirect('/contact');
    });
});

// ..................................for trestimonial {POST MAN:-}......................................................

app.get('/card', (req, res) => {
  const sql = 'SELECT * FROM testimonials';
  con.query(sql, (err, result) => {
    if (err) {
      console.error('Error retrieving testimonials from the database:', err);
      res.status(500).json({ success: false, error: err.message });
    } else {
      res.json({ success: true, data: result });
    }

  }); 
});

app.post('/card', (req, res) => {
  const { name, role, message, image } = req.body;

  // Validate the input (you might want to add more validation)
  if (!name || !role || !message || !image) {
    return res.status(400).json({ success: false, error: 'Invalid input' });
  }

  const sql = 'INSERT INTO testimonials (name, role, message, image) VALUES (?, ?, ?, ?)';
  const values = [name, role, message, image];

  con.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error adding testimonial to the database:', err);
      return res.status(500).json({ success: false, error: err.message });
    }

    res.json({ success: true, message: 'Testimonial added successfully', data: { id: result.insertId, name, role, message, image } });
  });
});

app.delete('/card/:id', (req, res) => {
  const cardId = req.params.id;

  // Validate the input (you might want to add more validation)
  if (!cardId) {
    return res.status(400).json({ success: false, error: 'Invalid input' });
  }

  const sql = 'DELETE FROM testimonials WHERE id = ?';
  const values = [cardId];

  con.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error deleting testimonial from the database:', err);
      return res.status(500).json({ success: false, error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Testimonial not found' });
    }

    res.json({ success: true, message: 'Testimonial deleted successfully' });
  });
});





app.put('/card/:id', (req, res) => {
  const cardId = req.params.id;
  const { name, role, message } = req.body;

  const data = [req.body.name, req.body.role, req.body.message, req.params.id];

  const sql = 'UPDATE testimonials SET name = ?, role = ?, message = ? WHERE id = ?';
  // const values = [name, role, message, cardId];

  con.query(sql, data, (err, result) => {
    if (err) {
      console.error('Error updating testimonial in the database:', err);
      return res.status(500).json({ success: false, error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Testimonial not found' });
    }
 
    res.json({ success: true, message: 'Testimonial updated successfully', data: { id: cardId, name, role, message } });
  });
});
// ..........................................for {EJS:-}..................................


app.get('/cards',function(req,res){
  var sql = "SELECT * FROM testimonials";
  con.query(sql,function(err,result){
      if(err){
          console.error("Error in data:", err);
          return res.status(500).send("Internal Server Error");
      }
      res.render(__dirname + "/cards",{data: result});
  }); 
});


app.get('/delete-cards', function (req, res) {
  var sql = "DELETE FROM testimonials WHERE id=?";
  var id= req.query.id;
  con.query(sql, [id], function (err, result) {
      if (err) {
          console.error("Error in delete-data:", err);
         
      }
      res.redirect('/cards');
  });
});

app.get('/update-cards', function (req, res) {
  var sql = "SELECT * FROM testimonials WHERE id=?";
  var id = req.query.id;
  con.query(sql, [id], function (err, result) {
      if (err) {
          console.error("Error in update-data:", err);
      }
      res.render(__dirname+"/cardUpadte",{data:result});
  });
});
   

app.post('/update-cards',function(req,res){
  var {name,role,message,id} = req.body;
  var sql="UPDATE testimonials SET name=? ,role=?, message=? where id=? ";
  con.query(sql, [name,role,message,id] ,function(err,result){
      if(err) throw err;

      res.redirect('/cards');
  });
});
app.listen(8080, function () {
    console.log('Server started on port 8080'); 
});

 

