import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent implements OnInit, OnDestroy{

  // posts = [
  //   {title: 'First Post', content: 'This is the first post\'s content'},
  //   {title: 'Second Post', content: 'This is the Second post\'s content'},
  //   {title: 'Third Post', content: 'This is the Third post\'s content'},
  // ]
  posts: Post[] = [];
  private postsSub: Subscription = new Subscription;
  private authStatusSub: Subscription = new Subscription;
  isLoading = false;
  totalPosts = 10;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  currentPage = 1;
  userIsAuthenticated = false;
  userId: string | null = null;


  constructor(public postsService: PostService, private authService: AuthService) {
  }
  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService.getPostUpdateListener().subscribe((
      postData: {posts: Post[], postCount: number}) => {
      this.isLoading   = false;
      this.totalPosts =   postData.postCount;
      this.posts = postData.posts;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onChangedPage(pageData: PageEvent) {
      this.currentPage = pageData.pageIndex + 1;
      this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.isLoading  = true;
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onDelete(postId: string) {
    this.isLoading  = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
      this.isLoading  = false;

    }, error => {
      this.isLoading  = false;
    });
  }
}
