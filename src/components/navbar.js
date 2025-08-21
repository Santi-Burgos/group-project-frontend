import { FaSearch } from "react-icons/fa";

const SearchBar = ({ onSearch }) => {
  return (
    <div className="search-container">
      <FaSearch className="search-icon" />
      <input
        type="search"
        placeholder="Buscar grupo..."
        onChange={(e) => onSearch(e.target.value)}
        className="search-group"
      />
    </div>
  );
};

export default SearchBar;
