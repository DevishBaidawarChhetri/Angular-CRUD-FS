import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from '../models/post.model';

// Similar to event emitter
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject();

  constructor(private http: HttpClient, private router: Router) { }

  private baseUrl: string = 'http://localhost:3001';

  // Listener for new post
  getPostUpdateListner() {
    return this.postsUpdated.asObservable();
  }

  // Add Post
  addPost(post: Post, image: File) {
    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('image', image, post.title);
    postData.append('content', post.content);
    this.http
      .post<{ message: string; post: Post }>(
        this.baseUrl + '/api/posts',
        postData
      )
      .subscribe((response) => {
        const post: Post = {
          _id: response.post._id,
          title: response.post.title,
          content: response.post.content,
          imagePath: response.post.imagePath
        }
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  // Get all Posts
  getPosts() {
    this.http
      .get<{ message: string, posts: Post[] }>(this.baseUrl + '/api/posts')
      .subscribe((data) => {
        this.posts = data.posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  // Get individual post
  getPost(id: string) {
    return this.http.get<{
      _id: string,
      title: string,
      content: string,
      imagePath: string
    }>(this.baseUrl + '/api/posts/' + id);
  }

  // Update Post
  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('_id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        _id: id,
        title: title,
        content: content,
        imagePath: image,
      };
    }
    this.http.put(this.baseUrl + "/api/posts/" + id, postData)
      .subscribe((response) => {
        const updatedPosts = [...this.posts];
        const oldPostsIndex = updatedPosts.findIndex(p => p._id === id);
        const post: Post = {
          _id: id,
          title: title,
          content: content,
          imagePath: "",
        }

        updatedPosts[oldPostsIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      })
  }

  // Delete Post
  deletePost(postId: string) {
    this.http.delete(this.baseUrl + '/api/posts/' + postId).subscribe(() => {
      const updatedPosts = this.posts.filter((post) => post._id !== postId);
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }
}
