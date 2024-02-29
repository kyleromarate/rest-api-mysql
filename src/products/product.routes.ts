import express, { Request, Response } from "express";
import { UnitProduct } from "./product.interface";
import { StatusCodes } from "http-status-codes";
import * as database from "./product.database";

export const productRouter = express.Router();

productRouter.get("/products", async (req: Request, res: Response) => {
    try {
        const allProducts: UnitProduct[] = await database.findAll();

        if (!allProducts || allProducts.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ msg: "No products found." });
        }

        return res.status(StatusCodes.OK).json({ total_products: allProducts.length, products: allProducts });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
});

productRouter.get("/product/:id", async (req: Request, res: Response) => {
    try {
        const productId = req.params.id;
        const product: UnitProduct | null = await database.findOne(productId);

        if (!product) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: `Product with ID ${productId} not found.` });
        }

        return res.status(StatusCodes.OK).json({ product });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
});

productRouter.post("/product", async (req: Request, res: Response) => {
    try {
        const { name, price, quantity, image } = req.body;

        if (!name || !price) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "Please provide name and price for the product." });
        }

        const newProduct = await database.create({ name, price, quantity, image });
        return res.status(StatusCodes.CREATED).json({ newProduct });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
});

productRouter.put('/product/:id', async (req: Request, res: Response) => {
    try {
        const { name, price } = req.body;
        const productId = req.params.id;

        if (!name || !price) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "Please provide name and price for the product." });
        }

        const existingProduct = await database.findOne(productId);
        if (!existingProduct) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: `Product with ID ${productId} not found.` });
        }

        const updatedProduct = await database.update(productId, { name, price });
        return res.status(StatusCodes.OK).json({ updatedProduct });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
});

productRouter.delete("/product/:id", async (req: Request, res: Response) => {
    try {
        const productId = req.params.id;
        const existingProduct = await database.findOne(productId);

        if (!existingProduct) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: `Product with ID ${productId} not found.` });
        }

        await database.remove(productId);
        return res.status(StatusCodes.OK).json({ msg: `Product with ID ${productId} deleted.` });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
});

export default productRouter;