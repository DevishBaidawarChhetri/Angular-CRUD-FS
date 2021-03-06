import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../../models/post.model';
import { PostsService } from '../../services/posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub: Subscription;

  // Paginations
  currentPage = 1;
  postsPerPage = 5;
  totalPosts = 0;
  pageSizeOptions = [2, 5, 10, 25];

  private authStatusSub: Subscription;
  public userIsAuthenticated: boolean = false;
  public userId: string;

  constructor(
    private postsServices: PostsService,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.postsServices.getPosts(this.currentPage, this.postsPerPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsServices
      .getPostUpdateListner()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      (isAuthentaicated) => {
        this.userIsAuthenticated = isAuthentaicated;
      }
    );
  }

  // Delete Post
  onDelete(postId) {
    this.postsServices.deletePost(postId).subscribe(
      (response: any) => {
        this.toastr.success(response.message, 'Success');
        this.postsServices.getPosts(this.currentPage, this.postsPerPage);
      },
      (error) => {
        this.toastr.error(error.error.message, 'Error');
      }
    );
  }

  // On Page change
  onPageChange(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsServices.getPosts(this.currentPage, this.postsPerPage);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
