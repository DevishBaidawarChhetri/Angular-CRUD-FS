import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from 'src/app/models/post.model';
import { PostsService } from '../../services/posts.service';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  form: FormGroup;
  public mode = 'create';
  private postId: string;
  post: Post;

  constructor(private postsSercice: PostsService, public route: ActivatedRoute, private fb: FormBuilder,) { }

  ngOnInit(): void {
    // Form Groups
    // this.form = new FormGroup({
    //   title: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
    //   content: new FormControl(null, { validators: [Validators.required, Validators.minLength(5)] })
    // });

    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(5)]]
    })

    // Get route for posting or editing post
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'editPost';
        this.postId = paramMap.get('postId');
        this.postsSercice.getPost(this.postId).subscribe((postData) => {
          // console.log(postData);
          this.post = {
            _id: postData._id,
            title: postData.title,
            content: postData.content
          }
          this.form.setValue({
            title: this.post.title,
            content: this.post.content
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    })
  }

  onAddPost() {
    if (this.form.invalid) { return }
    if (this.mode == 'create') {
      this.postsSercice.addPost(this.form.value);
    } else {
      this.postsSercice.updatePost(this.post._id, this.form.value);
    }
    this.logKeyValuePairs(this.form);
    this.form.reset();
  }

  // Get form's object's key and clear validators
  logKeyValuePairs(group: FormGroup) {
    Object.keys(group.controls).forEach((key: string) => {
      group.get(key).clearValidators();
    })
  }
}



