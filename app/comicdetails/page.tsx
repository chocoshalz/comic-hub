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

