"use client";
import { ChangeEvent, Component, Key, ReactNode } from "react";
import styles from "./Products.module.scss";
import sampleData from "@/lib/sample-data";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Modal, Button } from "react-bootstrap";
import { PutBlobResult } from "@vercel/blob";
import toast from "react-hot-toast";
import { getSession } from "next-auth/react";
import ComicClient from "@/services/client/common/ClientServices/ComicClient";
import StarRating from "@/components/FunctionalComponents/StarRating/StarRating";
import WishListClient from "@/services/client/common/ClientServices/WishListClient";
import CartClient from "@/services/client/common/ClientServices/CartClient";
import RatingReviewClient from "@/services/client/common/ClientServices/RatingReviewClient";

interface IFormState {
  title: string;
  banner: string;
  price: number;
  comicimagesList: string[];
  description: string;
}
class Products extends Component {
  //<{}, IFormState>

  comicServ!: ComicClient;
  wishlistServ!:WishListClient;
  cartServ!:CartClient
  reviewsServ!:RatingReviewClient
  state = {
    loading:true,
    isModalOpen: false,
    userInfo:{userInfo:{roleName:"User"}},
    popuptype: "upload",
    comicData: {
      title: "",
      price: "",
      description: "",
      banner: null,
      comicImagesList: [],
    },
    productDetails: {},
    currentIndex: 0,
    getAllProducts: [], //sampleData.products
  };
  constructor(props: {}) {
    super(props);
    this.comicServ = new ComicClient();
    this.wishlistServ = new WishListClient();
    this.cartServ = new CartClient()
    this.reviewsServ = new RatingReviewClient()
  }

  openModal = () =>
    this.setState({ isModalOpen: true, popuptype: "upload" }, () => {});
  closeModal = () => this.setState({ isModalOpen: false });
  // comicitemsDetails
  openComicitemsDetails(product: any) {
    console.log("product => ", product);
    this.setState(
      {
        isModalOpen: true,
        popuptype: "comicitemsDetails",
        productDetails: product,
      },
      () => {}
    );
  }

  productId:string = ""
  editProductItem(product:any)
  {
    this.productId = product.id
    this.setState({popuptype: "edit" })
    this.setState({
      comicData:{
        title: product.title,
        price: product.price,
        description: product.description,
        banner: product.banner,
        comicImagesList: [],
      }
    })
  }

  deleteProductItem(product:any)
  {
      this.comicServ.deleteComic(product).then(()=>{
        toast.success("delete comic successfully");
      this.GetAllComicList();
      this.closeModal();
      })
  }

  addToWishList(product:any)
  {
    console.log("product => ", product, "userinfo => ", this.state.userInfo)
    const user:any = this.state.userInfo.userInfo
    let payload:any = { "userId": user.id, "comicId": product.id }
    console.log("payload => ",payload)
    this.wishlistServ.addToWishList(payload).subscribe((res:any)=>{
      console.log("res => ", res)
      if(res.status === 200)
        {
          toast.success(res.message)
        }
    })
  }

  addToCart(product:any)
  {
    console.log("product => ", product, "userinfo => ", this.state.userInfo)
    const user:any = this.state.userInfo.userInfo
    let payload:any = { "userId": user.id, "comicId": product.id }
    console.log("payload => ",payload)
    this.cartServ.addTtCart(payload).subscribe((res:any)=>{
      console.log("res => ", res)
      if(res.status === 200)
      {
        toast.success(res.message)
      }
    })
  }

  ReviewsRatings(product:any)
  {
    const user:any = this.state.userInfo.userInfo
    let payload = {"userId": user.id, "comicId": product.id, rating:0, reviewText:"very good"}
    console.log("payload => ",payload)
    this.reviewsServ.getAllReviewsbyComicId(product.id)
    .subscribe((res:any)=>{
        console.log("res => ", res)
        if(res.status === 200)
        {
          toast.success(res.message)
        }
      })
    // this.reviesServ.addRatingReview(payload).subscribe((res:any)=>{
    //   console.log("res => ", res)
    //   if(res.status === 200)
    //   {
    //     toast.success(res.message)
    //   }
    // })
  }

  componentDidMount(): void {
    // Modal.setAppElement('#__next');
    this.handleAuth()
    this.GetAllComicList();
  }

  async handleAuth()
  {
    const sessionData = await getSession();
    this.setState({userInfo:sessionData})
  }

  async GetAllComicList() {
    (await this.comicServ.getAllComics()).subscribe({
      next: (res:any) => {
        console.log(res); // Handle success response
        if (200 === res.status) {
          const list: any = [
            res.comics[0],
            res.comics[1],
            res.comics[0],
            res.comics[1],
            res.comics[0],
            res.comics[1],
            res.comics[0],
            res.comics[1],
            res.comics[0],
            res.comics[1],
            res.comics[0],
            res.comics[1],
            res.comics[0],
            res.comics[1],
            res.comics[0],
            res.comics[1],
            res.comics[0],
            res.comics[1],
          ];
          this.setState({ getAllProducts: list, loading: false });
        }
      },
      error: (err:any) => {
        console.error(err); // Handle error response
      },
      complete: () => {
        console.log('Completed'); // Handle completion
      }
    });
  }

  // Handle File Change for Banner and Comic Images
  handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const files = e.target.files;
    if (files) {
      if (type === "banner") {
        // Handle banner file selection
        console.log("banner => ", files[0]);
        let comicData: any = this.state.comicData;
        comicData["banner"] = files[0];
        this.setState({ comicData });
      } else if (type === "comicimagesList") {
        // Handle multiple comic images selection
        const newImages = Array.from(files);
        let comicData: any = this.state.comicData;
        comicData["comicImagesList"] = newImages;
        console.log("newImages => ", newImages);
        this.setState({
          comicData,
          currentIndex: 0, // Reset to first image in the list
        });
      }
    }
  };

  // Handle Next Image in Comic Images
  handleNextImage = () => {
    if (
      this.state.currentIndex <
      this.state.comicData.comicImagesList.length - 1
    ) {
      this.setState((prevState: any) => ({
        currentIndex: prevState.currentIndex + 1,
      }));
    }
  };

  // Handle Previous Image in Comic Images
  handlePreviousImage = () => {
    if (this.state.currentIndex > 0) {
      this.setState((prevState: any) => ({
        currentIndex: prevState.currentIndex - 1,
      }));
    }
  };
  handleInputChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ): void {
    // Log the input value for debugging
    console.log("e => ", e.target.value);

    // Update the state based on the field
    this.setState((prevState:any) => ({
      comicData: {
        ...prevState.comicData, // Preserve the other fields in comicData
        [field]: e.target.value, // Update only the specific field
      },
    }));
  }

  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let comicData: any = this.state.comicData;

    let payload: any = {
      title: comicData.title,
      description: comicData.description,
      price: comicData.price,
    };
    console.log("this.state.popuptype => ", this.state.popuptype)
    
 //edit the comic
 if(this.state.popuptype == "edit")
  {
    if (comicData.title.length > 3 && comicData.description.length && comicData.banner && comicData.price)
    {
      payload["banner"] = comicData.banner
      payload['id'] = this.productId
      await this.comicServ.updateComic(payload).then((createComicRes: any) => {
      console.log("reateComicRes => ", createComicRes);
      toast.success("successfully Updated a comic");
      this.GetAllComicList();
      this.closeModal();
      this.productId = ""
    }); 
     
      
    } else {
      toast("please fill all fields", {
        icon: "⚠️", // Optional icon for the warning
        style: {
          border: "1px solid orange",
          padding: "16px",
          color: "orange",
        },
      });
    }
    
  }
  // upload the comic 
  else if(this.state.popuptype == "upload")
  {
    const response = await fetch(
      `/api/imageupload?filename=${comicData.banner.name}`,
      {
        method: "POST",
        body: comicData.banner,
      }
    );
    const newBlob = (await response.json()) as PutBlobResult;
    console.log("response => ", response, "newBlob => ", newBlob.url);
    if (comicData.title.length > 3 && comicData.description.length && newBlob.url && comicData.price)
    {
      payload["banner"] = newBlob.url;

      await this.comicServ.createComic(payload).then((createComicRes: any) => {
      console.log("reateComicRes => ", createComicRes);
      toast.success("successfully created a comic");
      this.GetAllComicList();
      this.closeModal();
    });
     
      
    } else {
      toast("please fill all fields", {
        icon: "⚠️", // Optional icon for the warning
        style: {
          border: "1px solid orange",
          padding: "16px",
          color: "orange",
        },
      });
    }
  
  }
    
  };

  getBannerUrl = (banner: File | string | null): string | null => {
    // If 'banner' is a file, generate a temporary URL using URL.createObjectURL
    if (banner instanceof File) {
      return URL.createObjectURL(banner);
    }
    // If 'banner' is already a URL (string), return it directly
    if (typeof banner === "string") {
      return banner;
    }
    return null; // No banner selected
  };
  

  uploadRatingChange(event: any) {
    console.log("event => ", event);
  }

  handleRatingChange(event: any) {
    console.log("event => ", event);
  }
  render() {
    const { title, price, description, banner, comicImagesList } =
      this.state.comicData;

    const { loading, getAllProducts, currentIndex, popuptype, productDetails } =
      this.state;
    const product: any = productDetails;
    return (
      <div className={styles["products-class"]}>
          {
            loading == true
            ? <div className='loading loading-box'> <div className='spinner'></div> </div>
            : <div>
              <div className={`${styles["products-header-part"]}`}>
          <div className={`parent-row`}>
            <div className={`left-child-column`}>
              <div className={`${styles["comics-list-heading"]}`}>
                Comics List
              </div>
            </div>
            <div className={`right-child-column`}>
              {
                !!this.state.userInfo && this.state.userInfo['userInfo']['roleName'] === "Super Admin" && 
                <div
                  onClick={() => this.openModal()}
                  className={`${styles["add-comics"]}`} >
                    add Comics
                </div>
              }

            </div>
          </div>
          </div>
          {/* npm install react-bootstrap bootstrap --f */}
          <Modal show={this.state.isModalOpen} onHide={() => this.closeModal()}>
          <Modal.Header closeButton>
            <Modal.Title
              style={{
                width: "100%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {popuptype == "comicitemsDetails" ? product.title : "Add Comics"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            { (popuptype == "upload" || popuptype == "edit") && (
              <div className={`${styles["add-comics-tolist"]}`}>
                <form
                  className={`${styles["add-comic-tolist-form"]}`}
                  onSubmit={this.handleSubmit}
                >
                  {/* Title and Price Fields */}
                  <div className={`${styles["add-comic-title-price"]}`}>
                    <div className={styles["title-input-field-container"]}>
                      <TextField
                        id="outlined-basic"
                        value={title}
                        onChange={(e) => this.handleInputChange(e, "title")}
                        required
                        className={styles["title-input-field"]}
                        label="Title"
                        variant="outlined"
                      />
                    </div>
                    <div className={styles["price-input-field-container"]}>
                      <TextField
                        id="outlined-basic"
                        type="number"
                        value={price}
                        onChange={(e) => this.handleInputChange(e, "price")}
                        required
                        className={styles["price-input-field"]}
                        label="Price"
                        variant="outlined"
                      />
                    </div>
                  </div>

                  {/* Banner and Images */}
                  <div className={`${styles["add-comic-banner-images"]}`}>
                    <div className={styles["banner-container"]}>
                      Banner Image
                      <label
                        htmlFor="banner"
                        style={{ width: "100%", height: "100%" }}
                      >
                        <div
                          className={styles["image-placeholder"]}
                          style={{
                            backgroundImage: banner
                              ? `url(${this.getBannerUrl(banner)})`  //url(${URL.createObjectURL(banner)})
                              : "none",
                            width: "150px",
                            height: "150px",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        >
                          {!banner && <span>Add Banner</span>}
                        </div>
                      </label>
                      <input
                        type="file"
                        id="banner"
                        style={{ display: "none" }}
                        onChange={(e) => this.handleFileChange(e, "banner")}
                      />
                    </div>

                    {/* Comic Images */}
                    {/* <div className={styles["images-container"]}>
                    <label htmlFor="comicimagesList" style={{ width: '100%',height: '100%',}}>
                      <div
                        className={styles["image-placeholder"]}
                        style={{
                          backgroundImage:
                            comicImagesList.length > 0
                              ? `url(${URL.createObjectURL(
                                  comicImagesList[currentIndex]
                                )})`
                              : "none",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        {comicImagesList.length === 0 && (
                          <span>Add Comic Images</span>
                        )}
                      </div>
                    </label>
                    <input
                      type="file"
                      id="comicimagesList"
                      style={{ display: "none" }}
                      multiple
                      onChange={(e) =>
                        this.handleFileChange(e, "comicimagesList")
                      }
                    />
                    {comicImagesList.length > 0 && (
                      <div className={styles["image-navigation"]}>
                        <button
                          type="button"
                          onClick={this.handlePreviousImage}
                        >
                          Previous
                        </button>
                        <button type="button" onClick={this.handleNextImage}>
                          Next
                        </button>
                      </div>
                    )}
                  </div> */}
                  </div>

                  {/* Description Field */}
                  <div className={`${styles["add-comic-description"]}`}>
                    <TextField
                      id="outlined-basic"
                      value={description}
                      onChange={(e) => this.handleInputChange(e, "description")}
                      required
                      multiline
                      rows={3} // Set the number of visible rows
                      // rowsMax={3} // Prevent growing beyond 3 rows
                      inputProps={{ maxLength: 500 }} // Limit the max length to 500 characters
                      className={styles["description-input-field"]}
                      label="Description"
                      variant="outlined"
                    />

                    <div style={{ textAlign: "end" }}>
                      {description.length} / 500
                    </div>
                  </div>

                  <div className={styles["cancel-submit"]}>
                    <div>
                      <Button
                        variant="secondary"
                        onClick={() => this.closeModal()}
                      >
                        Close
                      </Button>
                    </div>
                    <div>
                      <Button variant="primary" type="submit">
                        submit
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            )}
            {popuptype == "comicitemsDetails" && (
              <div style={{ width: "100%", overflowY: "auto" }} >
                <div style={{ width: "100%", display: "grid", gridTemplateColumns: `60% 40%`}} >
                  <div>
                    <img
                      style={{ width: "100%", height: "300px" }}
                      src={product.banner}
                      alt={product.title}
                      className={styles.image}
                      //   onError={(e) => e.target?.style.backgroundColor = '#f0f0f0'}  // Set background color on error
                    />
                  </div>
                  <div>
                    <div style={{width:'100%', display:'flex', justifyContent:'center'}}>
                      <StarRating
                        value={product.rating || 5}
                        editable={false}
                        fontSize={20}
                        onChange={(event) => this.handleRatingChange(event)}
                      />
                    </div>
                    <div onClick={()=> this.ReviewsRatings(product)} style={{width:'100%', display:'flex', justifyContent:'center'}}>
                      ({product.numReviews} reviews)
                    </div>
                    <div style={{width:'100%', display:'flex', justifyContent:'center'}}>
                      COST: ${product.price}
                    </div>
                    <div style={{width:'100%', display:'flex', justifyContent:'center', margin:'5px 0px'}}>
                      <div onClick={()=> this.editProductItem(product)} style={{width:'60px', height: '30px', backgroundColor:'orange', color:'white', borderRadius:'5px',display:'flex', justifyContent:'center', alignItems:'center'}}>
                      edit
                      </div>
                    </div>
                    <div style={{width:'100%', display:'flex', justifyContent:'center', margin:'5px 0px'}}>
                      <div onClick={()=> this.deleteProductItem(product)} style={{width:'60px', height: '30px', backgroundColor:'orange', color:'white', borderRadius:'5px',display:'flex', justifyContent:'center', alignItems:'center'}}>
                      delete
                      </div>
                    </div>
                    <div style={{width:'100%', display:'flex', justifyContent:'center', margin:'5px 0px'}}>
                      <div onClick={()=> this.addToWishList(product)} style={{width:'130px', height: '30px', backgroundColor:'orange', color:'white', borderRadius:'5px',display:'flex', justifyContent:'center', alignItems:'center'}}>
                      add to favourate
                      </div>
                    </div>
                    <div style={{width:'100%', display:'flex', justifyContent:'center', margin:'5px 0px'}}>
                      <div onClick={()=> this.addToCart(product)} style={{width:'130px', height: '30px', backgroundColor:'orange', color:'white', borderRadius:'5px',display:'flex', justifyContent:'center', alignItems:'center'}}>
                      add to cart
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ width: 'calc(100% - 20px)', maxHeight: '280px', overflowY: 'auto', wordWrap: 'break-word', margin:'10px'}}>
                  {product.description}
                  {/* wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
                  wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
                  wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
                  wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
                  wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
                  wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
                  wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
                  wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww */}
                  </div>
              </div>
            )}
          </Modal.Body>
          {/* <Modal.Footer>
            <Button variant="secondary" onClick={() => this.closeModal()}>
              Close
            </Button>
            <Button variant="primary" onClick={() => this.closeModal()}>
              Save Changes
            </Button>
          </Modal.Footer> */}
        </Modal>

        <div className={`${styles["products-content-part"]}`}>
          <div className={`__card-container__  ${styles["products-list"]}}`}>
            {Array.isArray(this.state.getAllProducts) &&
              this.state.getAllProducts.map(
                (product: any, productI: number) => (
                  <div
                    onClick={() => this.openComicitemsDetails(product)}
                    key={`products-${productI}`}
                    className={`__card__`}
                  >
                    {/* <div className={`__card-item__ ${styles["card-box"]}`}>
                    <div className={styles.imageContainer}>
                      <img
                        src={product.banner}
                        alt={product.title}
                        className={styles.image}
                        //   onError={(e) => e.target?.style.backgroundColor = '#f0f0f0'}  // Set background color on error
                      />
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.productName}>{product.title}</div>
                      <p className={styles.productDescription}>
                        {product.description}
                      </p>
                      <div className={styles.productInfo}>
                        <span className={styles.productRating}>
                          <StarRating
                            value={product.rating}
                            editable={false}
                            fontSize={15}
                            onChange={(event) => this.handleRatingChange(event)}
                          />
                        </span>
                        <span className={styles.productReviews}>
                          ({product.numReviews} reviews)
                        </span>
                        <span className={styles.productPrice}>
                          ${product.price}
                        </span>
                      </div>
                    </div>
                    </div> */}
                  </div>
                )
              )}
            {
              this.state.getAllProducts.length == 0 &&
              <div style={{width:'100%', height:'100%', display:'flex', justifyContent:'center', alignItems:'center', fontSize:'25px'}}>
                no comics found
              </div>
            }
          </div>
        </div>
            </div>
          }
      </div>
    );
  }
}
export default Products;

/*
{
    "url": "https://1hey79cgcukhbvk4.public.blob.vercel-storage.com/Spiderman-RWt0kpGNjM4RGLGBbntl34SKx43fFV.jpg",
    "downloadUrl": "https://1hey79cgcukhbvk4.public.blob.vercel-storage.com/Spiderman-RWt0kpGNjM4RGLGBbntl34SKx43fFV.jpg?download=1",
    "pathname": "Spiderman.jpg",
    "contentType": "image/jpeg",
    "contentDisposition": "inline; filename=\"Spiderman.jpg\""
}
*/
