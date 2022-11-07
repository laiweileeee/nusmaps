import SearchIcon from "@mui/icons-material/Search";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../components/Search";

const SearchBar = ({ filterEvents, setSearchedVal }) => {
  return (
    <Search sx={{ marginBottom: 2 }}>
      <SearchIconWrapper>
        <SearchIcon type="submit" aria-label="search" />
      </SearchIconWrapper>
      <StyledInputBase
        inputProps={{ "aria-label": "search" }}
        id="search-bar"
        className="text"
        onInput={(e) => {
          setSearchedVal(e.target.value);
        }}
        label="Enter a city name"
        variant="outlined"
        placeholder="Search..."
        size="small"
      >
        {" "}
      </StyledInputBase>
    </Search>
  );
};

export default SearchBar;
