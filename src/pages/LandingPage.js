import NavbarComp from '../components/landingpage/NavbarComp'
import HeroComp from '../components/landingpage/HeroComp'
import ServiceComp from '../components/landingpage/ServiceComp'
import FooterComp from '../components/landingpage/FooterComp'
import '../style/landingpage.css';

function LandingPage(){
    return (
        <div>
            <NavbarComp/>
            {/* content */}
            <HeroComp/>
            <ServiceComp/>
            {/* content */}
            <FooterComp/>
        </div>
    )

}

export default LandingPage;