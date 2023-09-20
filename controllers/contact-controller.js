import Contact from "../models/Contact.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10, favorite } = req.query; 
  const skip = (page - 1) * limit;

  const filter = { owner };
  if (favorite !== undefined) {
    filter.favorite = favorite === "true"; 
  }
  const result = await Contact.find(filter, null, { skip, limit }).populate(
    "owner",
    "email"
  );
  res.json(result);
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const filter = { _id: contactId, owner: req.user._id };
  const result = await Contact.findOne(filter);
  if (!result) {
    throw HttpError(404, `Contact with ${contactId} not found`);
  }
  res.json(result);
};

const add = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const updateById = async (req, res) => {
  const { contactId } = req.params;
  const filter = { _id: contactId, owner: req.user._id };
  const updatedContact = await Contact.findOneAndUpdate(filter, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(updatedContact);
};

const deliteById = async (req, res) => {
  const { contactId } = req.params;
  const filter = { _id: contactId, owner: req.user._id };
  const result = await Contact.findOneAndDelete(filter);
  if (!result) {
    throw HttpError(404, `Contact with id ${contactId} not found`);
  }
  res.status(200).json({ message: "contact deleted" });
};

const favorites = async (req, res) => {
  const { contactId } = req.params;
   const filter = { _id: contactId, owner: req.user._id };
const updatedContact = await Contact.findOneAndUpdate(filter, req.body, {
  new: true,
});
  if (!updatedContact) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(updatedContact);
};

export default {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  updateById: ctrlWrapper(updateById),
  deliteById: ctrlWrapper(deliteById),
  favorites: ctrlWrapper(favorites),
};
