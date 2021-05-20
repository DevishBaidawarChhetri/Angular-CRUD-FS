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
  addPost(post: Post) {
    this.http
      .post<{ message: string; postId: string }>(
        this.baseUrl + '/api/posts',
        post
      )
      .subscribe((response) => {
        const id = response.postId;
        post._id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
    this.router.navigate(['/']);
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
    return this.http.get<{ _id: string, title: string, content: string }>(this.baseUrl + '/api/posts/' + id);
  }

  // Update Post
  updatePost(id: string, formValue) {
    this.http.put(this.baseUrl + "/api/posts/" + id, formValue).subscribe((response) => {
      const updatedPosts = [...this.posts];
      const oldPostsIndex = updatedPosts.findIndex(p => p._id === id);
      const post: Post = {
        _id: id,
        title: formValue.title,
        content: formValue.content,
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
