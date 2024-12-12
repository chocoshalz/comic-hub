import { Router, Request, Response } from 'express';

const router = Router();

// Example of a GET route to fetch all users
router.get('/users', (req: Request, res: Response) => {
  res.json({ message: "Get all users" });
});

// Example of a POST route for creating a user
router.post('/users', (req: Request, res: Response) => {
  const user = req.body; // assuming you send user data in the body
  res.json({ message: "Create a new user", user });
});

// Example of a GET route to fetch a user by ID
router.get('/users/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({ message: `Get user with ID: ${id}` });
});

// Example of a PUT route for updating a user
router.put('/users/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedUser = req.body;  // assuming you send the updated user data in the body
  res.json({ message: `Update user with ID: ${id}`, updatedUser });
});

// Example of a DELETE route for deleting a user
router.delete('/users/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({ message: `Delete user with ID: ${id}` });
});

export default router;
