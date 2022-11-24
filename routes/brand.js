const router = require('express').Router();
const db = require('../db.js');

router.get('/:table', async (req, res) => {
  try {
    console.log('table =', req.params.table)
    const data = await db.select('*').from(req.params.table);
    res.send(data);
  }
  catch (err) {
    console.log(err);
  }
});


module.exports = router;