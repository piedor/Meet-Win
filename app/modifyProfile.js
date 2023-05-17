const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens


// ---------------------------------------------------------
// route to authenticate and get a new token
// ---------------------------------------------------------
router.post('', async function(req, res) {


app.use('', tokenChecker);
// request with no valid token stop here
// requests that goes through the tokenChecker have the field `req.loggedUser` set to the decoded token


});



module.exports = router;
