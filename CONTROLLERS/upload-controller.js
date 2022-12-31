const { StatusCodes } = require("http-status-codes");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const uploadFile = async (req, res) => {
  const file = req.files.file;
  const type = file.mimetype.split("/")[0];
  let result = "";
  if (type === "image") {
    result = await cloudinary.uploader.upload(file.tempFilePath, {
      use_filename: true,
      resource_type: "image",
      folder: "comms-uploads",
    });
  } else if (type === "video") {
    result = await cloudinary.uploader.upload(file.tempFilePath, {
      use_filename: true,
      resource_type: "video",
      folder: "comms-uploads",
    });
  } else if (type === "audio") {
    result = await cloudinary.uploader.upload(file.tempFilePath, {
      use_filename: true,
      resource_type: "video",
      folder: "comms-uploads",
    });
  } else if (type === "application") {
    result = await cloudinary.uploader.upload(file.tempFilePath, {
      use_filename: true,
      pages: true,
      resource_type: "auto",
      folder: "comms-uploads",
    });
  }
  fs.unlinkSync(req.files.file.tempFilePath);
  res.status(StatusCodes.OK).json({ file_link: result.secure_url });
};

module.exports = { uploadFile };
