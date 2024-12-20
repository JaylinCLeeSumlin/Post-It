// User.js
const pool = require('./db'); // Import the database pool
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key'; // Use an environment variable for this in production

// User class to manage users
class User {
    constructor(user_id, email, password, name = 'Unknown') {
        this.user_id = user_id;
        this.email = email;
        this.password = password;
        this.name = name;
    }

    // Helper function to hash a value using MD5
    static hashMD5(value) {
        return crypto.createHash('md5').update(value).digest('hex');
    }

    // Hash password with bcrypt
    static async hashPassword(password) {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    // Compare password with hashed password
    static async comparePassword(password, hash) {
        return await bcrypt.compare(password, hash);
    }

    // Add this method inside the User class
    static validatePassword(password) {
        if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long.');
        }
        if (!/[A-Z]/.test(password)) {
        throw new Error('Password must contain at least one uppercase letter.');
        }
        if (!/[a-z]/.test(password)) {
        throw new Error('Password must contain at least one lowercase letter.');
        }
        if (!/[0-9]/.test(password)) {
        throw new Error('Password must contain at least one number.');
        }
        if (!/[\W_]/.test(password)) {
        throw new Error('Password must contain at least one special character.');
        }
    }


    // Register a new user
    async addUser(cb) {
        try {
            
            const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [this.email]);

            if (existingUser.rows.length > 0) {
                // throw new Error('User with this email already exists.');
                cb({"err": 'User with this username already exists.',"code":501})
                return
            }

            // Check username uniqueness
            // const existingUsername = await pool.query('SELECT * FROM users WHERE name = $1', [this.name]);
            // if (existingUsername.rows.length > 0) {
                // throw new Error('User with this username already exists.');
            // }

            //Validate and hash password
            // try{
            //     User.validatePassword(this.password);
            // }catch( err){
            //     cb({"err": 'User with this username already exists.',"code":501})
            // }
            
            const hashedPassword = await User.hashPassword(this.password);
            const result = await pool.query(
                'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
                [this.name, this.email, hashedPassword]
            );
            this.user_id = result.rows[0].user_id;
            // return result.rows[0];
            cb({data:result.rows[0], code:100})
        } catch (err) {
            console.error('Error adding user:', err);
            throw err;
        }
    }

    // Authenticate user by verifying email and password
    // static async authenticate(email, password,cb) {
    //     try {
    //         const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    //         if (result.rows.length === 0) {
    //             cb( { err:500 })
    //         }

    //         const user = result.rows[0];
    //         const isPasswordValid = await User.comparePassword(password, user.password);
            
    //         // Generate JWT token
    //         const token = jwt.sign({ user_id: user.user_id, email: user.email }, secretKey, { expiresIn: '1h' });
    //         cb( { token:token, user:user });
    //     } catch (err) {
    //         console.error('Authentication error:', err);
    //         cb( { err:500 })
    //     }
    // }

    // // Verify JWT token
    // static verifyToken(token) {
    //     try {
    //         const decoded = jwt.verify(token, secretKey);
    //         return decoded;
    //     } catch (err) {
    //         console.error('Token verification failed:', err);
    //         return null;
    //     }
    // }

    static async authenticate(email, password, cb) {
        try {
            const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
            if (result.rows.length === 0) {
                return cb(new Error('User not found.'), null);
            }
    
            const user = result.rows[0];
    
            // Compare the input password hashed with MD5 if necessary
            let isPasswordValid = false;
            if (user.password.startsWith('$2b$')) {
                // bcrypt hash
                isPasswordValid = await bcrypt.compare(password, user.password);
            } else {
                // Legacy MD5 hash comparison
                const hashedMD5 = User.hashMD5(password);
                isPasswordValid = hashedMD5 === user.password;
    
                // If valid, rehash with bcrypt
                if (isPasswordValid) {
                    const newHashedPassword = await bcrypt.hash(password, 10);
                    await pool.query('UPDATE users SET password = $1 WHERE email = $2', [newHashedPassword, email]);
                }
            }
    
            if (!isPasswordValid) {
                return cb(new Error('Invalid credentials.'), null);
            }
    
            // Generate JWT token
            const token = jwt.sign({ user_id: user.user_id, email: user.email }, secretKey, { expiresIn: '1h' });
            cb(null, { token, user });
        } catch (err) {
            console.error('Authentication error:', err);
            cb(err, null);
        }
    }
    

     ///Retrieve User without using Userid
     static async getUserByEmailOrUsername(identifier) {
        try {
            const result = await pool.query(
                'SELECT user_id, email, name FROM users WHERE email = $1 OR name = $2',
                [identifier, identifier]
            );

            if (result.rows.length === 0) {
                throw new Error('User not found.');
            }

            return result.rows[0];
        } catch (err) {
            console.error('Error retrieving user:', err);
            throw err;
        }
    }

    // Retrieve user profile by user_id
    static async getUserProfile(user_id) {
        try {
            const result = await pool.query('SELECT user_id, email, name FROM users WHERE user_id = $1', [user_id]);
            if (result.rows.length === 0) {
                throw new Error('User not found.');
            }
            return result.rows[0];
        } catch (err) {
            console.error('Error retrieving user profile:', err);
            throw err;
        }
}
}

module.exports = User; // Export the User class
