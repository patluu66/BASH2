import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';
import { Post } from "../post.model";
import { PostsService } from "../posts.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: "First Post", content: "This is the first post's content" },
  //   { title: "Second Post", content: "This is the second post's content" },
  //   { title: "Third Post", content: "This is the third post's content" }
  // ];
  private posts: Post[] = [];
  private postsSub: Subscription;
  private show: boolean = false;
  private isSearchHome = true;
  private homeInfo: any[];

  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }

  getHomeInfo() {
    console.log(this.postsService.getZillowSearch);
    console.log(this.postsService.getStreetSearch);
    // this.homeInfo.push(this.postsService.getZillowSearch);
    return this.homeInfo;
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

  onGetZillow() {
    this.isSearchHome = !this.isSearchHome;
    this.show = !this.show;
    this.getHomeInfo();
    console.log(this.homeInfo);
    // console.log(this.postsService.getZillow());
    // let result = this.postsService.getZillow().subscribe(x => console.log(x));
    return this.postsService.getZillow();
  }

  onGetGiphy() {
    // this.isSearchHome = !this.isSearchHome;
    // this.show = !this.show;
    // console.log(this.postsService.getZillow());
    // let result = this.postsService.getZillow().subscribe(x => console.log(x));
    return this.postsService.getGiphy();
  }
}
