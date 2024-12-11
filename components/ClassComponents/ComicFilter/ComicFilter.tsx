import React, { Component } from 'react';
import './ComicFilter.scss';
import YearPicker from '@/components/FunctionalComponents/YearPicker/YearPicker';
import { Select, MenuItem, InputLabel, FormControl, Button } from '@mui/material';
import { subjectService } from '@/services/client/common/ClientServices/SubjectService';
import RangeFilter from '../RangeFilter/RangeFilter';

interface ComicFilterProps {
  minPrice: number;
  maxPrice: number;
  genres: string[];
  authors: string[];
  publishers: string[];
  onFiltersSubmit: (filters: { price: { min: number; max: number }; genre: string; author: string; publisher: string, publicationyear:string }) => void;
  onCancel: () => void;
}

interface ComicFilterState {
  selectedMinPrice: number;
  selectedMaxPrice: number;
  selectedGenre: string;
  selectedAuthor: string;
  selectedPublisher: string;
  publicationyear: string
}

class ComicFilter extends Component<ComicFilterProps, ComicFilterState> {

  rangeFilterRef = React.createRef<RangeFilter>();
  constructor(props: ComicFilterProps) {
    super(props);
    this.state = {
      selectedMinPrice: props.minPrice,
      selectedMaxPrice: props.maxPrice,
      selectedGenre: '',
      selectedAuthor: '',
      selectedPublisher: '',
      publicationyear: ''
    };
  }

  selectedPrice:any = {selectedMinPrice: 1, selectedMaxPrice: 200}
  componentDidMount(): void {
    subjectService.getfilterComicData().subscribe((res:any)=>{
      console.log("filter => ", res)
      if(!!res){
        this.selectedPrice = {selectedMinPrice: res.price.min, selectedMaxPrice:res.price.max}
        this.sendRange({selectedMinPrice: res.price.min,
          selectedMaxPrice: res.price.max,})
        this.setState({
          selectedMinPrice: res.price.min,
          selectedMaxPrice: res.price.max,
          selectedGenre: res.genre,
          selectedAuthor: res.author,
          selectedPublisher: res.publisher,
          publicationyear: res.publicationyear
        },()=>{
          // this.sendRange()
        })
      }
    })
  }

  handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const value = Number(e.target.value);
    this.setState((prevState) => ({
      selectedMinPrice: type === 'min' ? value : prevState.selectedMinPrice,
      selectedMaxPrice: type === 'max' ? value : prevState.selectedMaxPrice,
    }));
  };

  handleSelectChange = (e: React.ChangeEvent<{ value: unknown }>, field: keyof ComicFilterState) => {
    this.setState({ [field]: e.target.value } as Pick<ComicFilterState, keyof ComicFilterState>);
  };
  rangeCallback(e:any)
  {
    console.log("e => ", e)
    this.setState({
      selectedMinPrice: e.selectedMinPrice, selectedMaxPrice: e.selectedMaxPrice
    })
  }

  handleSelectYear(year:string)
  {
    this.setState({publicationyear:year})
    console.log("year => ",year)
  }

  handleSubmit = () => {
    const { selectedMinPrice, selectedMaxPrice, selectedGenre, selectedAuthor, selectedPublisher, publicationyear } = this.state;
    this.props.onFiltersSubmit({
      price: { min: selectedMinPrice, max: selectedMaxPrice },
      genre: selectedGenre,
      author: selectedAuthor,
      publisher: selectedPublisher,
      publicationyear:publicationyear
    });
  };

  handleCancel = () => {
    this.props.onCancel();
  };

  resetPublicationYear()
  {

  }

  sendRange(state:any) {
    console.log("current => ",this.rangeFilterRef.current)
    if (this.rangeFilterRef.current) {
      this.rangeFilterRef.current.setRange(state);
      console.log("sending => ",state)
    }
  };

  render() {
    const { minPrice, maxPrice, genres, authors, publishers } = this.props;
    const { selectedMinPrice, selectedMaxPrice, selectedGenre, selectedAuthor, selectedPublisher, publicationyear } = this.state;

    // Define MenuProps for dropdown height
    const dropdownMenuProps = {
      PaperProps: {
        style: {
          maxHeight: 300,
        },
      },
    };

    return (
      <div className="comic-filter">
        <div className='publication-year'>
          <div>
          <YearPicker setYearV={publicationyear} onYearSelect={(year:any) => this.handleSelectYear(year)} />
          </div>
        </div>

        <div className="filter-row price-filter">
          <label>Price Range: {selectedMinPrice} : {selectedMaxPrice}</label>
          {/* <div className="range-inputs">
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={selectedMinPrice}
              onChange={(e) => this.handlePriceChange(e, 'min')}
            />
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={selectedMaxPrice}
              onChange={(e) => this.handlePriceChange(e, 'max')}
            />
          </div>
          <div className="price-values">
            €{selectedMinPrice} - €{selectedMaxPrice}
          </div> */}
          <RangeFilter 
          ref={this.rangeFilterRef}
          minPrice={minPrice} maxPrice={maxPrice} selectedMinPrice={this.state.selectedMinPrice} selectedMaxPrice={this.state.selectedMaxPrice}
          rangeCallback={(e:any)=> this.rangeCallback(e)}></RangeFilter>
        </div>

        <div className="filter-row genre-filter">
          <FormControl fullWidth variant="outlined">
            <InputLabel>Genre</InputLabel>
            <Select
              value={selectedGenre}
              onChange={(e:any) => this.handleSelectChange(e, 'selectedGenre')}
              label="Genre"
              MenuProps={dropdownMenuProps}
            >
              <MenuItem value="">
                <em>Select Genre</em>
              </MenuItem>
              {genres.map((genre, index) => (
                <MenuItem key={index} value={genre}>
                  {genre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="filter-row author-filter">
          <FormControl fullWidth variant="outlined">
            <InputLabel>Author</InputLabel>
            <Select
              value={selectedAuthor}
              onChange={(e:any) => this.handleSelectChange(e, 'selectedAuthor')}
              label="Author"
              MenuProps={dropdownMenuProps}
            >
              <MenuItem value="">
                <em>Select Author</em>
              </MenuItem>
              {authors.map((author, index) => (
                <MenuItem key={index} value={author}>
                  {author}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="filter-row publisher-filter">
          <FormControl fullWidth variant="outlined">
            <InputLabel>Publisher</InputLabel>
            <Select
              value={selectedPublisher}
              onChange={(e:any) => this.handleSelectChange(e, 'selectedPublisher')}
              label="Publisher"
              MenuProps={dropdownMenuProps}
            >
              <MenuItem value="">
                <em>Select Publisher</em>
              </MenuItem>
              {publishers.map((publisher, index) => (
                <MenuItem key={index} value={publisher}>
                  {publisher}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className=" sc-buttons">
          <div>
          <Button variant="outlined" color="secondary" onClick={this.handleCancel}>
            Cancel
          </Button>
          </div>
          <div>
          <Button variant="contained" color="primary" onClick={this.handleSubmit}>
            Submit
          </Button>
          </div>
          
          
        </div>
      </div>
    );
  }
}

export default ComicFilter;
