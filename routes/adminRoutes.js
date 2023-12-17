const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Blog = require("../models/Blog");
const Category = require("../models/Category");
const Product = require("../models/Product");
const uuid = require("uuid");

const authenticateUser = (username, password) => {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  return username === adminUsername && password === adminPassword;
};

const isAuthenticated = (req, res, next) => {
  if (req.session.isAuthenticated) {
    return next();
  }
  return res.redirect("/login");
};

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (authenticateUser(username, password)) {
    req.session.isAuthenticated = true;
    return res.redirect("/dashboard");
  } else {
    return res.render("login", {
      error: "Неправильное имя пользователя или пароль",
    });
  }
});

router.get("/login", (req, res) => {
  return res.render("login", { error: null });
});

router.get("/logout", isAuthenticated, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    return res.redirect("/login");
  });
});

router.get("/dashboard", (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.redirect("/login");
  }
  return res.render("adminDashboard");
});

// blogs route codes
router.get("/blogs", isAuthenticated, async (req, res) => {
  try {
    const blogs = await Blog.find();
    return res.render("adminBlogs", { blogs });
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueFilename = `${uuid.v4()}-${file.originalname}`;
    cb(null, uniqueFilename);
  },
});
const upload = multer({ storage: storage });

router.post(
  "/blogs/create",
  upload.single("newPhoto"),
  isAuthenticated,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send("No file attached to the request");
      }
      const photoPath = req.file.path;
      const { newTitle, newDescription  } = req.body;
      if (!newTitle || !newDescription) {
        return res.status(400).send("All inputs are required");
      }
      const newBlog = new Blog({
        title: newTitle,
        description: newDescription,
        photo: photoPath,
      });
      await newBlog.save();
      return res.redirect("/blogs");
    } catch (error) {
      return res
        .status(500)
        .render("error", { error: "Internal Server Error" });
    }
  }
);

router.post(
  "/blogs/update/:blogId",
  isAuthenticated,
  upload.single("updatedPhoto"),
  async (req, res) => {
    try {
      const blogId = req.params.blogId;
      const { updatedTitle, updatedDescription } = req.body;
      const updatedPhoto = req.file ? req.file.path : "";
      const blog = await Blog.findById(blogId);
      if (!blog) {
        return res.status(404).send("Blog not found");
      }
      blog.title = updatedTitle;
      blog.description = updatedDescription;
      if (updatedPhoto) {
        blog.photo = updatedPhoto;
      }
      await blog.save();
      return res.redirect("/blogs");
    } catch (error) {
      return res
        .status(500)
        .render("error", { error: "Internal Server Error" });
    }
  }
);

router.get("/blogs/delete/:blogId", isAuthenticated, async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const deletedBlog = await Blog.findByIdAndDelete(blogId);
    if (!deletedBlog) {
      return res.status(404).send("Blog not found");
    }
    return res.redirect("/blogs");
  } catch (error) {
    return res.status(500).send("Internal Server Error: " + error.message);
  }
});

// categories route codes
router.get("/categories", isAuthenticated, async (req, res) => {
  try {
    const categories = await Category.find();
    return res.render("adminCategories", { categories });
  } catch (error) {
    return res.status(500).render("error", { error: "Internal Server Error" });
  }
});

router.post("/categories/create", isAuthenticated, async (req, res) => {
  try {
    const { newCategory } = req.body;
    if (!newCategory) {
      return res.status(400).send("Category is required");
    }
    const category = new Category({
      category: newCategory,
    });
    await category.save();
    return res.redirect("/categories");
  } catch (error) {
    return res.status(500).render("error", { error: "Internal Server Error" });
  }
});

router.post(
  "/categories/update/:categoryId",
  isAuthenticated,
  async (req, res) => {
    try {
      const categoryId = req.params.categoryId;
      const { updatedCategory } = req.body;
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).send("Category not found");
      }
      category.category = updatedCategory;
      await category.save();
      return res.redirect("/categories");
    } catch (error) {
      return res
        .status(500)
        .render("error", { error: "Internal Server Error" });
    }
  }
);

router.get(
  "/categories/delete/:categoryId",
  isAuthenticated,
  async (req, res) => {
    try {
      const categoryId = req.params.categoryId;
      const deletedCategory = await Category.findByIdAndDelete(categoryId);
      if (!deletedCategory) {
        return res.status(404).send("Category not found");
      }
      return res.redirect("/categories");
    } catch (error) {
      return res
        .status(500)
        .render("error", { error: "Internal Server Error" });
    }
  }
);

// Vacancies route codes
router.get("/products", isAuthenticated, async (req, res) => {
  try {
    const products = await Product.find();
    const categories = await Category.find();
    res.render("adminProducts", { products, categories });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", { error: "Internal Server Error" });
  }
});

router.get('/products/:productId',isAuthenticated, async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.json(product);
  } catch (error) {
    console.error('Error fetching product details:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post("/products/create", isAuthenticated, async (req, res) => {
  try {
    const { newCategory, newSelectCategory, newName, newModel, newPrice, newLength } = req.body;
    if (!newCategory || !newSelectCategory || !newName || !newModel || !newPrice || !newLength) {
      return res.status(400).send("All fields are required");
    }
    const newProduct = new Product({
      category: newCategory,
      selectCategory: newSelectCategory,
      name: newName,
      price: newPrice,
      model: newModel,
      length: newLength,
    });
    await newProduct.save();
    return res.redirect("/products");
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.post(
  "/products/update/:productId",
  isAuthenticated,
  async (req, res) => {
    try {
      const productId = req.params.productId;
      const {
        updatedCategory,
        updatedSelectCategory,
        updatedName,
        updatedModel,
        updatedLength,
        updatedPrice,
      } = req.body;
      if (
        !updatedCategory ||
        !updatedSelectCategory ||
        !updatedName ||
        !updatedModel ||
        !updatedLength ||
        !updatedPrice
      ) {
        return res.status(400).send("All fields are required");
      }
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).send("Product not found");
      }
      product.category = updatedCategory;
      product.selectCategory = updatedSelectCategory;
      product.name = updatedName;
      product.model = updatedModel;
      product.length = updatedLength;
      product.price = updatedPrice;
      await product.save();
      return res.redirect("/products");
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .render("error", { error: "Internal Server Error" });
    }
  }
);

router.get(
  "/products/delete/:productId",
  isAuthenticated,
  async (req, res) => {
    try {
      const productId = req.params.productId;
      const deletedProduct = await Product.findByIdAndDelete(productId);
      if (!deletedProduct) {
        return res.status(404).send("Product not found");
      }
      return res.redirect("/products");
    } catch (error) {
      return res
        .status(500)
        .render("error", { error: "Internal Server Error" });
    }
  }
);

module.exports = router;
