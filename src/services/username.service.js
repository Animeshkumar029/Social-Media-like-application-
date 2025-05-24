import { nanoid } from "nanoid";
import User from "../model/user.schema.js";

export const generateUsername=async(name)=>{

    let username=`${name}_${nanoid(3)}`;
    let length=3;
    let exist=true;

    while(exist){
        username=`${name}_${nanoid(length)}`;

        const present=await User.findOne({username});
        if(!present) exist=false;
        length++;
    }

    return username;
}
