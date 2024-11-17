import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },

        followers: [
            {
                //because we'll have many followers type:is object_id so
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        followings: [
            {
                //because we'll have many following type:is object_id so
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true, //user ka created_at and updated_at
    }
);

export const User = mongoose.model("User", schema);
