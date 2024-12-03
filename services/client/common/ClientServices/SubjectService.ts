'use client'
import { AsyncSubject, BehaviorSubject, ReplaySubject, Subject } from "rxjs";

class SubjectService {
  private dataSubject = new BehaviorSubject<any>(null);
  private authSubject = new ReplaySubject<any>()
  private heading = new ReplaySubject<any>()
  public  isAuthenticated:boolean = false
  private openSignInPopup = new Subject<any>()
  private orderPaymentData = new ReplaySubject<any>()

  sendData(data: any) {
    this.dataSubject.next(data); // Emit the new data
  }

  getData() {
    return this.dataSubject.asObservable(); // Return observable for subscription
  }

  setAuthData(data:any){ 
    let userInfo: any = localStorage.getItem("bonk-comic-hub-sign-userdata");
    if (userInfo) { this.authSubject.next(JSON.parse(userInfo).userInfo) }
    else{
      localStorage.setItem("bonk-comic-hub-sign-userdata", JSON.stringify({userInfo:{roleName:"Guest User"}}))
    }  
  }

  getAuthData(){ return this.authSubject.asObservable(); }

  setHeading(data:any){this.heading.next(data)}
  getHeading(){return this.heading.asObservable()}

  openSignInModal(type:boolean){ this.openSignInPopup.next({open:type}) }
  triggerSignInModal(){return this.openSignInPopup.asObservable()}

  setorderPaymentData(data:any){this.orderPaymentData.next(data)}
  getorderPaymentData(){return this.orderPaymentData.asObservable()}

}

export const subjectService = new SubjectService();

// 'use client'
// import { AsyncSubject, Subject } from 'rxjs';

// class SubjectService {
//   private subject = new Subject<any>();

//   sendData(data: any) {
//     this.subject.next(data); // Send data to subscribers
//   }

//   clearData() {
//     this.subject.next(null); // Clear the data
//   }

//   getData() {
//     return this.subject.asObservable(); // Expose the subject as an observable
//   }

// }

// export const subjectService = new SubjectService();
