import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

// Pages Import
import Home from './pages/Home';
import PublicWorks from './pages/services/PublicWorks';
import ServiceRequestPortal from './pages/services/ServiceRequestPortal';
import WasteRecycling from './pages/services/WasteRecycling';
import RoadsMaintenance from './pages/services/RoadsMaintenance';
import ParksForestry from './pages/services/ParksForestry';
import WaterServices from './pages/services/WaterServices';
import SnowRemoval from './pages/services/SnowRemoval';
import AnimalControl from './pages/services/AnimalControl';

// Community, Parks & Recreation (Youth Camp) Form Pages
import Community from './pages/community/Community';
import Parks from './pages/parks/Parks';
import Recreation from './pages/recreation/Recreation';

// Taxes Pages & Forms
import PropertyTaxHub from './pages/taxes/PropertyTaxHub';
import PropertyTaxes from './pages/taxes/PropertyTaxes';
import TaxPaymentMethods from './pages/taxes/TaxPaymentMethods';
import PreAuthorized from './pages/taxes/PreAuthorized';
import TaxCalculator from './pages/taxes/TaxCalculator';

// Permits Pages & Forms
import DeckPermits from './pages/permits/DeckPermits';
import PoolPermits from './pages/permits/PoolPermits';
import BurnPermits from './pages/permits/BurnPermits';
import BuildingPermits from './pages/permits/BuildingPermits';
import SignagePermits from './pages/permits/SignagePermits';

// Dedicated Permit Application Forms & Direct Endpoints
import PermitPortal from './pages/permits/apply/PermitPortal';
import DeckPermitApply from './pages/permits/apply/DeckPermitApply';
import PoolPermitApply from './pages/permits/apply/PoolPermitApply';
import BurnPermitApply from './pages/permits/apply/BurnPermitApply';

import ByLaws from './pages/documents/ByLaws';
import FeeSchedules from './pages/documents/FeeSchedules';
import Guides from './pages/documents/Guides';
import CouncilMinutes from './pages/documents/CouncilMinutes';

import Contact from './pages/Contact';
import TownInformation from './pages/TownInformation';
import Sitemap from './pages/Sitemap';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Default Route */}
          <Route index element={<Home />} />
          
          {/* Community, Parks & Recreation Direct Intake Form Routes */}
          <Route path="community" element={<Community />} />
          <Route path="parks" element={<Parks />} />
          <Route path="recreation" element={<Recreation />} />

          {/* Services Routes */}
          <Route path="services/public-works" element={<PublicWorks />} />
          <Route path="services/request" element={<ServiceRequestPortal />} />
          <Route path="services/track" element={<ServiceRequestPortal />} />
          <Route path="services/waste" element={<WasteRecycling />} />
          <Route path="services/roads" element={<RoadsMaintenance />} />
          <Route path="services/parks" element={<Parks />} />
          <Route path="services/parks-forestry" element={<ParksForestry />} />
          <Route path="services/water" element={<WaterServices />} />
          <Route path="services/snow" element={<SnowRemoval />} />
          <Route path="services/animals" element={<AnimalControl />} />

          {/* Taxes Routes & Dedicated Forms */}
          <Route path="taxes" element={<PropertyTaxHub />} />
          <Route path="taxes/info" element={<PropertyTaxes />} />
          <Route path="taxes/payment" element={<TaxPaymentMethods />} />
          <Route path="taxes/pre-authorized" element={<PreAuthorized />} />
          <Route path="taxes/calculator" element={<TaxCalculator />} />

          {/* Permits Routes & Dedicated Forms */}
          <Route path="permits/decks" element={<DeckPermits />} />
          <Route path="permits/pools" element={<PoolPermits />} />
          <Route path="permits/burn" element={<BurnPermits />} />
          <Route path="permits/building" element={<BuildingPermits />} />
          <Route path="permits/apply/building" element={<BuildingPermits />} />
          <Route path="permits/signs" element={<SignagePermits />} />

          {/* Dedicated Online Permit Application Request Forms (Scraper Endpoints) */}
          <Route path="permits/apply" element={<PermitPortal />} />
          <Route path="permits/apply/deck" element={<DeckPermitApply />} />
          <Route path="permits/apply/pool" element={<PoolPermitApply />} />
          <Route path="permits/apply/burn" element={<BurnPermitApply />} />

          {/* Documents & Knowledge Base Routes */}
          <Route path="documents/by-laws" element={<ByLaws />} />
          <Route path="documents/fees" element={<FeeSchedules />} />
          <Route path="documents/guides" element={<Guides />} />
          <Route path="documents/minutes" element={<CouncilMinutes />} />

          {/* Contact, About & Sitemap */}
          <Route path="about" element={<TownInformation />} />
          <Route path="town-hall" element={<TownInformation />} />
          <Route path="contact" element={<Contact />} />
          <Route path="sitemap" element={<Sitemap />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
