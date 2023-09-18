import Contact from "../models/Contact.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";


const getAll = async(req, res) => {
     const result = await Contact.find();
    res.json(result);
}

const getById = async (req, res) => { 
   const { contactId } = req.params;
   const result = await Contact.findById(contactId);
   if (!result) {
     throw HttpError(404, `Contact with ${contactId} not found`);
   }
   res.json(result); 
}

const add = async (req, res) => { 
    const result = await Contact.create(req.body);
    res.status(201).json(result);
}

const updateById = async (req, res) => { 
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(result);
}

const deliteById = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndDelete(contactId);
    if (!result) {
      throw HttpError(404, `Contact with id ${contactId} not found`);
    }
    res.status(200).json({ message: "contact deleted" });
}
 
const favorites = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(result);
}
 
export default {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    updateById: ctrlWrapper(updateById),
    deliteById: ctrlWrapper(deliteById),
    favorites: ctrlWrapper(favorites),
}