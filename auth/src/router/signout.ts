import express from 'express'
const router = express.Router();

router.post('/api/users/signout', (req, res) => {
  res.send('Signout page');
});

export { router as signoutRouter };
