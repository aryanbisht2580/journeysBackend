import cron from "node-cron"
import axios from "axios"

export const croning=()=>{
    const BACKEND_URL = 'https://journeysbackend-x.onrender.com'; 

    cron.schedule('*/4 * * * *', async () => {
    try {
        const response = await axios.get(BACKEND_URL);
        console.log(`Backend pinged successfully at ${new Date().toISOString()}`);
    } catch (error) {
        console.error(`Error pinging backend: ${error.message}`);
    }
    });
}
