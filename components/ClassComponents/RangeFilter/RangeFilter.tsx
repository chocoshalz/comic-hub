// ComicFilter.tsx
import React, { Component } from "react";
import "./RangeFilter.scss";

interface ComicFilterState {
  minPrice: number;
  maxPrice: number;
  selectedMinPrice: number;
  selectedMaxPrice: number;
}
interface ComicFilterProps{
    minPrice: number;
    maxPrice: number;
    selectedMinPrice: number;
    selectedMaxPrice: number;
    rangeCallback:(data: { selectedMinPrice: number; selectedMaxPrice: number }) => void;
}
class RangeFilter extends Component<ComicFilterProps, ComicFilterState> {
  constructor(props: ComicFilterProps) {
    super(props);
    this.state = {
      minPrice: this.props.minPrice,
      maxPrice: this.props.maxPrice,
      selectedMinPrice: this.props.selectedMinPrice,
      selectedMaxPrice: this.props.selectedMaxPrice,
    };

    console.log("pops => ", this.props)
  }

  setRange(state:any)
  {
    console.log("receiving => ",state)
    this.setState({
        selectedMinPrice:state.selectedMinPrice, selectedMaxPrice:state.selectedMaxPrice
    })
  }

  componentDidMount(): void {
      
  }

  handlePriceChange = (value: number, type: "min" | "max") => {
    if (type === "min") {
      this.setState((prevState) => ({
        selectedMinPrice: Math.min(value, prevState.selectedMaxPrice - 1),
      }),()=>{
        this.props.rangeCallback({ selectedMinPrice:this.state.selectedMinPrice, selectedMaxPrice:this.state.selectedMaxPrice })
      });
    } else {
      this.setState((prevState) => ({
        selectedMaxPrice: Math.max(value, prevState.selectedMinPrice + 1),
      }),()=>{
        this.props.rangeCallback({ selectedMinPrice:this.state.selectedMinPrice, selectedMaxPrice:this.state.selectedMaxPrice })
      });
    }
  };

  render() {
    const { minPrice, maxPrice, selectedMinPrice, selectedMaxPrice } = this.state;

    return (
      <div className="range-inputs">
        <div className="range-slider">
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={selectedMinPrice}
            onChange={(e) =>
              this.handlePriceChange(Number(e.target.value), "min")
            }
          />
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={selectedMaxPrice}
            onChange={(e) =>
              this.handlePriceChange(Number(e.target.value), "max")
            }
          />
        </div>
        <div className="range-values">
          <div className="min-box">€{selectedMinPrice}</div>
          <div className="max-box">€{selectedMaxPrice}</div>
        </div>
      </div>
    );
  }
}

export default RangeFilter;
