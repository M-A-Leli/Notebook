import Database from '../models/Database';

const dbInstance = Database.getInstance();

const connectDB = async () => {
    try {
        await dbInstance.connect();
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
    }
};

export { dbInstance, connectDB };
