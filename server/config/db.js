const mongoose=require('mongoose')

const dbConnection=async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI),
        console.log('Database Connected')
    } catch (error) {
       console.error('Database failed to connect') 
    }
}
module.exports=dbConnection;