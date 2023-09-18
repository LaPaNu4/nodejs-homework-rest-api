import express from "express";
import { contactAddSchema, contactChangeSchema } from "../../models/Contact.js";
import contactController from "../../controllers/contact-controller.js";
import { validateBody } from "../../decorators/index.js";
import isValid from "../../middlewares/isValidid.js";

const contactsRouter = express.Router();

const contactAddValidate = validateBody(contactAddSchema);
const contactUpdateFavoriteValidate = validateBody(contactChangeSchema);

contactsRouter.get("/", contactController.getAll);

contactsRouter.get("/:contactId", isValid, contactController.getById);

contactsRouter.post("/", contactAddValidate, contactController.add);

contactsRouter.put(
  "/:contactId",
  isValid,
  contactAddValidate,
  contactController.updateById
);

contactsRouter.delete("/:contactId", isValid, contactController.deliteById);

contactsRouter.patch(
  "/:contactId/favorite",
  isValid,
  contactUpdateFavoriteValidate,
  contactController.favorites
);

export default contactsRouter;
