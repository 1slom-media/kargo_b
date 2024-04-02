import bcrypt from 'bcrypt'

export async function compare(password:string,hash:string){
    const isMatch= await bcrypt.compare(password, hash);
    return isMatch
}