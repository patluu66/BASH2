import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
// import { NgxXml2jsonService } from 'ngx-xml2json';
import { PostsService } from "../posts.service";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent {
  enteredTitle = "";
  enteredContent = "";
 

  constructor(public postsService: PostsService) {}

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.postsService.addPost(form.value.title, form.value.content);
    form.resetForm();
  }

  // onGetZillow() {
  //   // console.log("Hellow");
  //   // console.log(this.postsService.getZillow());
  //     // let response2 = this.postsService.getZillow();
  //     // const parser = new DOMParser();
  //     // let xml = parser.parseFromString(response2, 'text/xml');
  //     // let obj = this.ngxXml2jsonService.xmlToJson(xml);
  //     // console.log(obj);
  //   return this.postsService.getZillow();
  // }
}
