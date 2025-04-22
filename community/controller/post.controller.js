import asyncWrapper from '../../middlewares/asyncWrapper.js';
import * as postService from '../service/post.service.js';

export const createPost = asyncWrapper( async(req, res) => {

    const { content, image } = req.body;
    const userId = req.user.id;
    const post = await postService.createPost(userId, content, image);
    res.status(201).json(post);

});

export const getPosts =  asyncWrapper(async (req, res) => {

    const posts = await postService.getAllPosts();
    res.status(200).json(posts);

});

export const getPost = asyncWrapper( async (req, res) => {
  try {
    const post = await postService.getPostById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export const deletePost = asyncWrapper( async (req, res) => {
  try {
    await postService.deletePost(req.params.id, req.user.id);
    res.status(200).json({ message: 'Post deleted' });
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
});
