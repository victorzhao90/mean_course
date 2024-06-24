import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { PostService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.css'
})
export class PostCreateComponent implements OnInit {
  enteredContent = "";
  enteredTitle="";
  mode = 'create';
  postId: string | undefined;
  post: any;
  isLoading: boolean  = false;
  form: FormGroup = new FormGroup({});
  imagePreview: string = "";
  authStatusSub: Subscription | undefined;

  constructor(public postsService: PostService, public route: ActivatedRoute,
    private authService: AuthService
  ) {

  }
  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null, 
        {validators: [Validators.required], 
          asyncValidators: [mimeType]
        })
    });
      this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has('postId')) {
          this.mode = 'edit';
          this.postId = paramMap.get('postId')!;
          this.isLoading = true;
          if (this.postId) {
            this.post = this.postsService.getPost(this.postId)
              .subscribe(postData => {
                this.isLoading = false;
                this.post = {id: postData._id, title: postData.title, content: postData.content,
                                   imagePath : postData.imagePath};
              })
              this.form.setValue({
                title: this.post.title,
                content: this.post.content,
                image: this.post.imagePath
              })
          }
        } else {
          this.mode = 'create';
          this.postId = undefined;
        }
      });
  }
  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.postsService.addPost("xxx", form.value.title, form.value.content);
    form.resetForm();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.form.patchValue({image: file});
    this.form.get('image')!.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(this.form.value.title, 
        this.form.value.content,
        this.form.value.image);
      this.isLoading = false;
    } else {
      this.postsService.updatePost(this.postId!, this.form.value.title, 
        this.form.value.content,
        this.form.value.image);
      this.isLoading = false;

    }
    this.form.reset();
  }

  ngOnDestroy(): void {
    this.authStatusSub!.unsubscribe();
  }
}
