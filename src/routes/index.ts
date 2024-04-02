import { Router } from "express";
import users from "../controllers/users";
import upload from "../utils/multer";
import checkToken from "../middlewares/checkToken";
import kargos from "../controllers/kargos";
import clients from "../controllers/clients";
import orders from "../controllers/orders";

const router = Router();

router.get("/users", users.Get);
router.get("/users/:id", users.GetId);
router.post("/users", upload.single("avatar"), users.Post);
router.put("/users/:id", upload.single("avatar"), users.Put);
router.delete("/users/:id", users.Delete);
router.post("/login", users.Login);
router.get("/whoami", checkToken, users.WhoAmi);

router.get("/kargos", kargos.Get);
router.get("/kargos/:id", kargos.GetId);
router.post("/kargos", kargos.Post);
router.put("/kargos/:id", kargos.Put);
router.delete("/kargos/:id", kargos.Delete);

router.get("/clients", clients.Get);
router.get("/clients/:id", clients.GetId);
router.post("/clients", clients.Post);
router.put("/clients/:id", clients.Put);
router.delete("/clients/:id", clients.Delete);

router.get("/orders", orders.Get);
router.get("/orders/:id", orders.GetId);
router.post("/orders", upload.single("image"), orders.Post);
router.put("/orders/:id", upload.single("image"), orders.Put);
router.delete("/orders/:id", orders.Delete);

export default router;
