import { Outlet} from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import Header from './Header';
import Footer from './Footer';

function Home() {
  const store = useSelector((state) => state.user);

  return (
    
    <div >
      <Header/>
      <main >
        {/* <MarketPrice/> */}
        
        <Outlet/>
      </main>
      <Footer/>

    </div>

  );
}
export default Home;
