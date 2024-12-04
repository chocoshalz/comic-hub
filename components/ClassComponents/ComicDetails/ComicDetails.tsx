'use client';
import "./ComicDetails.scss";
import withSearchParams from "@/components/routing/withSearchParams";
import { IconButton } from "@mui/material";
import { Component, FormEvent } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import { Modal } from "react-bootstrap";
import { subjectService } from "@/services/client/common/ClientServices/SubjectService";
import RatingReviewClient from "@/services/client/common/ClientServices/RatingReviewClient";
import UploadComic from "@/components/ClassComponents/UploadComic/UploadComic";
import ComicClient from "@/services/client/common/ClientServices/ComicClient";
import toast from "react-hot-toast";
import StarRating from "@/components/FunctionalComponents/StarRating/StarRating";
import WishListClient from "@/services/client/common/ClientServices/WishListClient";
import CartClient from "@/services/client/common/ClientServices/CartClient";
import OrderPaymentForm from "../OrderPaymentForm/OrderPaymentForm";
import { userInfo } from "os";
import ProfileClient from "@/services/client/common/ClientServices/ProfileClient";
interface UsersPageProps {
  searchParams: URLSearchParams;
  router:any
}

interface Review {
  id: string;
  user: string;
  comment: string;
  rating: number;
  isEditing?: boolean;
}

interface Comic {
  id: string;
  title: string;
  description: string;
  genre: string;
  author: string;
  publisher: string;
  price: string;
  banner: string;
  reviews: Review[];
  rating: number;
  addWishlist:boolean;
  addCart:boolean;
}

class ComicDetails extends Component<UsersPageProps> {
    ratingreview!:RatingReviewClient
    wishListServ:WishListClient
    cartServ:CartClient
  state = {
    userInfo:{roleName:"Guest User"},
    loading:false,
    isModalOpen: false,
    modalHeading : "",
    comic: {
      id: "",
      title: "",
      description:"",
      genre: "",
      author: "",
      publisher: "",
      price: "",
      banner: "",
      addWishlist:false,
      addCart:false,
      reviews: [
        // { id: "1", user: "John Doe", comment: "Amazing comic!", rating: 5 },
        // { id: "2", user: "Jane Smith", comment: "Loved it!", rating: 4 },
      ],
      rating: 4.5,
    } as Comic,
    newReview: {
      reviewText: "",
      rating: 0,
    },
  };
  comicServ!:ComicClient
  profileServ!:ProfileClient
  constructor(props:UsersPageProps)
  {
    super(props)
    this.ratingreview = new RatingReviewClient()
    this.comicServ = new ComicClient()
    this.wishListServ = new WishListClient()
    this.cartServ = new CartClient()
    this.profileServ = new ProfileClient()
  }

  componentDidMount(): void {
    console.log("comic details => ")
    this.handleAuth()
    
    this.getRatingsReviews()
    
  }

  getRatingsReviews()
  {
    let comic:any = this.state.comic
    this.ratingreview.getAllReviewsbyComicId(this.state.comic.id).subscribe((res:any)=>{
        console.log("res => ", res)
        comic['reviews'] = res.reviews
        this.setState({comic})
    })
  }

  uploadRatingsReviews(userId:string, rating:number, reviewText:string)
  {
    let payload:any ={userId , comicId:this.state.comic.id, rating, reviewText}
    this.ratingreview.addRatingReview(payload).subscribe((res:any)=>{
        console.log("res => ", res)
        this.getRatingsReviews()
    })
  }

  profileData:any
  async handleAuth()
  {
    subjectService.getAuthData().subscribe((res:any)=>{ 
      console.log("header subject => ", res)
      this.profileServ.getProfileById(res.id).subscribe((pro:any)=>{
        console.log("profile => ", pro)
        if(pro.status === 200 && pro.message !== 'Profile not found')
        {
          this.profileData = pro.data
        }
      })
      this.setState({ userInfo: res , loading: false }); 
      this.getData()
    })
   
  }
  
  comicData:any 
  cartId:string = ""
  async getData() {
    console.log("---->")
    // subjectService.sendData({"hell":"hhhh"})
    subjectService.getData().subscribe({
      next: (res) => {
        this.comicData = res
        console.log("Response received:", res);
        if(!res)
        {
          location.href = "/"
        }
        let comic:any = this.state.comic
        comic['id'] = res.id
        comic['title'] = res.title
        comic['description'] = res.description
        comic['genre'] = res.genre
        comic['author'] = res.author
        comic['publisher'] = res.publisher
        comic['price'] = res.price
        comic['banner'] = res.banner
        
        this.setState({
            loading:false,
            comic},()=>{
              const userInfo:any = this.state.userInfo
              const switchtype:string = !!userInfo ? userInfo?.roleName : "Guest User" 
              if(switchtype === "User")
              {
                
                //check wishlist
                // this.wishListServ.CheckWishList({userId:userInfo.id, comicId: res.id}).subscribe((resW:any)=>{
                //   console.log("check wishlist => ", resW)
                //   if(resW.message === "You have already added this comic to your wishlist")
                //   {
                //       comic['addWishlist'] = true
                //       this.setState({comic})
                //   }
  
                // })

                //check cart addCart
                console.log("check cart")
                this.cartServ.checkCart({userId:userInfo.id, comicId: res.id}).subscribe((resW:any)=>{
                  console.log("check wishlist => ", resW)
                  this.cartId = resW.cartId
                  if(resW.message === "You have already added this comic to your Cart")
                  {
                      comic['addCart'] = true
                      this.setState({comic})
                  }
  
                })
                


              }
             
            })
      },
      error: (err) => {
        console.error("Error fetching data:", err);
      },
      complete: () => {
        console.log("Data fetch complete.");
      },
    });
  }
  
  handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    this.setState((prevState:any) => ({
      newReview: { ...prevState.newReview, [name]: value },
    }));
  };

  handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    this.setState((prevState:any) => ({
      newReview: { ...prevState.newReview, rating: parseInt(value, 10) },
    }));
  };

  handlePostReview = (e: FormEvent, userId:string) => {
    e.preventDefault();
    const { newReview, comic } = this.state;
    console.log("newReview => ", newReview)
    if (newReview.reviewText && newReview.rating) {
      this.setState({
        comic: {
          ...comic,
          reviews: [
            ...comic.reviews,
            {
              id: String(comic.reviews.length + 1),
              ...newReview,
              isEditing: false,
            },
          ],
        },
        newReview: { reviewText:"" , rating: 0 },
      },()=>{
        console.log("upload review =>")
        this.uploadRatingsReviews(userId, newReview.rating, newReview.reviewText)
      });
    }
  };

  handleEditReview = (review:any, reviewI:number) => {
    const { comic } = this.state
    comic["reviews"][reviewI]['isEditing'] = true
    console.log("reviews => ", comic["reviews"][reviewI])
    console.log("review => ", review, "reviews => ")
    // review['isEditing'] = true
    this.setState({comic})
    // this.setState((prevState:any) => ({
    //   comic: {
    //     ...prevState.comic,
    //     reviews: prevState.comic.reviews.map((review:any) =>
    //       review.id === review.id ? { ...review, isEditing: !review.isEditing } : review
    //     ),
    //   },
    // }),()=>{
    //   console.log("")
    // });
  };

  editRatingReview(e:any, reviewI:number, field:string)
  {
    const  comic:any  = this.state.comic
    comic["reviews"][reviewI][field] = field === 'rating' ? e : e.target.value
    console.log("reviews => ", comic["reviews"][reviewI])
    this.setState({comic})
  }

  handleDeleteReview = (review:any, reviewI:number) => {
    this.ratingreview.deleteReview(review.id).subscribe((res:any)=>{
      toast.success(res.message)
      this.getRatingsReviews()
    })
    // this.setState((prevState:any) => ({
    //   comic: {
    //     ...prevState.comic,
    //     reviews: prevState.comic.reviews.filter((review:any) => review.id !== id),
    //   },
    // }));
  };

  handleUpdateReview = (id: string, updatedComment: string, updatedRating: number) => {
    this.setState((prevState:any) => ({
      comic: {
        ...prevState.comic,
        reviews: prevState.comic.reviews.map((review:any) =>
          review.id === id
            ? { ...review, comment: updatedComment, rating: updatedRating, isEditing: false }
            : review
        ),
      },
    }));
  };

  handleSubmitEditedReview(review:any, reviewI:number)
  {
    let comic:any = this.state.comic
      console.log("review => ", review)
      this.ratingreview.updateReview(review.id, review).subscribe((res:any)=>{
        toast.success(res.message)
        comic["reviews"][reviewI]['isEditing'] = false
        comic["reviews"][reviewI]['reviewText'] = comic["reviews"][reviewI]['comment']
        // comic["reviews"][reviewI]['reviewText'] = comic["reviews"][reviewI]['comment']
        console.log("reviews => ", comic["reviews"][reviewI])
        console.log("review => ", review, "reviews => ")
        // review['isEditing'] = true
        this.setState({comic})
      })
      
  }

  editComic()
  {
    console.log("state => ", this.state.comic)
    this.openModal()
  }
  openModal = () => this.setState({ isModalOpen: true, modalHeading:"Update Comic"}, () => {});
  closeModal = () => this.setState({ isModalOpen: false });

  async handleUploadSubmit(e:any)
  {
    console.log("e => ", e)
    await this.closeModal()
  }


  SignContent()
  {
    return <Modal show={this.state.isModalOpen} onHide={() => this.closeModal()}>
        <Modal.Header closeButton>
            <Modal.Title style={{ width: "100%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {this.state.modalHeading}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {
              this.state.modalHeading === "Update Comic" 
              ? <UploadComic setData={this.state.comic} onSubmit={(e:any)=> this.handleUploadSubmit(e)}></UploadComic>
              : <OrderPaymentForm></OrderPaymentForm>
            }
        </Modal.Body>
      </Modal>
  }

  async deleteComic(comic:any)
  {
    (await this.comicServ.deleteComic({ id: comic.id })).subscribe((res:any)=>{
      console.log("res => ", res)
      toast.success(res.message)
    })
  }

  addToWishList(comic:any)
  {
    if(subjectService.isAuthenticated)
    {
      let userInfo:any = this.state.userInfo
        
        let payload:any = {
          userId:userInfo.id, comicId:comic.id
        }
        console.log("add to wishlist => ", payload, userInfo)
        if(comic['addWishlist'] === false)
        {
          this.wishListServ.addToWishList(payload).subscribe((res:any)=>{
            comic['addWishlist'] = true
            this.setState({comic})
            toast.success(res.message)
          })
        }
        else{
          // this.wishListServ.removeFromWishList().subscribe((res:any)=>{
          //   comic['addWishlist'] = false
          //   this.setState({comic})
          //   toast.success(res.message)
          // })
        }
        
    }
    else{
        subjectService.openSignInModal(true)
        console.log("logoin popup")
    }
  }

  addToCart(comic:any)
  {
    if(subjectService.isAuthenticated)
    {
      let userInfo:any = this.state.userInfo
        
        let payload:any = {
          userId:userInfo.id, comicId:comic.id
        }
        console.log("add to cart", this.comicData)   
        if(comic['addCart'] === true)
        {
          console.log("removing from cart")
          this.cartServ.RemoveFromtCart(this.cartId).subscribe((res:any)=>{
            comic['addCart'] = false
            this.setState({comic})
            toast.success(res.message)
          })
        }
        else{
          console.log("adding to cart")
          this.cartServ.addTotCart(payload).subscribe((res:any)=>{
            comic['addCart'] = true
            this.setState({comic})
            toast.success(res.message)
          })
        }
       
    }
    else{
        subjectService.openSignInModal(true)
        console.log("logoin popup")
    }
  }

  order()
  {
    if(subjectService.isAuthenticated)
    {
      const userInfo:any = this.state.userInfo
      let pro:any = this.profileData
      let comicData:any = this.comicData
      console.log("pro send => ", pro)
      if(!!pro)
      if(pro.address.length && pro.createdAt.length && pro.fullName.length && pro.phone.length 
        && pro.phone.length && pro.pinCode.length && pro.state.length && pro.state && pro.city)
      {
        try {
          let data = {
            name: pro.fullName,
            email: userInfo.email,
            phone: pro.phone,
            address: pro.address,
            addressLine2: '',
            city: pro.city,
            state: pro.state,
            zip: pro.pinCode,
            price: comicData.price,
            userInfo:userInfo,
            comicData:comicData,
            orderSummary: [
              { item: comicData.title, quantity: 1, price: comicData.price },
            ]
          }
          subjectService.setorderPaymentData(data)
          this.setState({modalHeading:"Order Payment Form", isModalOpen:true })
        } catch (error) {
          console.log("err => ", error)
        }
        
      }
      else{
        alert("please update profile")
      }

        
    }
    else{
        subjectService.openSignInModal(true)
        console.log("logoin popup")
    }
   
  }

  setRating(rate:any)
  {
    // let comic:any = this.state.comic
    // this.setRating()
    this.setState((prevState:any) => ({
        newReview: { ...prevState.newReview, rating: rate//parseInt(rate, 10) 

        },
      }));
    console.log("rating => ", rate)
  }

  render() {
    const { comic, newReview, loading } = this.state;
    let user:any = this.state.userInfo
    const switchtype:string = !!user ? user?.roleName : "Guest User" 
    if(loading)
    {
        return <div>loading ...</div>
    }
    
    return (
        <div className="comicdetails-root-class">
          {this.SignContent()}
            <div className="comic-details">
        {/* Comic Information */}
        <div className="comic-card">
          {/* First Row: Heading */}
          {/* <div className="comic-heading">
            <h1>{comic.title}</h1>
          </div> */}

          {/* Second Row: Banner and Details */}
          <div className="comic-body">
            {/* First Column: Banner */}
            <div className="comic-banner">
                {
                    !!comic.banner &&
                    <img src={comic.banner} alt={comic.title} />
                }
            </div>

            {/* Second Column: Details */}
            <div className="comic-info">
              <p><strong>Genre:</strong> {comic.genre}</p>
              <p><strong>Author:</strong> {comic.author}</p>
              <p><strong>Publisher:</strong> {comic.publisher}</p>
              <p><strong>Price:</strong> {comic.price}</p>
              <div className="comic-actions">
                {
                    (switchtype === "User" || switchtype === "Guest User") &&
                    <div>
                        {/* <IconButton onClick={()=> this.addToWishList(comic)}  className="menu-icon wishlist">
                            <FavoriteIcon style={{ color: comic.addWishlist === true ? "red" : "gray" }} /> 
                        </IconButton> */}

                        <IconButton onClick={()=> this.addToCart(comic)} className="menu-icon add-to-cart">
                            <ShoppingCartIcon style={{ color:  comic['addCart'] === true ? "red" : 'gray' }} /> 
                        </IconButton>
                    </div>
                }

                {
                    switchtype === "Admin" &&
                    <div>
                        <IconButton onClick={()=> this.editComic()} className="menu-icon edit-icon">
                            <EditIcon style={{ color: "#1976d2" }} /> {/* Blue Edit Icon */}
                        </IconButton>

                        <IconButton onClick={()=> this.deleteComic(comic)} className="menu-icon delete-icon">
                            <DeleteIcon style={{ color: "#d32f2f" }} /> {/* Red Delete Icon */}
                        </IconButton>
                    </div>
                }
             
                
                
              </div>
              {
                (switchtype === "User" || switchtype === "Guest User")  &&
                <div className={"order-btn-container"}>
                <button className="order-btn" onClick={()=> this.order()}>Order </button>
              </div>
              }
              
            </div>
          </div>

          {/* Third Row: Description */}
          <div className="comic-description">
            <h3>Description</h3>
            <p>{comic.description}</p>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <h2>Reviews</h2>
          <div className="reviews-list">
            {
            comic.reviews.length === 0
            ? <div style={{width:'100%', textAlign:'center'}}><h2>no reviews</h2></div>
            :comic.reviews.map((review:any, reviewI:number) => (
              <div key={review.id} className="review-item">
                {review.isEditing ? (
                  <div className="edit-review">
                    <div>
                    <textarea
                      style={{
                        width:'100%', height:'100px', resize:'none', border:"2px solid lightgray" 
                      }}
                      defaultValue={review.reviewText}
                      onBlur={(e) =>
                       this.editRatingReview(e, reviewI, 'comment')
                      }
                    />
                    </div>
                    <div>
                      <StarRating fontSize={20} editable={true} value={review.rating} onChange={(e)=> this.editRatingReview(e, reviewI, 'rating')} ></StarRating>
                    </div>
                    <div >
                      <button style={{marginLeft:'10px', backgroundColor:"orange", borderRadius:'5px', color:'white', padding:'0px 10px'}} 
                      onClick={() => this.handleSubmitEditedReview(review, reviewI)}>Save</button>
                    </div>
                    

                    {/* <select
                      defaultValue={review.rating}
                      onChange={(e) =>
                        this.handleUpdateReview(review.id, review.comment, parseInt(e.target.value, 10))
                      }
                    >
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <option key={rating} value={rating}>
                          {rating}⭐
                        </option>
                      ))}
                    </select> */}
                  </div>
                ) : (
                  <>
                  <strong>Name : { review.fullName || review.username }</strong>
                  <div className="display-rating">
                    <div>rating :</div>
                    <div className="dr-stars"><StarRating  editable={false} fontSize={20} value={review.rating}></StarRating></div>
                  </div>                    
                  <p className="display-comment-text">{review.reviewText}</p>
                    {
                      (review.userId === user.id || this.state.userInfo.roleName === "Admin") &&
                      <div className="review-actions">
                          <button onClick={() => this.handleEditReview(review, reviewI)}>Edit</button>
                          <button onClick={() => this.handleDeleteReview(review, reviewI)}>Delete</button>
                    </div>
                    }
                    
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Post Review Form */}
          {
            // this.state.userInfo.roleName !== "Guest User" &&
            subjectService.isAuthenticated === true &&
            <form className="post-review-form" onSubmit={(e)=>this.handlePostReview(e, user.id)}>
            <h3>Post Your Review</h3>
            {/* <input
              type="text"
              name="user"
              placeholder="Your Name"
              value={newReview.user}
              onChange={this.handleInputChange}
              required
            /> */}
            <textarea
              name="reviewText"
              placeholder="Write your review here"
              value={newReview.reviewText}
              onChange={this.handleInputChange}
              required
            ></textarea>
            <div style={{margin:"10px 0px"}} >
            <StarRating fontSize={20} editable={true} onChange={(e)=> this.setRating(e)} ></StarRating>
            </div>
            {/* <select
              name="rating"
              value={newReview.rating}
              onChange={this.handleRatingChange}
              required
            >
              <option value={0}>Select Rating</option>
              {[1, 2, 3, 4, 5].map((rating) => (
                <option key={rating} value={rating}>
                  {rating}⭐
                </option>
              ))}
            </select> */}
            <button type="submit">Post Review</button>
          </form>
          }
          
        </div>
      </div>
        </div>
    );
  }
}

export default withSearchParams(ComicDetails);
