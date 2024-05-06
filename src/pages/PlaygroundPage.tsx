import SearchBox from '../components/SearchBox';

const PlaygroundPage = () => {
  return <SearchBox onChange={(data) => console.log(data)} />;
};

export default PlaygroundPage;
