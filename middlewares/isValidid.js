import { isValidObjectId } from "mongoose";
import { HttpError } from "../helpers/index.js";

const isValid = (req, res, next) => { 
    const { contactId } = req.params;
    if (!isValidObjectId(contactId)) {
      return next(HttpError(404, `${contactId} not valid`));
    }
    next();
}
export default isValid;
