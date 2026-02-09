export const DEMO_CODE = `
import express from 'express';
import { query } from './db';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

const SECRET = "temp_secret_key_123"; // TODO: Move to env var

// User Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  // VULNERABILITY: SQL Injection
  const user = await query(\`SELECT * FROM users WHERE username = '\${username}' AND password = '\${password}'\`);
  
  if (user) {
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET);
    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

// Get User Profile
app.get('/profile', async (req, res) => {
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, SECRET);
    // PERFORMANCE: N+1 Query potential if called in list
    const userData = await query(\`SELECT * FROM users WHERE id = \${decoded.id}\`);
    const posts = await query(\`SELECT * FROM posts WHERE user_id = \${decoded.id}\`);
    
    // Simulating heavy computation
    let hugeArray = [];
    for(let i=0; i<1000000; i++) { hugeArray.push(i); } 

    res.json({ user: userData, posts });
  } catch (e) {
    res.status(403).send('Invalid token');
  }
});

app.listen(3000, () => console.log('Server running on 3000'));
`;
