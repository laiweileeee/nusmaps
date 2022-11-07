import SearchIcon from "@mui/icons-material/Search";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../components/Search";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";

const SearchBar = ({ filterEvents, setSearchedVal }) => {
  return (
    <AppBar position="sticky">
      <Search sx={{ marginBottom: 2, marginTop: 2 }}>
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
    </AppBar>
  );
};

export default SearchBar;
