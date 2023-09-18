import { isValidObjectId } from "mongoose";
import { HttpError } from "../helpers/index.js";

const isValid = (req, res, next) => { 
    const { id } = req.params;
    if (!isValidObjectId(id)) { 
        return next(HttpError(404 `${id} not valid`));
    }
    next();
}
export default isValid;
