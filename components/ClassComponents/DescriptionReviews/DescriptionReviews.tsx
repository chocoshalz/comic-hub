'use client'
import "./DescriptionReviews.scss"
import React, { Component, FormEvent } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import StarRating from '@/components/FunctionalComponents/StarRating/StarRating';
import RatingReviewClient from '@/services/client/common/ClientServices/RatingReviewClient';
import { subjectService } from '@/services/client/common/ClientServices/SubjectService';
import ProfileClient from '@/services/client/common/ClientServices/ProfileClient';
import ComicClient from '@/services/client/common/ClientServices/ComicClient';
import toast from 'react-hot-toast';

interface DescriptionReviewsProps {
  comic: any; // Adjust the type of comic as per your requirements
}

// interface DescriptionReviewsState {
//   activeTab: number;
// }

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
    publicationyear:string;
  }
class DescriptionReviews extends Component<DescriptionReviewsProps>//, DescriptionReviewsState> 
{
    ratingreview!:RatingReviewClient
    state = {
        activeTab: 0,
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
          publicationyear:"",
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
  constructor(props: DescriptionReviewsProps)
  {
    super(props)
    this.ratingreview = new RatingReviewClient()
    this.comicServ = new ComicClient()
    // this.wishListServ = new WishListClient()
    // this.cartServ = new CartClient()
    this.profileServ = new ProfileClient()
  }

  componentDidMount(): void {
    console.log("comic details => ")
    this.handleAuth()
    
    this.getRatingsReviews()
    
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
        comic['publicationyear'] = res.publicationyear
        
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

  handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    this.setState({ activeTab: newValue });
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

  render() {
    const { comic } = this.props;
    const { activeTab } = this.state;
    let user:any = this.state.userInfo
    const switchtype:string = !!user ? user?.roleName : "Guest User" 
    return (
      <Box>
        <Tabs value={activeTab} onChange={this.handleTabChange}>
          <Tab label="Description" />
          <Tab label="Reviews" />
        </Tabs>

        {activeTab === 0 && (
            <div className="comic-description">
                <Box p={2}>
            {/* <Typography variant="h6">Description</Typography> */}
            <Typography variant="body1">{comic.description}</Typography>
          </Box>
            </div>
          
        )}

        {activeTab === 1 && (
          <Box p={2}>
            {/* <Typography variant="h6">Reviews</Typography> */}
            {comic.reviews && comic.reviews.length > 0 ? (
              comic.reviews.map((review:any, reviewI:number) => (
                <div key={reviewI} className="review-item">
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
                // <Box key={reviewI} mb={2}>
                //   <Typography variant="subtitle1">
                //     <strong>{review.username || 'Anonymous'}</strong>
                //   </Typography>
                //   <StarRating editable={false} value={review.rating} />
                //   <Typography variant="body2">{review.reviewText}</Typography>
                // </Box>
              ))
            ) : (
              <Typography variant="body2">No reviews available.</Typography>
            )}
          </Box>
        )}
      </Box>
    );
  }
}

export default DescriptionReviews;
