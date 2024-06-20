const validateBody=(x)=>{
    const {name,email,password,phone,address,role}=x;
    if(!name){
        return {error:"name is required!"}
    }
    if(!email){
        return {error:"email is required!"}
    }
    if(!password){
        return {error:"password is required!"}
    }
    if(!phone){
        return {error:"phone is required!"}
    }
}
export default validateBody