const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Middleware to parse JSON bodies from requests
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
});

// Middleware to log incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} request for '${req.url}'`);
    next();
});

/// Route to get users data
app.get('/data/database.json', (req, res) => {
    fs.readFile(path.join(__dirname, 'data', 'database.json'), 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read database file' });
        }
        res.json(JSON.parse(data));
    });
});

// Route to handle sign-up (API endpoint)
app.post('/api/signup', (req, res) => {
    const newUser = req.body;

    console.log('New user:', newUser);  // Debug: Log the new user data

    // Read the existing data from database.json
    fs.readFile(path.join(__dirname, 'data', 'database.json'), 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading database file:', err);
            return res.status(500).json({ error: 'Failed to read database file' });
        }

        let usersData;
        try {
            usersData = JSON.parse(data);  // Parse current JSON data
        } catch (parseError) {
            console.error('Error parsing JSON data:', parseError);
            return res.status(500).json({ error: 'Invalid database format' });
        }

        // Add the new user to the users array
        usersData.users.push(newUser);

        // Write the updated data back to the file
        fs.writeFile(path.join(__dirname, 'data', 'database.json'), JSON.stringify(usersData, null, 2), (err) => {
            if (err) {
                console.error('Error writing to database file:', err);
                return res.status(500).json({ error: 'Failed to update database file' });
            }

            console.log('User successfully added to the database');  // Debug: Log successful addition
            res.status(200).json({ message: 'User registered successfully' });
        });
    });
});


// API to get all borrowed items
app.get('/api/borrowed-items', (req, res) => {
    const filePath = path.join(__dirname, 'data', 'borrowed_items.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading borrowed_items.json' });
        }

        res.json(JSON.parse(data)); // Send the borrowed items as a JSON response
    });
});

app.post('/api/borrowed-items/update', (req, res) => {
    console.log('Received update request for:', req.body);
    const updatedItem = req.body;
    const filePath = path.join(__dirname, 'data', 'borrowed_items.json');

    // Read the existing data from borrowed_items.json
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            return res.status(500).json({ error: 'Error reading borrowed_items.json' });
        }

        let borrowedItems;
        try {
            borrowedItems = JSON.parse(data);
        } catch (err) {
            console.error('Error parsing JSON data:', err);
            return res.status(500).json({ error: 'Error parsing borrowed_items.json' });
        }

        // Find the index of the item to update
        const itemIndex = borrowedItems.borrowed_items.findIndex(item =>
            item.butiran === updatedItem.butiran && item.tarikh_pinjam === updatedItem.tarikh_pinjam
        );

        if (itemIndex === -1) {
            return res.status(404).json({ error: 'Item not found' });
        }

        // Update the item at the found index
        borrowedItems.borrowed_items[itemIndex] = updatedItem;

        // Write the updated data back to borrowed_items.json
        fs.writeFile(filePath, JSON.stringify(borrowedItems, null, 2), (err) => {
            if (err) {
                console.error('Error writing to JSON file:', err);
                return res.status(500).json({ error: 'Error writing to borrowed_items.json' });
            }

            res.json({ message: 'Borrow item updated successfully' });
        });
    });
});

// API to add a new borrowed item
app.post('/api/borrowed-items/', (req, res) => {
    const newItem = req.body;
    const filePath = path.join(__dirname, 'data', 'borrowed_items.json');

    // Read the existing data from borrowed_items.json
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading borrowed_items.json' });
        }

        const borrowedItems = JSON.parse(data);
        borrowedItems.borrowed_items.push(newItem); // Add the new item

        // Write the updated data back to borrowed_items.json
        fs.writeFile(filePath, JSON.stringify(borrowedItems, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error writing to borrowed_items.json' });
            }

            res.json({ message: 'Borrow request submitted successfully' });
        });
    });
});

/// Other routes and configurations
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve static files from the current directory and assets folder
app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname, 'assets')));

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});