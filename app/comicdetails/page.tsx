'use client';
import "./comicdetails.scss";
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
interface UsersPageProps {
  searchParams: URLSearchParams;
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
}

class ComicDetails extends Component<UsersPageProps> {
    ratingreview!:RatingReviewClient
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
  constructor(props:UsersPageProps)
  {
    super(props)
    this.ratingreview = new RatingReviewClient()
    this.comicServ = new ComicClient()
  }

  componentDidMount(): void {
    console.log("comic details => ")
    this.handleAuth()
    this.getData()
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
  async handleAuth()
  {
    subjectService.getAuthData().subscribe((res:any)=>{ 
      console.log("header subject => ", res)
      this.setState({ userInfo: res , loading: false }); })
   
  }
  

  getData() {
    console.log("---->")
    // subjectService.sendData({"hell":"hhhh"})
    subjectService.getData().subscribe({
      next: (res) => {
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
            comic})
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

  handleEditReview = (id: string) => {
    this.setState((prevState:any) => ({
      comic: {
        ...prevState.comic,
        reviews: prevState.comic.reviews.map((review:any) =>
          review.id === id ? { ...review, isEditing: !review.isEditing } : review
        ),
      },
    }));
  };

  handleDeleteReview = (id: string) => {
    this.setState((prevState:any) => ({
      comic: {
        ...prevState.comic,
        reviews: prevState.comic.reviews.filter((review:any) => review.id !== id),
      },
    }));
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
            <UploadComic setData={this.state.comic} onSubmit={(e:any)=> this.handleUploadSubmit(e)}></UploadComic>
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

  order()
  {
    location.href = "order" 
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
          <div className="comic-heading">
            <h1>{comic.title}</h1>
          </div>

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
                    switchtype === "User" &&
                    <div>
                        <IconButton   className="menu-icon wishlist">
                            <FavoriteIcon style={{ color: 'gray' }} /> 
                        </IconButton>

                        <IconButton className="menu-icon add-to-cart">
                            <ShoppingCartIcon style={{ color: 'gray' }} /> 
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
              <div className={"order-btn-container"}>
                <button className="order-btn" onClick={()=> this.order()}>Order</button>
              </div>
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
            {comic.reviews.map((review:any) => (
              <div key={review.id} className="review-item">
                {review.isEditing ? (
                  <div className="edit-review">
                    <textarea
                      defaultValue={review.reviewText}
                      onBlur={(e) =>
                        this.handleUpdateReview(review.id, e.target.value, review.rating)
                      }
                    />
                    <select
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
                    </select>
                    <button onClick={() => this.handleEditReview(review.id)}>Save</button>
                  </div>
                ) : (
                  <>
                    <p>
                      <strong>{review.user}</strong> ({review.rating}⭐)
                    </p>
                    <p>{review.reviewText}</p>
                    <div className="review-actions">
                      <button onClick={() => this.handleEditReview(review.id)}>Edit</button>
                      <button onClick={() => this.handleDeleteReview(review.id)}>Delete</button>
                    </div>
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
            <select
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
            </select>
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
