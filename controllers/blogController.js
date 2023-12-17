const Blog = require("../models/Blog");

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    return res.json(
      blogs.map((blog) => ({
        _id: blog._id,
        title: blog.title,
        description: blog.description,
        photo: blog.photo,
        hashtag: blog.hashtag,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt,
      }))
    );
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    return res.json({
      _id: blog._id,
      title: blog.title,
      description: blog.description,
      photo: blog.photo,
      hashtag: blog.hashtag,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.createBlog = async (req, res) => {
  try {
    const newBlog = new Blog({
      title: req.body.title,
      description: req.body.description,
      photo: req.body.photo,
      hashtag: req.body.hashtag,
    });
    const savedBlog = await newBlog.save();
    return res.json(savedBlog);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        photo: req.body.photo,
        hashtag: req.body.hashtag,
      },
      { new: true }
    );
    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    return res.json({
      _id: updatedBlog._id,
      title: updatedBlog.title,
      description: updatedBlog.description,
      photo: updatedBlog.photo,
      hashtag: updatedBlog.hashtag,
      createdAt: updatedBlog.createdAt,
      updatedAt: updatedBlog.updatedAt,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    return res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
