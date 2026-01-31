from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

posts = [
    {'id': 1, 'title': 'First Post', 'content': 'This is the first post.', 'comments': [{'id': 1, 'text': 'First comment'}]},
    {'id': 2, 'title': 'Second Post', 'content': 'This is the second post.', 'comments': []}
]

next_post_id = 3
next_comment_id = 2

@app.route('/posts', methods=['GET'])
def get_posts():
    return jsonify(posts)

@app.route('/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    post = next((post for post in posts if post['id'] == post_id), None)
    if post:
        return jsonify(post)
    return jsonify({'message': 'Post not found'}), 404

@app.route('/posts', methods=['POST'])
def create_post():
    global next_post_id
    data = request.get_json()
    new_post = {
        'id': next_post_id,
        'title': data['title'],
        'content': data['content'],
        'comments': []
    }
    posts.append(new_post)
    next_post_id += 1
    return jsonify(new_post), 201

@app.route('/posts/<int:post_id>/comments', methods=['POST'])
def add_comment(post_id):
    global next_comment_id
    data = request.get_json()
    post = next((post for post in posts if post['id'] == post_id), None)
    if post:
        new_comment = {
            'id': next_comment_id,
            'text': data['text']
        }
        post['comments'].append(new_comment)
        next_comment_id += 1
        return jsonify(new_comment), 201
    return jsonify({'message': 'Post not found'}), 404

@app.route('/posts/<int:post_id>', methods=['PUT'])
def update_post(post_id):
    data = request.get_json()
    post = next((post for post in posts if post['id'] == post_id), None)
    if post:
        post['title'] = data['title']
        post['content'] = data['content']
        return jsonify(post)
    return jsonify({'message': 'Post not found'}), 404

@app.route('/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    global posts
    posts = [post for post in posts if post['id'] != post_id]
    return jsonify({'message': 'Post deleted'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)