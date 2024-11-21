import { Pin } from "../models/pinModel.js";
import TryCatch from "../utils/tryCatch.js";
import getDataUrl from "../utils/urlGenerator.js";
import cloudinary from "cloudinary";

export const createPin = TryCatch(async (req, res) => {
    const { title, pin } = req.body;

    const file = req.file;
    const fileUrl = getDataUrl(file);

    const cloud = await cloudinary.v2.uploader.upload(fileUrl.content);

    await Pin.create({
        title,
        pin,
        image: {
            id: cloud.public_id,
            url: cloud.secure_url,
        },
        owner: req.user._id,
    });
    res.json({
        message: "Pin Created",
    });
});

//get all pins
export const getAllPins = TryCatch(async (req, res) => {
    const pins = await Pin.find().sort({ createdAt: -1 }); //latest sbse first

    res.json(pins);
});

//get single pin
export const getSinglePin = TryCatch(async (req, res) => {
    const pin = await Pin.findById(req.params.id).populate(
        "owner",
        "-passwrod"
    );

    res.json(pin);
});

//comments
export const commentOnPin = TryCatch(async (req, res) => {
    const pin = await Pin.findById(req.params.id);

    //checkpoint
    if (!pin)
        return res.status(400).json({
            message: "no Pin with this Id",
        });

    pin.comments.push({
        user: req.user._id,
        name: req.user.name,
        comment: req.body.comment,
    });

    await pin.save();

    res.json({
        message: "Comment Added",
    });
});

//COMMENTS IS AN ARRAY

//delete commnet
export const deleteComment = TryCatch(async (req, res) => {
    //fetching pin
    const pin = await Pin.findById(req.params.id);
    //if pin not found
    if (!pin)
        return res.status(400).json({
            message: "no pin with this Id",
        });

    //now finding comment id for deleting it

    if (!req.query.commentId)
        //comment ki id ese lete hai
        return res.status(404).json({
            message: "please give comment id",
        });

    const commentIndex = pin.comments.findIndex(
        (item) => item._id.toString() === req.query.commentId.toString()
    );

    //if commnet index nahi milta hai toh value -1 return hogi
    //agar current id se koi comment nahi hai toh
    if (commentIndex === -1) {
        return res.status(404).json({
            message: "Comment not found",
        });
    }

    //if comment hai then {login user k}
    const comment = pin.comments[commentIndex];

    if (comment.user.toString() === req.user._id.toString()) {
        pin.comments.splice(commentIndex, 1);
        await pin.save();

        return res.json({
            message: "Comment Deleted",
        });
    } else {
        return res.status(403).json({
            message: "you are not owner of this comment",
        });
    }
});

//deleting pin
export const deletePin = TryCatch(async (req, res) => {
    const pin = await Pin.findById(req.params.id);
    if (!pin)
        return res.status(400).json({
            message: "No pin with this id",
        });

    if (pin.owner.toString() !== req.user._id.toString())
        return res.status(403).json({
            message: "unauthorized",
        });

    await cloudinary.v2.uploader.destroy(pin.image.id);
    await pin.deleteOne();

    res.json({
        message: "pin Deleted",
    });
});

//update pin
export const updatePin = TryCatch(async (req, res) => {
    const pin = await Pin.findById(req.params.id);

    if (!pin)
        return res.status(400).json({
            message: "No pin with this id",
        });
    //now well check if owner of the pin exist or not
    if (pin.owner.toString() !== req.user._id.toString())
        return res.status(403).json({
            message: "Unauthorized",
        });

    pin.title=req.body.title;
    pin.pin=req.body.pin//description
    await pin.save()
    res.json({
        message:"pin updated"
    })
});
