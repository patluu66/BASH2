import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from 'rxjs/operators';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { Post } from "./post.model";
import { Zillow } from "./post.model";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private posts2 = [];
  private postsUpdated = new Subject<Post[]>();
  public homeInfo = [];
  private street: string;

  constructor(private http: HttpClient, private ngxXml2jsonService: NgxXml2jsonService) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>(
        "api/posts"
      )
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          };
        });
      }))
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getZillow2() {
    this.http.get('api/zillow').pipe(map((response) => {
      console.log(response);
      return response;
    }))
  }

  getZillow() {
    this.http.get<any>('http://localhost:3000/api/zillow').subscribe((response) => {
      // console.log(response.Posts);
      const parser = new DOMParser();
      let xml = parser.parseFromString(response.Posts, 'text/xml');

      // let x = xml.documentElement.childNodes;
      // let y = xml.getElementsByTagName("city")[0].childNodes[0];

      let street = xml.getElementsByTagName("street")[0].childNodes[0];
      let zip = xml.getElementsByTagName("zipcode")[0].childNodes[0];
      let city = xml.getElementsByTagName("city")[0].childNodes[0];
      let state = xml.getElementsByTagName("state")[0].childNodes[0];
      let amount = xml.getElementsByTagName("amount")[0].childNodes[0];
      let homeDetails = xml.getElementsByTagName("homedetails")[0].childNodes[0];

      this.street = new XMLSerializer().serializeToString(street);
      this.homeInfo.push(new XMLSerializer().serializeToString(street));
      this.homeInfo.push(new XMLSerializer().serializeToString(zip));
      this.homeInfo.push(new XMLSerializer().serializeToString(city));
      this.homeInfo.push(new XMLSerializer().serializeToString(state));
      this.homeInfo.push(new XMLSerializer().serializeToString(amount));
      this.homeInfo.push(new XMLSerializer().serializeToString(homeDetails));

      console.log(this.homeInfo);
      // console.log(street.nodeValue);

      let obj = this.ngxXml2jsonService.xmlToJson(xml);
      // this.obj2 = this.ngxXml2jsonService.xmlToJson(xml);
      return obj;

    })
  }

  getGiphy() {
    this.http.get<any>('http://localhost:3000/api/giphy').subscribe((response) => {
      console.log(response.Posts);
      return response;

    })
  }


  getStreetSearch() {
    return this.street;
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getZillowSearch() {
    return this.homeInfo;
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.http
      .post<{ message: string, postId: string }>("api/posts", post)
      .subscribe(responseData => {
        const id = responseData.postId;
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }


  deletePost(postId: string) {
    this.http.delete("./api/posts/" + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
