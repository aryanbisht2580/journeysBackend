import bcrypt from "bcryptjs"
export const hashPassword=async(password)=>{
    try{
        const hp=await bcrypt.hash(password,10);
        return hp;
    }
    catch(err){
        console.log(err);
    }
}
export const compareHash=async(password,hashPassword)=>{
    return bcrypt.compare(password,hashPassword);
}