import { Component } from "react";
import { TextField, Button } from "@mui/material";
import "./UploadComic.scss";
import { PutBlobResult } from "@vercel/blob";
import ComicClient from "@/services/client/common/ClientServices/ComicClient";
import toast from "react-hot-toast";
import React from "react";
import YearPicker from "@/components/FunctionalComponents/YearPicker/YearPicker";

interface UploadComicProps {
  setData?:any
  onSubmit: any;
}

interface UploadComicState {
  title: string;
  genre: string;
  author: string;
  publisher: string;
  price: string;
  description: string;
  banner: File | null;
  bannerPreview: string | null;
  publicationyear: string,
  errors: {
    [key: string]: string;
  };
}

class UploadComic extends Component<UploadComicProps, UploadComicState> {
    comicServ!:ComicClient
    fileInputRef:any
  constructor(props: UploadComicProps) {
    super(props);
    this.comicServ = new ComicClient()
    this.fileInputRef = React.createRef<HTMLInputElement>();
    this.state = {
      title: this.props.setData?.title || "",
      genre: this.props.setData?.genre || "",
      author: this.props.setData?.author || "",
      publisher: this.props.setData?.publisher || "",
      price: this.props.setData?.price || "",
      description: this.props.setData?.description || "",
      banner: this.props.setData?.banner || null,
      bannerPreview: this.props.setData?.banner || null,
      publicationyear: this.props.setData?.publicationyear || null,
      errors: {},
    };

    console.log("setComic data => ", this.props.setData)
  }

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      ...prevState,
      [name]: value,
      errors: { ...prevState.errors, [name]: "" },
    }));
  };

  handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      this.setState({
        banner: file,
        bannerPreview: URL.createObjectURL(file),
        errors: { ...this.state.errors, banner: "" },
      });
    }
  };

  triggerFileUpload = () => {
    if (this.fileInputRef.current) {
      console.log("this.fileInputRef => ", this.fileInputRef)
      this.fileInputRef.current.click();
    }
    let handleupdateimageC:any = document.getElementsByClassName("handleupdateimageC1")
    console.log("handleupdateimageC => ", handleupdateimageC)
    // const fileInput = document.getElementById("handleupdateimage") //as HTMLInputElement;
    // console.log("fileInput => ", fileInput)
    // if (fileInput) {
    //   fileInput.click(); // Programmatically triggers the file input
    // }
  };

  handleImageRemove = (type:string) => {
    if(type === "Update Image")
    {
      console.log("this.fileInputRef => ", this.fileInputRef)
      this.triggerFileUpload()
    }
    else if(type === "Remove Image")
    {
      this.setState({ banner: null, bannerPreview: null });
    }
    
  };

  validateForm = () => {
    const { title, genre, author, publisher, price, description, banner, publicationyear } = this.state;
    const errors: { [key: string]: string } = {};

    if (!title.trim()) errors.title = "Title is required";
    if (!genre.trim()) errors.genre = "Genre is required";
    if (!author.trim()) errors.author = "Author is required";
    if (!publisher.trim()) errors.publisher = "Publisher is required";
    if (!price.trim() || isNaN(Number(price))) errors.price = "Valid price is required";
    if (!description.trim()) errors.description = "Description is required";
    if (!banner) errors.banner = "Banner image is required";
    if (!publicationyear) errors.publicationyear = "Publication Year is required";

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleSubmit = () => {
    console.log("submit => ", this.validateForm())
    if (this.validateForm()) {
      const { title, genre, author, publisher, price, description, banner, publicationyear } = this.state;

      let editbanner:any = this.props?.setData
      if(editbanner?.banner.includes("https://"))
      {
        console.log("this.state => ", this.state, typeof banner, banner)
        this.updateComic(typeof banner !== "string", this.state)
      } 
      else{
        this.props.onSubmit({ title, genre, author, publisher, price, description, banner, publicationyear });
        this.CreateComic(this.state)
      } 
    }
  };

  handleSelectYear(year:string)
  {
    console.log("selected year => ", year)
    this.setState((prevState) => ({
      ...prevState,
      ['publicationyear']: year,
      errors: { ...prevState.errors, ['publicationyear']: "" },
    }));
  }

  async updateComic(updaimage:boolean, payload:any)
  {
    
    console.log("updaimage => ", updaimage, "payload => ", payload)
    let response:any, newBlob:any, reqObj = payload
    reqObj['id'] = this.props.setData.id
    if(updaimage === true)
    {
      await this.comicServ.deleteComicFile(this.props.setData.banner).then(()=>{})
      response = await fetch(
        `/api/imageupload?filename=${payload.banner.name}`,{ method: "POST", body: payload.banner, }
      );
      newBlob = (await response.json()) as PutBlobResult;
      console.log("response => ", response, "newBlob => ", newBlob.url);
      if(newBlob.url)
        {
          reqObj["banner"] = newBlob.url;
          (await this.comicServ.updateComic(reqObj)).subscribe((createComicRes: any) => {
            this.props.onSubmit(createComicRes)
              console.log("createComicRes => ", createComicRes);

              toast.success("successfully updated a comic");
          })
        }
        
    }
    else
    {
      console.log("reqObj => ", reqObj);

      (await this.comicServ.updateComic(reqObj)).subscribe((createComicRes: any) => {
            this.props.onSubmit(createComicRes)
              console.log("createComicRes => ", createComicRes);
              toast.success("successfully updated a comic");
          })
    }
  }

  async CreateComic(payload:any)
  {
    let reqObj = payload
    const response = await fetch(
        `/api/imageupload?filename=${payload.banner.name}`,{ method: "POST", body: payload.banner, }
      );
      const newBlob = (await response.json()) as PutBlobResult;
      console.log("response => ", response, "newBlob => ", newBlob.url);
      if(newBlob.url)
      {
        reqObj["banner"] = newBlob.url;
        (await this.comicServ.createComic(reqObj)).subscribe((createComicRes: any) => {
          if(createComicRes.status === 200)
          {
            this.props.onSubmit(createComicRes)
            console.log("createComicRes => ", createComicRes);
            toast.success("successfully created a comic");
          }
        })
        
  
      }
  }

  deleteComic()
  {
    this.comicServ.deleteComic({id:this.props.setData.id})
  }

  
  

  render() {
    const { title, genre, author, publisher, price, description, bannerPreview, publicationyear, errors } = this.state;
    let editbanner:any = this.props?.setData//.?bannerPreview
    return (
      <div className="add-comics-tolist" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* First Row */}
        <div style={{ display: "flex", gap: "20px" }}>
          <TextField
            label="Title"
            name="title"
            value={title}
            onChange={this.handleInputChange}
            fullWidth
            error={!!errors.title}
            helperText={errors.title}
          />
          <TextField
            label="Genre"
            name="genre"
            value={genre}
            onChange={this.handleInputChange}
            fullWidth
            error={!!errors.genre}
            helperText={errors.genre}
          />
        </div>

        {/* Second Row */}
        <div style={{ display: "flex", gap: "20px" }}>
          <TextField
            label="Author"
            name="author"
            value={author}
            onChange={this.handleInputChange}
            fullWidth
            error={!!errors.author}
            helperText={errors.author}
          />
          <TextField
            label="Publisher"
            name="publisher"
            value={publisher}
            onChange={this.handleInputChange}
            fullWidth
            error={!!errors.publisher}
            helperText={errors.publisher}
          />
        </div>

        {/* Third Row */}
        <div style={{ display: "flex", gap: "20px" }}>
          {/* Banner Section */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "1px dashed #ccc",
              position: "relative",
              height: "200px",
            }}
          >
            {bannerPreview ? (
              <img
                src={bannerPreview}
                alt="Banner Preview"
                style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
              />
            ) : (
              <Button component="label">
                Upload Banner
                <input
                 ref={this.fileInputRef}
                  id="handleupdateimage"
                  className="handleupdateimageC"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={this.handleImageUpload}
                />
              </Button>
            )}
            {errors.banner && (
              <div style={{ color: "red", fontSize: "0.875rem", marginTop: "5px" }}>{errors.banner}</div>
            )}
          </div>

          {/* Price Section */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <YearPicker setYearV={publicationyear} onYearSelect={(year:any) => this.handleSelectYear(year)} />
                </div>
            <TextField
              label="Price"
              name="price"
              value={price}
              onChange={this.handleInputChange}
              fullWidth
              error={!!errors.price}
              helperText={errors.price}
            />
            {bannerPreview && (
              <div>
                <Button
                style={{width:"100%"}}
                variant="contained"
                color="secondary"
                disabled={editbanner?.banner.includes("https://") ? true : false}
                onClick={()=> this.handleImageRemove(editbanner?.banner.includes("https://") ? "Update Image" :"Remove Image")}
              >
                { editbanner?.banner.includes("https://") ? "Current Image" :"Remove Image" }
              </Button>
              {
                editbanner?.banner.includes("https://") &&
                <Button
                style={{marginTop:'10px', width:"100%"}}
                variant="contained"
                color="secondary"
                onClick={()=> this.handleImageRemove(editbanner?.banner.includes("https://") ? "Update Image" :"Remove Image")}
              >
                <input
                 ref={this.fileInputRef}
                  id="handleupdateimage1"
                  className="handleupdateimageC1"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={this.handleImageUpload}
                />
                Updata Image
              </Button>
              }
              
              </div>
            )}
          </div>
        </div>

        {/* Fourth Row */}
        <TextField
          label="Description"
          name="description"
          value={description}
          onChange={this.handleInputChange}
          multiline
          rows={4}
          fullWidth
          error={!!errors.description}
          helperText={errors.description}
        />

        {/* Submit Button */}
        <Button variant="contained" color="primary" onClick={this.handleSubmit}>
          Submit
        </Button>
      </div>
    );
  }
}

export default UploadComic;
