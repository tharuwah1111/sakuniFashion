const db = require("../db/database");

// get last id of product
const getLastProductId = async () => {
    const sql = "SELECT Product_id FROM Product ORDER BY CAST(SUBSTRING(Product_id, 9) AS UNSIGNED) DESC LIMIT 1";

    return new Promise((resolve, reject) => {
        db.query(sql, (error, result) => {
            if (error) {
                return reject(error);
            }

            if (result.length === 0) {
                return resolve("Product_0");
            }

            return resolve(result[0].Product_id);
        });
    });
};

//create new product id
const newProductId = async () => {
    const lastId = await getLastProductId();
    const numberPart = parseInt(lastId.substring(8));
    const newId = "Product_" + (numberPart + 1);
    return newId;
}

//create new products 
//req => Product_name , [Colours] , Catogory , Price_per_product , Fee_for_task
//res = > if successfull true      else false

const createProduct = async (req, res) => {
    try {
        const { Product_name, Colours, Catogory, Price_per_product, Fee_for_task } = req.body;
        const sql = "INSERT INTO Product (Product_id , Product_name , Colour , Catogory , Price_per_product,Fee_for_task,is_deleted) VALUES(?,?,?,?,?,?,0)";

        for (const colour of Colours) {
            const Product_id = await newProductId();

            await new Promise((resolve, reject) => {
                db.query(
                    sql, [Product_id, Product_name, colour, Catogory, Price_per_product, Fee_for_task],
                    (error, result) => {
                        if (error) {
                            return reject(error);
                        }

                        resolve(result);
                    }
                );
            });
        }

        return res.json({
            successfull: true,
            message: "Products created successfully"
        });

    }
    catch (error) {
        return res.json({
            message: "Database Failure",
            error,
            successfull: false
        });
    }

}


//delete product 
//req = > Product_name
//res = > successful true/false
const deleteProduct = async (req, res) => {
    try {
        const { Product_name } = req.body;
        const sql = "UPDATE Product SET is_deleted = 1 WHERE Product_name = ?";
        db.query(sql, [Product_name], (error) => {
            if (error) {
                return res.json({
                    successfull: false
                })
            }
            else {
                return res.json({
                    successfull: true
                })
            }
        });

    }
    catch (error) {
        return res.json({
            message: "Database Failure",
            error,
            successfull: false
        });
    }
}

//delete one colour only
//req => Product_id
//res = > successful true/false
const deleteProductColour = async (req, res) => {
    try {
        const { Product_id } = req.body;
        const sql = "UPDATE Product SET is_deleted = 1 WHERE Product_id = ?";
        db.query(sql, [Product_id], (error) => {
            if (error) {
                return res.json({
                    successfull: false
                })
            }
            else {
                return res.json({
                    successfull: true
                })
            }
        });

    }
    catch (error) {
        return res.json({
            message: "Database Failure",
            error,
            successfull: false
        });
    }
}



module.exports = {
    deleteProductColour, deleteProduct, createProduct
}