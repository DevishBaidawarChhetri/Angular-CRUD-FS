import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from '../models/post.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

// Similar to event emitter
import { Subject } from 'rxjs';

// Environment Variable
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) { }

  private baseUrl: string = environment.apiUrl + '/posts/';

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
      .post<{ message: string; post: Post }>(this.baseUrl, postData)
      .subscribe(
        (response: any) => {
          // We are redirecting to home route so below is commented

          // const post: Post = {
          //   _id: response.post._id,
          //   title: response.post.title,
          //   content: response.post.content,
          //   imagePath: response.post.imagePath
          // }
          // this.posts.push(post);
          // this.postsUpdated.next({posts:[...this.posts]});
          this.toastr.success(response.message, 'Success');
          this.router.navigate(['/']);
        },
        (error) => {
          this.toastr.error(error.error.message, 'Error');
        }
      );
  }

  // Get all Posts
  getPosts(currentPage: number, postsPerPage: number) {
    const queryParams = `?page=${currentPage}&pagesize=${postsPerPage}`;
    this.http
      .get<{ message: string; posts: Post[]; maxPosts: number }>(
        this.baseUrl + queryParams
      )
      .subscribe(
        (data) => {
          this.posts = data.posts;
          this.postsUpdated.next({
            posts: [...this.posts],
            postCount: data.maxPosts,
          });
          this.toastr.success(data.message, 'Success');
        },
        (error) => {
          this.toastr.error(error.error.message, 'Success');
        }
      );
  }

  // Get individual post
  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
    }>(this.baseUrl + id);
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
    this.http.put(this.baseUrl + id, postData).subscribe(
      (response: any) => {
        // We are redirecting to home route so below is commented

        // const updatedPosts = [...this.posts];
        // const oldPostsIndex = updatedPosts.findIndex(p => p._id === id);
        // const post: Post = {
        //   _id: id,
        //   title: title,
        //   content: content,
        //   imagePath: "",
        // }
        // console.log(post);
        // updatedPosts[oldPostsIndex] = post;
        // this.posts = updatedPosts;
        // this.postsUpdated.next({ [...this.posts], postCount: });
        this.toastr.success(response.message, 'Success');
        this.router.navigate(['/']);
      },
      (error) => {
        this.toastr.error(error.error.message, 'Error');
      }
    );
  }

  // Delete Post
  deletePost(postId: string) {
    return this.http.delete(this.baseUrl + postId);
  }
}
