import { useState } from 'react';
import SearchBar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import { getAPI } from 'pixabay-api';
import styles from './App.module.css';
import toast, { Toaster } from 'react-hot-toast';

const App = () => {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  // state = {
  //   images: [],
  //   currentPage: 1,
  //   searchQuery: '',
  //   isLoading: false,
  //   isError: false,
  //   isEnd: false,
  // };

  // async componentDidUpdate(_prevProps, prevState) {
  //   const { searchQuery, currentPage } = this.state;

  // Fetch new images if the search query or current page changes
  //   if (
  //     prevState.searchQuery !== searchQuery ||
  //     prevState.currentPage !== currentPage
  //   ) {
  //     await this.fetchImages();
  //   }
  

  const fetchImages = async () => {
    // const { searchQuery, currentPage } = this.state;

    // this.setState({ isLoading: true });
    setIsLoading(true);

    try {
      const response = await getAPI(searchQuery, currentPage);

      console.log(response);

      const { totalHits, hits } = response;

      // Check if the API returns no images for the search query
      if (hits.length === 0) {
        toast.error(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        // this.setState({ isLoading: false });
        setIsLoading(false);
        return;
      }

      // Display a success message when the first page is loaded
      if (currentPage === 1) {
        toast.success(`Hooray! We found ${totalHits} images!`);
      }

      // Check if all available images have been loaded
      if (currentPage * 12 >= totalHits) {
        // this.setState({ isEnd: true });
        setIsEnd(true);
        toast("We're sorry, but you've reached the end of search results.", {
          icon: '👏',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      }

      // this.setState(prevState => ({
      //   images: currentPage === 1 ? hits : [...prevState.images, ...hits],
      //   isEnd: prevState.images.length + hits.length >= totalHits,
      // }));

      setImages(prevState => currentPage === 1 ? hits : [...prevState, ...hits]);
      setIsEnd(prevState => prevState.length + hits.length >= totalHits);
    } catch (error) {
      // Handle any errors that occur during the API request
      // this.setState({ isError: true });
      setIsError(true);
      toast.error('Oops, something went wrong! Reload this page!');
    } finally {
      // Ensure loading state is reset once the API request completes
      // this.setState({ isLoading: false });
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = query => {
    const normalizedQuery = query.trim().toLowerCase();
    // const normalizedCurrentQuery = this.state.searchQuery.toLowerCase();
    const normalizedCurrentQuery = setSearchQuery;

    // Validate the search query to prevent empty searches
    if (normalizedQuery === '') {
      alert(`Empty string is not a valid search query. Please type again.`);
      return;
    }

    // Prevent duplicate searches with the same query
    if (normalizedQuery === normalizedCurrentQuery) {
      alert(
        `Search query is the same as the previous one. Please provide a new search query.`
      );
      return;
    }

    // Only update the state and fetch images if the new query is different
    if (normalizedQuery !== normalizedCurrentQuery) {
      // this.setState({
      //   searchQuery: normalizedQuery,
      //   currentPage: 1,
      //   images: [],
      //   isEnd: false,
      // });
      setSearchQuery(normalizedQuery);
      setCurrentPage(1);
      setImages([]);
      setIsEnd(false);
    }
  };

  const handleLoadMore = () => {
    // Increment the current page to load more images, unless at the end
    // if (!this.state.isEnd) {
    //   this.setState(prevState => ({ currentPage: prevState.currentPage + 1 }));
    if (!setIsEnd) {
      setCurrentPage(prevState => prevState + 1);
    } else {
      alert("You've reached the end of the search results.");
    }
  };


  // const { images, isLoading, isError, isEnd } = this.state;
  return (
    <div className={styles.App}>
      <SearchBar onSubmit={handleSearchSubmit} />
      <ImageGallery images={images} />
      {isLoading && <Loader />}
      {!isLoading && !isError && images.length > 0 && !isEnd && (
        <Button onClick={handleLoadMore} />
      )}
      {isError && <p>Something went wrong. Please try again later.</p>}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}

export default App;
