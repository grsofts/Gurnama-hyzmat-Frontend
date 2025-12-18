import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useAuth } from './auth/useAuth';
import 'antd/dist/antd.css';
import { theme } from "antd";

//libs
import Sidebar, { SidebarItem } from './components/Sidebar'
import Header from './components/Header'
import { Routes, Route, useLocation, Navigate } from "react-router-dom" 

//icons
import { Award, BriefcaseBusiness, Handshake, Images,NotebookPen, Users2 } from 'lucide-react';

//pages
import Banners from './pages/banners/Banners';
import Login from './auth/Login';
import Users from './pages/users/Users';
import { Flex } from 'antd';

// Защищенный роут
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <div>Загрузка...</div>; // Или компонент загрузки
    }
    
    return user ? children : <Navigate to="/login" />;
};


export default function App() {
  const location = useLocation();
  
const { token } = theme.useToken();
  return (
      <div className='h-screen'>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/*" element={
              <ProtectedRoute>
                <Flex className="h-screen" style={{ backgroundColor: token.colorBgContainer}} horizontal>
                  
                  {/** Sidebar */}
                  <Sidebar>
                    <SidebarItem 
                      icon={<Images size={20} />}
                      text="Bannerlar"
                      active={location.pathname === "/banners"}
                      to="/banners"
                    />
                    
                    <SidebarItem 
                      icon={<BriefcaseBusiness size={20} />}
                      text="Hyzmatlar"
                      active={location.pathname === "/services"}
                      to="/services"
                    />
                    <SidebarItem 
                      icon={<NotebookPen size={20} />}
                      text="Edilen işler"
                      active={location.pathname === "/projects"}
                      to="/projects"
                    />

                    <SidebarItem 
                      icon={<Handshake size={20} />}
                      text="Partnýorlar"
                      active={location.pathname === "/partners"}
                      to="/partners"
                    />

                    <SidebarItem 
                      icon={<Award size={20} />}
                      text="Sertifikatlar"
                      active={location.pathname === "/certificates"}
                      to="/certificates"
                    />

                    <span className="my-2 h-px bg-gray-200 block" />
                    <SidebarItem 
                      icon={<Users2 size={20} />}
                      text="Ulanyjylar"
                      active={location.pathname === "/users"}
                      to="/users"
                    />
                  </Sidebar>


                  {/** Content */}
                  <Flex className="flex-1 overflow-y-auto w-full" vertical>
                    <Header />
                      <Routes>
                        <Route path="/banners" element={<Banners />} />
                        <Route path="/services" element={<h2></h2>} />
                        <Route path="/projects" element={<h2></h2>} />
                        <Route path="/partners" element={<h2></h2>} />
                        <Route path="/certificates" element={<h2></h2>} />
                        <Route path='/users' element={<Users />} />
                      </Routes>
                  </Flex>
                </Flex>
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
    </div>
  )
}