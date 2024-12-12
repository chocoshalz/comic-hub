import React, { Component } from 'react';
import styles from './Dropdown.module.scss'; // Import the SCSS module

// Define the type for dropdown options
interface Option {
  id: number;
  label: string;
  value: string;
}

// Define the interface for the props
interface DropdownProps {
  options: Option[];            // Array of options
  onSelect: (selected: Option) => void;  // Callback for selected option
}

// Define the state interface for the component
interface DropdownState {
  selectedOption: string;
}

class Dropdown extends Component<DropdownProps, DropdownState> {
  constructor(props: DropdownProps) {
    super(props);
    this.state = {
      selectedOption: ''
    };
  }

  handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = event.target.value;
    this.setState({ selectedOption });

    // Call the onSelect callback to return the selected item
    const selectedItem = this.props.options.find(option => option.value === selectedOption);
    if (selectedItem) {
      this.props.onSelect(selectedItem);
    }
  };

  render() {
    const { options } = this.props;
    const { selectedOption } = this.state;

    return (
      <div className={styles['dropdownContainer']}>
        {/* <label htmlFor="options" className={styles['dropdownLabel']}>Choose an option:</label> */}
        <select 
          id="options" 
          value={selectedOption} 
          onChange={this.handleChange} 
          className={styles['dropdownSelect']}
        >
          {/* <option value="">Select an option</option> */}
          {options.map((option) => (
            <option key={option.id} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* {selectedOption && (
          <div className={styles['dropdownSelection']}>
            <p>You selected: {selectedOption}</p>
          </div>
        )} */}
      </div>
    );
  }
}

export default Dropdown;
