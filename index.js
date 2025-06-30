const express = require('express');
const path = require('path');
const app = express();
const PORT = 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
let posts = [];

app.get('/', (req, res) => {
  const category = req.query.category || 'All';
  let filteredPosts = posts;
  
  if (category !== 'All') {
    filteredPosts = posts.filter(post => post.category === category);
  }
  res.render('home', { 
    posts: filteredPosts, 
    selectedCategory: category,
    categories: ['All', 'Tech', 'Lifestyle', 'Education', 'Personality', 'Fitness', 'Any other']
  });
});

app.post('/posts', (req, res) => {
  const { title, content, author, category } = req.body;
  
  if (title && content && author && category) {
    const newPost = { id: Date.now(), title, content, author, category, timestamp: new Date().toLocaleDateString()
    };
    posts.unshift(newPost);
  }
  res.redirect('/');
});
app.get('/edit/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find(p => p.id === postId);
  if (!post) {
    return res.redirect('/');
  }
  res.render('edit', { post });
});

app.post('/edit/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const { title, content, author, category } = req.body;
  
  const postIndex = posts.findIndex(p => p.id === postId);
  
  if (postIndex !== -1 && title && content && author && category) {
    posts[postIndex] = {
      ...posts[postIndex],
      title,
      content,
      author,
      category
    };
  }
  res.redirect('/');
});
app.post('/delete/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  posts = posts.filter(p => p.id !== postId);
  res.redirect('/');
});
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Blog application running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to view your blog`);
});
