import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from 'src/app/models/post.model';
import { PostsService } from '../../services/posts.service';
import { mimeType } from './mime-type.validator';


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
  imageName: string = '';
  imagePreview: string;

  constructor(private postsSercice: PostsService, public route: ActivatedRoute, private fb: FormBuilder,) { }

  ngOnInit(): void {
    // Form Group
    // this.form = new FormGroup({
    //   title: new FormControl(null, {
    //     validators: [Validators.required, Validators.minLength(3)],
    //   }),
    //   image: new FormControl(null, {
    //     validators: [Validators.required],
    //     asyncValidators: [mimeType],
    //   }),
    //   content: new FormControl(null, {
    //     validators: [Validators.required],
    //   }),
    // });

    // Form Builder
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(5)]],
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    })

    // Get route for posting or editing post
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postsSercice.getPost(this.postId).subscribe((postData) => {
          // console.log(postData);
          this.post = {
            _id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath
          }
          this.form.setValue({
            title: this.post.title,
            image: this.post.imagePath,
            content: this.post.content,
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
      this.postsSercice.addPost(this.form.value, this.form.value.image);
    } else {
      this.postsSercice.updatePost(
        this.post._id,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
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

  // On image selected
  onImagePicked(event: Event) {
    this.imageName = (event.target as HTMLInputElement).files[0].name;
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}



