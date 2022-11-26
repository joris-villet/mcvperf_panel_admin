const router = require('express').Router();
const db = require('../db.js');

// router.get('/:table', async (req, res) => {
//   try {
//     //console.log('table =', req.params.table)
//     const data = await db
//       .select('*')
//       .from(req.params.table)
//       .orderBy('id', 'asc')
//       .offset(0)
//       .limit(20);
    
//     const [dataLenght] = await db(req.params.table).count('*');
//     console.log(dataLenght)
    
//     res.send({
//       result: data,
//       length: dataLenght['count']
//     });
//   }
//   catch (err) {
//     console.log(err);
//     res.send(err);
//   }
// });

router.get('/admin/:table/:offset', async (req, res) => {
  try {
    //console.log('table =', req.params.table)

    console.log("page => ", Number(req.params.offset))
    // if (Number(req.params.page) === 1) offset = 0;

    let offset = Number(req.params.offset);
    
    const data = await db
      .select('*')
      .from(req.params.table)
      .orderBy('id', 'asc')
      .offset(offset)
      .limit(20);
    
    const [dataLenght] = await db(req.params.table).count('*');
    //console.log(dataLenght)
    
    res.send({
      result: data,
      length: dataLenght['count']
    });
  }
  catch (err) {
    console.log(err);
    res.send(err);
  }
});


// router.put('/brands/update/:id', async (req, res) => {
//   try {

//     const data = await db('brands')
//       .where('id', Number(req.params.id))
//       .update({
//         id: req.params.id,
//         name: req.body.name,
//         width: req.body.width,
//         created_at: req.body.created_at,
//         updated_at: new Date()
//       }, ['id'])
    
//     res.send({id: data});

//   }
//   catch (err) {
//     console.log(err);
//     res.send(err);
//   }
// })

router.put('/:table/update/:id', async (req, res) => {
  try {

    //console.log(req.body)

    // let data = undefined;
    
    req.body.updated_at = new Date();
    

    const data = await db(req.params.table)
      .where('id', Number(req.params.id))
      .update(req.body, ['id'])

    
    
    res.send(data);

  }
  catch (err) {
    console.log(err);
    res.send(err);
  }
})


module.exports = router;