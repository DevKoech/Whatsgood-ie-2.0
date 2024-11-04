import mongoose from 'mongoose';

const connection_url = 'mongodb+srv://admin:dma7G8nRVrtIuuTD@whatsgood-ie-2-0.v8foq.mongodb.net/whatsgooddb?retryWrites=true&w=majority&appName=whatsgood-ie-2-0';

(async () => {
    try {
        await mongoose.connect(connection_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("DB connected successfully");
        process.exit(0); // Exit after successful connection
    } catch (error) {
        console.error("Error connecting to database:", error);
        process.exit(1); // Exit with error code
    }
})();
