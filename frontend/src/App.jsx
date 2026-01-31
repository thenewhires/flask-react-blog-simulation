import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedPostTitle, setEditedPostTitle] = useState('');
  const [editedPostContent, setEditedPostContent] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [selectedPostId, setSelectedPostId] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleCreatePost = async () => {
    try {
      await axios.post('http://localhost:5000/posts', {
        title: newPostTitle,
        content: newPostContent,
      });
      fetchPosts();
      setNewPostTitle('');
      setNewPostContent('');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleEditPost = (post) => {
    setEditingPostId(post.id);
    setEditedPostTitle(post.title);
    setEditedPostContent(post.content);
  };

  const handleUpdatePost = async () => {
    try {
      await axios.put(`http://localhost:5000/posts/${editingPostId}`, {
        title: editedPostTitle,
        content: editedPostContent,
      });
      fetchPosts();
      setEditingPostId(null);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:5000/postss/${postId}`); // BUG: typo in endpoint 'postss'
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleAddComment = async (postId) => {
    try {
      await axios.post(`http://localhost:5000/posts/${postId}/comments`, {
        text: newCommentText,
      });
      fetchPosts();
      setNewCommentText('');
      setSelectedPostId(null);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleViewComments = (postId) => {
    setSelectedPostId(postId);
  };

  return (
    <div className="App">
      <h1>Blog</h1>

      <div>
        <h2>Create New Post</h2>
        <input
          type="text"
          placeholder="Title"
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
        />
        <button onClick={handleCreatePost}>Create Post</button>
      </div>

      <h2>Posts</h2>
      {posts.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <button onClick={() => handleEditPost(post)}>Edit</button>
          <button onClick={() => handleDeletePost(post.id)}>Delete</button>
          <button onClick={() => handleViewComments(post.id)}>View Comments</button>
          {selectedPostId === post.id && (
            <div>
              <h4>Comments:</h4>
              {post.comments.length > 0 ? (
                <ul>
                  {post.comments.map((comment) => (
                    <li key={comment.id}>{comment.text}</li>
                  ))}
                </ul>
              ) : (
                <p>No comments yet.</p>
              )}

              <div>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                />
                <button onClick={() => handleAddComment(post.id)}>Add Comment</button>
              </div>
            </div>
          )}
        </div>
      ))}

      {editingPostId && (
        <div>
          <h2>Edit Post</h2>
          <input
            type="text"
            value={editedPostTitle}
            onChange={(e) => setEditedPostTitle(e.target.value)}
          />
          <textarea
            value={editedPostContent}
            onChange={(e) => setEditedPostContent(e.target.value)}
          />
          <button onClick={handleUpdatePost}>Update Post</button>
        </div>
      )}
    </div>
  );
}

export default App;