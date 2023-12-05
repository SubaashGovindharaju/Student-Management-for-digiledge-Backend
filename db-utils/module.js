import mongoose from "mongoose";



const appUserSchema = new mongoose.Schema({
      Name: {
        type: 'string',
        require: true,
    },
    Gender: {
        type: 'string',
        require: true,
    },
    Age: {
        type: 'string',
        require: true,
    },
    Image: {
        type: 'String',
        require: true,
    },
    
});

export const AppUserModel = mongoose.model('app-users ', appUserSchema);
