"use client";
import ComicClient from "@/services/client/common/ClientServices/ComicClient";
import "./Comics.scss";
import sampleData from "@/lib/sample-data";
import { Component } from "react";
import { Modal } from "react-bootstrap";
import UploadComic from "../UploadComic/UploadComic";
import StarRating from "@/components/FunctionalComponents/StarRating/StarRating";
import withRouter from "@/components/routing/withRouter";
import { subjectService } from "@/services/client/common/ClientServices/SubjectService";
import ComicDetails from "../ComicDetails/ComicDetails";
import ComicFilter from "../ComicFilter/ComicFilter";
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';

interface ProductsPageProps {
  router: any; // Router instance
}

class Comics extends Component<ProductsPageProps> {
  comicServ!: ComicClient;

  state = {
    genres: [], //"Action", "Adventure", "Comedy", "Drama", "Fantasy"
    authors:[],
    publishers:[],
    searchTerm: "",
    comicDetail: false,
    isModalOpen: false,
    comicDetails: { heading: "" },
    modalHeading: "Upload comic",
    userInfo: { roleName: "Guest User" },
    loading: true,
    getAllProducts: [], //sampleData.products ||
  };
  constructor(props: ProductsPageProps) {
    super(props);
    this.comicServ = new ComicClient();
  }

  async navigateTo(comic: any) {
    await subjectService.sendData(comic);
    const { router } = this.props;
    await router.push(`${"comicdetails"}?comicId=${comic.id}`);
  }

  openModal = () =>
    this.setState({ isModalOpen: true, popuptype: "upload" }, () => {});
  closeModal = () => this.setState({ isModalOpen: false });

  componentDidMount(): void {
    subjectService.setHeading({ heading: "Comics" });
    this.handleAuth();
    this.GetAllComicList();
  }
  async handleAuth() {
    subjectService.getAuthData().subscribe((res: any) => {
      this.setState({ userInfo: res, loading: false });
    });
  }

  comicsList:any = []
  async GetAllComicList() {
    (await this.comicServ.getAllComics()).subscribe({
      next: (res: any) => {
        console.log(res); // Handle success response
        if (200 === res.status) {
          this.comicsList = res.comics
          this.setState({ getAllProducts: res.comics, loading: false });
          this.setAuthorsGeneresPublishers(res.comics)
        }
      },
      error: (err: any) => {
        console.error(err); // Handle error response
      },
      complete: () => {
        console.log("Completed"); // Handle completion
      },
    });
  }

  filtersList:any = {
    genres:[],
    authors:[],
    publishers:[]
  }
  async setAuthorsGeneresPublishers(comics:any)
  {
    let genres:any = this.state.genres
    let authors:any = this.state.authors
    let publishers:any = this.state.publishers
    console.log("comics => ", comics)
    await comics.filter((c:any)=>{
      if(c.hasOwnProperty('genre')){ 
        if(!genres.includes(c.genre)){
          genres.push(c.genre)
          this.filtersList['genres'] = genres
          this.setState({genres})
        }
       }
       if(c.hasOwnProperty('publisher')){ if(!publishers.includes(c.publisher)){
        publishers.push(c.publisher)
        this.filtersList['publishers'] = publishers
        this.setState({publishers})
      } }
       if(c.hasOwnProperty('author')){ if(!authors.includes(c.author)){
        authors.push(c.author)
        this.filtersList['authors'] = authors
        this.setState({authors})
      } }
    })
    
  }

  

  addComic() {
    this.openModal();
    this.setState({ modalHeading: "Upload comic" });
  }

  async openComicDetails(comic: any) {
    await subjectService.sendData(comic);
    this.setState({
      comicDetail: true,
      comicDetails: { heading: comic.title },
    });
    console.log("comic => ", comic);
  }

  goToComicList() {
    this.setState({ comicDetail: false });
  }

  async handleUploadSubmit(e: any) {
    console.log("e => ", e);
    await this.GetAllComicList();
    await this.closeModal();
  }

  SignContent() {
    return (
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
            {this.state.modalHeading}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.state.modalHeading === "Filter Comics" ? (
            <div>
              <ComicFilter
                minPrice={1}
                maxPrice={200}
                genres={this.state.genres}
                authors={this.state.authors}
                publishers={this.state.publishers}
                onFiltersSubmit={(e)=> this.handleFiltersSubmit(e)}
                onCancel={()=> this.handleCancel()}
              />
            </div>
          ) : (
            <UploadComic
              onSubmit={(e: any) => this.handleUploadSubmit(e)}
            ></UploadComic>
          )}
        </Modal.Body>
      </Modal>
    );
  }
  filterComicData:any = null
  handleFiltersSubmit = (filters: {
    price: { min: number; max: number };
    genre: string;
    author: string;
    publisher: string;
    publicationyear:string
  }) => {
    this.filterComicData = filters
    const comicsList: any[] = this.comicsList; // Assuming comicsList is an array of comic objects
    console.log("Selected Filters:", filters, "comicsList => ", comicsList);
  
    // Apply filters to the comicsList
    const filteredComics = comicsList.filter((comic: any) => {
      const isWithinPriceRange =
        comic.price >= filters.price.min && comic.price <= filters.price.max;
      const matchpublicationyear = filters.publicationyear ? comic.publicationyear.toString() === filters.publicationyear.toString() : true;
      const matchesGenre = filters.genre ? comic.genre === filters.genre : true;
      const matchesAuthor = filters.author ? comic.author === filters.author : true;
      const matchesPublisher = filters.publisher ? comic.publisher === filters.publisher : true;
      console.log("matchpublicationyear => ", matchpublicationyear, filters.publicationyear, comic.publicationyear)
      return isWithinPriceRange && matchesGenre && matchesAuthor && matchesPublisher && matchpublicationyear;
    });
  
    // Update state with filtered comics
    this.setState({ getAllProducts: filteredComics || [], isModalOpen: false });
  };
  

  handleCancel = () => {
    console.log("Filter selection canceled.");
  };

  searchComics(e: any) {
    this.setState({ searchTerm: e.target.value.toLowerCase() });
    // const searchTerm = e.target.value.toLowerCase(); // Get the search term in lowercase
    // const filteredComics = this.state.getAllProducts.filter((comic: any) =>
    //   comic.title.toLowerCase().includes(searchTerm) // Check if title includes the search term
    // );

    // // Update the state with the filtered list of comics
    // this.setState({ getAllProducts: filteredComics });
  }

  filterComics() {
    subjectService.setfilterComicData(this.filterComicData)
    this.setState({ modalHeading: "Filter Comics", isModalOpen: true });
  }

  bsToggle:boolean = true
  bestSeller() {
    const comicsList: any[] = this.comicsList; 
    console.log("comics =>", comicsList);

    if(this.bsToggle)
    {
      this.bsToggle = false
      // Filter the comicsList to get only the products with an average rating between 4 and 5
    const getAllProducts = comicsList.filter((c: any) => c.averageRating >= 4 && c.averageRating <= 5);
  
    console.log("getAllProducts =>", getAllProducts);
    this.setState({getAllProducts})
    }
    else{
      this.bsToggle = true
      this.setState({getAllProducts:comicsList})
    }
  
    
  }
  
  avgRating(rating:string)
  {
    if(!!rating)
    {
      return parseInt(rating, 10)
    }
    return 0;
  }

  render() {
    const {
      searchTerm,
      loading,
      userInfo,
      getAllProducts,
      comicDetail,
      comicDetails,
    } = this.state;
    const user = userInfo;
    const switchtype: string = !!user ? user?.roleName : "Guest User";

    // Filter the comic list based on searchTerm
    let filteredComicList = getAllProducts;

    if (searchTerm) {
      filteredComicList = getAllProducts.filter((comic: any) =>
        comic['title'].toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return (
      <div
        className={`comics-root-class ${
          switchtype === "Admin" ? "admin-grid" : ""
        }`}
      >
        {loading == true ? (
          <div className="loading loading-box">
            {" "}
            <div className="spinner"></div>{" "}
          </div>
        ) : (
          <div>
            {comicDetail === true ? (
              <div className="comic-details-class">
                <div className="column-details-heading">
                  <div className="cd-back" onClick={() => this.goToComicList()}>
                    <img src={"assets/images/comics/left-arrow.png"}></img>
                  </div>
                  <div className="cd-heading">{comicDetails.heading}</div>
                </div>
                <div className="column-details-content">
                  <ComicDetails></ComicDetails>
                </div>
              </div>
            ) : (
              <div>
                <div className={`comicss-header-part`}>
                  { (
                    <div className={`parent-row`}>
                      <div className={`left-child-column comics-search-filter`}>
                        {comicDetail === false && (
                          <div className="search-filter">
                            <div style={{width:'40px', cursor:'pointer'}} onClick={()=> this.bestSeller()}>
                              <img src={"assets/images/comics/best-seller.png"}></img>
                            </div>
                            <div>
                              <div className="comics-search">
                                <input
                                  type="text"
                                  placeholder="search comics"
                                  onChange={(e) => this.searchComics(e)}
                                />
                              </div>
                            </div>
                            <div className="comics-filter">
                              <img
                                src={"assets/images/comics/filter.png"}
                                onClick={() => this.filterComics()}
                              ></img>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className={`right-child-column`}>
                      {
                        switchtype === "Admin" &&
                        <div
                          className="add-comics-btn"
                          onClick={() => this.addComic()}
                        >
                          add comics
                        </div>
                      }
                        
                      </div>
                    </div>
                  )}
                </div>
                <div className="comicss-content-part">
                  {getAllProducts.length === 0 ? (
                    <div className="no-comic-found">no comic found</div>
                  ) : (
                    <div className={`__card-container__`}>
                      {filteredComicList.map((comic: any, comicI: number) => (
                        <div key={comicI} className={`__card__`}>
                          <div className={`__card-item__ __card-box__ `}>
                            <div
                              className="item-container"
                              onClick={() => this.openComicDetails(comic)}
                            >
                              <div className="banner comic-hub-color1">
                                {/* "assets/images/batman1.jpg" */}
                                <img src={comic.banner}></img>
                              </div>
                              <div className="title-desc-reviews comic-hub-color2">
                                <div className="title text_dotdotdot">
                                  <strong>{comic.title}</strong>
                                </div>
                                <div className="description multiline-ellipsis-paragraph comic-hub-color1">
                                  <p>{comic.description}</p>
                                </div>
                                <div className="reviews-ratings-price">
                                  <div className="ratings">
                                  {/* <Stack spacing={1}>
                                    <Rating name="half-rating" defaultValue={comic.averageRating} precision={0.5} />
                                  </Stack> */}

                                    <StarRating
                                      value={comic.averageRating}
                                      editable={false}
                                      fontSize={15}
                                    ></StarRating>
                                  </div>
                                  <div className="reviews">{comic.reviewCount+" reviews"}</div>
                                  <div className="price">€{comic.price}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        {this.SignContent()}
      </div>
    );
  }
}
export default withRouter(Comics);
