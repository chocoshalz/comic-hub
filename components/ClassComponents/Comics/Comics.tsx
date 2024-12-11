"use client";
import ComicClient from "@/services/client/common/ClientServices/ComicClient";
import "./Comics.scss"
import sampleData from "@/lib/sample-data";
import { Component } from "react";
import { Modal } from "react-bootstrap";
import UploadComic from "../UploadComic/UploadComic";
import StarRating from "@/components/FunctionalComponents/StarRating/StarRating";
import withRouter from "@/components/routing/withRouter";
import { subjectService } from "@/services/client/common/ClientServices/SubjectService";
import ComicDetails from "../ComicDetails/ComicDetails";

interface ProductsPageProps {
  router: any; // Router instance
}


class Comics extends Component<ProductsPageProps> {
  comicServ!: ComicClient;
  state = {
    comicDetail:false,
    isModalOpen:false,
    comicDetails:{heading:""},
    modalHeading:"Upload comic",
    userInfo:{roleName:"Guest User"},
    loading: true,
    getAllProducts: [], //sampleData.products ||
  };
  constructor(props: ProductsPageProps) {
    super(props);
    this.comicServ = new ComicClient();
  }

  async navigateTo(comic:any) 
  {
    await subjectService.sendData(comic);
    const { router } = this.props;
    await router.push(`${"comicdetails"}?comicId=${comic.id}`); 
  };

  openModal = () => this.setState({ isModalOpen: true, popuptype: "upload" }, () => {});
  closeModal = () => this.setState({ isModalOpen: false });


  componentDidMount(): void {
    subjectService.setHeading({heading:"Comics"})
    this.handleAuth()
    this.GetAllComicList();
  }
  async handleAuth()
  {
    subjectService.getAuthData().subscribe((res:any)=>{ this.setState({ userInfo: res , loading: false }); })
  }

  async GetAllComicList() {
    (await this.comicServ.getAllComics()).subscribe({
      next: (res: any) => {
        console.log(res); // Handle success response
        if (200 === res.status) {
        //   const list: any = [
        //     res.comics[0],
        //     res.comics[1],
        //     res.comics[0],
        //     res.comics[1],
        //     res.comics[0],
        //     res.comics[1],
        //     res.comics[0],
        //     res.comics[1],
        //     res.comics[0],
        //     res.comics[1],
        //     res.comics[0],
        //     res.comics[1],
        //     res.comics[0],
        //     res.comics[1],
        //     res.comics[0],
        //     res.comics[1],
        //     res.comics[0],
        //     res.comics[1],
        //   ];
          this.setState({ getAllProducts: res.comics, loading: false });
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

  addComic()
  {
    this.openModal()
  }

  async openComicDetails(comic:any)
  {
    await subjectService.sendData(comic);
    this.setState({comicDetail:true, comicDetails:{heading:comic.title}})
    console.log("comic => ",comic)
  }

  goToComicList()
  {
    this.setState({comicDetail:false})
  }

  async handleUploadSubmit(e:any)
  {
    console.log("e => ", e)
    await this.GetAllComicList()
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
            <UploadComic onSubmit={(e:any)=> this.handleUploadSubmit(e)}></UploadComic>
        </Modal.Body>
      </Modal>
  }

  render() {
    const { loading, userInfo, getAllProducts, comicDetail, comicDetails } = this.state;
    const user = userInfo
    const switchtype:string = !!user ? user?.roleName : "Guest User"  
    return (
      <div className={`comics-root-class ${switchtype === "Admin" ? "admin-grid" : ""}`}>
        {loading == true ? (
          <div className="loading loading-box">
            {" "}
            <div className="spinner"></div>{" "}
          </div>
        ) : (
          <div>
            {
              comicDetail === true
              ? <div className="comic-details-class">
                 <div className="column-details-heading">
                  <div className="cd-back" onClick={()=> this.goToComicList()}>
                    <img src={"assets/images/comics/left-arrow.png"}></img>
                  </div>
                  <div className="cd-heading">
                    {comicDetails.heading}
                  </div>
                 </div>
                 <div className="column-details-content">
                  <ComicDetails></ComicDetails>
                 </div>
                </div>
              :<div>
              <div className={`comicss-header-part`}>
            { 
                switchtype === "Admin" && 
                <div className={`parent-row`}>
                <div className={`left-child-column`}>
                  {/* <div className={`comics-list-heading`}>
                    Comics List
                  </div> */}
                </div>
                <div className={`right-child-column`}>
                        <div className="add-comics-btn" onClick={()=> this.addComic()}>add comics</div>
                </div>
              </div>
            }
              
            </div>
            <div className="comicss-content-part">
              {
                getAllProducts.length === 0 
                ? <div className="no-comic-found">no comic found</div>
                :  <div className={`__card-container__`}>
                {
                  getAllProducts.map((comic:any, comicI:number)=>(
                    <div key={comicI} className={`__card__`} >
                        <div className={`__card-item__ __card-box__ `}>
                            <div className="item-container" onClick={()=> this.openComicDetails(comic)}>
                                <div className="banner">
                                {/* "assets/images/batman1.jpg" */}
                                  <img src={comic.banner}></img>
                                </div>
                                <div className="title-desc-reviews">
                                  <div className="title text_dotdotdot">
                                      <strong>
                                        {comic.title}
                                      </strong>
                                  </div>
                                  <div className="description multiline-ellipsis-paragraph">
                                    <p>
                                    {comic.description}
                                    </p>
                                  </div>
                                  <div className="reviews-ratings-price">
                                    <div className="ratings">
                                    <StarRating value={4} editable={false} fontSize={15}></StarRating>
                                    </div>
                                    <div className="reviews">
                                      9 reviews
                                    </div>
                                    <div className="price">
                                      ${comic.price}
                                    </div>
                                  </div>
                                </div>
                            </div>
                        </div>
                      </div>))
                }
                </div>
              }
                   
                    
            </div>
              </div>
            }
           
          </div>
        )}
        {this.SignContent()}
      </div>
    );
  }
}
export default withRouter(Comics);

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