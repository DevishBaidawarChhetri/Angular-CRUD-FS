import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../../models/post.model';
import { PostsService } from '../../services/posts.service';
import { Subscription } from 'rxjs'


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub: Subscription;

  constructor(private postsServices: PostsService) { }

  ngOnInit(): void {
    this.postsServices.getPosts();
    this.postsSub = this.postsServices
      .getPostUpdateListner()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }

  // Delete Post
  onDelete(postId) {
    this.postsServices.deletePost(postId);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
