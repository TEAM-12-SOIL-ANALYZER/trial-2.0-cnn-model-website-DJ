import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { spawn } from 'child_process';

async function startServer() {
  const app = express();
  const PORT = 4000;

  app.use(express.json({ limit: '50mb' }));

  app.post('/api/classify', async (req, res) => {
    try {
      const { imageBase64, language } = req.body;

      if (!imageBase64) {
        return res.status(400).json({ error: 'No image provided' });
      }

      // Spawn Python process
      const pythonProcess = spawn('python', ['predict.py']);

      let dataString = '';
      let errorString = '';

      pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorString += data.toString();
        console.error('Python stderr:', data.toString());
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0 && !dataString) {
          console.error('Python process exited with code', code);
          return res.status(500).json({ error: 'Failed to classify soil type (Model Error).' });
        }

        try {
          const parsed = JSON.parse(dataString.trim());
          if (parsed.error) {
            return res.status(500).json({ error: parsed.error });
          }
          res.json(parsed);
        } catch (err) {
          console.error('Failed to parse Python response', err);
          console.error('Raw Python output:', dataString);
          res.status(500).json({ error: 'Failed to parse classification result.' });
        }
      });

      // Send JSON input to python script via stdin
      pythonProcess.stdin.write(JSON.stringify({ imageBase64, language }));
      pythonProcess.stdin.end();

    } catch (error) {
      console.error('Error in /api/classify:', error);
      res.status(500).json({ error: 'Failed to classify soil type.' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
